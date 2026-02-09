import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { BANKS, BANK_BRANCHES } from '../../utils/constants';
import { validateAccountNumber, validatePhone, formatPhoneNumber } from '../../utils/validation';
import { updateUserProfile } from '../../services/auth.service';

const EditProfileModal = ({ isOpen, onClose, userData, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    bankName: userData?.bankName || '',
    customBankName: '',
    bankBranch: userData?.bankBranch || '',
    customBankBranch: '',
    accountNumber: userData?.accountNumber || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const selectedBank = BANKS.find(b => b.label === formData.bankName);
  const branches = formData.bankName ? BANK_BRANCHES[selectedBank?.value] || [] : [];
  
  const isOtherBankSelected = formData.bankName === 'Other';
  const isOtherBranchSelected = formData.bankBranch === 'Other';

  const handleBankChange = (e) => {
    const bankName = e.target.value;
    setFormData({ 
      ...formData, 
      bankName, 
      bankBranch: '', 
      customBankName: '',
      customBankBranch: '' 
    });
  };

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setFormData({ 
      ...formData, 
      bankBranch: branch,
      customBankBranch: '' 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Determine final bank name and branch
    const finalBankName = isOtherBankSelected ? formData.customBankName : formData.bankName;
    const finalBankBranch = isOtherBranchSelected ? formData.customBankBranch : formData.bankBranch;

    // Validation
    if (!formData.name || !formData.phone || !finalBankName || !finalBankBranch || !formData.accountNumber) {
      setError('All fields are required');
      return;
    }

    if (isOtherBankSelected && !formData.customBankName.trim()) {
      setError('Please enter your bank name');
      return;
    }

    if (isOtherBranchSelected && !formData.customBankBranch.trim()) {
      setError('Please enter your bank branch');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    // Only validate account number format for predefined banks
    if (!isOtherBankSelected && !validateAccountNumber(formData.accountNumber, formData.bankName)) {
      setError(`Invalid account number format for ${formData.bankName}`);
      return;
    }

    setLoading(true);

    try {
      const updates = {
        name: formData.name,
        phone: formatPhoneNumber(formData.phone),
        bankName: finalBankName,
        bankBranch: finalBankBranch,
        accountNumber: formData.accountNumber,
      };

      const result = await updateUserProfile(userData.uid, updates);

      if (result.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} />}

        {/* Name */}
        <Input
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your full name"
          required
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="0712345678"
          helperText="Kenyan phone number"
          required
        />

        {/* Bank Name */}
        <Select
          label="Bank Name"
          value={formData.bankName}
          onChange={handleBankChange}
          required
        >
          <option value="">Select your bank</option>
          {BANKS.map((bank) => (
            <option key={bank.value} value={bank.label}>
              {bank.label}
            </option>
          ))}
        </Select>

        {/* Custom Bank Name */}
        {isOtherBankSelected && (
          <Input
            label="Enter Bank Name"
            type="text"
            value={formData.customBankName}
            onChange={(e) => setFormData({ ...formData, customBankName: e.target.value })}
            placeholder="Enter your bank name"
            required
          />
        )}

        {/* Bank Branch */}
        <Select
          label="Bank Branch"
          value={formData.bankBranch}
          onChange={handleBranchChange}
          required
          disabled={!formData.bankName}
        >
          <option value="">Select branch</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </Select>

        {/* Custom Bank Branch */}
        {isOtherBranchSelected && formData.bankBranch === 'Other' && (
          <Input
            label="Enter Branch Name"
            type="text"
            value={formData.customBankBranch}
            onChange={(e) => setFormData({ ...formData, customBankBranch: e.target.value })}
            placeholder="Enter your branch name"
            required
          />
        )}

        {/* Account Number */}
        <Input
          label="Account Number"
          type="text"
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
          placeholder="Enter your account number"
          required
          helperText={
            selectedBank && !isOtherBankSelected
              ? `${selectedBank.accountLength} digits required`
              : isOtherBankSelected
              ? 'Enter your account number'
              : ''
          }
        />

        {/* ID Number - Read Only */}
        <Input
          label="ID Number"
          type="text"
          value={userData?.idNumber || ''}
          disabled
          helperText="ID number cannot be changed"
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="orange"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
};

export default EditProfileModal;