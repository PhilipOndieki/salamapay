import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Alert from '../common/Alert';
import { formatDate, formatIssueRef, getIssueTypeText, maskAccountNumber } from '../../utils/formatters';
import { STATUS_LABELS, ISSUE_STATUS } from '../../utils/constants';
import { updateIssueStatus } from '../../services/firestore.service';

const IssueDetailModal = ({ issue, isOpen, onClose, adminId, onSuccess }) => {
  const [resolving, setResolving] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [error, setError] = useState(null);
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  if (!issue) return null;

  const handleResolve = async () => {
    setError(null);
    setResolving(true);

    try {
      const result = await updateIssueStatus(
        issue.id,
        ISSUE_STATUS.RESOLVED,
        adminId,
        resolutionNote
      );

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to resolve issue');
      console.error(err);
    } finally {
      setResolving(false);
    }
  };

  const handleMarkInProgress = async () => {
    setError(null);
    setResolving(true);

    try {
      const result = await updateIssueStatus(
        issue.id,
        ISSUE_STATUS.IN_PROGRESS,
        adminId
      );

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    } finally {
      setResolving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Issue ${formatIssueRef(issue.id)}`}
      size="large"
    >
      <div className="space-y-6">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {/* Status Badge */}
        <div>
          <Badge variant={issue.status} className="text-base">
            {STATUS_LABELS[issue.status]}
          </Badge>
        </div>

        {/* Intern Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Intern Name</p>
            <p className="font-medium text-dark-800">{issue.internName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-dark-800">{issue.internPhone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-dark-800">{issue.internEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Submitted</p>
            <p className="font-medium text-dark-800">{formatDate(issue.createdAt)}</p>
          </div>
        </div>

        {/* Bank Details */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-dark-800 mb-4">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bank</p>
              <p className="font-medium text-dark-800">{issue.bankName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Branch</p>
              <p className="font-medium text-dark-800">{issue.bankBranch}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Account Number</p>
              <div className="flex items-center gap-3">
                <p className="font-medium text-dark-800 font-mono">
                  {showAccountNumber ? issue.accountNumber : maskAccountNumber(issue.accountNumber)}
                </p>
                <button
                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {showAccountNumber ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Issue Details */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-dark-800 mb-4">Issue Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Issue Type</p>
              <p className="font-medium text-dark-800">{getIssueTypeText(issue.issueType)}</p>
            </div>
            {issue.description && (
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-dark-800">{issue.description}</p>
              </div>
            )}
            {issue.attachmentURL && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Attachment</p>
                <img
                  src={issue.attachmentURL}
                  alt="Issue attachment"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Resolution Section */}
        {issue.status !== ISSUE_STATUS.RESOLVED && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-dark-800 mb-4">Resolve Issue</h3>
            <textarea
              rows={3}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Add resolution note (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        )}

        {/* Resolution Info */}
        {issue.status === ISSUE_STATUS.RESOLVED && (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Resolved:</span> {formatDate(issue.resolvedAt)}
            </p>
            {issue.resolutionNote && (
              <p className="text-sm text-green-800 mt-2">
                <span className="font-semibold">Note:</span> {issue.resolutionNote}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {issue.status === ISSUE_STATUS.PENDING && (
          <Button
            variant="primary"
            onClick={handleMarkInProgress}
            disabled={resolving}
          >
            Mark In Progress
          </Button>
        )}
        {issue.status !== ISSUE_STATUS.RESOLVED && (
          <Button
            variant="orange"
            onClick={handleResolve}
            disabled={resolving}
          >
            {resolving ? 'Resolving...' : 'Resolve Issue'}
          </Button>
        )}
      </div>
    </Modal>
  );
};

IssueDetailModal.propTypes = {
  issue: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  adminId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
};

export default IssueDetailModal;