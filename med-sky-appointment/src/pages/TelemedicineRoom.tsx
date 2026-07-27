import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MonitorUp, 
  MessageSquare, 
  Settings,
  MoreVertical,
  Maximize,
  Send,
  Wifi,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

const TelemedicineRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [message, setMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'System', text: 'Call connected securely.', time: '10:00 AM', isMe: false },
    { id: '2', sender: 'Dr. Sarah', text: 'Hello! I will be with you in just a moment.', time: '10:01 AM', isMe: false },
  ]);

  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: user?.name || 'Me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleEndCall = () => {
    // In a real app, cleanup WebRTC connections here
    navigate('/dashboard');
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 text-slate-50 overflow-hidden font-sans">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Consultation Room</h1>
            <p className="text-xs text-slate-400">ID: {id?.slice(0, 8)} • Encrypted</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {formatDuration(callDuration)}
            </div>
            <div className="flex items-center text-slate-400 ml-2" title="Connection: Excellent">
              <Wifi className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Video Stage */}
        <main className={`relative flex flex-1 flex-col transition-all duration-300 ${showChat ? 'mr-80' : ''}`}>
          
          {/* Main Remote Video (Simulated) */}
          <div className="absolute inset-0 p-4">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-slate-800 flex items-center justify-center">
              {/* Fallback pattern for when video is loading or we don't have a stream */}
              <div className="absolute inset-0 opacity-20" 
                   style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
              </div>
              
              <div className="flex flex-col items-center z-10">
                <Avatar className="h-32 w-32 border-4 border-slate-800 shadow-2xl mb-6">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-sky-600 text-3xl font-light">DR</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-light tracking-wide">Dr. Sarah Jenkins</h2>
                <p className="text-slate-400 mt-2 font-medium">Cardiologist</p>
              </div>

              {/* Badges on video */}
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-sm font-medium">
                  Dr. Sarah Jenkins
                </div>
              </div>
            </div>
          </div>

          {/* Picture-in-Picture Local Video (Simulated) */}
          <div className="absolute bottom-28 right-8 z-20 h-48 w-72 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl transition-transform hover:scale-105 cursor-move">
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
               {isVideoOff ? (
                 <div className="flex flex-col items-center">
                   <Avatar className="h-16 w-16 mb-2">
                     <AvatarFallback className="bg-slate-700">{user?.name?.charAt(0) || 'Me'}</AvatarFallback>
                   </Avatar>
                   <p className="text-xs text-slate-400">Camera Off</p>
                 </div>
               ) : (
                 <div className="h-full w-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                   {/* Simulated active camera feed - just a placeholder gradient */}
                   <span className="text-slate-500 text-sm">Local Video</span>
                 </div>
               )}
            </div>
            <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium">
              You
            </div>
            {isMuted && (
              <div className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1.5 text-white backdrop-blur-md">
                <MicOff className="h-3 w-3" />
              </div>
            )}
          </div>

          {/* Floating Control Bar */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-3 shadow-2xl backdrop-blur-xl transition-all hover:bg-slate-900/90 hover:border-white/20">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              className={`h-12 w-12 rounded-xl transition-all hover:scale-110 ${!isMuted && 'bg-slate-800 hover:bg-slate-700 text-white'}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isVideoOff ? "destructive" : "secondary"}
              size="icon"
              className={`h-12 w-12 rounded-xl transition-all hover:scale-110 ${!isVideoOff && 'bg-slate-800 hover:bg-slate-700 text-white'}`}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>

            <div className="h-8 w-px bg-slate-700 mx-2"></div>

            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all hover:scale-110"
              title="Share Screen"
            >
              <MonitorUp className="h-5 w-5" />
            </Button>

            <Button
              variant={showChat ? "secondary" : "ghost"}
              size="icon"
              className={`h-12 w-12 rounded-xl transition-all hover:scale-110 ${showChat ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-110"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <div className="h-8 w-px bg-slate-700 mx-2"></div>

            <Button
              variant="destructive"
              className="h-12 rounded-xl px-6 font-semibold shadow-lg shadow-red-500/20 transition-all hover:scale-105 hover:bg-red-600"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-5 w-5 mr-2" />
              End Call
            </Button>
          </div>
        </main>

        {/* Slide-out Chat Sidebar */}
        <aside 
          className={`absolute right-0 top-0 h-full w-80 flex flex-col border-l border-slate-800 bg-slate-900 transition-transform duration-300 ease-in-out ${
            showChat ? 'translate-x-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <h3 className="font-medium text-slate-200">In-Call Messages</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => setShowChat(false)}>
              <span className="sr-only">Close chat</span>
              &times;
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-medium text-slate-300">{msg.sender}</span>
                  <span className="text-[10px] text-slate-500">{msg.time}</span>
                </div>
                <div 
                  className={`rounded-2xl px-4 py-2 max-w-[85%] text-sm ${
                    msg.isMe 
                      ? 'bg-sky-600 text-white rounded-br-sm' 
                      : msg.sender === 'System'
                      ? 'bg-slate-800 text-slate-300 italic w-full text-center rounded-2xl border border-slate-700'
                      : 'bg-slate-700 text-white rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-sky-500 rounded-full"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!message.trim()}
                className="rounded-full bg-sky-600 hover:bg-sky-700 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TelemedicineRoom;
