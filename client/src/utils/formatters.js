import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

// Date formatting
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = date?.toDate ? date.toDate() : new Date(date);
  
  if (isToday(dateObj)) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday at ' + format(dateObj, 'h:mm a');
  }
  
  return format(dateObj, 'MMM d, yyyy h:mm a');
};

export const formatDateShort = (date) => {
  if (!date) return '';
  const dateObj = date?.toDate ? date.toDate() : new Date(date);
  return format(dateObj, 'MMM d, yyyy');
};

export const formatTime = (date) => {
  if (!date) return '';
  const dateObj = date?.toDate ? date.toDate() : new Date(date);
  return format(dateObj, 'h:mm a');
};

// Account number masking
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 4) return accountNumber;
  const last4 = accountNumber.slice(-4);
  return '****' + last4;
};

// Phone number formatting
export const formatPhoneDisplay = (phone) => {
  if (!phone) return '';
  
  // Remove +254 prefix for display
  if (phone.startsWith('+254')) {
    const localNumber = '0' + phone.substring(4);
    // Format as 0712 345 678
    return localNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};

// Currency formatting
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '';
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

// Issue reference formatting
export const formatIssueRef = (issueId) => {
  if (!issueId) return '';
  return '#ISS-' + issueId.substring(0, 8).toUpperCase();
};

// Status badge formatting
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status) => {
  const texts = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
  };
  return texts[status] || status;
};

// Issue type formatting
export const getIssueTypeText = (type) => {
  const texts = {
    late_payment: 'Late Payment',
    underpayment: 'Underpayment',
    wrong_amount: 'Wrong Amount',
    not_received: 'Payment Not Received',
    other: 'Other',
  };
  return texts[type] || type;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};