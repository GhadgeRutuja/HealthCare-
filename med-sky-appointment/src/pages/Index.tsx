import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, MapPin, Mail, Linkedin, Twitter, Facebook, Heart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <Services />
      
      {/* Clean Professional Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
            
            {/* Brand */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2.5 rounded-xl">
                  <Heart className="h-6 w-6 text-white fill-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">HealthCare+</h3>
                  <p className="text-blue-400 font-medium text-xs tracking-wider uppercase mt-0.5">Medical Center</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed text-base font-light">
                Providing exceptional, patient-centered care. Our team of specialists is dedicated to supporting your health and well-being at every stage of life.
              </p>
              <div className="flex items-center space-x-4 pt-2">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Facebook className="h-4 w-4 text-slate-300" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="h-4 w-4 text-slate-300" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="h-4 w-4 text-slate-300" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 lg:col-start-6">
              <h4 className="font-semibold text-white text-lg mb-6">Navigation</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About Us</Link></li>
                <li><Link to="/services" className="text-slate-400 hover:text-white transition-colors text-sm">Our Services</Link></li>
                <li><Link to="/doctors" className="text-slate-400 hover:text-white transition-colors text-sm">Find a Doctor</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="lg:col-span-3">
              <h4 className="font-semibold text-white text-lg mb-6">Departments</h4>
              <ul className="space-y-3">
                <li><Link to="/services" className="text-slate-400 hover:text-white transition-colors text-sm">Cardiology Center</Link></li>
                <li><Link to="/services" className="text-slate-400 hover:text-white transition-colors text-sm">Neurology Institute</Link></li>
                <li><Link to="/services" className="text-slate-400 hover:text-white transition-colors text-sm">Pediatric Care</Link></li>
                <li><Link to="/services" className="text-slate-400 hover:text-white transition-colors text-sm">Orthopedic Surgery</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-3">
              <h4 className="font-semibold text-white text-lg mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-slate-400 text-sm">123 Medical Center Drive<br/>Health City, HC 12345</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                  <a href="tel:+15551234567" className="text-slate-400 hover:text-white transition-colors text-sm">+1 (555) 123-4567</a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                  <a href="mailto:contact@healthcareplus.com" className="text-slate-400 hover:text-white transition-colors text-sm">contact@healthcareplus.com</a>
                </li>
              </ul>
            </div>

          </div>
          
          {/* Divider */}
          <div className="border-t border-slate-800 w-full mb-8"></div>
          
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} HealthCare+ Medical Center. All rights reserved.</p>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Patient Rights</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
