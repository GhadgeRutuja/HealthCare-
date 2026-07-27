
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, MapPin, Mail, Linkedin, Twitter, Facebook, Heart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Services />
      
      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-20">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
              {/* Brand */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="gradient-sky p-2.5 rounded-lg">
                    <Heart className="h-5 w-5 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">HealthCare+</h3>
                    <p className="text-xs text-slate-400">Premium Medical Care</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Your trusted partner in healthcare, providing quality medical services with compassion and expertise.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <a href="#" className="p-2 bg-slate-700 hover:bg-sky-600 rounded-lg transition-colors duration-300">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-2 bg-slate-700 hover:bg-sky-600 rounded-lg transition-colors duration-300">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="p-2 bg-slate-700 hover:bg-sky-600 rounded-lg transition-colors duration-300">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-lg mb-6 text-white">Quick Links</h4>
                <ul className="space-y-3">
                  <li><Link to="/about" className="text-slate-300 hover:text-sky-400 transition-colors font-medium">About Us</Link></li>
                  <li><Link to="/services" className="text-slate-300 hover:text-sky-400 transition-colors font-medium">Services</Link></li>
                  <li><Link to="/doctors" className="text-slate-300 hover:text-sky-400 transition-colors font-medium">Find Doctors</Link></li>
                  <li><Link to="/contact" className="text-slate-300 hover:text-sky-400 transition-colors font-medium">Contact</Link></li>
                </ul>
              </div>
              
              {/* Services */}
              <div>
                <h4 className="font-semibold text-lg mb-6 text-white">Services</h4>
                <ul className="space-y-3">
                  <li><Link to="/services" className="text-slate-300 hover:text-sky-400 transition-colors font-medium">Cardiology</Link></li>
                  <li><Link to="/services" className="text-slate-300 hover:text-sky-400 transition-colors font-medium">Neurology</Link></li>
                  <li><Link to="/services" className="text-slate-300 hover:text-sky-400 transition-colors font-medium">Pediatrics</Link></li>
                  <li><Link to="/services" className="text-slate-300 hover:text-sky-400 transition-colors font-medium">Orthopedics</Link></li>
                </ul>
              </div>
              
              {/* Contact Info */}
              <div>
                <h4 className="font-semibold text-lg mb-6 text-white">Contact Info</h4>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">123 Medical Center Dr, Health City, HC 12345</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-sky-400 flex-shrink-0" />
                    <a href="tel:+15551234567" className="text-slate-300 hover:text-sky-400 transition-colors font-medium">+1 (555) 123-4567</a>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-sky-400 flex-shrink-0" />
                    <a href="mailto:info@healthcareplus.com" className="text-slate-300 hover:text-sky-400 transition-colors font-medium">info@healthcareplus.com</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-slate-700"></div>
          
          {/* Bottom Footer */}
          <div className="py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">&copy; 2024 HealthCare+. All rights reserved. | Crafted with care</p>
            <div className="flex items-center space-x-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-sky-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-sky-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-sky-400 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
