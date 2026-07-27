import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image,
  Mic,
  Smile,
  Clock,
  CheckCheck,
  Check,
  Users,
  Star,
  Archive,
  Pin,
  Trash2,
  Download,
  Eye,
  EyeOff,
  AlertCircle,
  FileText,
  Calendar,
  Pill,
  HeartPulse,
  Camera,
  Upload,
  X,
  Filter,
  Loader2
} from 'lucide-react';
import { User as UserType } from '@/services/api';

interface MessagingSystemProps {
  user: UserType;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'doctor' | 'patient';
  content: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file' | 'prescription' | 'appointment';
  attachments?: Attachment[];
  isEncrypted?: boolean;
  replyTo?: string;
}

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'prescription' | 'lab_result';
  url: string;
  size: number;
}

interface Conversation {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  priority: 'normal' | 'high' | 'urgent';
  messages: Message[];
  patientInfo: {
    age: number;
    condition: string;
    lastVisit: Date;
  };
}

const MessagingSystem: React.FC<MessagingSystemProps> = ({ user }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned' | 'archived'>('all');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock conversations data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: 'conv_1',
        patientId: 'pat_001',
        patientName: 'Sarah Johnson',
        patientAvatar: '',
        unreadCount: 2,
        isPinned: true,
        isArchived: false,
        priority: 'high',
        patientInfo: {
          age: 34,
          condition: 'Hypertension',
          lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        lastMessage: {
          id: 'msg_003',
          senderId: 'pat_001',
          senderName: 'Sarah Johnson',
          senderRole: 'patient',
          content: 'Thank you for the prescription. When should I schedule my follow-up?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false,
          messageType: 'text'
        },
        messages: [
          {
            id: 'msg_001',
            senderId: user._id,
            senderName: `Dr. ${user.lastName}`,
            senderRole: 'doctor',
            content: 'Hello Sarah, how are you feeling after starting the new medication?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: true,
            messageType: 'text'
          },
          {
            id: 'msg_002',
            senderId: 'pat_001',
            senderName: 'Sarah Johnson',
            senderRole: 'patient',
            content: 'Much better, Doctor. The dizziness has reduced significantly.',
            timestamp: new Date(Date.now() - 90 * 60 * 1000),
            isRead: true,
            messageType: 'text'
          },
          {
            id: 'msg_003',
            senderId: 'pat_001',
            senderName: 'Sarah Johnson',
            senderRole: 'patient',
            content: 'Thank you for the prescription. When should I schedule my follow-up?',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            isRead: false,
            messageType: 'text'
          }
        ]
      },
      {
        id: 'conv_2',
        patientId: 'pat_002',
        patientName: 'Michael Brown',
        patientAvatar: '',
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        priority: 'normal',
        patientInfo: {
          age: 45,
          condition: 'Diabetes Type 2',
          lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        lastMessage: {
          id: 'msg_005',
          senderId: user._id,
          senderName: `Dr. ${user.lastName}`,
          senderRole: 'doctor',
          content: 'Your lab results look good. Continue with your current medication.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isRead: true,
          messageType: 'text'
        },
        messages: [
          {
            id: 'msg_004',
            senderId: 'pat_002',
            senderName: 'Michael Brown',
            senderRole: 'patient',
            content: 'Doctor, I got my lab results. Could you please review them?',
            timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
            isRead: true,
            messageType: 'text',
            attachments: [
              {
                id: 'att_001',
                name: 'Lab_Results_2024.pdf',
                type: 'lab_result',
                url: '#',
                size: 245760
              }
            ]
          },
          {
            id: 'msg_005',
            senderId: user._id,
            senderName: `Dr. ${user.lastName}`,
            senderRole: 'doctor',
            content: 'Your lab results look good. Continue with your current medication.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            isRead: true,
            messageType: 'text'
          }
        ]
      },
      {
        id: 'conv_3',
        patientId: 'pat_003',
        patientName: 'Emma Davis',
        patientAvatar: '',
        unreadCount: 1,
        isPinned: false,
        isArchived: false,
        priority: 'urgent',
        patientInfo: {
          age: 28,
          condition: 'Asthma',
          lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        lastMessage: {
          id: 'msg_006',
          senderId: 'pat_003',
          senderName: 'Emma Davis',
          senderRole: 'patient',
          content: 'I\'m having trouble breathing. Should I use my rescue inhaler?',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          isRead: false,
          messageType: 'text'
        },
        messages: [
          {
            id: 'msg_006',
            senderId: 'pat_003',
            senderName: 'Emma Davis',
            senderRole: 'patient',
            content: 'I\'m having trouble breathing. Should I use my rescue inhaler?',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            isRead: false,
            messageType: 'text'
          }
        ]
      }
    ];

    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 1000);
  }, [user._id, user.lastName]);

  const currentConversation = conversations.find(c => c.id === activeConversation);
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const filteredConversations = conversations.filter(conv => {
    if (filter === 'unread' && conv.unreadCount === 0) return false;
    if (filter === 'pinned' && !conv.isPinned) return false;
    if (filter === 'archived' && !conv.isArchived) return false;
    if (searchTerm && !conv.patientName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return timestamp.toLocaleDateString();
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: user._id,
      senderName: `Dr. ${user.lastName}`,
      senderRole: 'doctor',
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false,
      messageType: 'text'
    };

    // Update conversations
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message
        };
      }
      return conv;
    }));

    setNewMessage('');
    setSending(false);

    // Auto-scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, isRead: true }))
        };
      }
      return conv;
    }));
  };

  const togglePin = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, isPinned: !conv.isPinned };
      }
      return conv;
    }));
  };

  const archiveConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, isArchived: !conv.isArchived };
      }
      return conv;
    }));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return <Pill className="h-4 w-4 text-green-600" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'file':
        return <FileText className="h-4 w-4 text-gray-600" />;
      case 'image':
        return <Image className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (activeConversation) {
      markAsRead(activeConversation);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation]);

  return (
    <div className="h-[800px] flex border rounded-lg overflow-hidden bg-white">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-sky-600" />
              Messages
              {totalUnread > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {totalUnread}
                </Badge>
              )}
            </h3>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1">
            <Button 
              variant={filter === 'all' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'unread' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread
            </Button>
            <Button 
              variant={filter === 'pinned' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('pinned')}
            >
              Pinned
            </Button>
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading conversations...</p>
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors relative ${
                    activeConversation === conversation.id 
                      ? 'bg-sky-50 border-sky-200 border' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.patientAvatar} />
                        <AvatarFallback>
                          {conversation.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.priority === 'urgent' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium truncate ${
                          conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {conversation.patientName}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {conversation.isPinned && <Pin className="h-3 w-3 text-orange-500" />}
                          {getPriorityIcon(conversation.priority)}
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate ${
                          conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                        }`}>
                          {conversation.lastMessage.senderRole === 'doctor' ? 'You: ' : ''}
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {conversation.patientInfo.condition} • Age {conversation.patientInfo.age}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-sm font-medium text-gray-900 mb-1">No conversations found</h4>
              <p className="text-xs text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'No messages at this time'}
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentConversation.patientAvatar} />
                  <AvatarFallback>
                    {currentConversation.patientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{currentConversation.patientName}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <HeartPulse className="h-3 w-3 mr-1" />
                    {currentConversation.patientInfo.condition} • Age {currentConversation.patientInfo.age}
                    {isTyping && (
                      <span className="ml-2 text-green-600">Typing...</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => togglePin(currentConversation.id)}>
                  <Pin className={`h-4 w-4 ${currentConversation.isPinned ? 'text-orange-500' : ''}`} />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentConversation.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderRole === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${message.senderRole === 'doctor' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-3 rounded-lg ${
                        message.senderRole === 'doctor' 
                          ? 'bg-sky-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center mb-1">
                          {getMessageIcon(message.messageType)}
                          {message.isEncrypted && <Shield className="h-3 w-3 ml-1 text-green-500" />}
                        </div>
                        <p className="text-sm">{message.content}</p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center p-2 bg-white bg-opacity-20 rounded">
                                <FileText className="h-4 w-4 mr-2" />
                                <span className="text-xs flex-1">{attachment.name}</span>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                        message.senderRole === 'doctor' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{formatTimestamp(message.timestamp)}</span>
                        {message.senderRole === 'doctor' && (
                          <div className="ml-1">
                            {message.isRead ? (
                              <CheckCheck className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Avatar className={`h-8 w-8 ${message.senderRole === 'doctor' ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
                      <AvatarImage src={message.senderRole === 'doctor' ? user.profileImage : currentConversation.patientAvatar} />
                      <AvatarFallback className="text-xs">
                        {message.senderRole === 'doctor' ? 'Dr' : message.senderName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-end space-x-2">
                <div className="flex space-x-1">
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="min-h-[40px] max-h-[120px] resize-none"
                  />
                </div>

                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim() || sending}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              {/* Quick Responses */}
              <div className="flex space-x-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setNewMessage('Thank you for your message. I will review and get back to you soon.')}
                >
                  Quick Reply
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setNewMessage('Please schedule a follow-up appointment to discuss this further.')}
                >
                  Schedule Follow-up
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setNewMessage('I\'ve sent you a new prescription. Please check your email.')}
                >
                  Prescription Sent
                </Button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*,.pdf,.doc,.docx"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a patient from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem;
