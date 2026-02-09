import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Select from '../common/Select';
import Alert from '../common/Alert';
import { sendAdminMessage } from '../../services/firestore.service';

const SendMessageModal = ({ isOpen, onClose, internId, internName, adminId, onSuccess }) => {
  const [formData, setFormData] = useState({
    message: '',
    priority: 'normal',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);

    try {
      const result = await sendAdminMessage(
        internId,
        formData.message,
        adminId,
        formData.priority
      );

      if (result.success) {
        setSuccess('Message sent successfully!');
        setFormData({ message: '', priority: 'normal' });
        
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Send Message to ${internName}`}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} />}

        {/* Priority */}
        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent</option>
        </Select>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter your message here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.message.length}/500 characters
          </p>
        </div>

        {/* Priority Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Priority Levels:</strong>
          </p>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• <strong>Normal:</strong> General notifications (blue)</li>
            <li>• <strong>High:</strong> Important updates (yellow/warning)</li>
            <li>• <strong>Urgent:</strong> Critical issues requiring immediate attention (red)</li>
          </ul>
        </div>

        {/* Common Message Templates */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setFormData({ 
                ...formData, 
                message: 'Your name in the bank account does not match your ID. Please update your bank details or contact us for assistance.',
                priority: 'high'
              })}
              className="w-full text-left px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Name Mismatch
            </button>
            <button
              type="button"
              onClick={() => setFormData({ 
                ...formData, 
                message: 'Please verify your account number. We were unable to process your payment with the provided details.',
                priority: 'high'
              })}
              className="w-full text-left px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Account Verification
            </button>
            <button
              type="button"
              onClick={() => setFormData({ 
                ...formData, 
                message: 'Additional information is required to process your payment issue. Please check your details and update if necessary.',
                priority: 'normal'
              })}
              className="w-full text-left px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Additional Info Needed
            </button>
          </div>
        </div>

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
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

SendMessageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  internId: PropTypes.string.isRequired,
  internName: PropTypes.string.isRequired,
  adminId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
};

export default SendMessageModal;