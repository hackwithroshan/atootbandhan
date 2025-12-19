import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { InformationCircleIcon } from '../icons/InformationCircleIcon';
import { XMarkIcon } from '../icons/XMarkIcon';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
  onClose: (id: number) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircleIcon,
    iconClass: 'text-green-500',
    containerBgClass: 'bg-green-50',
  },
  error: {
    icon: ExclamationTriangleIcon,
    iconClass: 'text-red-500',
    containerBgClass: 'bg-red-50',
  },
  info: {
    icon: InformationCircleIcon,
    iconClass: 'text-blue-500',
    containerBgClass: 'bg-blue-50',
  },
};

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const { icon: Icon, iconClass, containerBgClass } = toastConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300); // Wait for exit animation
    }, 5000); 

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  const animationClass = isExiting ? 'animate-toast-exit' : 'animate-toast-enter';

  return (
    <div
      className={`max-w-sm w-full ${containerBgClass} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${animationClass}`}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconClass}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
