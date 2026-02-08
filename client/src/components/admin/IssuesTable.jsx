import PropTypes from 'prop-types';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';
import Loading from '../common/Loading';
import { formatDate, formatIssueRef, getIssueTypeText } from '../../utils/formatters';
import { STATUS_LABELS } from '../../utils/constants';

const IssuesTable = ({ issues, loading, onViewIssue, onResolveIssue }) => {
  if (loading) {
    return <Loading text="Loading issues..." />;
  }

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
          <h3 className="mt-4 text-lg font-medium text-gray-900">No issues found</h3>
          <p className="mt-2 text-gray-500">
            No payment issues match your current filters.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Issue ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Intern
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bank
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Issue Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary-600">
                    {formatIssueRef(issue.id)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{issue.internName}</div>
                  <div className="text-sm text-gray-500">{issue.internPhone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{issue.bankName}</div>
                  <div className="text-sm text-gray-500">{issue.bankBranch}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getIssueTypeText(issue.issueType)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={issue.status}>
                    {STATUS_LABELS[issue.status]}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(issue.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => onViewIssue(issue)}
                      className="text-xs px-3 py-1"
                    >
                      View
                    </Button>
                    {issue.status !== 'resolved' && (
                      <Button
                        variant="orange"
                        onClick={() => onResolveIssue(issue)}
                        className="text-xs px-3 py-1"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Issue Count */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{issues.length}</span> issue{issues.length !== 1 ? 's' : ''}
        </p>
      </div>
    </Card>
  );
};

IssuesTable.propTypes = {
  issues: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onViewIssue: PropTypes.func.isRequired,
  onResolveIssue: PropTypes.func.isRequired,
};

export default IssuesTable;