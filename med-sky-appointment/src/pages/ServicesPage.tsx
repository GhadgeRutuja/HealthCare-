import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { 
  Heart, 
  Brain, 
  Eye, 
  Bone, 
  Baby, 
  Stethoscope,
  Microscope,
  Scan,
  Pill,
  Activity,
  Users,
  Clock,
  Shield,
  Award,
  CheckCircle,
  Calendar,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ServicesPage = () => {
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Comprehensive heart care with advanced diagnostic and treatment options.',
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      features: [
        'Electrocardiogram (ECG)',
        'Echocardiography',
        'Heart Surgery',
        'Preventive Cardiology'
      ],
      specialists: '8 Cardiologists',
      availability: '24/7 Emergency Care'
    },
    {
      icon: Brain,
      title: 'Neurology',
      description: 'Expert neurological care for brain and nervous system disorders.',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      features: [
        'Brain MRI & CT Scans',
        'Stroke Treatment',
        'Epilepsy Management',
        'Neurological Surgery'
      ],
      specialists: '6 Neurologists',
      availability: 'Mon-Sun 8AM-8PM'
    },
    {
      icon: Eye,
      title: 'Ophthalmology',
      description: 'Complete eye care services from routine checkups to complex surgeries.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      features: [
        'Comprehensive Exams',
        'Cataract Surgery',
        'LASIK Surgery',
        'Glaucoma Treatment'
      ],
      specialists: '5 Ophthalmologists',
      availability: 'Mon-Fri 9AM-6PM'
    },
    {
      icon: Bone,
      title: 'Orthopedics',
      description: 'Advanced treatment for bone, joint, and musculoskeletal conditions.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      features: [
        'Joint Replacement',
        'Sports Medicine',
        'Fracture Treatment',
        'Spine Surgery'
      ],
      specialists: '10 Orthopedic Surgeons',
      availability: 'Mon-Sat 8AM-7PM'
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents.',
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
      features: [
        'Well-Child Visits',
        'Vaccinations',
        'Pediatric Surgery',
        'Emergency Pediatrics'
      ],
      specialists: '12 Pediatricians',
      availability: '24/7 Pediatric Care'
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      description: 'Primary healthcare services for overall wellness and prevention.',
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
      features: [
        'Routine Check-ups',
        'Chronic Management',
        'Health Screenings',
        'Preventive Care'
      ],
      specialists: '15 General Practitioners',
      availability: 'Mon-Sun 7AM-9PM'
    }
  ];

  const qualityFeatures = [
    {
      icon: Award,
      title: 'Accredited Excellence',
      description: 'Joint Commission accredited facility with absolute highest safety standards.'
    },
    {
      icon: Users,
      title: 'Expert Medical Team',
      description: 'Board-certified specialists with decades of combined global experience.'
    },
    {
      icon: Clock,
      title: '24/7 Emergency Care',
      description: 'Round-the-clock critical medical assistance for urgent health needs.'
    },
    {
      icon: Shield,
      title: 'Advanced Technology',
      description: 'State-of-the-art medical equipment and secure digital health records.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-sky-200 selection:text-sky-900 pb-20 relative overflow-hidden">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-300/20 blur-[120px] animate-pulse-soft" />
        <div className="absolute top-[40%] left-[-20%] w-[50%] h-[50%] rounded-full bg-emerald-200/20 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sky-700 font-medium text-sm mb-6 animate-slide-up">
          <Activity className="w-4 h-4" /> Comprehensive Care
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Specialties</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Discover our full range of medical specialties and services, delivered by 
          experienced professionals using cutting-edge technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:scale-105 transition-all">
             <Link to="/book-appointment">
                Schedule Appointment <ChevronRight className="ml-2 w-5 h-5" />
             </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className={`w-16 h-16 rounded-2xl ${service.bg} ${service.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
                
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-slate-700 font-medium">
                      <CheckCircle className="h-4 w-4 text-sky-500 mr-3 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-0 rounded-lg px-3 py-1">
                    <Users className="h-3 w-3 mr-1.5" /> {service.specialists}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-0 rounded-lg px-3 py-1">
                    <Clock className="h-3 w-3 mr-1.5" /> {service.availability}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality Features */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">The HealthCare+ Standard</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We're unconditionally committed to providing exceptional healthcare experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityFeatures.map((feature, index) => {
              const IconComp = feature.icon;
              return (
                <div key={index} className="text-center group p-6">
                  <div className="mx-auto w-20 h-20 bg-white rounded-3xl shadow-lg border border-slate-50 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <IconComp className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium CTA Block */}
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl">
          <div className="absolute inset-0">
             <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-blue-600/20 mix-blend-overlay" />
             {/* decorative blob */}
             <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/30 blur-[80px] rounded-full" />
             <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/30 blur-[80px] rounded-full" />
          </div>
          
          <div className="relative z-10 px-8 py-20 md:py-24 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to Experience World-Class Healthcare?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Don't wait to prioritize your health. Schedule an appointment with our expert specialists and take the first step towards a healthier tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg bg-sky-500 hover:bg-sky-400 text-white shadow-xl hover:shadow-sky-500/25 hover:-translate-y-1 transition-all border-0">
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-5 w-5" /> Book Appointment Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white transition-all">
                <Link to="/doctors">
                  Browse Specialists
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
