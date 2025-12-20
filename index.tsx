import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider, SocketProvider } from './hooks/useToast';
import { ToastContainer } from './components/common/ToastContainer';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
      <ToastContainer />
    </ToastProvider>
  </React.StrictMode>
);