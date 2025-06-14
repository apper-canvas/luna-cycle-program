import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  loading,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-button text-white shadow-lg hover:shadow-xl",
    secondary: "bg-surface-100 text-primary border border-primary hover:bg-surface-200",
    ghost: "text-primary hover:bg-surface-100",
    danger: "bg-error text-white hover:bg-red-600"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`;

  const IconComponent = icon ? (
    <ApperIcon 
      name={icon} 
      size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18}
      className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}
    />
  ) : null;

  const handleClick = disabled ? undefined : onClick;

  return (
<motion.button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      {...(() => {
        // Filter out custom React props to prevent DOM warnings
        const { variant, size, icon, iconPosition, fullWidth, loading, ...domProps } = props;
        return domProps;
      })()}
    >
      {icon && iconPosition === 'left' && IconComponent}
      {children}
      {icon && iconPosition === 'right' && IconComponent}
    </motion.button>
  );
};

export default Button;