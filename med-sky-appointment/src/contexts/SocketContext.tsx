import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if user is logged in
    if (!user || !user._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    const newSocket = io(SOCKET_URL, {
      withCredentials: true
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      // Register user with their ID to receive targeted notifications
      newSocket.emit('register', user._id);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for live notifications
    newSocket.on('notification', (notification) => {
      toast.info(notification.title, {
        description: notification.message,
        duration: 5000,
      });
      
      // Dispatch a custom event so the Navbar can update its count
      window.dispatchEvent(new CustomEvent('new_notification', { detail: notification }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
