import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../hooks/useIssues';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import BankDetailsCard from '../components/intern/BankDetailsCard';
import IssueList from '../components/intern/IssueList';
import { ROUTES } from '../utils/constants';

const InternDashboard = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { issues, loading } = useIssues({ internId: userData?.uid });

  if (!userData) {
    return <Loading fullScreen text="Loading your profile..." />;
  }

  // Check if bank details are completed
  if (!userData.bankName || !userData.accountNumber) {
    navigate('/register');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-800">
            Welcome back, {userData.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Track and manage your payment issues
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Issues List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark-800">Your Issues</h2>
              <Button
                variant="orange"
                onClick={() => navigate(ROUTES.INTERN_REPORT_ISSUE)}
              >
                Report New Issue
              </Button>
            </div>

            {loading ? (
              <Loading text="Loading your issues..." />
            ) : (
              <IssueList issues={issues} />
            )}
          </div>

          {/* Right Column - Bank Details */}
          <div className="space-y-6">
            <BankDetailsCard userData={userData} />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-lg font-semibold text-dark-800 mb-4">
                Issue Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Issues</span>
                  <span className="font-semibold text-dark-800">
                    {issues.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {issues.filter(i => i.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">
                    {issues.filter(i => i.status === 'in_progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolved</span>
                  <span className="font-semibold text-green-600">
                    {issues.filter(i => i.status === 'resolved').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-800 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-primary-700 mb-4">
                If you're experiencing payment issues, report them here and our team will resolve them as quickly as possible.
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(ROUTES.INTERN_REPORT_ISSUE)}
              >
                Report Payment Issue
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InternDashboard;