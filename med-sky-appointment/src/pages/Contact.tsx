import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar,
  Send,
  MessageSquare,
  HeadphonesIcon,
  Navigation,
  Building,
  Users,
  Shield,
  CheckCircle
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    department: 'general'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: [
        { label: 'Main Line', value: '(555) 123-4567' },
        { label: 'Emergency', value: '(555) 911-2468' },
        { label: 'Appointments', value: '(555) 123-BOOK' }
      ],
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [
        { label: 'General Inquiries', value: 'info@medicare.com' },
        { label: 'Appointments', value: 'appointments@medicare.com' },
        { label: 'Support', value: 'support@medicare.com' }
      ],
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: [
        { label: 'Main Campus', value: '123 Healthcare Blvd' },
        { label: 'City, State', value: 'Medical City, MC 12345' },
        { label: 'Parking', value: 'Free valet parking available' }
      ],
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: [
        { label: 'Mon - Fri', value: '6:00 AM - 10:00 PM' },
        { label: 'Saturday', value: '8:00 AM - 8:00 PM' },
        { label: 'Sunday', value: '8:00 AM - 6:00 PM' }
      ],
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const departments = [
    { value: 'general', label: 'General Inquiries' },
    { value: 'appointments', label: 'Appointments' },
    { value: 'billing', label: 'Billing & Insurance' },
    { value: 'emergency', label: 'Emergency Services' },
    { value: 'patient-care', label: 'Patient Care' },
    { value: 'feedback', label: 'Feedback & Complaints' }
  ];

  const locations = [
    {
      name: 'Main Medical Center',
      address: '123 Healthcare Blvd, Medical City, MC 12345',
      phone: '(555) 123-4567',
      hours: 'Mon-Sun: 24/7 Emergency Care',
      services: ['Emergency Care', 'Surgery', 'ICU', 'All Specialties']
    },
    {
      name: 'Downtown Clinic',
      address: '456 Central Ave, Downtown, MC 12346',
      phone: '(555) 234-5678',
      hours: 'Mon-Fri: 7AM-9PM, Sat-Sun: 9AM-5PM',
      services: ['General Medicine', 'Pediatrics', 'Urgent Care']
    },
    {
      name: 'Westside Family Center',
      address: '789 West Park Dr, Westside, MC 12347',
      phone: '(555) 345-6789',
      hours: 'Mon-Fri: 8AM-8PM, Sat: 9AM-3PM',
      services: ['Family Medicine', 'Women\'s Health', 'Preventive Care']
    },
    {
      name: 'North Campus Specialty Center',
      address: '321 North Medical Way, Northville, MC 12348',
      phone: '(555) 456-7890',
      hours: 'Mon-Fri: 7AM-7PM',
      services: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology']
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        department: 'general'
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="gradient-sky text-white py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">
              Get in Touch
            </h1>
            <p className="text-xl text-sky-100 max-w-3xl mx-auto leading-relaxed">
              We're here to help! Reach out to us with any questions, concerns, or to schedule an appointment. 
              Our team is available 24/7 for your healthcare needs.
            </p>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-sky-600 text-lg px-8 py-6 rounded-xl font-semibold">
              <Phone className="mr-2 h-5 w-5" />
              Emergency? Call (555) 911-2468
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Contact Information</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Multiple ways to reach us</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="card-premium shadow-premium-hover group border-slate-200">
                <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <info.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{info.title}</h3>
                <div className="space-y-4">
                  {info.details.map((detail, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-sm text-slate-500 font-medium">{detail.label}</div>
                      <div className="font-semibold text-slate-900">{detail.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form & Quick Actions Section */}
      <div className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card-premium shadow-premium border-slate-200 p-8 md:p-10">
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="gradient-sky p-3 rounded-xl mr-4 shadow-lg">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
                    <p className="text-slate-600 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {isSubmitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">Message Sent!</h3>
                  <p className="text-slate-600 text-lg">
                    Thank you for contacting us. We'll respond to your message within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className="border-slate-200 focus:ring-sky-500 focus:border-sky-500 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email"
                        className="border-slate-200 focus:ring-sky-500 focus:border-sky-500 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="border-slate-200 focus:ring-sky-500 focus:border-sky-500 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">
                        Department
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white text-slate-900 font-medium"
                      >
                        {departments.map((dept) => (
                          <option key={dept.value} value={dept.value}>
                            {dept.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Brief description of your inquiry"
                      className="border-slate-200 focus:ring-sky-500 focus:border-sky-500 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Please provide details about your inquiry..."
                      className="resize-none border-slate-200 focus:ring-sky-500 focus:border-sky-500 rounded-lg"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full gradient-sky text-white hover:shadow-lg hover:shadow-sky-400/50 text-lg py-6 rounded-lg font-semibold">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="card-premium shadow-premium border-slate-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="gradient-sky p-3 rounded-xl mr-4 shadow-lg">
                    <HeadphonesIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Need Immediate Help?</h3>
                </div>
                <div className="space-y-3">
                  <Button size="lg" className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/50 text-lg py-6 rounded-lg font-semibold">
                    <Phone className="mr-2 h-5 w-5" />
                    Emergency: (555) 911-2468
                  </Button>
                  <Button size="lg" variant="outline" className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-lg py-6 rounded-lg font-semibold">
                    <Phone className="mr-2 h-5 w-5" />
                    General: (555) 123-4567
                  </Button>
                  <Button size="lg" variant="outline" className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-lg py-6 rounded-lg font-semibold">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                </div>
              </div>

              <div className="card-premium shadow-premium border-slate-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="gradient-sky p-3 rounded-xl mr-4 shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Patient Resources</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center text-slate-700 hover:text-sky-600 transition-colors cursor-pointer font-medium">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                    Patient Privacy & Rights
                  </div>
                  <div className="flex items-center text-slate-700 hover:text-sky-600 transition-colors cursor-pointer font-medium">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                    Insurance & Billing Information
                  </div>
                  <div className="flex items-center text-slate-700 hover:text-sky-600 transition-colors cursor-pointer font-medium">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                    Medical Records Request
                  </div>
                  <div className="flex items-center text-slate-700 hover:text-sky-600 transition-colors cursor-pointer font-medium">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                    Patient Portal Access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Locations</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Multiple convenient locations to serve you better. Find the nearest center to you.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {locations.map((location, index) => (
              <div key={index} className="card-premium shadow-premium-hover group border-slate-200">
                <div className="flex items-center mb-6">
                  <div className="gradient-sky p-2.5 rounded-lg mr-3 shadow-md">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{location.name}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600 leading-relaxed">{location.address}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-sky-600 flex-shrink-0" />
                    <p className="text-sm text-slate-600 font-medium">{location.phone}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600">{location.hours}</p>
                  </div>
                  <div className="pt-4 space-y-3">
                    <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {location.services.map((service, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 px-3 py-1.5 rounded-full font-semibold"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-6 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-sky-300 font-semibold rounded-lg">
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Find Us</h2>
            <p className="text-lg text-slate-600">Main Medical Center Location</p>
          </div>
          
          {/* Placeholder for map - you would integrate with Google Maps or similar */}
          <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl h-96 flex items-center justify-center shadow-premium border border-slate-200">
            <div className="text-center space-y-4">
              <MapPin className="h-20 w-20 text-slate-400 mx-auto" />
              <p className="text-slate-600 font-semibold text-lg">Interactive Map</p>
              <p className="text-slate-500">123 Healthcare Blvd, Medical City, MC 12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
