import React, { useState, useEffect, useRef } from 'react';
import { messagesApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, MessageSquare, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact.contactId);
    }
  }, [activeContact]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      // If message is from active contact, append it and mark as read
      if (activeContact && (message.sender._id === activeContact.contactId || message.sender === activeContact.contactId)) {
        setMessages(prev => [...prev, message]);
        // Ideally emit a read event to server here
      } else {
        // Update unread count in contacts list
        setContacts(prev => prev.map(c => {
          if (c.contactId === message.sender._id || c.contactId === message.sender) {
            return { ...c, unreadCount: c.unreadCount + 1, lastMessage: message.content, timestamp: message.createdAt };
          }
          return c;
        }));
      }
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, activeContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await messagesApi.getConversations();
      if (res.success) {
        setContacts(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      setLoadingMessages(true);
      const res = await messagesApi.getHistory(userId);
      if (res.success) {
        setMessages(res.data);
        // Clear unread count for this contact
        setContacts(prev => prev.map(c => c.contactId === userId ? { ...c, unreadCount: 0 } : c));
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const res = await messagesApi.send(activeContact.contactId, newMessage);
      if (res.success) {
        setMessages(prev => [...prev, res.data]);
        setNewMessage('');
        
        // Update contact last message
        setContacts(prev => prev.map(c => 
          c.contactId === activeContact.contactId 
            ? { ...c, lastMessage: res.data.content, timestamp: res.data.createdAt } 
            : c
        ));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch (e) {
      return '';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] w-full bg-white rounded-2xl shadow-sm border border-slate-200">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[600px] w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Left Panel - Contacts list */}
      <div className="w-1/3 min-w-[280px] border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9 bg-white border-slate-200 focus-visible:ring-sky-500 rounded-full"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {contacts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No active conversations</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {contacts.map((contact) => (
                <button
                  key={contact.contactId}
                  onClick={() => setActiveContact(contact)}
                  className={`flex items-center gap-3 p-4 text-left transition-colors border-b border-slate-100 last:border-0 ${
                    activeContact?.contactId === contact.contactId 
                      ? 'bg-sky-50 hover:bg-sky-50/80 relative after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-sky-500' 
                      : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border border-slate-200">
                      <AvatarImage src={contact.user.profileImage} />
                      <AvatarFallback className="bg-sky-100 text-sky-700">
                        {contact.user.firstName[0]}{contact.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {contact.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-900 truncate">
                        {contact.user.role === 'doctor' ? 'Dr. ' : ''}{contact.user.firstName} {contact.user.lastName}
                      </p>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                        {formatDate(contact.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${contact.unreadCount > 0 ? 'font-medium text-slate-900' : 'text-slate-500'}`}>
                      {contact.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Panel - Chat window */}
      <div className="flex-1 flex flex-col bg-white relative">
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-200 flex items-center px-6 bg-white shrink-0 shadow-sm z-10">
              <Avatar className="h-10 w-10 mr-4 border border-slate-200">
                <AvatarImage src={activeContact.user.profileImage} />
                <AvatarFallback className="bg-sky-100 text-sky-700">
                  {activeContact.user.firstName[0]}{activeContact.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-slate-900">
                  {activeContact.user.role === 'doctor' ? 'Dr. ' : ''}{activeContact.user.firstName} {activeContact.user.lastName}
                </h2>
                <p className="text-xs text-slate-500 capitalize">{activeContact.user.role}</p>
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6 bg-slate-50/30">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 pt-10">
                  <MessageSquare className="h-12 w-12 opacity-20" />
                  <p>Send a message to start the conversation</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, idx) => {
                    // Check if sender is me (could be populated object or just string ID)
                    const isMe = (msg.sender._id || msg.sender) === user?._id;
                    
                    // Show date separator if date changed
                    const msgDate = new Date(msg.createdAt).toDateString();
                    const prevMsgDate = idx > 0 ? new Date(messages[idx-1].createdAt).toDateString() : null;
                    const showDate = msgDate !== prevMsgDate;

                    return (
                      <React.Fragment key={msg._id || idx}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="px-3 py-1 bg-slate-200/50 text-slate-500 rounded-full text-xs font-medium">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                        )}
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div 
                            className={`px-4 py-2.5 rounded-2xl max-w-[75%] shadow-sm text-[15px] leading-relaxed ${
                              isMe 
                                ? 'bg-sky-500 text-white rounded-br-sm' 
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 mx-1">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-200 bg-white shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-100/50 border-slate-200 rounded-full px-6 focus-visible:ring-sky-500"
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="rounded-full h-10 w-10 p-0 shrink-0 bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-500/20"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50/50">
            <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-6 shadow-sm border border-slate-200">
              <MessageSquare className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Your Messages</h3>
            <p className="text-sm">Select a conversation from the left to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
