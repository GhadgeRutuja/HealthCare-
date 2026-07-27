import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell,
  Calendar,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  Phone,
  Video,
  Mail,
  Trash2,
  MoreVertical,
  Filter,
  Search,
  Loader2,
  X,
  Eye,
  Archive,
  Pin,
  Volume2,
  VolumeX
} from 'lucide-react';
import { User as UserType } from '@/services/api';

interface NotificationCenterProps {
  user: UserType;
}

interface Notification {
  id: string;
  type: 'appointment' | 'patient' | 'review' | 'system' | 'emergency';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isPinned: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  relatedEntity?: {
    id: string;
    type: 'patient' | 'appointment' | 'prescription';
    name: string;
  };
  metadata?: {
    patientName?: string;
    appointmentTime?: string;
    rating?: number;
    prescriptionId?: string;
  };
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock notifications for demonstration
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'appointment',
        title: 'New Appointment Request',
        message: 'Sarah Johnson has requested an appointment for tomorrow at 2:00 PM',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        isPinned: false,
        priority: 'medium',
        relatedEntity: {
          id: 'pat_001',
          type: 'patient',
          name: 'Sarah Johnson'
        },
        metadata: {
          patientName: 'Sarah Johnson',
          appointmentTime: '2:00 PM'
        }
      },
      {
        id: '2',
        type: 'review',
        title: 'New Patient Review',
        message: 'Michael Brown left a 5-star review: "Excellent care and very professional!"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        isPinned: true,
        priority: 'low',
        metadata: {
          patientName: 'Michael Brown',
          rating: 5
        }
      },
      {
        id: '3',
        type: 'emergency',
        title: 'Emergency Consultation',
        message: 'Emergency consultation request from Emma Davis - requires immediate attention',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        isRead: false,
        isPinned: false,
        priority: 'urgent',
        relatedEntity: {
          id: 'pat_002',
          type: 'patient',
          name: 'Emma Davis'
        },
        metadata: {
          patientName: 'Emma Davis'
        }
      },
      {
        id: '4',
        type: 'appointment',
        title: 'Appointment Cancelled',
        message: 'John Smith cancelled his appointment scheduled for today at 3:30 PM',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        isRead: true,
        isPinned: false,
        priority: 'medium',
        metadata: {
          patientName: 'John Smith',
          appointmentTime: '3:30 PM'
        }
      },
      {
        id: '5',
        type: 'system',
        title: 'System Update',
        message: 'Your profile has been successfully updated with new qualifications',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true,
        isPinned: false,
        priority: 'low'
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pinnedCount = notifications.filter(n => n.isPinned).length;

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'urgent' ? 'h-5 w-5 text-red-600' : 
                     priority === 'high' ? 'h-5 w-5 text-orange-600' :
                     'h-5 w-5 text-blue-600';

    switch (type) {
      case 'appointment':
        return <Calendar className={iconClass} />;
      case 'patient':
        return <Users className={iconClass} />;
      case 'review':
        return <Star className={iconClass} />;
      case 'emergency':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'system':
        return <FileText className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'high':
        return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-4 border-blue-500 bg-blue-50';
      default:
        return 'border-l-4 border-gray-300 bg-white';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const togglePin = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications
    .filter(n => {
      if (filter === 'unread' && n.isRead) return false;
      if (filter === 'pinned' && !n.isPinned) return false;
      if (typeFilter !== 'all' && n.type !== typeFilter) return false;
      if (searchTerm && !n.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !n.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by pinned first, then by timestamp
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bell className="h-6 w-6 mr-2 text-sky-600" />
            Notification Center
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h2>
          <p className="text-gray-600">Stay updated with your practice activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button 
                variant={filter === 'unread' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              <Button 
                variant={filter === 'pinned' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('pinned')}
              >
                Pinned ({pinnedCount})
              </Button>
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Types</option>
              <option value="appointment">Appointments</option>
              <option value="patient">Patients</option>
              <option value="review">Reviews</option>
              <option value="emergency">Emergency</option>
              <option value="system">System</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Notifications</span>
            <Badge variant="secondary">
              {filteredNotifications.length} {filteredNotifications.length === 1 ? 'notification' : 'notifications'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <ScrollArea className="h-[600px]">
              <div className="space-y-1">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    } ${getPriorityColor(notification.priority)}`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h4>
                              {notification.isPinned && (
                                <Pin className="h-3 w-3 text-orange-500" />
                              )}
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            
                            {/* Metadata */}
                            {notification.metadata && (
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                {notification.metadata.patientName && (
                                  <span className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {notification.metadata.patientName}
                                  </span>
                                )}
                                {notification.metadata.appointmentTime && (
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {notification.metadata.appointmentTime}
                                  </span>
                                )}
                                {notification.metadata.rating && (
                                  <span className="flex items-center">
                                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                    {notification.metadata.rating}/5
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePin(notification.id);
                                }}
                              >
                                <Pin className={`h-3 w-3 ${notification.isPinned ? 'text-orange-500' : 'text-gray-400'}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {notification.type === 'appointment' && (
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline">
                              <Calendar className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                          </div>
                        )}
                        
                        {notification.type === 'emergency' && (
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              <Phone className="h-3 w-3 mr-1" />
                              Call Now
                            </Button>
                            <Button size="sm" variant="outline">
                              <Video className="h-3 w-3 mr-1" />
                              Video Call
                            </Button>
                          </div>
                        )}

                        {notification.type === 'review' && (
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View Review
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Respond
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {filter === 'unread' ? 'All caught up! No unread notifications.' :
                 filter === 'pinned' ? 'No pinned notifications.' :
                 searchTerm ? 'No notifications match your search.' :
                 'You have no notifications at this time.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{notifications.filter(n => n.type === 'appointment').length}</div>
            <div className="text-sm text-gray-600">Appointments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{notifications.filter(n => n.type === 'review').length}</div>
            <div className="text-sm text-gray-600">Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{notifications.filter(n => n.priority === 'urgent').length}</div>
            <div className="text-sm text-gray-600">Urgent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{pinnedCount}</div>
            <div className="text-sm text-gray-600">Pinned</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationCenter;
