import React, { useState, useCallback, useContext, createContext, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../utils/config';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// A separate context for internal provider/container communication
const ToastManagementContext = createContext<{
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
} | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastManagementContext.Provider value={{ toasts, removeToast }}>
        {children}
      </ToastManagementContext.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Internal hook for the ToastContainer
export const useToastManager = () => {
    const context = useContext(ToastManagementContext);
    if (context === undefined) {
        throw new Error('useToastManager must be used within a ToastProvider');
    }
    return context;
};

// --- Socket.IO Context ---
const SocketContext = createContext<Socket | undefined>(undefined);

// A single socket instance for the entire app
const socket = io(API_URL, {
    autoConnect: true,
    reconnection: true,
});

socket.on('connect', () => console.log('Socket connected:', socket.id));
socket.on('disconnect', () => console.log('Socket disconnected'));
socket.on('connect_error', (err) => console.error('Socket connection error:', err.message));


export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
