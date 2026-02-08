import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../services/auth.service';
import Button from './Button';
import { ROUTES, ROLES } from '../../utils/constants';

const Navbar = () => {
  const { currentUser, userData, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await signOutUser();
    if (result.success) {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-500">SalamaPay</h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                {/* User Info */}
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {userData?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-dark-800">{userData?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
                </div>

                {/* Dashboard Link */}
                {userRole === ROLES.ADMIN ? (
                  <Link to={ROUTES.ADMIN_DASHBOARD}>
                    <Button variant="secondary">Dashboard</Button>
                  </Link>
                ) : (
                  <Link to={ROUTES.INTERN_DASHBOARD}>
                    <Button variant="secondary">Dashboard</Button>
                  </Link>
                )}

                {/* Logout Button */}
                <Button variant="orange" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Login and Signup for non-authenticated users */}
                <Link to={ROUTES.LOGIN}>
                  <Button variant="secondary">Login</Button>
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
  );
};

export default Navbar;