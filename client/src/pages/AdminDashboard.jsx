import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../hooks/useIssues';
import { useAdminStats } from '../hooks/useAdminStats';
import Navbar from '../components/common/Navbar';
import Loading from '../components/common/Loading';
import StatsCard from '../components/admin/StatsCard';
import FilterPanel from '../components/admin/FilterPanel.jsx';
import IssuesTable from '../components/admin/IssuesTable.jsx';
import IssueDetailModal from '../components/admin/IssueDetailModal.jsx';
import MessagesList from '../components/admin/MessagesList';

const AdminDashboard = () => {
  const { userData } = useAuth();
  const [filters, setFilters] = useState({ status: null, issueType: null, bankName: null });
  const { issues, loading } = useIssues(filters);
  const { stats, loading: statsLoading } = useAdminStats();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('issues'); // 'issues' or 'messages'

  const handleViewIssue = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleResolveIssue = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-800">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage and resolve payment issues
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            <div className="col-span-full">
              <Loading text="Loading statistics..." />
            </div>
          ) : stats ? (
            <>
              <StatsCard
                title="Total Pending"
                value={stats.totalPending}
                color="warning"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatsCard
                title="In Progress"
                value={stats.totalInProgress}
                color="primary"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
              <StatsCard
                title="Resolved Today"
                value={stats.resolvedToday}
                color="success"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatsCard
                title="Total Resolved"
                value={stats.totalResolved}
                color="success"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              />
            </>
          ) : null}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('issues')}
              className={`${
                activeTab === 'issues'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Issues
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`${
                activeTab === 'messages'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Messages
            </button>
          </nav>
        </div>

        {/* Main Content */}
        {activeTab === 'issues' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterPanel filters={filters} onFilterChange={setFilters} />

              {/* Bank Distribution */}
              {stats && stats.byBank && Object.keys(stats.byBank).length > 0 && (
                <div className="mt-6 bg-white rounded-lg shadow-card p-6">
                  <h3 className="text-lg font-semibold text-dark-800 mb-4">By Bank</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.byBank).map(([bank, count]) => (
                      <div key={bank} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{bank}</span>
                        <span className="text-sm font-semibold text-dark-800">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Issues Table */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-dark-800">
                  Issues {!loading && `(${issues.length})`}
                </h2>
              </div>
              
              <IssuesTable
                issues={issues}
                loading={loading}
                onViewIssue={handleViewIssue}
                onResolveIssue={handleResolveIssue}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <MessagesList adminId={userData?.uid} />
          </div>
        )}
      </main>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        adminId={userData?.uid}
        onSuccess={handleModalClose}
      />
    </div>
  );
};

export default AdminDashboard;