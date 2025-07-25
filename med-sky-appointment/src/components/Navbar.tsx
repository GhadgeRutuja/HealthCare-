import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, 
  Menu, 
  X, 
  Calendar,
  Users,
  Shield,
  ChevronDown,
  User,
  Settings,
  LogOut,
  FileText
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return <Stethoscope className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'patient': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="gradient-sky p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-sky-900">HealthCare+</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-sky-600 transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-sky-600 transition-colors">
              Services
            </Link>
            <Link to="/doctors" className="text-gray-700 hover:text-sky-600 transition-colors">
              Find Doctors
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-sky-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-sky-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Authentication Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImage || '/placeholder.svg'} />
                        <AvatarFallback>
                          {user.firstName[0]}{user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium leading-none">
                            {user.firstName} {user.lastName}
                          </p>
                          <Badge className={getRoleColor(user.role)} variant="secondary">
                            <div className="flex items-center space-x-1">
                              {getRoleIcon(user.role)}
                              <span className="capitalize">{user.role}</span>
                            </div>
                          </Badge>
                        </div>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'patient' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/book-appointment" className="w-full cursor-pointer">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Book Appointment</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/medical-records" className="w-full cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Medical Records</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-sky-600 hover:bg-sky-700">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-sky-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-sky-100">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/services" 
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/doctors" 
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Doctors
              </Link>
              <Link 
                to="/about" 
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Authentication Section for Mobile */}
              <div className="pt-4 border-t border-sky-100 mt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    {/* User Info */}
                    <div className="px-3 py-2 bg-sky-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImage || '/placeholder.svg'} />
                          <AvatarFallback className="text-xs">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <Badge className={getRoleColor(user.role)} variant="secondary" size="sm">
                            <div className="flex items-center space-x-1">
                              {getRoleIcon(user.role)}
                              <span className="capitalize text-xs">{user.role}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* User Menu Items */}
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    
                    {user.role === 'patient' && (
                      <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                        <Link to="/book-appointment" onClick={() => setIsMenuOpen(false)}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Link>
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Login Section */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2 px-1">Login</p>
                      <div className="space-y-1">
                        <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                          <Link to="/login/patient" onClick={() => setIsMenuOpen(false)}>
                            <Users className="h-4 w-4 mr-2" />
                            Patient Login
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                          <Link to="/login/doctor" onClick={() => setIsMenuOpen(false)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Doctor Login
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                          <Link to="/login/admin" onClick={() => setIsMenuOpen(false)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Login
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Register Section */}
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2 px-1">New User? Register</p>
                      <div className="space-y-1">
                        <Button variant="outline" size="sm" asChild className="w-full justify-start">
                          <Link to="/signup/patient" onClick={() => setIsMenuOpen(false)}>
                            <Users className="h-4 w-4 mr-2" />
                            Register as Patient
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="w-full justify-start">
                          <Link to="/signup/doctor" onClick={() => setIsMenuOpen(false)}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Register as Doctor
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="pt-2">
                      <Button asChild className="w-full gradient-sky text-white">
                        <Link to="/book-appointment" onClick={() => setIsMenuOpen(false)}>
                          Book Appointment
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
