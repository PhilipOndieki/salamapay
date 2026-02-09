import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { signInUser } from '../services/auth.service';
import { ROUTES, ROLES } from '../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const result = await signInUser(formData.email, formData.password);

      if (result.success) {
        // Fetch user data to determine role
        const { getUserData } = await import('../services/auth.service');
        const userData = await getUserData(result.user.uid);
        
        if (userData.success) {
          const redirectRoute = userData.data.role === ROLES.ADMIN 
            ? ROUTES.ADMIN_DASHBOARD 
            : ROUTES.INTERN_DASHBOARD;
          navigate(redirectRoute);
        } else {
          // Fallback to intern dashboard if role fetch fails
          navigate(ROUTES.INTERN_DASHBOARD);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to={ROUTES.HOME}>
            <h1 className="text-4xl font-bold text-primary-500">SalamaPay</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-dark-800">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to={ROUTES.SIGNUP} className="text-primary-500 hover:text-primary-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-card" onSubmit={handleSubmit}>
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="orange"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center">
            <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;