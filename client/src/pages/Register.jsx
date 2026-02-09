import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';
import { BANKS, BANK_BRANCHES, ROUTES } from '../utils/constants';
import { validateAccountNumber } from '../utils/validation';
import { completeUserRegistration } from '../services/firestore.service';

const Register = () => {
  const { userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bankName: '',
    customBankName: '',
    bankBranch: '',
    customBankBranch: '',
    accountNumber: '',
    idNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedBank = BANKS.find(b => b.label === formData.bankName);
  const branches = formData.bankName ? BANK_BRANCHES[selectedBank?.value] || [] : [];
  
  // Check if "Other" is selected for bank or branch
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

    // Determine final bank name and branch
    const finalBankName = isOtherBankSelected ? formData.customBankName : formData.bankName;
    const finalBankBranch = isOtherBranchSelected ? formData.customBankBranch : formData.bankBranch;

    // Validation
    if (!finalBankName || !finalBankBranch || !formData.accountNumber || !formData.idNumber) {
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

    // Only validate account number format for predefined banks
    if (!isOtherBankSelected && !validateAccountNumber(formData.accountNumber, formData.bankName)) {
      setError(`Invalid account number format for ${formData.bankName}`);
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        bankName: finalBankName,
        bankBranch: finalBankBranch,
        accountNumber: formData.accountNumber,
        idNumber: formData.idNumber,
      };

      const result = await completeUserRegistration(userData.uid, registrationData);

      if (result.success) {
        // Use setTimeout to avoid React state update warning
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 100);
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

  // Show loading screen while auth is loading
  if (authLoading) {
    return <Loading fullScreen text="Loading your profile..." />;
  }

  // Redirect to login if no user is authenticated
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="text-3xl font-bold text-dark-800">
              Authentication Required
            </h2>
            <p className="mt-2 text-gray-600">
              Please sign in to complete your registration
            </p>
          </div>
          <Button
            variant="orange"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-dark-800">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Add your bank details to start reporting payment issues
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-card" onSubmit={handleSubmit}>
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          <div className="space-y-4">
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

            {/* Custom Bank Name Input - Shows when "Other" is selected */}
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

            {/* Custom Bank Branch Input - Shows when "Other" is selected */}
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

            {/* ID Number */}
            <Input
              label="ID Number"
              type="text"
              value={formData.idNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              placeholder="Enter your ID number"
              required
              helperText="Enter your National ID or Passport number"
            />
          </div>

          <Button
            type="submit"
            variant="orange"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Registration'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;