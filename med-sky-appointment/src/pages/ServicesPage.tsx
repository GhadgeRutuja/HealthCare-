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
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ServicesPage = () => {
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Comprehensive heart care with advanced diagnostic and treatment options.',
      color: 'bg-red-100 text-red-600',
      features: [
        'Electrocardiogram (ECG)',
        'Echocardiography',
        'Cardiac Catheterization',
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
      color: 'bg-purple-100 text-purple-600',
      features: [
        'Brain MRI & CT Scans',
        'Stroke Treatment',
        'Epilepsy Management',
        'Neurological Surgery',
        'Cognitive Assessment'
      ],
      specialists: '6 Neurologists',
      availability: 'Mon-Sun 8AM-8PM'
    },
    {
      icon: Eye,
      title: 'Ophthalmology',
      description: 'Complete eye care services from routine checkups to complex surgeries.',
      color: 'bg-blue-100 text-blue-600',
      features: [
        'Comprehensive Eye Exams',
        'Cataract Surgery',
        'Retinal Procedures',
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
      color: 'bg-green-100 text-green-600',
      features: [
        'Joint Replacement',
        'Sports Medicine',
        'Fracture Treatment',
        'Spine Surgery',
        'Physical Therapy'
      ],
      specialists: '10 Orthopedic Surgeons',
      availability: 'Mon-Sat 8AM-7PM'
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      description: 'Specialized healthcare for infants, children, and adolescents.',
      color: 'bg-pink-100 text-pink-600',
      features: [
        'Well-Child Visits',
        'Vaccinations',
        'Developmental Screening',
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
      color: 'bg-sky-100 text-sky-600',
      features: [
        'Routine Check-ups',
        'Chronic Disease Management',
        'Health Screenings',
        'Preventive Care',
        'Family Medicine'
      ],
      specialists: '15 General Practitioners',
      availability: 'Mon-Sun 7AM-9PM'
    },
    {
      icon: Microscope,
      title: 'Laboratory Services',
      description: 'Advanced diagnostic testing and pathology services.',
      color: 'bg-amber-100 text-amber-600',
      features: [
        'Blood Tests',
        'Urine Analysis',
        'Microbiology',
        'Molecular Diagnostics',
        'Pathology Services'
      ],
      specialists: '8 Lab Technicians',
      availability: '24/7 Lab Services'
    },
    {
      icon: Scan,
      title: 'Radiology',
      description: 'State-of-the-art imaging services for accurate diagnosis.',
      color: 'bg-indigo-100 text-indigo-600',
      features: [
        'X-Ray Imaging',
        'MRI Scans',
        'CT Scans',
        'Ultrasound',
        'Mammography'
      ],
      specialists: '6 Radiologists',
      availability: 'Mon-Sun 6AM-10PM'
    },
    {
      icon: Pill,
      title: 'Pharmacy',
      description: 'Full-service pharmacy with prescription and over-the-counter medications.',
      color: 'bg-emerald-100 text-emerald-600',
      features: [
        'Prescription Filling',
        'Medication Counseling',
        'Drug Interactions Check',
        'Home Delivery',
        'Specialty Medications'
      ],
      specialists: '4 Licensed Pharmacists',
      availability: 'Mon-Sun 8AM-8PM'
    }
  ];

  const qualityFeatures = [
    {
      icon: Award,
      title: 'Accredited Excellence',
      description: 'Joint Commission accredited facility with highest safety standards'
    },
    {
      icon: Users,
      title: 'Expert Medical Team',
      description: 'Board-certified specialists with decades of combined experience'
    },
    {
      icon: Clock,
      title: '24/7 Emergency Care',
      description: 'Round-the-clock medical assistance for urgent health needs'
    },
    {
      icon: Shield,
      title: 'Advanced Technology',
      description: 'State-of-the-art medical equipment and digital health records'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sky-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Comprehensive Medical Services
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Discover our full range of medical specialties and services, delivered by 
              experienced professionals with cutting-edge technology and compassionate care.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-sky-600 hover:bg-gray-100">
              Schedule Appointment
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Medical Specialties
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each department is equipped with modern facilities and staffed by specialists 
              dedicated to providing exceptional patient care.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Services Include:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {service.specialists}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {service.availability}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <Button asChild className="bg-sky-600 hover:bg-sky-700 flex-1">
                      <Link to={`/book-appointment?specialty=${encodeURIComponent(service.title)}`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link to="/doctors">
                        Find Doctors
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose HealthCare+?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional healthcare experiences with 
              the highest standards of medical excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Schedule your appointment today and experience the difference of personalized, 
            professional healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-sky-600 hover:bg-gray-100">
              <Activity className="h-5 w-5 mr-2" />
              Book Appointment
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sky-600">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 gradient-sky-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Experience World-Class Healthcare?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't wait to prioritize your health. Schedule an appointment with our expert specialists 
            and take the first step towards better health today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700">
              <Link to="/book-appointment">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white">
              <Link to="/doctors">
                <ArrowRight className="mr-2 h-5 w-5" />
                Browse Our Specialists
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">HealthCare+</h3>
              <p className="text-gray-400">
                Your trusted partner in healthcare, providing quality medical services with compassion and expertise.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Doctors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="tel:911" className="hover:text-white transition-colors">Emergency: 911</a></li>
                <li><a href="tel:+15551234567" className="hover:text-white transition-colors">Main: +1 (555) 123-4567</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Online Consultation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>123 Medical Center Dr</p>
                <p>Health City, HC 12345</p>
                <p>Email: info@healthcareplus.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HealthCare+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;
