import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Loading from '../components/common/Loading';
import IssueForm from '../components/intern/IssueForm';

const ReportIssue = () => {
  const { userData } = useAuth();

  if (!userData) {
    return <Loading fullScreen text="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-800">
            Report Payment Issue
          </h1>
          <p className="mt-2 text-gray-600">
            Fill out the form below to report your payment issue
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6 md:p-8">
          <IssueForm userData={userData} />
        </div>
      </main>
    </div>
  );
};

export default ReportIssue;