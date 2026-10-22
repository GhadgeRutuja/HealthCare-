import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  Stethoscope,
  Shield,
  Activity
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
        icon: <Activity className="w-10 h-10 text-sky-500" />
      };
    }
    
    switch (userType) {
      case 'patient':
        return {
          title: 'Patient Login',
          subtitle: 'Access your health records and book appointments',
          icon: <User className="w-10 h-10 text-sky-500" />
        };
      case 'doctor':
        return {
          title: 'Doctor Login', 
          subtitle: 'Manage your appointments and patient records',
          icon: <Stethoscope className="w-10 h-10 text-blue-500" />
        };
      case 'admin':
        return {
          title: 'Admin Login',
          subtitle: 'Access administrative dashboard and controls',
          icon: <Shield className="w-10 h-10 text-purple-500" />
        };
      default:
        return {
          title: 'Sign in to your account',
          subtitle: 'Welcome back! Please sign in to continue.',
          icon: <Activity className="w-10 h-10 text-sky-500" />
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
    <div className="min-h-screen bg-slate-50 selection:bg-sky-200 selection:text-sky-900 relative overflow-hidden flex flex-col">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-200/50 blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/40 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm mb-6 animate-float">
              {typeInfo.icon}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {typeInfo.title}
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              {typeInfo.subtitle}
            </p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-bl-full blur-2xl opacity-50 pointer-events-none" />
            
            {error && (
              <Alert variant="destructive" className="mb-6 rounded-xl border-red-200 bg-red-50 text-red-800">
                <AlertDescription className="font-medium text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                <div className="relative mt-2 group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 transition-all text-base shadow-sm"
                    placeholder="Enter your email"
                  />
                </div>
                {formErrors.email && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                <div className="relative mt-2 group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 transition-all text-base shadow-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formErrors.password && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.password}</p>}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, rememberMe: !!checked }))
                    }
                    className="rounded-md border-slate-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-medium text-slate-600 cursor-pointer">
                    Remember me
                  </Label>
                </div>

                <Link to="/forgot-password" className="text-sm font-semibold text-sky-600 hover:text-sky-500 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-14 text-lg font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 mt-2"
              >
                {isLoading ? 'Signing in...' : 'Sign in to Account'}
              </Button>
              
              {!isSpecificLogin && (
                <p className="mt-8 text-center text-sm text-slate-600 font-medium border-t border-slate-200 pt-6">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-sky-600 hover:text-sky-500 font-bold transition-colors">
                    Create a new account
                  </Link>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
