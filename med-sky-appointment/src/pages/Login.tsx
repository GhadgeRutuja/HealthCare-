
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();
  
  // Extract user type from URL path
  const userType = location.pathname.split('/').pop();
  const isSpecificLogin = ['patient', 'doctor', 'admin'].includes(userType || '');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/dashboard';

  // Get user type specific info
  const getUserTypeInfo = () => {
    if (!isSpecificLogin) {
      return {
        title: 'Sign in to your account',
        subtitle: 'Welcome back! Please sign in to continue.',
        icon: '🏥'
      };
    }
    
    switch (userType) {
      case 'patient':
        return {
          title: 'Patient Login',
          subtitle: 'Access your health records and book appointments',
          icon: '👤'
        };
      case 'doctor':
        return {
          title: 'Doctor Login', 
          subtitle: 'Manage your appointments and patient records',
          icon: '🩺'
        };
      case 'admin':
        return {
          title: 'Admin Login',
          subtitle: 'Access administrative dashboard and controls',
          icon: '🛡️'
        };
      default:
        return {
          title: 'Sign in to your account',
          subtitle: 'Welcome back! Please sign in to continue.',
          icon: '🏥'
        };
    }
  };

  const typeInfo = getUserTypeInfo();

  // Clear errors when form changes
  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the context
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <div className="text-4xl mb-4">{typeInfo.icon}</div>
            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
              {typeInfo.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {typeInfo.subtitle}
            </p>
            {!isSpecificLogin && (
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <Link to="/signup" className="font-medium text-sky-600 hover:text-sky-500">
                  create a new account
                </Link>
              </p>
            )}
          </div>
          
          <Card className="shadow-lg">
            <CardHeader className="space-y-1 sm:space-y-2">
              <CardTitle className="text-center text-lg sm:text-xl">
                {isSpecificLogin ? `${userType?.charAt(0).toUpperCase()}${userType?.slice(1)} Login` : 'Login'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {error && (
                <Alert variant="destructive" className="mb-4 sm:mb-6">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="email" className="text-sm">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-11 sm:h-12"
                      placeholder="Enter your email"
                    />
                  </div>
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 h-11 sm:h-12"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, rememberMe: !!checked }))
                      }
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Remember me
                    </Label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-sky-600 hover:text-sky-500">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-sky-600 hover:bg-sky-700 h-11 sm:h-12 text-base"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
