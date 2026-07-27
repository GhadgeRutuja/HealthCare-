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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="gradient-sky text-white py-28 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">
              About HealthCare+
            </h1>
            <p className="text-xl text-sky-100 max-w-3xl mx-auto leading-relaxed">
              Founded on a mission to provide accessible, compassionate, and high-quality healthcare 
              to every individual in our community.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Stats Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="card-premium shadow-premium-hover group border-slate-200 text-center">
                <div className={`w-16 h-16 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-sky-600 mb-2">{stat.number}</h3>
                <p className="text-slate-600 font-semibold">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="card-premium shadow-premium border-slate-200 p-10">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="h-8 w-8 text-sky-600" />
              <h2 className="text-3xl font-bold text-slate-900">Our Vision</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg mb-4">
              To be the leading healthcare provider known for innovation, excellence, and patient-centered care.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              We envision a world where quality healthcare is accessible to everyone, regardless of their background or circumstances.
            </p>
          </div>

          <div className="card-premium shadow-premium border-slate-200 p-10">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-8 w-8 text-sky-600" />
              <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg mb-4">
              To deliver comprehensive, compassionate healthcare services of the highest quality to improve health and wellbeing.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              We are committed to providing exceptional medical care while upholding the highest ethical standards.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">Our Core Values</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mb-16">
            These values guide every decision and action we take in serving our patients
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="card-premium shadow-premium-hover group border-slate-200">
                  <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-16 border border-slate-200">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">Our Journey</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mb-16">
            A timeline of milestones that shaped HealthCare+
          </p>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-8">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-xl gradient-sky text-white font-bold text-lg shadow-lg">
                    {milestone.year}
                  </div>
                </div>
                <div className="card-premium shadow-premium border-slate-200 flex-1 p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{milestone.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">Leadership Team</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mb-16">
            Meet the experienced professionals leading our organization
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card-premium shadow-premium-hover group border-slate-200 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover bg-slate-200"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-sky-600 font-semibold mb-4">{member.role}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="h-4 w-4 text-sky-600 flex-shrink-0 mt-1" />
                      <p className="text-sm text-slate-600">{member.education}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-sky-600 flex-shrink-0 mt-1" />
                      <p className="text-sm text-slate-600">{member.experience}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-sky-600 flex-shrink-0 mt-1" />
                      <p className="text-sm text-slate-600">{member.specialization}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="gradient-sky text-white rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">Join Our Community of Care</h2>
            <p className="text-lg text-sky-100 max-w-2xl mx-auto leading-relaxed">
              Experience the difference that compassionate, expert healthcare can make in your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-sky-600 font-semibold rounded-lg text-lg px-8 py-6">
                <Calendar className="mr-2 h-5 w-5" />
                Book an Appointment
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-sky-600 font-semibold rounded-lg text-lg px-8 py-6">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
