import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Award, 
  Heart, 
  Shield, 
  Phone,
  Calendar,
  Target,
  Eye,
  Handshake,
  Stethoscope,
  Building,
  GraduationCap,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    {
      icon: Users,
      number: '50,000+',
      label: 'Patients Served',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Stethoscope,
      number: '200+',
      label: 'Expert Doctors',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      icon: Building,
      number: '15',
      label: 'Medical Centers',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      icon: Award,
      number: '25+',
      label: 'Years Experience',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We treat every patient with empathy, respect, and genuine concern for their holistic wellbeing.',
      color: 'text-rose-500',
      bg: 'bg-rose-500/10'
    },
    {
      icon: Shield,
      title: 'Quality & Safety',
      description: 'Maintaining the highest standards of medical care with rigorous, state-of-the-art safety protocols.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Continuously striving for excellence in medical services, technology, and patient satisfaction.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Handshake,
      title: 'Integrity',
      description: 'Building lifelong trust through transparent, honest communication and ethical medical practices.',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  ];

  const team = [
    {
      name: 'Dr. Michael Anderson',
      role: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1000&auto=format&fit=crop',
      education: 'MD, Harvard Medical School',
      experience: '20+ years',
      specialization: 'Internal Medicine & Leadership'
    },
    {
      name: 'Dr. Sarah Williams',
      role: 'Director of Cardiology',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop',
      education: 'MD, Johns Hopkins University',
      experience: '18+ years',
      specialization: 'Interventional Cardiology'
    },
    {
      name: 'Dr. James Chen',
      role: 'Head of Emergency Medicine',
      image: '/assets/doctor-james-chen.jpg',
      education: 'MD, Stanford Medical School',
      experience: '15+ years',
      specialization: 'Emergency & Trauma Care'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Director of Pediatrics',
      image: '/assets/doctor-emily-rodriguez.jpg',
      education: 'MD, UCLA Medical School',
      experience: '12+ years',
      specialization: 'Pediatric Care & Development'
    }
  ];

  const milestones = [
    {
      year: '1998',
      title: 'Foundation',
      description: 'HealthCare+ was established with a singular vision to provide accessible, world-class healthcare.'
    },
    {
      year: '2005',
      title: 'Expansion',
      description: 'Opened 5 additional state-of-the-art medical centers across the metropolitan region.'
    },
    {
      year: '2015',
      title: 'Digital Transformation',
      description: 'Implemented advanced digital health records and pioneered telemedicine in our district.'
    },
    {
      year: '2024',
      title: 'Innovation Hub',
      description: 'Established our premier research and innovation center for medical advancement.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-sky-200 selection:text-sky-900 relative overflow-hidden">
      <Navbar />
      
      {/* Abstract Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-300/30 blur-[120px] animate-pulse-soft" />
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-blue-400/20 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-300/20 blur-[120px] animate-pulse-soft" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 md:pt-40 md:pb-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sky-700 font-medium text-sm mb-6 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            Pioneering the Future of Healthcare
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Patient Care</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Founded on a mission to provide accessible, compassionate, and high-quality healthcare 
            to every individual in our community. We combine medical excellence with human empathy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-premium hover:shadow-premium-hover hover:scale-105 transition-all bg-sky-600 hover:bg-sky-700 text-white border-0">
              <Link to="/book-appointment">
                Book Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg bg-white/50 backdrop-blur-md border-sky-200 text-sky-700 hover:bg-white/80 hover:scale-105 transition-all">
              <Link to="/doctors">
                Meet Our Doctors
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="glass-panel rounded-3xl p-6 text-center hover:-translate-y-2 transition-all duration-300">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">{stat.number}</h3>
                <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          <div className="glass-panel rounded-3xl p-10 hover:shadow-premium-lg transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-sky-100 rounded-full blur-3xl group-hover:bg-sky-200 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-sky-100 rounded-2xl text-sky-600">
                  <Eye className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Our Vision</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg mb-4">
                To be the leading healthcare provider globally recognized for innovation, unparalleled excellence, and uncompromising patient-centered care.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                We envision a world where premium quality healthcare is seamlessly accessible to everyone, empowering healthier and happier communities.
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-10 hover:shadow-premium-lg transition-all duration-500 group relative overflow-hidden">
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl group-hover:bg-blue-200 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                  <Target className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg mb-4">
                To deliver comprehensive, compassionate healthcare services of the highest tier to comprehensively improve health and overall wellbeing.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                We are staunchly committed to providing exceptional medical care while upholding the absolute highest ethical and scientific standards.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              The foundational principles that guide every decision and action we take in serving our patients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 group">
                  <div className={`w-14 h-14 ${value.bg} ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-32">
          <div className="glass-panel rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">A Journey of Excellence</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Decades of commitment to advancing healthcare and saving lives.
              </p>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-12 mb-12 last:mb-0 group">
                  <div className="md:w-1/4 flex md:justify-end items-start md:pt-1">
                    <div className="inline-block bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text text-3xl font-black">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="md:w-3/4 glass-card bg-white/40 p-8 rounded-3xl group-hover:bg-white/70 transition-colors">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{milestone.title}</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Meet the distinguished professionals guiding our institution towards the future of medicine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group relative rounded-3xl overflow-hidden glass-card p-4">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="px-2 pb-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-sky-600 font-semibold text-sm mb-4">{member.role}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <GraduationCap className="h-4 w-4 text-sky-500" />
                      <span className="truncate">{member.education}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <TrendingUp className="h-4 w-4 text-sky-500" />
                      <span>{member.experience}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium CTA Section */}
        <div className="relative rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-slate-900">
             <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
             <div className="absolute inset-0 bg-gradient-to-r from-sky-900/90 to-slate-900/90" />
          </div>
          
          <div className="relative z-10 px-8 py-24 md:py-32 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Experience Premium Healthcare</h2>
            <p className="text-xl text-sky-100 max-w-2xl mx-auto leading-relaxed mb-10">
              Join thousands of patients who trust HealthCare+ for their medical needs. Schedule a consultation today and discover the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full px-10 py-7 text-lg bg-white text-slate-900 hover:bg-sky-50 shadow-xl hover:scale-105 transition-all font-bold">
                <Calendar className="mr-2 h-5 w-5 text-sky-600" />
                Book an Appointment
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 py-7 text-lg border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all font-medium">
                <Phone className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
