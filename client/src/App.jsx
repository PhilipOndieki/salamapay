import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROUTES, ROLES } from './utils/constants';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Register from './pages/Register';
import InternDashboard from './pages/InternDashboard';
import ReportIssue from './pages/ReportIssue';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  if (allowedRole && userRole !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    if (userRole === ROLES.ADMIN) {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} />;
    } else {
      return <Navigate to={ROUTES.INTERN_DASHBOARD} />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.HOME} element={<Landing />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Intern routes */}
          <Route 
            path={ROUTES.INTERN_DASHBOARD} 
            element={
              <ProtectedRoute allowedRole={ROLES.INTERN}>
                <InternDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.INTERN_REPORT_ISSUE} 
            element={
              <ProtectedRoute allowedRole={ROLES.INTERN}>
                <ReportIssue />
              </ProtectedRoute>
            } 
          />

          {/* Protected Admin routes */}
          <Route 
            path={ROUTES.ADMIN_DASHBOARD} 
            element={
              <ProtectedRoute allowedRole={ROLES.ADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;