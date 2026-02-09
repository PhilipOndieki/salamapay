import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { ISSUE_STATUS } from '../utils/constants';

// ===== USER OPERATIONS =====
// Complete user registration (bank details)
export const completeUserRegistration = async (uid, bankDetails) => {
  try {
    // Check if ID number already exists
    const idCheck = await checkIdNumberExists(bankDetails.idNumber);
    if (!idCheck.success) {
      return { success: false, error: idCheck.error };
    }
    if (idCheck.exists) {
      return { success: false, error: 'This ID number is already registered in the system' };
    }

    await updateDoc(doc(db, 'users', uid), {
      bankName: bankDetails.bankName,
      bankBranch: bankDetails.bankBranch,
      accountNumber: bankDetails.accountNumber, // Will be encrypted by Cloud Function
      idNumber: bankDetails.idNumber,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Complete registration error:', error);
    return { success: false, error: error.message };
  }
};

// Get user profile
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { success: false, error: error.message };
  }
};

// Check if ID number already exists
export const checkIdNumberExists = async (idNumber) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('idNumber', '==', idNumber),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    return { success: true, exists: !querySnapshot.empty };
  } catch (error) {
    console.error('Check ID number error:', error);
    return { success: false, error: error.message };
  }
};

// ===== ISSUE OPERATIONS =====

// Create new issue
export const createIssue = async (issueData) => {
  try {
    const issueRef = await addDoc(collection(db, 'issues'), {
      ...issueData,
      status: ISSUE_STATUS.PENDING,
      createdAt: serverTimestamp(),
      resolvedAt: null,
      resolvedBy: null,
      resolutionNote: null,
      internalNotes: [],
    });

    return { success: true, issueId: issueRef.id };
  } catch (error) {
    console.error('Create issue error:', error);
    return { success: false, error: error.message };
  }
};

// Get intern's issues
export const getInternIssues = async (internId) => {
  try {
    const q = query(
      collection(db, 'issues'),
      where('internId', '==', internId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const issues = [];
    querySnapshot.forEach((doc) => {
      issues.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: issues };
  } catch (error) {
    console.error('Get intern issues error:', error);
    return { success: false, error: error.message };
  }
};

// Get single issue by ID
export const getIssueById = async (issueId) => {
  try {
    const issueDoc = await getDoc(doc(db, 'issues', issueId));
    if (issueDoc.exists()) {
      return { success: true, data: { id: issueDoc.id, ...issueDoc.data() } };
    }
    return { success: false, error: 'Issue not found' };
  } catch (error) {
    console.error('Get issue error:', error);
    return { success: false, error: error.message };
  }
};

// Get all issues (admin)
export const getAllIssues = async (filters = {}) => {
  try {
    let q = collection(db, 'issues');
    const constraints = [];

    // Apply filters
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.issueType) {
      constraints.push(where('issueType', '==', filters.issueType));
    }
    if (filters.bankName) {
      constraints.push(where('bankName', '==', filters.bankName));
    }

    // Add ordering
    constraints.push(orderBy('createdAt', 'desc'));

    // Add limit if specified
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    q = query(q, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const issues = [];
    querySnapshot.forEach((doc) => {
      issues.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: issues };
  } catch (error) {
    console.error('Get all issues error:', error);
    return { success: false, error: error.message };
  }
};

// Update issue status
export const updateIssueStatus = async (issueId, status, adminId, resolutionNote = null) => {
  try {
    const updates = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === ISSUE_STATUS.RESOLVED) {
      updates.resolvedAt = serverTimestamp();
      updates.resolvedBy = adminId;
      if (resolutionNote) {
        updates.resolutionNote = resolutionNote;
      }
    }

    await updateDoc(doc(db, 'issues', issueId), updates);
    return { success: true };
  } catch (error) {
    console.error('Update issue status error:', error);
    return { success: false, error: error.message };
  }
};

// Add internal note to issue (admin only)
export const addInternalNote = async (issueId, note, adminId) => {
  try {
    const issueDoc = await getDoc(doc(db, 'issues', issueId));
    if (!issueDoc.exists()) {
      return { success: false, error: 'Issue not found' };
    }

    const currentNotes = issueDoc.data().internalNotes || [];
    const newNote = {
      note,
      addedBy: adminId,
      addedAt: new Date().toISOString(),
    };

    await updateDoc(doc(db, 'issues', issueId), {
      internalNotes: [...currentNotes, newNote],
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Add internal note error:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listener for issues
export const subscribeToIssues = (filters, callback) => {
  let q = collection(db, 'issues');
  const constraints = [];

  if (filters.status) {
    constraints.push(where('status', '==', filters.status));
  }
  if (filters.internId) {
    constraints.push(where('internId', '==', filters.internId));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  if (filters.limit) {
    constraints.push(limit(filters.limit));
  }

  q = query(q, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const issues = [];
    snapshot.forEach((doc) => {
      issues.push({ id: doc.id, ...doc.data() });
    });
    callback(issues);
  });
};

// Get dashboard statistics (admin)
export const getDashboardStats = async () => {
  try {
    const allIssues = await getAllIssues();
    if (!allIssues.success) {
      return { success: false, error: allIssues.error };
    }

    const issues = allIssues.data;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const stats = {
      totalPending: issues.filter(i => i.status === ISSUE_STATUS.PENDING).length,
      totalInProgress: issues.filter(i => i.status === ISSUE_STATUS.IN_PROGRESS).length,
      totalResolved: issues.filter(i => i.status === ISSUE_STATUS.RESOLVED).length,
      resolvedToday: issues.filter(i => {
        if (i.status !== ISSUE_STATUS.RESOLVED || !i.resolvedAt) return false;
        const resolvedDate = i.resolvedAt.toDate ? i.resolvedAt.toDate() : new Date(i.resolvedAt);
        return resolvedDate >= todayStart;
      }).length,
      byBank: {},
      byIssueType: {},
    };

    // Group by bank
    issues.forEach(issue => {
      if (issue.bankName) {
        stats.byBank[issue.bankName] = (stats.byBank[issue.bankName] || 0) + 1;
      }
      if (issue.issueType) {
        stats.byIssueType[issue.issueType] = (stats.byIssueType[issue.issueType] || 0) + 1;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return { success: false, error: error.message };
  }
};

// Bulk update issues
export const bulkUpdateIssues = async (issueIds, status, adminId) => {
  try {
    const updates = issueIds.map(issueId =>
      updateIssueStatus(issueId, status, adminId)
    );
    
    await Promise.all(updates);
    return { success: true };
  } catch (error) {
    console.error('Bulk update error:', error);
    return { success: false, error: error.message };
  }
};