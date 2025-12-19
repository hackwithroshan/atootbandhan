import React, { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, options, error, placeholder, icon, className, ...props }) => {
  return (
    <div className={`w-full ${className}`}> {/* Ensure full width by default, allow override */}
      <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-0.5 text-left"> {/* Smaller margin, left aligned */}
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
         {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            {icon}
          </div>
        )}
        <select
          id={id}
          className={`block w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 appearance-none transition-colors duration-200 text-sm
            ${icon ? 'pl-10' : 'pl-3'}
            ${error ? 'border-red-500 focus:ring-red-400 focus:border-red-500' : 'border-gray-300 focus:ring-rose-400 focus:border-rose-500'}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${props.value === '' || !props.value && placeholder ? 'text-gray-400' : 'text-gray-900'}
          `}
          {...props}
        >
          {placeholder && <option value="" disabled hidden>{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value} className="text-gray-900">
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600 text-left">{error}</p>}
    </div>
  );
};

export default Select;