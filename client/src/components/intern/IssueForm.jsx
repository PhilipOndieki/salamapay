import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import FileUpload from '../common/FileUpload';
import Alert from '../common/Alert';
import { ISSUE_TYPES, ISSUE_TYPE_LABELS, ROUTES } from '../../utils/constants';
import { createIssue } from '../../services/firestore.service';
import { uploadIssueAttachment } from '../../services/storage.service';

const IssueForm = ({ userData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.issueType) {
      setError('Please select an issue type');
      return;
    }

    setLoading(true);

    try {
      // Prepare issue data
      const issueData = {
        internId: userData.uid,
        internName: userData.name,
        internPhone: userData.phone,
        internEmail: userData.email,
        bankName: userData.bankName,
        bankBranch: userData.bankBranch,
        accountNumber: userData.accountNumber,
        issueType: formData.issueType,
        description: formData.description || '',
        attachmentURL: '',
      };

      // Upload attachment if exists
      if (attachment) {
        const tempIssueId = Date.now().toString();
        const uploadResult = await uploadIssueAttachment(attachment, tempIssueId);
        
        if (uploadResult.success) {
          issueData.attachmentURL = uploadResult.url;
        } else {
          setError('Failed to upload attachment: ' + uploadResult.error);
          setLoading(false);
          return;
        }
      }

      // Create issue
      const result = await createIssue(issueData);

      if (result.success) {
        setSuccess('Issue reported successfully! Reference: #ISS-' + result.issueId.substring(0, 8));
        
        // Reset form
        setFormData({ issueType: '', description: '' });
        setAttachment(null);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate(ROUTES.INTERN_DASHBOARD);
        }, 2000);
      } else {
        setError('Failed to report issue: ' + result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} />}

      {/* Issue Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Issue Type <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {Object.entries(ISSUE_TYPES).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="issueType"
                value={value}
                checked={formData.issueType === value}
                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                className="w-5 h-5 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-3 text-gray-800 font-medium">
                {ISSUE_TYPE_LABELS[value]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Details (Optional)
        </label>
        <textarea
          id="description"
          rows={4}
          maxLength={500}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Provide any additional information about your payment issue..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* File Upload */}
      <FileUpload
        label="Attach Proof (Optional)"
        helperText="Upload a screenshot of payment notification or bank statement"
        onFileSelect={setAttachment}
      />

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="orange"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Submitting...' : 'Submit Issue'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(ROUTES.INTERN_DASHBOARD)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

IssueForm.propTypes = {
  userData: PropTypes.object.isRequired,
};

export default IssueForm;