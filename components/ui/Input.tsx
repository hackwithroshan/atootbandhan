
import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  icon?: ReactNode; // Icon on the left
  rightIcon?: ReactNode; // Icon on the right (e.g., password toggle)
  onRightIconClick?: () => void; // Click handler for the right icon
}

const Input: React.FC<InputProps> = ({ label, id, error, icon, rightIcon, onRightIconClick, className, ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-0.5 text-left">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`block w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 text-sm
            ${icon ? 'pl-10' : 'pl-3'}
            ${rightIcon ? 'pr-10' : 'pr-3'} 
            ${error ? 'border-red-500 focus:ring-red-400 focus:border-red-500' : 'border-gray-300 focus:ring-rose-400 focus:border-rose-500'}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${props.type === 'file' ? 'file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100 cursor-pointer' : ''}
          `}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={props['aria-label'] ? `${props['aria-label']} visibility toggle` : 'Toggle visibility'}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600 text-left">{error}</p>}
    </div>
  );
};

export default Input;
