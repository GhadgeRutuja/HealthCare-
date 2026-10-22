import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Brain, 
  Eye, 
  Bone, 
  Baby, 
  Stethoscope,
  Users,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Advanced diagnostic and treatment options for heart and vascular conditions by board-certified specialists.'
    },
    {
      icon: Brain,
      title: 'Neurology',
      description: 'Comprehensive neurological care focusing on complex brain, spinal cord, and nervous system disorders.'
    },
    {
      icon: Eye,
      title: 'Ophthalmology',
      description: 'State-of-the-art vision care, from routine checkups and diagnostics to complex surgical interventions.'
    },
    {
      icon: Bone,
      title: 'Orthopedics',
      description: 'Dedicated treatment and rehabilitation plans for bone, joint, and severe musculoskeletal injuries.'
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      description: 'Compassionate, specialized healthcare tailored to the developmental needs of infants and children.'
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      description: 'Holistic primary care services focusing on long-term wellness, prevention, and proactive health management.'
    }
  ];

  const features = [
    'Access to top-tier medical specialists',
    'State-of-the-art medical facilities',
    'Seamless digital appointment scheduling',
    'Comprehensive patient health records',
    'Strict confidentiality and data security',
    '24/7 dedicated patient support line'
  ];

  return (
    <section className="py-24 lg:py-32 bg-slate-50 relative selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-5">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100/50 text-blue-700 font-semibold text-sm border border-blue-200 uppercase tracking-widest shadow-sm">
            Departments of Excellence
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Specialized Care <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Departments</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
            Our multi-disciplinary team brings together leading experts across various medical fields to provide you with the most effective, personalized treatments available.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-blue-50/50 rounded-2xl shadow-inner border border-blue-100/50 flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-500 group-hover:scale-110">
                <service.icon className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed font-light text-[1.05rem]">
                {service.description}
              </p>
              <div className="pt-2 border-t border-slate-100">
                <Link 
                  to={`/book-appointment?specialty=${encodeURIComponent(service.title)}`}
                  className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group/link"
                >
                  Schedule Consultation
                  <ArrowRight className="ml-1.5 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Features / Why Choose Us Section - Reimagined */}
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl mt-12 relative group/feature">
          {/* Subtle gradient glow in background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="grid lg:grid-cols-2 relative z-10">
            
            <div className="p-12 md:p-16 lg:p-20 flex flex-col justify-center">
              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
                A higher standard of <br/>
                <span className="text-blue-400">medical excellence.</span>
              </h3>
              <p className="text-slate-300 text-lg mb-12 leading-relaxed font-light">
                We believe that healthcare should be accessible, transparent, and built around your specific needs. From routine check-ups to complex procedures, our facilities prioritize your well-being.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-y-6 gap-x-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3 group/item">
                    <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5 group-hover/item:text-blue-300 transition-colors" />
                    <span className="text-slate-200 text-sm font-medium leading-tight group-hover/item:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-14">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white text-base px-8 py-6 rounded-xl font-semibold shadow-xl shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5">
                  <Link to="/about">
                    Learn More About Us
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block relative bg-slate-800 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay transition-transform duration-[2s] group-hover/feature:scale-105" style={{ backgroundImage: 'url("/assets/clinic.png")' }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
              
              <div className="absolute bottom-16 right-16 bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl max-w-sm hover:-translate-y-1 transition-transform duration-500">
                <div className="flex items-center space-x-5 mb-5">
                  <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-inner border border-blue-400">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-4xl font-extrabold text-white tracking-tight">99%</div>
                    <div className="text-sm text-slate-300 font-medium uppercase tracking-wider mt-1">Patient Satisfaction</div>
                  </div>
                </div>
                <p className="text-sm text-slate-400 font-light leading-relaxed">Based on verified patient reviews and outcomes over the last 12 months across all our specialized departments.</p>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Services;
