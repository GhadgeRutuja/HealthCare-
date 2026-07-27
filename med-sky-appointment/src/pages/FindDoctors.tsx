import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { doctorsApi, Doctor as APIDoctor } from '@/services/api';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Clock,
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
  Loader2
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

  // Get specialty color
  const getSpecialtyColor = (specialty: string) => {
    const colorMap: { [key: string]: string } = {
      'Cardiology': 'bg-red-100 text-red-600',
      'Neurology': 'bg-purple-100 text-purple-600',
      'Ophthalmology': 'bg-blue-100 text-blue-600',
      'Orthopedics': 'bg-green-100 text-green-600',
      'Pediatrics': 'bg-pink-100 text-pink-600',
      'General Medicine': 'bg-indigo-100 text-indigo-600',
      'Family Medicine': 'bg-indigo-100 text-indigo-600',
      'Dermatology': 'bg-yellow-100 text-yellow-600',
      'Psychiatry': 'bg-teal-100 text-teal-600',
    };
    return colorMap[specialty] || 'bg-gray-100 text-gray-600';
  };

  const handleBookAppointment = (doctorId: string, doctorName: string, specialty: string) => {
    // Navigate to booking page with doctor information
    navigate(`/book-appointment?doctorId=${doctorId}&doctor=${encodeURIComponent(doctorName)}&specialty=${encodeURIComponent(specialty)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Header Section */}
      <div className="gradient-sky text-white py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">
              Find Your Doctor
            </h1>
            <p className="text-xl text-sky-100 max-w-2xl mx-auto leading-relaxed">
              Connect with experienced healthcare professionals who care about your wellbeing
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-4 pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search doctors, specialties, or conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white border-0 shadow-premium rounded-xl w-full text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="h-6 w-6 text-sky-600" />
            <span className="font-semibold text-slate-900 text-lg">Filter by Specialty:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                onClick={() => setSelectedSpecialty(specialty)}
                size="lg"
                className={`${
                  selectedSpecialty === specialty ? "gradient-sky text-white shadow-lg hover:shadow-xl" : "border-2 border-slate-200 text-slate-700 hover:border-sky-400"
                } rounded-full font-semibold px-6 py-2`}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
              <span className="text-slate-600 font-medium">Loading doctors...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 font-semibold">
              {error}
            </div>
          ) : (
            <p className="text-slate-600 font-medium">
              Showing <span className="text-sky-600 font-bold">{doctors.length}</span> doctor{doctors.length !== 1 ? 's' : ''} 
              {selectedSpecialty !== 'All' && ` in ${selectedSpecialty}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-premium shadow-premium animate-pulse border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-slate-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-slate-300 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-300 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-300 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-slate-300 mb-6">
              <Search className="h-20 w-20 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Failed to load doctors
            </h3>
            <p className="text-slate-600 mb-6 text-lg">
              {error}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="lg"
              className="border-2 border-slate-200 text-slate-700 hover:border-sky-400 rounded-lg font-semibold"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {doctors.map((doctor) => {
              const IconComponent = getSpecialtyIcon(doctor.specialties[0] || '');
              const colorClass = getSpecialtyColor(doctor.specialties[0] || '');
              
              return (
                <div key={doctor._id} className="card-premium shadow-premium-hover group border-slate-200 overflow-hidden">
                  <div className="flex items-start gap-6">
                    {/* Doctor Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={doctor.user.profileImage || '/placeholder.svg'}
                        alt={`${doctor.user.firstName} ${doctor.user.lastName}`}
                        className="w-24 h-24 rounded-xl object-cover bg-slate-200 shadow-md"
                      />
                      <div className={`absolute -bottom-2 -right-2 w-10 h-10 ${colorClass} rounded-full flex items-center justify-center shadow-lg`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>
                    
                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0 pt-2">
                      <h3 className="text-2xl font-bold text-slate-900 mb-1 truncate">
                        Dr. {doctor.user.firstName} {doctor.user.lastName}
                      </h3>
                      <p className="text-sky-600 font-semibold mb-3 text-base">
                        {doctor.specialties[0]}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="ml-1.5 font-bold text-slate-900">{doctor.rating.average.toFixed(1)}</span>
                        </div>
                        <span className="text-slate-600 text-sm">({doctor.rating.count} reviews)</span>
                      </div>
                      
                      {/* Experience */}
                      <div className="flex flex-col gap-2 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-sky-600" />
                          <span>{doctor.experience.years} years experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-sky-600" />
                          <span>{doctor.totalPatients} patients treated</span>
                        </div>
                      </div>

                      {/* Consultation Fee */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-slate-600">Consultation Fee:</span>
                        <span className="text-2xl font-bold text-sky-600">${doctor.consultationFee}</span>
                      </div>
                    </div>
                    
                    {/* Consultation Fee Badge */}
                    <div className="text-right flex-shrink-0">
                      <div className="gradient-sky text-white px-4 py-2 rounded-lg shadow-md">
                        <div className="text-xs text-sky-100 mb-0.5">Per Session</div>
                        <div className="text-2xl font-bold">${doctor.consultationFee}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="my-6 border-t border-slate-200"></div>

                  <div className="space-y-4">
                    {/* Education & Bio */}
                    {doctor.education.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-sky-600" />
                          <span className="font-semibold text-slate-900">Education:</span>
                        </div>
                        <p className="text-slate-600 text-sm ml-6">
                          {doctor.education[0].degree} - {doctor.education[0].institution} ({doctor.education[0].graduationYear})
                        </p>
                      </div>
                    )}
                    
                    {doctor.bio && (
                      <p className="text-slate-600 text-sm line-clamp-3 bg-slate-50 p-3 rounded-lg">
                        {doctor.bio}
                      </p>
                    )}

                    {/* Specializations */}
                    <div>
                      <div className="font-semibold text-slate-900 mb-2">Specializations:</div>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specialties.map((specialty, index) => (
                          <Badge key={index} className="bg-sky-100 text-sky-700 border-0 font-medium">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <div className="font-semibold text-slate-900 mb-2">Languages:</div>
                      <p className="text-slate-600 text-sm">{doctor.languages.join(', ')}</p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${doctor.status === 'active' ? 'bg-green-500 shadow-glow' : 'bg-slate-400'}`}></div>
                        <span className={`font-semibold ${doctor.status === 'active' ? 'text-green-700' : 'text-slate-600'}`}>
                          {doctor.status === 'active' ? 'Available' : 'Unavailable'}
                        </span>
                        {doctor.isAvailableForEmergency && (
                          <Badge className="bg-red-100 text-red-700 border-0 font-semibold ml-2">
                            Emergency
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-slate-200 text-slate-700 hover:border-sky-400 rounded-lg font-semibold"
                        >
                          <Phone className="h-4 w-4 mr-1.5" />
                          Call
                        </Button>
                        <Button
                          onClick={() => handleBookAppointment(
                            doctor._id,
                            `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
                            doctor.specialties[0]
                          )}
                          size="sm"
                          className="gradient-sky text-white hover:shadow-lg font-semibold rounded-lg"
                          disabled={doctor.status !== 'active'}
                        >
                          <Calendar className="h-4 w-4 mr-1.5" />
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && doctors.length === 0 && (
          <div className="text-center py-24">
            <div className="inline-block bg-slate-100 p-6 rounded-full mb-8">
              <Search className="h-16 w-16 text-slate-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">
              No doctors found
            </h3>
            <p className="text-slate-600 mb-8 text-lg max-w-xl mx-auto">
              Try adjusting your search criteria or browse all specialties. New doctors are joining our platform regularly!
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('All');
              }}
              size="lg"
              className="gradient-sky text-white hover:shadow-lg font-semibold rounded-lg px-8"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Ready to Get Started Section */}
        {!loading && !error && doctors.length > 0 && (
          <>
            <div className="mt-20 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-16 text-center border border-slate-200 shadow-premium">
              <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Found Your Doctor?
              </h3>
              <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Schedule your appointment today and experience the difference of personalized, professional healthcare.
              </p>
              <Button asChild size="lg" className="gradient-sky text-white hover:shadow-lg text-lg px-10 py-7 rounded-xl font-semibold">
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment Now
                </Link>
              </Button>
            </div>

            {/* Call to Action */}
            <div className="mt-16 gradient-sky text-white rounded-3xl p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold">
                  Need Help Finding the Right Doctor?
                </h3>
                <p className="text-lg text-sky-100 max-w-2xl mx-auto leading-relaxed">
                  Our patient care coordinators are available 24/7 to help you find the perfect healthcare provider for your needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-sky-600 font-semibold rounded-lg text-lg px-8 py-6">
                    <Phone className="mr-2 h-5 w-5" />
                    Call (555) 123-4567
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-sky-600 font-semibold rounded-lg text-lg px-8 py-6">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Support
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FindDoctors;
