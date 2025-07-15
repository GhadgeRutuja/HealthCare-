import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  Bell,
  Shield,
  CreditCard,
  Settings as SettingsIcon,
  Camera,
  Save,
  Eye,
  EyeOff,
  Plus,
  X,
  Calendar,
  DollarSign,
  Languages,
  Award,
  Stethoscope,
  GraduationCap,
  Building,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { User as UserType } from '@/services/api';

interface DoctorSettingsProps {
  user: UserType;
}

interface DoctorProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  professionalInfo: {
    medicalLicense: string;
    specialty: string;
    subSpecialty: string;
    yearsOfExperience: number;
    education: string[];
    certifications: string[];
    currentHospital: string;
    previousExperience: string[];
    consultationFee: number;
    languages: string[];
    biography: string;
  };
  schedule: {
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
    breakTime: {
      start: string;
      end: string;
    };
    appointmentDuration: number;
    maxDailyAppointments: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    appointmentReminders: boolean;
    cancelationAlerts: boolean;
    reviewNotifications: boolean;
    marketingEmails: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'limited';
    showContactInfo: boolean;
    showRatings: boolean;
    allowOnlineBooking: boolean;
    requireApproval: boolean;
  };
}

const DoctorSettings: React.FC<DoctorSettingsProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profile, setProfile] = useState<DoctorProfile>({
    personalInfo: {
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ')[1] || '',
      email: user.email || '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    professionalInfo: {
      medicalLicense: '',
      specialty: user.role === 'doctor' ? 'General Medicine' : '',
      subSpecialty: '',
      yearsOfExperience: 0,
      education: [],
      certifications: [],
      currentHospital: '',
      previousExperience: [],
      consultationFee: 0,
      languages: ['English'],
      biography: ''
    },
    schedule: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: {
        start: '09:00',
        end: '17:00'
      },
      breakTime: {
        start: '12:00',
        end: '13:00'
      },
      appointmentDuration: 30,
      maxDailyAppointments: 16
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      appointmentReminders: true,
      cancelationAlerts: true,
      reviewNotifications: true,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'public',
      showContactInfo: true,
      showRatings: true,
      allowOnlineBooking: true,
      requireApproval: false
    }
  });

  const [newEducation, setNewEducation] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const profileData = await api.getDoctorProfile(user._id);
        // setProfile(profileData);
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Failed to load doctor profile:', error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };

    loadDoctorProfile();
  }, [user._id]);

  const handleSave = async (section: keyof DoctorProfile) => {
    try {
      setSaving(true);
      // TODO: Replace with actual API call
      // await api.updateDoctorProfile(user._id, { [section]: profile[section] });
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      setSaving(true);
      // TODO: Replace with actual API call
      // await api.changePassword(user._id, currentPassword, newPassword);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to change password:', error);
      setMessage({ type: 'error', text: 'Failed to change password. Please check your current password.' });
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    if (newEducation.trim()) {
      setProfile(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          education: [...prev.professionalInfo.education, newEducation.trim()]
        }
      }));
      setNewEducation('');
    }
  };

  const removeEducation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        education: prev.professionalInfo.education.filter((_, i) => i !== index)
      }
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setProfile(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          certifications: [...prev.professionalInfo.certifications, newCertification.trim()]
        }
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setProfile(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        certifications: prev.professionalInfo.certifications.filter((_, i) => i !== index)
      }
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !profile.professionalInfo.languages.includes(newLanguage.trim())) {
      setProfile(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          languages: [...prev.professionalInfo.languages, newLanguage.trim()]
        }
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setProfile(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        languages: prev.professionalInfo.languages.filter((_, i) => i !== index)
      }
    }));
  };

  const workingDaysOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const toggleWorkingDay = (day: string) => {
    setProfile(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        workingDays: prev.schedule.workingDays.includes(day)
          ? prev.schedule.workingDays.filter(d => d !== day)
          : [...prev.schedule.workingDays, day]
      }
    }));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name?.split(' ').map(n => n[0]).join('') || 'D'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

              <Separator />

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.personalInfo.firstName}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.personalInfo.lastName}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.personalInfo.phone}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.personalInfo.dateOfBirth}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={profile.personalInfo.gender}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, gender: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <Label>Address Information</Label>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    placeholder="Street Address"
                    value={profile.personalInfo.address}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, address: e.target.value }
                    }))}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="City"
                      value={profile.personalInfo.city}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, city: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="State/Province"
                      value={profile.personalInfo.state}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, state: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="ZIP/Postal Code"
                      value={profile.personalInfo.zipCode}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, zipCode: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('personalInfo')} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Credentials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-green-600" />
                  Medical Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="medicalLicense">Medical License Number</Label>
                  <Input
                    id="medicalLicense"
                    value={profile.professionalInfo.medicalLicense}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      professionalInfo: { ...prev.professionalInfo, medicalLicense: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="specialty">Primary Specialty</Label>
                  <Input
                    id="specialty"
                    value={profile.professionalInfo.specialty}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      professionalInfo: { ...prev.professionalInfo, specialty: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="subSpecialty">Sub-specialty</Label>
                  <Input
                    id="subSpecialty"
                    value={profile.professionalInfo.subSpecialty}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      professionalInfo: { ...prev.professionalInfo, subSpecialty: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={profile.professionalInfo.yearsOfExperience}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      professionalInfo: { ...prev.professionalInfo, yearsOfExperience: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    min="0"
                    value={profile.professionalInfo.consultationFee}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      professionalInfo: { ...prev.professionalInfo, consultationFee: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Work Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentHospital">Current Hospital/Clinic</Label>
                  <Input
                    id="currentHospital"
                    value={profile.professionalInfo.currentHospital}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      professionalInfo: { ...prev.professionalInfo, currentHospital: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="biography">Professional Biography</Label>
                  <Textarea
                    id="biography"
                    rows={4}
                    placeholder="Tell patients about yourself, your experience, and approach to healthcare..."
                    value={profile.professionalInfo.biography}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      professionalInfo: { ...prev.professionalInfo, biography: e.target.value }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add education (e.g., MD from Harvard Medical School)"
                    value={newEducation}
                    onChange={(e) => setNewEducation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addEducation()}
                  />
                  <Button onClick={addEducation} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {profile.professionalInfo.education.map((edu, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{edu}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add certification (e.g., Board Certified in Internal Medicine)"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  />
                  <Button onClick={addCertification} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {profile.professionalInfo.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{cert}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeCertification(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Languages className="h-5 w-5 mr-2 text-green-600" />
                Languages Spoken
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add language"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                />
                <Button onClick={addLanguage} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.professionalInfo.languages.map((lang, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{lang}</span>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeLanguage(index)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('professionalInfo')} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Professional Info
            </Button>
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Working Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Working Days */}
              <div>
                <Label className="text-base font-medium mb-3 block">Working Days</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                  {workingDaysOptions.map((day) => (
                    <Button
                      key={day}
                      variant={profile.schedule.workingDays.includes(day) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleWorkingDay(day)}
                      className="w-full"
                    >
                      {day.substring(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={profile.schedule.workingHours.start}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        workingHours: { ...prev.schedule.workingHours, start: e.target.value }
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={profile.schedule.workingHours.end}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        workingHours: { ...prev.schedule.workingHours, end: e.target.value }
                      }
                    }))}
                  />
                </div>
              </div>

              {/* Break Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="breakStart">Break Start Time</Label>
                  <Input
                    id="breakStart"
                    type="time"
                    value={profile.schedule.breakTime.start}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        breakTime: { ...prev.schedule.breakTime, start: e.target.value }
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="breakEnd">Break End Time</Label>
                  <Input
                    id="breakEnd"
                    type="time"
                    value={profile.schedule.breakTime.end}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        breakTime: { ...prev.schedule.breakTime, end: e.target.value }
                      }
                    }))}
                  />
                </div>
              </div>

              {/* Appointment Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appointmentDuration">Appointment Duration (minutes)</Label>
                  <select
                    id="appointmentDuration"
                    value={profile.schedule.appointmentDuration}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, appointmentDuration: parseInt(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="maxAppointments">Max Daily Appointments</Label>
                  <Input
                    id="maxAppointments"
                    type="number"
                    min="1"
                    max="50"
                    value={profile.schedule.maxDailyAppointments}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, maxDailyAppointments: parseInt(e.target.value) || 1 }
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('schedule')} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-yellow-600" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {Object.entries(profile.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                      <p className="text-xs text-gray-500">
                        {key === 'emailNotifications' && 'Receive notifications via email'}
                        {key === 'smsNotifications' && 'Receive SMS text notifications'}
                        {key === 'pushNotifications' && 'Receive push notifications in the app'}
                        {key === 'appointmentReminders' && 'Get reminders about upcoming appointments'}
                        {key === 'cancelationAlerts' && 'Be notified when appointments are cancelled'}
                        {key === 'reviewNotifications' && 'Get notified about new patient reviews'}
                        {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, [key]: checked }
                      }))}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('notifications')} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-600" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handlePasswordChange} 
                  disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full"
                >
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Profile Visibility</Label>
                  <select
                    value={profile.privacy.profileVisibility}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, profileVisibility: e.target.value as 'public' | 'private' | 'limited' }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 mt-1"
                  >
                    <option value="public">Public - Visible to everyone</option>
                    <option value="limited">Limited - Visible to patients only</option>
                    <option value="private">Private - Not searchable</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Contact Information</Label>
                    <Switch
                      checked={profile.privacy.showContactInfo}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, showContactInfo: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Ratings & Reviews</Label>
                    <Switch
                      checked={profile.privacy.showRatings}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, showRatings: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Allow Online Booking</Label>
                    <Switch
                      checked={profile.privacy.allowOnlineBooking}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, allowOnlineBooking: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Require Appointment Approval</Label>
                    <Switch
                      checked={profile.privacy.requireApproval}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, requireApproval: checked }
                      }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave('privacy')} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorSettings;
