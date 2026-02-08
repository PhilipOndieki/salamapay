import PropTypes from 'prop-types';
import Select from '../common/Select';
import { ISSUE_STATUS, ISSUE_TYPES, BANKS, STATUS_LABELS, ISSUE_TYPE_LABELS } from '../../utils/constants';

const FilterPanel = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-dark-800 mb-4">Filters</h3>

      {/* Status Filter */}
      <div>
        <Select
          label="Status"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value || null })}
        >
          <option value="">All Statuses</option>
          {Object.entries(ISSUE_STATUS).map(([key, value]) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </div>

      {/* Issue Type Filter */}
      <div>
        <Select
          label="Issue Type"
          value={filters.issueType || ''}
          onChange={(e) => onFilterChange({ ...filters, issueType: e.target.value || null })}
        >
          <option value="">All Types</option>
          {Object.entries(ISSUE_TYPES).map(([key, value]) => (
            <option key={value} value={value}>
              {ISSUE_TYPE_LABELS[value]}
            </option>
          ))}
        </Select>
      </div>

      {/* Bank Filter */}
      <div>
        <Select
          label="Bank"
          value={filters.bankName || ''}
          onChange={(e) => onFilterChange({ ...filters, bankName: e.target.value || null })}
        >
          <option value="">All Banks</option>
          {BANKS.map((bank) => (
            <option key={bank.value} value={bank.label}>
              {bank.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFilterChange({ status: null, issueType: null, bankName: null })}
        className="w-full mt-4 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

FilterPanel.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterPanel;
