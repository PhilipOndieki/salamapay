import PropTypes from 'prop-types';
import { formatDate, formatIssueRef, getIssueTypeText } from '../../utils/formatters';
import Badge from '../common/Badge';
import Card from '../common/Card';
import { ISSUE_STATUS, STATUS_LABELS } from '../../utils/constants';

const IssueList = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No issues reported</h3>
          <p className="mt-2 text-gray-500">
            You haven't reported any payment issues yet.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Card key={issue.id} hover>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-dark-800">
                  {formatIssueRef(issue.id)}
                </h3>
                <Badge variant={issue.status}>
                  {STATUS_LABELS[issue.status]}
                </Badge>
              </div>

              <p className="text-gray-700">{getIssueTypeText(issue.issueType)}</p>

              {issue.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {issue.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{formatDate(issue.createdAt)}</span>
                {issue.resolvedAt && (
                  <span>• Resolved {formatDate(issue.resolvedAt)}</span>
                )}
              </div>
            </div>

            {issue.attachmentURL && (
              <div className="flex-shrink-0">
                <img
                  src={issue.attachmentURL}
                  alt="Attachment"
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

IssueList.propTypes = {
  issues: PropTypes.array.isRequired,
};

export default IssueList;