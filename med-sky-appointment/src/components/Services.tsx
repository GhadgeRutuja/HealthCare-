
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
  Clock,
  Shield,
  ArrowRight,
  Calendar
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Comprehensive heart care with advanced diagnostic and treatment options.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Brain,
      title: 'Neurology',
      description: 'Expert neurological care for brain and nervous system disorders.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Eye,
      title: 'Ophthalmology',
      description: 'Complete eye care services from routine checkups to complex surgeries.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Bone,
      title: 'Orthopedics',
      description: 'Advanced treatment for bone, joint, and musculoskeletal conditions.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents.',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      description: 'Primary healthcare services for overall wellness and prevention.',
      color: 'bg-sky-100 text-sky-600'
    }
  ];

  const features = [
    {
      icon: Users,
      title: 'Expert Doctors',
      description: 'Board-certified specialists with years of experience'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock medical assistance when you need it'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Highest standards of medical care and safety protocols'
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900">
            Our Medical Services
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive healthcare services delivered by experienced professionals 
            using state-of-the-art technology and personalized care approaches.
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="gradient-sky text-white hover:shadow-lg hover:shadow-sky-400/50 text-lg px-8 py-6 rounded-xl font-semibold">
              <Link to="/services" className="flex items-center">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div 
              key={index}
              className="card-premium shadow-premium-hover border-slate-200"
            >
              <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="sm" className="gradient-sky text-white hover:shadow-lg flex-1 rounded-lg font-semibold">
                  <Link to={`/book-appointment?specialty=${encodeURIComponent(service.title)}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-semibold">
                  <Link to="/doctors">
                    Find Doctors
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl p-12 md:p-16 border border-sky-100 mt-20">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900">
              Why Choose HealthCare+?
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We're committed to providing exceptional healthcare experiences with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-6">
                <div className="gradient-sky w-16 h-16 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 bg-white rounded-3xl p-12 md:p-16 text-center border border-slate-200 shadow-premium">
          <div className="space-y-6">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900">
              Ready to Schedule Your Appointment?
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Don't wait to take care of your health. Book an appointment with our specialists 
              or explore our services to find the right care for you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild size="lg" className="gradient-sky text-white hover:shadow-lg hover:shadow-sky-400/50 text-lg px-8 py-6 rounded-xl font-semibold">
              <Link to="/book-appointment" className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold">
              <Link to="/doctors" className="flex items-center">
                <ArrowRight className="mr-2 h-5 w-5" />
                Find Specialists
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
