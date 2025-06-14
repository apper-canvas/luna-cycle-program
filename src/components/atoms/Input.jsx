import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  icon,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputClasses = `
    w-full px-4 py-3 rounded-lg border transition-all duration-200
    font-body text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    ${error ? 'border-error bg-red-50' : 'border-gray-200 bg-surface-50'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${icon ? 'pl-12' : ''}
    ${className}
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 font-body">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={20} className="text-gray-400" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error font-body">{error}</p>
      )}
    </div>
  );
};

export default Input;