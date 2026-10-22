import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  CheckCircle,
  Building
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

  const departments = [
    { value: 'general', label: 'General Inquiries' },
    { value: 'appointments', label: 'Appointments' },
    { value: 'billing', label: 'Billing & Insurance' },
    { value: 'emergency', label: 'Emergency Services' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', department: 'general' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      {/* Split Layout Header & Form */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* Left Side - Imagery & Info (Fixed/Sticky on Desktop) */}
        <div className="lg:w-5/12 xl:w-1/2 relative bg-slate-900 min-h-[60vh] lg:min-h-0 flex flex-col">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-overlay"
            style={{ backgroundImage: 'url("/assets/clinic.png")' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
          
          <div className="relative z-10 p-8 md:p-16 lg:p-20 flex flex-col justify-end h-full">
            <div className="animate-slide-up">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8">
                <Building className="h-4 w-4 text-sky-400" />
                <span className="text-sm font-semibold text-white tracking-wide uppercase">Main Campus</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Get in <span className="text-sky-400">Touch</span>
              </h1>
              <p className="text-xl text-slate-300 font-light max-w-lg mb-12">
                We're here to help! Reach out to us with any questions, concerns, or to schedule an appointment.
              </p>
              
              <div className="space-y-8 border-t border-white/10 pt-10">
                <div className="flex items-start space-x-5">
                  <div className="bg-sky-500/20 p-3 rounded-xl border border-sky-500/30">
                    <Phone className="h-6 w-6 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">Call Us</h4>
                    <p className="text-slate-400 text-lg">Main: (555) 123-4567</p>
                    <p className="text-rose-400 font-semibold text-lg mt-1">Emergency: (555) 911-2468</p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="bg-sky-500/20 p-3 rounded-xl border border-sky-500/30">
                    <MapPin className="h-6 w-6 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">Visit Us</h4>
                    <p className="text-slate-400 text-lg leading-relaxed">123 Healthcare Blvd<br/>Medical City, MC 12345</p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="bg-sky-500/20 p-3 rounded-xl border border-sky-500/30">
                    <Clock className="h-6 w-6 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">Hours</h4>
                    <p className="text-slate-400 text-lg leading-relaxed">Mon-Fri: 6AM - 10PM<br/>Weekends: 8AM - 8PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-7/12 xl:w-1/2 p-8 md:p-16 lg:p-24 bg-slate-50 flex items-center justify-center relative overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/50 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="w-full max-w-2xl relative z-10 bg-white rounded-[2.5rem] shadow-premium-lg border border-slate-100 p-10 md:p-16">
            <div className="flex items-center mb-10">
              <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-4 rounded-2xl mr-5 shadow-lg">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Send a Message</h2>
                <p className="text-slate-500 font-light mt-1 text-lg">We'll respond within 24 hours</p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Message Sent!</h3>
                <p className="text-slate-500 text-lg font-light leading-relaxed max-w-sm mx-auto">
                  Thank you for reaching out. A member of our support staff will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl h-14 px-5 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                      className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl h-14 px-5 text-lg"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 000-0000"
                      className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl h-14 px-5 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full h-14 px-5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 focus:bg-white text-slate-700 text-lg font-medium appearance-none"
                    >
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>{dept.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Subject</label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="How can we help?"
                    className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl h-14 px-5 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Provide detailed information here..."
                    className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl p-5 text-lg resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 text-lg py-7 rounded-xl font-bold transition-all">
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
