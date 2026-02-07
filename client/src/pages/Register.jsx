import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { BANKS, BANK_BRANCHES, ROUTES } from '../utils/constants';
import { validateAccountNumber, validatePhone, formatPhoneNumber } from '../utils/validation';
import { completeUserRegistration } from '../services/firestore.service';

const Register = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bankName: '',
    bankBranch: '',
    accountNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedBank = BANKS.find(b => b.label === formData.bankName);
  const branches = formData.bankName ? BANK_BRANCHES[selectedBank?.value] || [] : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.bankName || !formData.bankBranch || !formData.accountNumber) {
      setError('All fields are required');
      return;
    }

    if (!validateAccountNumber(formData.accountNumber, formData.bankName)) {
      setError(`Invalid account number format for ${formData.bankName}`);
      return;
    }

    setLoading(true);

    try {
      const result = await completeUserRegistration(userData.uid, formData);

      if (result.success) {
        navigate(ROUTES.INTERN_DASHBOARD);
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
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value, bankBranch: '' })}
              required
            >
              <option value="">Select your bank</option>
              {BANKS.map((bank) => (
                <option key={bank.value} value={bank.label}>
                  {bank.label}
                </option>
              ))}
            </Select>

            {/* Bank Branch */}
            <Select
              label="Bank Branch"
              value={formData.bankBranch}
              onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
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

            {/* Account Number */}
            <Input
              label="Account Number"
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              placeholder="Enter your account number"
              required
              helperText={selectedBank ? `${selectedBank.accountLength} digits required` : ''}
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