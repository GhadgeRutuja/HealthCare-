import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Calendar, 
  MapPin,
  UserCheck,
  Stethoscope,
  Shield,
  GraduationCap,
  Award,
  DollarSign,
  Globe,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Extract user type from URL path
  const userTypeFromUrl = location.pathname.split('/').pop();
  const initialRole = ['patient', 'doctor'].includes(userTypeFromUrl || '') 
    ? (userTypeFromUrl as 'patient' | 'doctor') 
    : 'patient';
  
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin'>(initialRole);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    // Doctor-specific fields
    licenseNumber: '',
    specialties: [],
    education: [{
      degree: '',
      institution: '',
      graduationYear: new Date().getFullYear()
    }],
    consultationFee: '',
    languages: [],
    bio: ''
  });

  const [formErrors, setFormErrors] = useState<any>({});

  // Clear errors when form changes
  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear field error
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (field: 'specialties' | 'languages', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'specialties' | 'languages') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'specialties' | 'languages', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      education: [{
        ...prev.education[0],
        [field]: value
      }]
    }));
  };

  const validateForm = () => {
    const errors: any = {};

    // Basic validation
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';

    // Role-specific validation
    if (selectedRole === 'patient') {
      if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) errors.gender = 'Gender is required';
    }

    if (selectedRole === 'doctor') {
      if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
      if (formData.specialties.length === 0 || !formData.specialties[0]?.trim()) errors.specialties = 'At least one specialty is required';
      if (!formData.education[0]?.degree?.trim()) errors.education = 'Education degree is required';
      if (!formData.education[0]?.institution?.trim()) errors.education = 'Education institution is required';
      if (!formData.consultationFee) errors.consultationFee = 'Consultation fee is required';
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
      // Filter out empty specialties
      const cleanSpecialties = formData.specialties.filter(s => s && s.trim());
      const cleanLanguages = formData.languages.filter(l => l && l.trim());
      
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: selectedRole,
        ...(selectedRole === 'patient' && {
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          address: formData.address
        }),
        ...(selectedRole === 'doctor' && {
          licenseNumber: formData.licenseNumber,
          specialties: cleanSpecialties.length > 0 ? cleanSpecialties : ['General Medicine'],
          education: formData.education,
          consultationFee: parseInt(formData.consultationFee),
          languages: cleanLanguages.length > 0 ? cleanLanguages : ['English'],
          bio: formData.bio
        })
      };

      console.log('📝 Submitting form data:', userData);
      await register(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Registration error:', error);
      // Error is handled by the context
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join MediCare and start your healthcare journey</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-center">Sign Up</CardTitle>
              
              {/* Role Selection */}
              <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="patient" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient
                  </TabsTrigger>
                  <TabsTrigger value="doctor" className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Doctor
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="Enter first name"
                      />
                    </div>
                    {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="Enter last name"
                      />
                    </div>
                    {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="Enter email address"
                    />
                  </div>
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="Enter phone number"
                    />
                  </div>
                  {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        placeholder="Enter password"
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

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Patient-specific fields */}
                {selectedRole === 'patient' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="pl-10"
                          />
                        </div>
                        {formErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{formErrors.dateOfBirth}</p>}
                      </div>

                      <div>
                        <Label htmlFor="gender">Gender *</Label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.gender && <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Address Information
                      </h3>
                      
                      <div>
                        <Label htmlFor="address.street">Street Address</Label>
                        <Input
                          id="address.street"
                          name="address.street"
                          type="text"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          placeholder="Enter street address"
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="address.city">City</Label>
                          <Input
                            id="address.city"
                            name="address.city"
                            type="text"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address.state">State</Label>
                          <Input
                            id="address.state"
                            name="address.state"
                            type="text"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address.zipCode">ZIP Code</Label>
                          <Input
                            id="address.zipCode"
                            name="address.zipCode"
                            type="text"
                            value={formData.address.zipCode}
                            onChange={handleInputChange}
                            placeholder="ZIP Code"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Doctor-specific fields */}
                {selectedRole === 'doctor' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      Professional Information
                    </h3>

                    <div>
                      <Label htmlFor="licenseNumber">Medical License Number *</Label>
                      <div className="relative">
                        <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          type="text"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="Enter license number"
                        />
                      </div>
                      {formErrors.licenseNumber && <p className="text-red-500 text-sm mt-1">{formErrors.licenseNumber}</p>}
                    </div>

                    {/* Specialties */}
                    <div>
                      <Label>Medical Specialties *</Label>
                      <p className="text-gray-600 text-sm mb-3">Choose from our list of recognized specialties</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="grid grid-cols-2 gap-2">
                          {['Cardiology', 'Neurology', 'Ophthalmology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology', 'Psychiatry', 'Radiology', 'Emergency Medicine', 'Surgery', 'Internal Medicine', 'Family Medicine', 'Oncology', 'Anesthesiology'].map((spec) => (
                            <label key={spec} className="flex items-center gap-2 p-2 border rounded hover:bg-blue-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.specialties.includes(spec)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    if (!formData.specialties.includes(spec)) {
                                      setFormData(prev => ({
                                        ...prev,
                                        specialties: [...prev.specialties.filter(s => s), spec]
                                      }));
                                    }
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      specialties: prev.specialties.filter(s => s !== spec)
                                    }));
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-sm">{spec}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {formData.specialties.length > 0 && formData.specialties[0] && (
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                          <p className="text-sm font-medium text-blue-900 mb-2">Selected Specialties:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.specialties.filter(s => s).map((spec, idx) => (
                              <span key={idx} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {spec}
                                <button
                                  type="button"
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    specialties: prev.specialties.filter((_, i) => i !== idx)
                                  }))}
                                  className="hover:text-blue-900"
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {formErrors.specialties && <p className="text-red-500 text-sm mt-2">{formErrors.specialties}</p>}
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Education *
                      </Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            placeholder="Degree (e.g., MD, MBBS)"
                            value={formData.education[0]?.degree || ''}
                            onChange={(e) => handleEducationChange('degree', e.target.value)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Institution"
                            value={formData.education[0]?.institution || ''}
                            onChange={(e) => handleEducationChange('institution', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Graduation Year"
                          value={formData.education[0]?.graduationYear || ''}
                          onChange={(e) => handleEducationChange('graduationYear', parseInt(e.target.value))}
                        />
                      </div>
                      {formErrors.education && <p className="text-red-500 text-sm mt-1">{formErrors.education}</p>}
                    </div>

                    {/* Consultation Fee */}
                    <div>
                      <Label htmlFor="consultationFee">Consultation Fee (USD) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="consultationFee"
                          name="consultationFee"
                          type="number"
                          value={formData.consultationFee}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="Enter consultation fee"
                        />
                      </div>
                      {formErrors.consultationFee && <p className="text-red-500 text-sm mt-1">{formErrors.consultationFee}</p>}
                    </div>

                    {/* Languages */}
                    <div>
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Languages Spoken
                      </Label>
                      <p className="text-gray-600 text-sm mb-3">Check the languages you speak fluently</p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {['English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi', 'Arabic', 'Portuguese'].map((lang) => (
                          <label key={lang} className="flex items-center gap-2 p-2 border rounded hover:bg-blue-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.languages.includes(lang)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (!formData.languages.includes(lang)) {
                                    setFormData(prev => ({
                                      ...prev,
                                      languages: [...prev.languages.filter(l => l), lang]
                                    }));
                                  }
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    languages: prev.languages.filter(l => l !== lang)
                                  }));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{lang}</span>
                          </label>
                        ))}
                      </div>

                      {formData.languages.length > 0 && formData.languages[0] && (
                        <div className="p-3 bg-green-50 rounded">
                          <p className="text-sm font-medium text-green-900 mb-2">Selected Languages:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.languages.filter(l => l).map((lang, idx) => (
                              <span key={idx} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {lang}
                                <button
                                  type="button"
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    languages: prev.languages.filter((_, i) => i !== idx)
                                  }))}
                                  className="hover:text-green-900"
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <Label htmlFor="bio" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Professional Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about your medical experience and expertise..."
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-sky-600 hover:bg-sky-700"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-sky-600 hover:text-sky-500 font-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
