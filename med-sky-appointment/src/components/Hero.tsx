import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-slate-50 pt-2 pb-12 lg:pt-4 lg:pb-20 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Subtle dotted pattern overlay for texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-10">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full border border-blue-100 shadow-sm transition-transform hover:-translate-y-0.5 duration-300 cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-sm font-semibold tracking-wide">Accepting New Patients</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-[4rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Exceptional care, <br/>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">when you need it most.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg font-light tracking-wide">
                Connect with leading medical specialists, schedule appointments seamlessly, and manage your health journey in one intuitive platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" asChild className="group bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-7 rounded-2xl font-medium transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5">
                <Link to="/book-appointment" className="flex items-center">
                  Book an Appointment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-7 rounded-2xl border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-slate-300 font-medium transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
                <Link to="/doctors">
                  Find a Doctor
                </Link>
              </Button>
            </div>

            {/* Features list */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 pt-8 border-t border-slate-200/60">
              <div className="flex items-center space-x-4 group cursor-default">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 group-hover:bg-emerald-100 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 font-semibold">Verified</span>
                  <span className="text-slate-500 text-sm font-medium">Specialists</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 group cursor-default">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 font-semibold">Same-day</span>
                  <span className="text-slate-500 text-sm font-medium">Booking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className="relative lg:h-[650px] flex items-center justify-center mt-12 lg:mt-0">
            {/* Soft decorative background shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-blue-100/40 to-indigo-50/40 rounded-full blur-3xl -z-10 transition-all duration-1000 animate-pulse-soft"></div>
            
            <div className="relative w-full max-w-md lg:max-w-xl mx-auto group">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-300/60 border-8 border-white bg-white transition-transform duration-700 group-hover:scale-[1.02]">
                <img 
                  src="/assets/clinic.png" 
                  alt="Modern medical facility" 
                  className="w-full h-[450px] lg:h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Floating card for depth */}
              <div className="absolute -bottom-8 -left-6 md:-left-12 bg-white/90 backdrop-blur-xl p-5 md:p-6 rounded-2xl shadow-2xl shadow-slate-200/80 border border-white flex items-center space-x-5 animate-float hover:scale-105 transition-transform duration-300 cursor-default">
                <div className="bg-orange-50 p-3.5 rounded-2xl border border-orange-100 shadow-inner">
                  <MapPin className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider mb-0.5">Locations</p>
                  <p className="text-base md:text-lg font-bold text-slate-900">Find a clinic near you</p>
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
