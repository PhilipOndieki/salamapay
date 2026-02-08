// User roles
export const ROLES = {
  INTERN: 'intern',
  ADMIN: 'admin'
};

// Admin roles
export const ADMIN_ROLES = {
  VIEWER: 'viewer',
  RESOLVER: 'resolver',
  SUPER_ADMIN: 'super_admin'
};

// Issue types
export const ISSUE_TYPES = {
  LATE_PAYMENT: 'late_payment',
  UNDERPAYMENT: 'underpayment',
  WRONG_AMOUNT: 'wrong_amount',
  NOT_RECEIVED: 'not_received',
  OTHER: 'other'
};

// Issue type labels
export const ISSUE_TYPE_LABELS = {
  [ISSUE_TYPES.LATE_PAYMENT]: 'Late Payment',
  [ISSUE_TYPES.UNDERPAYMENT]: 'Underpayment',
  [ISSUE_TYPES.WRONG_AMOUNT]: 'Wrong Amount',
  [ISSUE_TYPES.NOT_RECEIVED]: 'Payment Not Received',
  [ISSUE_TYPES.OTHER]: 'Other'
};

// Issue statuses
export const ISSUE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved'
};

// Status labels
export const STATUS_LABELS = {
  [ISSUE_STATUS.PENDING]: 'Pending',
  [ISSUE_STATUS.IN_PROGRESS]: 'In Progress',
  [ISSUE_STATUS.RESOLVED]: 'Resolved'
};

// Status colors (Tailwind classes)
export const STATUS_COLORS = {
  [ISSUE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ISSUE_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [ISSUE_STATUS.RESOLVED]: 'bg-green-100 text-green-800'
};

// Banks in Kenya
export const BANKS = [
  { value: 'kcb', label: 'Kenya Commercial Bank (KCB)', accountLength: 13 },
  { value: 'equity', label: 'Equity Bank', accountLength: 12 },
  { value: 'coop', label: 'Co-operative Bank', accountLength: 13 },
  { value: 'ncba', label: 'NCBA Bank', accountLength: 13 },
  { value: 'stanbic', label: 'Stanbic Bank', accountLength: 13 },
  { value: 'mpesa', label: 'M-Pesa', accountLength: 10 },
  { value: 'absa', label: 'Absa Bank', accountLength: 13 },
  { value: 'dtb', label: 'Diamond Trust Bank (DTB)', accountLength: 13 },
  { value: 'im', label: 'I & M Bank', accountLength: 13 },
  { value: 'standard_chartered', label: 'Standard Chartered', accountLength: 13 },
  { value: 'other', label: 'Other', accountLength: null }
];

// Bank branches (sample - you'd have a full list)
export const BANK_BRANCHES = {
  kcb: ['Westlands', 'CBD', 'Kilimani', 'Karen', 'Thika Road', 'Mombasa Road', 'Other'],
  equity: ['Upper Hill', 'Westlands', 'CBD', 'Thika', 'Nakuru', 'Kisumu', 'Other'],
  coop: ['Cooperative House', 'Westlands', 'CBD', 'Karen', 'Ngong Road', 'Other'],
  ncba: ['Westlands', 'CBD', 'Upperhill', 'Karen', 'Mombasa Road', 'Other'],
  stanbic: ['Chiromo', 'Westlands', 'CBD', 'Village Market', 'Other'],
  mpesa: ['Mobile Money'],
  absa: ['Queensway', 'Westlands', 'Thika Road', 'CBD', 'Other'],
  dtb: ['Mombasa Road', 'Westlands', 'Kenyatta Avenue', 'Other'],
  im: ['Koinange Street', 'Westlands', 'Thika Road', 'Industrial Area', 'Other'],
  standard_chartered: ['Chiromo', 'Westlands', 'CBD', 'Other'],
  other: ['Other']
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  INTERN_DASHBOARD: '/intern/dashboard',
  INTERN_REPORT_ISSUE: '/intern/report-issue',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ISSUE_DETAIL: '/admin/issues/:id'
};