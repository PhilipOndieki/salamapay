import PropTypes from 'prop-types';
import Card from '../common/Card';
import { maskAccountNumber } from '../../utils/formatters';

const BankDetailsCard = ({ userData }) => {
  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-dark-800">Payment Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-dark-800">{userData.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-dark-800">{userData.phone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Bank</p>
            <p className="font-medium text-dark-800">{userData.bankName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Branch</p>
            <p className="font-medium text-dark-800">{userData.bankBranch}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Account Number</p>
            <p className="font-medium text-dark-800 font-mono">
              {maskAccountNumber(userData.accountNumber)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            These details are used for resolving payment issues only.
          </p>
        </div>
      </div>
    </Card>
  );
};

BankDetailsCard.propTypes = {
  userData: PropTypes.object.isRequired,
};

export default BankDetailsCard;