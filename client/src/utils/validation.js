// Form validation functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Kenyan phone format: +254XXXXXXXXX or 07XXXXXXXX or 01XXXXXXXX
  const phoneRegex = /^(\+254|0)[17]\d{8}$/;
  return phoneRegex.test(phone);
};

export const formatPhoneNumber = (phone) => {
  // Convert to +254 format
  if (phone.startsWith('0')) {
    return '+254' + phone.substring(1);
  }
  if (!phone.startsWith('+')) {
    return '+254' + phone;
  }
  return phone;
};

export const validateAccountNumber = (accountNumber, bankName) => {
  // Bank-specific account number validation
  const rules = {
    'KCB': { length: 13, type: 'numeric' },
    'Equity': { length: 12, type: 'numeric' },
    'Co-op Bank': { length: 13, type: 'numeric' },
    'NCBA': { length: 13, type: 'numeric' },
    'Stanbic': { length: 13, type: 'numeric' },
    'M-Pesa': { length: 9, type: 'numeric' }, // Phone number
    'Absa': { length: 10, type: 'numeric' },
    'Family Bank': { length: 13, type: 'numeric' },
  };

  const rule = rules[bankName];
  if (!rule) return true; // Unknown bank, skip validation

  const numericOnly = accountNumber.replace(/\D/g, '');
  
  if (rule.type === 'numeric') {
    return numericOnly.length === rule.length;
  }
  
  return accountNumber.length === rule.length;
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return {
    isValid: minLength && hasUppercase && hasLowercase && hasNumber,
    errors: {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
    }
  };
};

export const validateForm = (formData, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${field} is required`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};