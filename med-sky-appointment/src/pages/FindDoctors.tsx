import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { doctorsApi, Doctor as APIDoctor } from '@/services/api';
import { 
  Search, 
  Star, 
  Calendar, 
  Filter,
  Heart, 
  Brain, 
  Eye, 
  Bone, 
  Baby, 
  Stethoscope,
  GraduationCap,
  Award,
  Phone,
  Mail,
  Loader2,
  ArrowRight
} from 'lucide-react';

const FindDoctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [doctors, setDoctors] = useState<APIDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const specialties = [
    'All',
    'Cardiology',
    'Neurology', 
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine',
    'Dermatology',
    'Psychiatry'
  ];

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await doctorsApi.getAll({
          specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
          search: searchTerm || undefined,
          limit: 20
        });
        
        if (response.success) {
          setDoctors(response.data);
          setError(null);
        } else {
          setError('Failed to fetch doctors');
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchDoctors();
    }, 300); // Debounce search

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedSpecialty]);

  // Get specialty icon
  const getSpecialtyIcon = (specialty: string) => {
    const iconMap: { [key: string]: any } = {
      'Cardiology': Heart,
      'Neurology': Brain,
      'Ophthalmology': Eye,
      'Orthopedics': Bone,
      'Pediatrics': Baby,
      'General Medicine': Stethoscope,
      'Family Medicine': Stethoscope,
      'Dermatology': Award,
      'Psychiatry': Brain,
    };
    return iconMap[specialty] || Stethoscope;
  };

  const handleBookAppointment = (doctorId: string, doctorName: string, specialty: string) => {
    navigate(`/book-appointment?doctorId=${doctorId}&doctor=${encodeURIComponent(doctorName)}&specialty=${encodeURIComponent(specialty)}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-sky-200 selection:text-sky-900 pb-20 relative overflow-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-200/40 blur-[120px] animate-pulse-soft" />
        <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Premium Header */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 animate-slide-up">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Specialist</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Connect with world-class healthcare professionals dedicated to your wellbeing.
        </p>
        
        {/* Search Bar - Glassmorphic */}
        <div className="max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
            <div className="relative flex items-center bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-2 transition-all hover:bg-white/95">
              <div className="p-3 text-sky-500">
                <Search className="h-6 w-6" />
              </div>
              <Input
                type="text"
                placeholder="Search doctor name, designation, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-0 shadow-none text-lg text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Filters */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="hidden md:flex items-center gap-2 mr-4 text-slate-500 font-medium">
              <Filter className="h-5 w-5" />
              <span>Filter:</span>
            </div>
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  selectedSpecialty === specialty 
                    ? "bg-slate-900 text-white shadow-lg scale-105" 
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between">
          {loading ? (
            <div className="flex items-center gap-3 text-sky-600 font-medium bg-sky-50 px-4 py-2 rounded-full">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Fetching premium specialists...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 font-semibold bg-red-50 px-4 py-2 rounded-full">
              {error}
            </div>
          ) : (
            <p className="text-slate-500 font-medium flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Showing <strong className="text-slate-900 mx-1">{doctors.length}</strong> available specialists
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-md rounded-[2rem] p-6 animate-pulse border border-slate-100">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-slate-200 rounded-2xl flex-shrink-0" />
                  <div className="flex-1 space-y-4 py-2">
                    <div className="h-6 bg-slate-200 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="glass-panel text-center py-24 rounded-[3rem]">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Connection Interrupted</h3>
            <p className="text-slate-500 mb-8 text-lg max-w-md mx-auto">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-slate-900 text-white rounded-full px-8 py-6 text-lg hover:bg-slate-800">
              Retry Connection
            </Button>
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {doctors.map((doctor) => {
              const IconComponent = getSpecialtyIcon(doctor.specialties[0] || '');
              const placeholderImage = doctor.user.gender === 'female'
                ? '/assets/doctor-placeholder-female.svg'
                : '/assets/doctor-placeholder-male.svg';
              const availableDay = Object.entries(doctor.workingHours || {})
                .find(([, hours]) => hours.isWorking);
              
              return (
                <div key={doctor._id} className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-sky-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                    {/* Image Column */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-white shadow-md relative flex items-center justify-center">
                        {doctor.user.profileImage && doctor.user.profileImage !== '/placeholder.svg' ? (
                          <img
                            src={doctor.user.profileImage}
                            alt={`Dr. ${doctor.user.firstName}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <img
                            src={placeholderImage}
                            alt={`Illustration of Dr. ${doctor.user.firstName}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        )}
                      </div>
                      <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-sky-500 rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-slate-50">
                        <IconComponent className="h-6 w-6" />
                      </div>
                    </div>
                    
                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 truncate">
                            Dr. {doctor.user.firstName} {doctor.user.lastName}
                          </h3>
                          <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mt-1">
                            {doctor.specialties[0]}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg font-bold text-sm">
                            <Star className="h-4 w-4 fill-current" />
                            {doctor.rating.average.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{doctor.education[0]?.degree} - {doctor.education[0]?.institution}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-slate-400" />
                          <span>{doctor.experience.years} Years of Excellence</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        {doctor.specialties.slice(1, 3).map((spec, i) => (
                          <Badge key={i} variant="secondary" className="bg-slate-50 text-slate-600 border border-slate-200 font-medium rounded-lg">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 rounded-xl bg-sky-50 px-3 py-2 text-xs text-slate-600">
                        <span className="font-semibold text-sky-700">Availability:</span>{' '}
                        {availableDay
                          ? `${availableDay[0].charAt(0).toUpperCase() + availableDay[0].slice(1)} ${availableDay[1].startTime} - ${availableDay[1].endTime}`
                          : 'Schedule not available'}
                      </div>
                      {doctor.bio && (
                        <p className="mt-3 line-clamp-2 text-sm text-slate-500">{doctor.bio}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Footer Actions */}
                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Consultation Fee</span>
                        <span className="text-xl font-extrabold text-slate-900">${doctor.consultationFee}</span>
                      </div>
                      <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          {doctor.status === 'active' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                          <span className={`relative inline-flex rounded-full h-3 w-3 ${doctor.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                        </span>
                        <span className={`text-sm font-semibold ${doctor.status === 'active' ? 'text-green-600' : 'text-slate-500'}`}>
                          {doctor.status === 'active' ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleBookAppointment(
                        doctor._id,
                        `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
                        doctor.specialties[0]
                      )}
                      className="w-full sm:w-auto bg-slate-900 text-white hover:bg-sky-600 rounded-xl px-6 py-5 transition-colors duration-300 font-semibold"
                      disabled={doctor.status !== 'active'}
                    >
                      Book Session <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && doctors.length === 0 && (
          <div className="glass-panel text-center py-24 rounded-[3rem]">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">No Specialists Found</h3>
            <p className="text-slate-500 mb-8 text-lg max-w-lg mx-auto">
              We couldn't find any doctors matching your criteria. Try adjusting your filters or search term.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('All');
              }}
              variant="outline"
              className="rounded-full px-8 py-6 text-lg border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;
