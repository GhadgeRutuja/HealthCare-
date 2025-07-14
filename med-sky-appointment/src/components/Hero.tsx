
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-sky-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Health,
                <span className="text-sky-600 block">Our Priority</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Book appointments with top-rated doctors instantly. Experience healthcare 
                that puts you first with easy scheduling and quality care.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="gradient-sky text-white hover:opacity-90 text-lg px-8">
                <Link to="/book-appointment" className="flex items-center">
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 border-sky-300 text-sky-700 hover:bg-sky-50">
                <Link to="/doctors">
                  Find Doctors
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600">500+</div>
                <div className="text-gray-600">Expert Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600">50k+</div>
                <div className="text-gray-600">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative">
            <div className="grid gap-6">
              {/* Quick Booking Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-float">
                <div className="flex items-start space-x-4">
                  <div className="gradient-sky p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quick Booking</h3>
                    <p className="text-gray-600 text-sm">Schedule appointments in under 2 minutes with our streamlined process.</p>
                  </div>
                </div>
              </div>

              {/* Instant Confirmation Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-start space-x-4">
                  <div className="gradient-sky p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Instant Confirmation</h3>
                    <p className="text-gray-600 text-sm">Get immediate booking confirmation with automated reminders.</p>
                  </div>
                </div>
              </div>

              {/* Multiple Locations Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-start space-x-4">
                  <div className="gradient-sky p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Multiple Locations</h3>
                    <p className="text-gray-600 text-sm">Find healthcare providers near you across multiple locations.</p>
                  </div>
                </div>
              </div>

              {/* Rating Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-start space-x-4">
                  <div className="gradient-sky p-3 rounded-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Verified Reviews</h3>
                    <p className="text-gray-600 text-sm">Read authentic patient reviews and ratings for informed decisions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-sky-200 rounded-full opacity-20 animate-pulse-soft"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-sky-300 rounded-full opacity-20 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};

export default Hero;
