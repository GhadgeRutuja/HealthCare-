
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Medical Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare services delivered by experienced professionals 
            using state-of-the-art technology and personalized care approaches.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700">
              <Link to="/services">
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
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-sky-200"
            >
              <div className={`w-16 h-16 ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="sm" className="bg-sky-600 hover:bg-sky-700 flex-1">
                  <Link to={`/book-appointment?specialty=${encodeURIComponent(service.title)}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link to="/doctors">
                    Find Doctors
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="gradient-sky-light rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose HealthCare+?
            </h3>
            <p className="text-lg text-gray-600">
              We're committed to providing exceptional healthcare experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="gradient-sky w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Schedule Your Appointment?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't wait to take care of your health. Book an appointment with our specialists 
            or explore our services to find the right care for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700">
              <Link to="/book-appointment">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/doctors">
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
