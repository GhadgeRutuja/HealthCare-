import React, { useState, useEffect } from 'react';
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
  User,
  Settings,
  LogOut,
  FileText,
  Shield,
  Bell
} from 'lucide-react';
import { notificationsApi } from '@/services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
      
      const handleNewNotification = (e: any) => {
        setNotifications(prev => [e.detail, ...prev]);
        setUnreadCount(prev => prev + 1);
      };
      
      window.addEventListener('new_notification', handleNewNotification);
      return () => window.removeEventListener('new_notification', handleNewNotification);
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.getAll();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n: any) => !n.read).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await notificationsApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

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
    <nav className="bg-white/95 backdrop-blur-premium border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="gradient-sky p-2.5 rounded-xl shadow-lg group-hover:shadow-premium transition-all duration-300">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900">HealthCare+</span>
              <span className="text-xs text-sky-600 font-semibold">Premium Care</span>
            </div>
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
                {/* Notifications Bell */}
                <DropdownMenu onOpenChange={(open) => { if (open) markAllRead(); }}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full">
                      <Bell className="h-5 w-5 text-gray-700 hover:text-sky-600" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
                    <DropdownMenuLabel className="font-semibold flex justify-between items-center">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">{unreadCount} New</Badge>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">No notifications yet.</div>
                    ) : (
                      notifications.slice(0, 10).map((notif: any) => (
                        <div key={notif._id} className={`p-3 border-b last:border-0 ${!notif.read ? 'bg-sky-50' : 'bg-white'}`}>
                          <p className="text-xs font-semibold text-sky-800 mb-1">{notif.title}</p>
                          <p className="text-xs text-gray-600">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-sky-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/doctors"
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Doctors
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Authentication */}
              <div className="border-t pt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImage || '/placeholder.svg'} />
                          <AvatarFallback>
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                          <Badge className={getRoleColor(user.role)} variant="secondary">
                            <div className="flex items-center space-x-1">
                              {getRoleIcon(user.role)}
                              <span className="capitalize">{user.role}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-sky-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {user.role === 'patient' && (
                      <>
                        <Link
                          to="/book-appointment"
                          className="block px-3 py-2 text-gray-700 hover:text-sky-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Book Appointment
                        </Link>
                        <Link
                          to="/medical-records"
                          className="block px-3 py-2 text-gray-700 hover:text-sky-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Medical Records
                        </Link>
                      </>
                    )}
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-gray-700 hover:text-sky-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-gray-700 hover:text-sky-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors mx-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
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
