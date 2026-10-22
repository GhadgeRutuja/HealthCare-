import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Calendar, 
  MapPin,
  Stethoscope,
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
  
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor'>(initialRole);

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

      await register(userData);
      navigate('/dashboard');
    } catch (error) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-sky-200 selection:text-sky-900 relative overflow-hidden flex flex-col">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[60%] w-[50%] h-[50%] rounded-full bg-sky-200/40 blur-[120px] animate-pulse-soft" />
        <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/30 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-center">
        <div className="w-full max-w-4xl animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Create Your Account</h1>
            <p className="text-lg text-slate-600">Join MediCare and start your healthcare journey</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-6 sm:p-10 relative overflow-hidden">
             <div className="absolute -top-32 -right-32 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
             
             <div className="relative z-10">
              <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'patient' | 'doctor')} className="w-full mb-10">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-100/50 p-1.5 rounded-xl">
                  <TabsTrigger value="patient" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-sky-600 transition-all font-semibold py-2.5 flex items-center justify-center gap-2">
                    <User className="h-4 w-4" /> Patient
                  </TabsTrigger>
                  <TabsTrigger value="doctor" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all font-semibold py-2.5 flex items-center justify-center gap-2">
                    <Stethoscope className="h-4 w-4" /> Doctor
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {error && (
                <Alert variant="destructive" className="mb-8 rounded-xl border-red-200 bg-red-50 text-red-800">
                  <AlertDescription className="font-medium text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">First Name *</Label>
                    <div className="relative mt-2 group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                        placeholder="First name"
                      />
                    </div>
                    {formErrors.firstName && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.firstName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">Last Name *</Label>
                    <div className="relative mt-2 group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                        placeholder="Last name"
                      />
                    </div>
                    {formErrors.lastName && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.lastName}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address *</Label>
                    <div className="relative mt-2 group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                        placeholder="name@example.com"
                      />
                    </div>
                    {formErrors.email && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number *</Label>
                    <div className="relative mt-2 group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.phone}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password *</Label>
                    <div className="relative mt-2 group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-12 pr-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                        placeholder="Create a password"
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

                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">Confirm Password *</Label>
                    <div className="relative mt-2 group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-12 pr-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Patient-specific fields */}
                {selectedRole === 'patient' && (
                  <div className="space-y-8 border-t border-slate-200 pt-8 mt-8">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <User className="h-6 w-6 text-sky-500" /> Patient Details
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-slate-700">Date of Birth *</Label>
                        <div className="relative mt-2 group">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className="pl-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                          />
                        </div>
                        {formErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.dateOfBirth}</p>}
                      </div>

                      <div>
                        <Label htmlFor="gender" className="text-sm font-semibold text-slate-700">Gender *</Label>
                        <div className="mt-2">
                          <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                            <SelectTrigger className="h-14 rounded-xl bg-white border-slate-200 focus:ring-sky-500 focus:border-sky-500 shadow-sm">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl shadow-xl">
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {formErrors.gender && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.gender}</p>}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-slate-400" /> Address Information
                      </h4>
                      
                      <div>
                        <Label htmlFor="address.street" className="text-sm font-semibold text-slate-700">Street Address</Label>
                        <Input
                          id="address.street"
                          name="address.street"
                          type="text"
                          value={formData.address.street}
                          onChange={handleInputChange}
                          className="mt-2 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                          placeholder="Enter street address"
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="col-span-2 md:col-span-1">
                          <Label htmlFor="address.city" className="text-sm font-semibold text-slate-700">City</Label>
                          <Input
                            id="address.city"
                            name="address.city"
                            type="text"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            className="mt-2 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address.state" className="text-sm font-semibold text-slate-700">State</Label>
                          <Input
                            id="address.state"
                            name="address.state"
                            type="text"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            className="mt-2 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address.zipCode" className="text-sm font-semibold text-slate-700">ZIP Code</Label>
                          <Input
                            id="address.zipCode"
                            name="address.zipCode"
                            type="text"
                            value={formData.address.zipCode}
                            onChange={handleInputChange}
                            className="mt-2 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-sky-500 focus-visible:border-sky-500 shadow-sm"
                            placeholder="ZIP Code"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Doctor-specific fields */}
                {selectedRole === 'doctor' && (
                  <div className="space-y-8 border-t border-slate-200 pt-8 mt-8">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Stethoscope className="h-6 w-6 text-blue-500" /> Professional Information
                    </h3>

                    <div>
                      <Label htmlFor="licenseNumber" className="text-sm font-semibold text-slate-700">Medical License Number *</Label>
                      <div className="relative mt-2 group">
                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          type="text"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          className="pl-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-sm"
                          placeholder="Enter license number"
                        />
                      </div>
                      {formErrors.licenseNumber && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.licenseNumber}</p>}
                    </div>

                    {/* Specialties */}
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">Medical Specialties *</Label>
                      <p className="text-slate-500 text-sm mt-1 mb-4">Choose from our list of recognized specialties</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        {['Cardiology', 'Neurology', 'Ophthalmology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology', 'Psychiatry', 'Radiology', 'Emergency Medicine', 'Surgery'].map((spec) => (
                          <label key={spec} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors bg-white">
                            <Checkbox
                              checked={formData.specialties.includes(spec as any)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  if (!formData.specialties.includes(spec as never)) {
                                    setFormData(prev => ({
                                      ...prev,
                                      specialties: [...prev.specialties.filter(s => s), spec as never]
                                    }));
                                  }
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    specialties: prev.specialties.filter(s => s !== spec)
                                  }));
                                }
                              }}
                              className="rounded-md border-slate-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700">{spec}</span>
                          </label>
                        ))}
                      </div>

                      {formErrors.specialties && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.specialties}</p>}
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-slate-400" /> Education *
                      </Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Degree (e.g., MD, MBBS)"
                          value={formData.education[0]?.degree || ''}
                          onChange={(e) => handleEducationChange('degree', e.target.value)}
                          className="h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-sm"
                        />
                        <Input
                          placeholder="Institution Name"
                          value={formData.education[0]?.institution || ''}
                          onChange={(e) => handleEducationChange('institution', e.target.value)}
                          className="h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-sm"
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Graduation Year (e.g., 2015)"
                        value={formData.education[0]?.graduationYear || ''}
                        onChange={(e) => handleEducationChange('graduationYear', parseInt(e.target.value))}
                        className="h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-sm w-full md:w-1/2"
                      />
                      {formErrors.education && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.education}</p>}
                    </div>

                    {/* Consultation Fee */}
                    <div>
                      <Label htmlFor="consultationFee" className="text-sm font-semibold text-slate-700">Consultation Fee (USD) *</Label>
                      <div className="relative mt-2 group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          id="consultationFee"
                          name="consultationFee"
                          type="number"
                          value={formData.consultationFee}
                          onChange={handleInputChange}
                          className="pl-12 h-14 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-sm"
                          placeholder="Enter consultation fee per session"
                        />
                      </div>
                      {formErrors.consultationFee && <p className="text-red-500 text-sm mt-1.5 font-medium">{formErrors.consultationFee}</p>}
                    </div>

                    {/* Bio */}
                    <div>
                      <Label htmlFor="bio" className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-slate-400" /> Professional Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={5}
                        className="rounded-xl bg-white border-slate-200 focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-sm resize-none p-4"
                        placeholder="Tell patients about your medical experience, approach to care, and expertise..."
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-8 pb-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full text-white rounded-xl h-14 text-lg font-bold shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${
                      selectedRole === 'patient' ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20' : 
                      selectedRole === 'doctor' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 
                      'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                    }`}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>

                <div className="text-center pt-2 border-t border-slate-200">
                  <p className="text-slate-600 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-sky-600 hover:text-sky-500 font-bold transition-colors">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
