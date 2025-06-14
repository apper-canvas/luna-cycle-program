import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  gradient = false,
  hover = false,
  onClick,
  ...props 
}) => {
  const baseClasses = "rounded-xl p-6 shadow-sm";
  const backgroundClass = gradient ? "bg-gradient-card" : "bg-white";
  const hoverClass = hover ? "hover:shadow-md cursor-pointer" : "";
  
  const cardClasses = `${baseClasses} ${backgroundClass} ${hoverClass} ${className}`;

  if (onClick || hover) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={hover ? { y: -2, scale: 1.01 } : {}}
        whileTap={onClick ? { scale: 0.99 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;