const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

// Initialize Firebase Admin
admin.initializeApp();

// Encryption key (should be stored in Firebase Config in production)
// For development: firebase functions:config:set encryption.key="your-32-byte-key"
const ENCRYPTION_KEY = functions.config().encryption?.key || 'dev-key-32-bytes-long-example!';
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

/**
 * Encrypt account number
 */
function encryptAccountNumber(text) {
  try {
    const key = Buffer.from(ENCRYPTION_KEY);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt account number');
  }
}

/**
 * Decrypt account number
 */
function decryptAccountNumber(encryptedText) {
  try {
    const key = Buffer.from(ENCRYPTION_KEY);
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt account number');
  }
}

/**
 * Encrypt account number when user is created
 */
exports.encryptUserAccountNumber = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // Only encrypt if account number exists and is not already encrypted
    if (data.accountNumber && !data.accountNumber.includes(':')) {
      try {
        const encrypted = encryptAccountNumber(data.accountNumber);
        await snap.ref.update({ accountNumber: encrypted });
        console.log(`Encrypted account number for user ${context.params.userId}`);
      } catch (error) {
        console.error('Failed to encrypt account number:', error);
      }
    }
    
    return null;
  });

/**
 * Encrypt account number when user updates their bank details
 */
exports.encryptUserAccountNumberOnUpdate = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Check if account number was updated and needs encryption
    if (after.accountNumber && 
        after.accountNumber !== before.accountNumber && 
        !after.accountNumber.includes(':')) {
      try {
        const encrypted = encryptAccountNumber(after.accountNumber);
        await change.after.ref.update({ accountNumber: encrypted });
        console.log(`Encrypted updated account number for user ${context.params.userId}`);
      } catch (error) {
        console.error('Failed to encrypt account number:', error);
      }
    }
    
    return null;
  });

/**
 * Send SMS notification when issue is created
 * NOTE: You'll need to integrate with an SMS provider (e.g., Africa's Talking, Twilio)
 * For now, this just logs the notification
 */
exports.sendIssueCreatedNotification = functions.firestore
  .document('issues/{issueId}')
  .onCreate(async (snap, context) => {
    const issue = snap.data();
    const issueRef = context.params.issueId.substring(0, 8).toUpperCase();
    
    const message = `Your payment issue #ISS-${issueRef} has been submitted to SalamaPay. We'll notify you once it's resolved.`;
    
    // TODO: Integrate with SMS provider
    console.log(`SMS to ${issue.internPhone}: ${message}`);
    
    // Example with Africa's Talking (uncomment when configured):
    /*
    const africastalking = require('africastalking')({
      apiKey: functions.config().africastalking.api_key,
      username: functions.config().africastalking.username
    });
    
    const sms = africastalking.SMS;
    await sms.send({
      to: [issue.internPhone],
      message: message
    });
    */
    
    return null;
  });

/**
 * Send SMS notification when issue status changes
 */
exports.sendIssueStatusUpdateNotification = functions.firestore
  .document('issues/{issueId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    // Only send notification if status changed
    if (before.status !== after.status) {
      const issueRef = context.params.issueId.substring(0, 8).toUpperCase();
      let message = '';
      
      if (after.status === 'in_progress') {
        message = `Your payment issue #ISS-${issueRef} is now being processed by our team.`;
      } else if (after.status === 'resolved') {
        message = `Your payment issue #ISS-${issueRef} has been resolved. Check your account within 24 hours.`;
      }
      
      if (message) {
        // TODO: Integrate with SMS provider
        console.log(`SMS to ${after.internPhone}: ${message}`);
      }
    }
    
    return null;
  });

/**
 * Create audit log when admin views account number
 * This would be triggered by a callable function from the admin dashboard
 */
exports.logAccountNumberView = functions.https.onCall(async (data, context) => {
  // Verify caller is authenticated and is admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  
  const adminDoc = await admin.firestore().doc(`users/${context.auth.uid}`).get();
  if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Must be admin');
  }
  
  // Create audit log
  await admin.firestore().collection('auditLogs').add({
    action: 'view_account_number',
    performedBy: context.auth.uid,
    targetUser: data.userId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    ipAddress: context.rawRequest?.ip || 'unknown'
  });
  
  return { success: true };
});

/**
 * Scheduled function to send daily summary to admins
 * Runs every day at 9 AM EAT (East Africa Time = UTC+3)
 */
exports.sendDailySummaryToAdmins = functions.pubsub
  .schedule('0 6 * * *') // 6 AM UTC = 9 AM EAT
  .timeZone('Africa/Nairobi')
  .onRun(async (context) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get issues from yesterday
    const issuesSnapshot = await admin.firestore()
      .collection('issues')
      .where('createdAt', '>=', yesterday)
      .where('createdAt', '<', today)
      .get();
    
    const stats = {
      total: issuesSnapshot.size,
      pending: 0,
      resolved: 0
    };
    
    issuesSnapshot.forEach(doc => {
      const issue = doc.data();
      if (issue.status === 'pending') stats.pending++;
      if (issue.status === 'resolved') stats.resolved++;
    });
    
    console.log(`Daily Summary: ${stats.total} issues (${stats.pending} pending, ${stats.resolved} resolved)`);
    
    // TODO: Send email to admins with summary
    
    return null;
  });