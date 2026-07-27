
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Star, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-purple-50/30">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-sky-300 to-indigo-300 rounded-full opacity-[0.15] blur-[100px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200 to-cyan-300 rounded-full opacity-[0.15] blur-[100px]"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 rounded-full opacity-[0.15] blur-[100px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-sky-100/60 backdrop-blur-sm border border-sky-200 px-4 py-2 rounded-full w-fit">
              <Zap className="h-4 w-4 text-sky-600" />
              <span className="text-sm font-semibold text-sky-700">Trusted by 50,000+ Patients</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                Your Health,
                <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent block">Our Priority</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                Book appointments with world-class doctors instantly. Experience healthcare 
                that puts you first with easy scheduling, quality care, and 24/7 support.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild className="gradient-sky text-white hover:shadow-lg hover:shadow-sky-400/50 text-lg px-8 py-6 rounded-xl font-semibold">
                <Link to="/book-appointment" className="flex items-center">
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold">
                <Link to="/doctors">
                  Find Doctors
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1">
                  <div className="text-4xl font-bold bg-gradient-to-br from-sky-600 to-blue-600 bg-clip-text text-transparent">500+</div>
                </div>
                <div className="text-sm text-slate-600 font-medium">Expert Doctors</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1">
                  <div className="text-4xl font-bold bg-gradient-to-br from-sky-600 to-blue-600 bg-clip-text text-transparent">50k+</div>
                </div>
                <div className="text-sm text-slate-600 font-medium">Happy Patients</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1">
                  <div className="text-4xl font-bold bg-gradient-to-br from-sky-600 to-blue-600 bg-clip-text text-transparent">24/7</div>
                </div>
                <div className="text-sm text-slate-600 font-medium">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative">
            <div className="grid gap-6">
              {/* Quick Booking Card */}
              <div className="card-premium shadow-premium-hover group">
                <div className="flex items-start space-x-4">
                  <div className="gradient-sky p-3.5 rounded-xl shadow-lg group-hover:shadow-lg transition-all duration-300">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1.5 text-lg">Quick Booking</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Schedule appointments in under 2 minutes with our streamlined process.</p>
                  </div>
                </div>
              </div>

              {/* Instant Confirmation Card */}
              <div className="card-premium shadow-premium-hover group" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start space-x-4">
                  <div className="gradient-sky p-3.5 rounded-xl shadow-lg group-hover:shadow-lg transition-all duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1.5 text-lg">Instant Confirmation</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Get immediate booking confirmation with automated reminders.</p>
                  </div>
                </div>
              </div>

              {/* Multiple Locations Card */}
              <div className="card-premium shadow-premium-hover group" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start space-x-4">
                  <div className="gradient-sky p-3.5 rounded-xl shadow-lg group-hover:shadow-lg transition-all duration-300">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1.5 text-lg">Multiple Locations</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Find healthcare providers near you across multiple locations.</p>
                  </div>
                </div>
              </div>

              {/* Verified Rating Card */}
              <div className="card-premium shadow-premium-hover group" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start space-x-4">
                  <div className="gradient-sky p-3.5 rounded-xl shadow-lg group-hover:shadow-lg transition-all duration-300">
                    <Star className="h-6 w-6 text-white fill-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1.5 text-lg">Highly Rated</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">4.9/5 rating from thousands of verified patients.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
