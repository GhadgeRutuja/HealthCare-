import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Award, 
  Heart, 
  Shield, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Target,
  Eye,
  Handshake,
  Stethoscope,
  Building,
  GraduationCap,
  TrendingUp
} from 'lucide-react';

const About = () => {
  const stats = [
    {
      icon: Users,
      number: '50,000+',
      label: 'Patients Served',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Stethoscope,
      number: '200+',
      label: 'Expert Doctors',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Building,
      number: '15',
      label: 'Medical Centers',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Award,
      number: '25+',
      label: 'Years Experience',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We treat every patient with empathy, respect, and genuine concern for their wellbeing.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Shield,
      title: 'Quality & Safety',
      description: 'Maintaining the highest standards of medical care with rigorous safety protocols.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Continuously striving for excellence in medical services and patient satisfaction.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Handshake,
      title: 'Integrity',
      description: 'Building trust through honest communication and ethical medical practices.',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const team = [
    {
      name: 'Dr. Michael Anderson',
      role: 'Chief Medical Officer',
      image: '/placeholder.svg',
      education: 'MD, Harvard Medical School',
      experience: '20+ years',
      specialization: 'Internal Medicine & Leadership'
    },
    {
      name: 'Dr. Sarah Williams',
      role: 'Director of Cardiology',
      image: '/placeholder.svg',
      education: 'MD, Johns Hopkins University',
      experience: '18+ years',
      specialization: 'Interventional Cardiology'
    },
    {
      name: 'Dr. James Chen',
      role: 'Head of Emergency Medicine',
      image: '/placeholder.svg',
      education: 'MD, Stanford Medical School',
      experience: '15+ years',
      specialization: 'Emergency & Trauma Care'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Director of Pediatrics',
      image: '/placeholder.svg',
      education: 'MD, UCLA Medical School',
      experience: '12+ years',
      specialization: 'Pediatric Care & Development'
    }
  ];

  const milestones = [
    {
      year: '1998',
      title: 'Foundation',
      description: 'MediCare was established with a vision to provide accessible healthcare.'
    },
    {
      year: '2005',
      title: 'Expansion',
      description: 'Opened 5 additional medical centers across the region.'
    },
    {
      year: '2012',
      title: 'Technology Integration',
      description: 'Implemented advanced digital health systems and telemedicine.'
    },
    {
      year: '2018',
      title: 'Specialized Centers',
      description: 'Launched specialized centers for cardiology, neurology, and oncology.'
    },
    {
      year: '2024',
      title: 'Innovation Hub',
      description: 'Established research and innovation center for medical advancement.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="gradient-sky text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About MediCare
            </h1>
            <p className="text-xl text-sky-100 max-w-3xl mx-auto mb-8">
              For over 25 years, we've been dedicated to providing exceptional healthcare services 
              with a commitment to innovation, compassion, and excellence in patient care.
            </p>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-sky-600">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule a Visit
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center mr-4">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To provide compassionate, high-quality healthcare services that improve the lives of our patients 
                  and communities. We are committed to delivering personalized care through innovation, excellence, 
                  and a patient-centered approach that puts your health and wellbeing first.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading healthcare provider in our region, recognized for our commitment to excellence, 
                  innovation, and patient satisfaction. We envision a future where every individual has access to 
                  comprehensive, affordable, and world-class medical care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These fundamental principles guide everything we do and shape our approach to patient care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0 text-center">
                  <div className={`w-16 h-16 ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the experienced professionals leading our mission to provide exceptional healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover bg-gray-200"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sky-600 font-medium mb-3">{member.role}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {member.education}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {member.experience}
                    </div>
                    <p className="text-xs mt-2">{member.specialization}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Milestones that have shaped our growth and commitment to excellence
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-sky-200"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-8 ${
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="text-sky-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-sky-600 rounded-full border-4 border-white shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 gradient-sky-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience Quality Healthcare?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust MediCare for their healthcare needs. 
            Schedule your appointment today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-sky-600 hover:bg-sky-700">
              <Calendar className="mr-2 h-5 w-5" />
              Book Appointment
            </Button>
            <Button size="lg" variant="outline">
              <Phone className="mr-2 h-5 w-5" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
