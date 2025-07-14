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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Header Section */}
      <div className="gradient-sky text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Doctor
            </h1>
            <p className="text-xl text-sky-100 max-w-2xl mx-auto mb-8">
              Connect with experienced healthcare professionals who care about your wellbeing
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search doctors, specialties, or conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-white border-0 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Filter by Specialty:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                onClick={() => setSelectedSpecialty(specialty)}
                className={selectedSpecialty === specialty ? "bg-sky-600 hover:bg-sky-700" : ""}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-gray-600">Loading doctors...</span>
            </div>
          ) : error ? (
            <div className="text-red-600">
              {error}
            </div>
          ) : (
            <p className="text-gray-600">
              Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} 
              {selectedSpecialty !== 'All' && ` in ${selectedSpecialty}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid lg:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load doctors
            </h3>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && !error && (
          <div className="grid lg:grid-cols-2 gap-8">
            {doctors.map((doctor) => {
              const IconComponent = getSpecialtyIcon(doctor.specialties[0] || '');
              const colorClass = getSpecialtyColor(doctor.specialties[0] || '');
              
              return (
                <Card key={doctor._id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      {/* Doctor Image */}
                      <div className="relative">
                        <img
                          src={doctor.user.profileImage || '/placeholder.svg'}
                          alt={`${doctor.user.firstName} ${doctor.user.lastName}`}
                          className="w-20 h-20 rounded-full object-cover bg-gray-200"
                        />
                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${colorClass} rounded-full flex items-center justify-center`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                      </div>
                      
                      {/* Doctor Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          Dr. {doctor.user.firstName} {doctor.user.lastName}
                        </h3>
                        <p className="text-sky-600 font-semibold mb-2">
                          {doctor.specialties[0]}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-semibold">{doctor.rating.average.toFixed(1)}</span>
                          </div>
                          <span className="text-gray-500">({doctor.rating.count} reviews)</span>
                        </div>
                        
                        {/* Experience */}
                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {doctor.experience.years} years experience
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            {doctor.totalPatients} patients treated
                          </div>
                        </div>
                      </div>
                      
                      {/* Consultation Fee */}
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Consultation</div>
                        <div className="text-lg font-bold text-sky-600">${doctor.consultationFee}</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Education & Bio */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-gray-600" />
                        <span className="font-semibold text-gray-900">Education:</span>
                      </div>
                      {doctor.education.length > 0 && (
                        <p className="text-gray-600 text-sm mb-3">
                          {doctor.education[0].degree} - {doctor.education[0].institution} ({doctor.education[0].graduationYear})
                        </p>
                      )}
                      
                      {doctor.bio && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {doctor.bio}
                        </p>
                      )}
                    </div>

                    {/* Specializations */}
                    <div className="mb-4">
                      <div className="font-semibold text-gray-900 mb-2">Specializations:</div>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4">
                      <div className="font-semibold text-gray-900 mb-2">Languages:</div>
                      <p className="text-gray-600 text-sm">{doctor.languages.join(', ')}</p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${doctor.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-gray-600">
                          {doctor.status === 'active' ? 'Available' : 'Unavailable'}
                        </span>
                        {doctor.isAvailableForEmergency && (
                          <Badge variant="destructive" className="text-xs ml-2">
                            Emergency
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </Button>
                        <Button
                          onClick={() => handleBookAppointment(
                            doctor._id,
                            `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
                            doctor.specialties[0]
                          )}
                          size="sm"
                          className="bg-sky-600 hover:bg-sky-700 flex items-center gap-1"
                          disabled={doctor.status !== 'active'}
                        >
                          <Calendar className="h-4 w-4" />
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && doctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all specialties
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('All');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Ready to Get Started Section */}
        <div className="mt-16 bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Schedule your appointment today and experience the difference of personalized, professional healthcare.
          </p>
          <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700">
            <Link to="/book-appointment">
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </Link>
          </Button>
        </div>

        {/* Call to Action */}
        <div className="mt-16 gradient-sky-light rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Need Help Finding the Right Doctor?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our patient care coordinators are available 24/7 to help you find the perfect healthcare provider for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-sky-600 hover:bg-sky-700">
              <Phone className="mr-2 h-5 w-5" />
              Call (555) 123-4567
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="mr-2 h-5 w-5" />
              Email Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDoctors;
