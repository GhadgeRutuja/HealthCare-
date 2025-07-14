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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="gradient-sky text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-sky-100 max-w-3xl mx-auto mb-8">
              We're here to help! Reach out to us with any questions, concerns, or to schedule an appointment. 
              Our team is available 24/7 for your healthcare needs.
            </p>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-sky-600">
              <Calendar className="mr-2 h-5 w-5" />
              Emergency? Call (555) 911-2468
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${info.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <info.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  {info.details.map((detail, idx) => (
                    <div key={idx}>
                      <div className="text-sm text-gray-500">{detail.label}</div>
                      <div className="font-semibold text-gray-900">{detail.value}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form & Map Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center mr-4">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                </div>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thank you for contacting us. We'll respond to your message within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Please provide details about your inquiry..."
                      className="resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-sky-600 hover:bg-sky-700">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              )}
            </Card>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-4">
                      <HeadphonesIcon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Need Immediate Help?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <Button size="lg" className="w-full bg-red-600 hover:bg-red-700">
                    <Phone className="mr-2 h-5 w-5" />
                    Emergency: (555) 911-2468
                  </Button>
                  <Button size="lg" variant="outline" className="w-full">
                    <Phone className="mr-2 h-5 w-5" />
                    General: (555) 123-4567
                  </Button>
                  <Button size="lg" variant="outline" className="w-full">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">Patient Resources</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      Patient Privacy & Rights
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      Insurance & Billing Information
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      Medical Records Request
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      Patient Portal Access
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Locations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Multiple convenient locations to serve you better. Find the nearest center to you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center mb-2">
                    <Building className="h-5 w-5 text-sky-600 mr-2" />
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-600">{location.phone}</p>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600">{location.hours}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 font-medium mb-2">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {location.services.map((service, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-lg text-gray-600">Main Medical Center Location</p>
          </div>
          
          {/* Placeholder for map - you would integrate with Google Maps or similar */}
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Interactive Map</p>
              <p className="text-sm text-gray-400">123 Healthcare Blvd, Medical City, MC 12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
