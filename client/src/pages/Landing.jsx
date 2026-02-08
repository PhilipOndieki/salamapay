import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { ROUTES, ROLES } from '../utils/constants';

const Landing = () => {
  const { currentUser, userRole } = useAuth();

  // Redirect authenticated users to their dashboard
  const getDashboardRoute = () => {
    if (!currentUser) return null;
    return userRole === ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.INTERN_DASHBOARD;
  };

  const dashboardRoute = getDashboardRoute();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={ROUTES.HOME} className="flex items-center">
              <span className="text-2xl font-bold text-primary-500">SalamaPay</span>
            </Link>

            <div className="flex items-center gap-4">
              {dashboardRoute ? (
                <Link to={dashboardRoute}>
                  <Button variant="primary">Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="secondary">Log In</Button>
                  </Link>
                  <Link to={ROUTES.SIGNUP}>
                    <Button variant="orange">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full width background */}
      <div 
        className="relative min-h-[600px] flex items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to SalamaPay
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              Peace of mind for your payments
            </p>
            
            {!currentUser && (
              <div className="flex flex-wrap gap-4">
                <Link to={ROUTES.SIGNUP}>
                  <Button variant="orange" className="text-lg px-8 py-4">
                    Get Started
                  </Button>
                </Link>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="secondary" className="text-lg px-8 py-4 bg-white">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-800 mb-4">
              How SalamaPay Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple, secure, and efficient payment issue resolution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark-800 mb-2">Report Issues</h3>
              <p className="text-gray-600">
                Easily report payment delays or discrepancies through our simple form
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark-800 mb-2">Track Status</h3>
              <p className="text-gray-600">
                Monitor your issue in real-time from submission to resolution
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark-800 mb-2">Get Resolved</h3>
              <p className="text-gray-600">
                Receive notifications when your payment issue is resolved
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-dark-800 mb-4">
            Ready to resolve your payment issues?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of interns who trust SalamaPay for payment issue resolution
          </p>
          {!currentUser && (
            <Link to={ROUTES.SIGNUP}>
              <Button variant="orange" className="text-lg px-8 py-4">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2026 SalamaPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;