import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title,
  description,
  actionLabel,
  onAction,
  icon = "Plus",
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={icon} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      </motion.div>
      
      <h3 className="text-lg font-semibold font-display text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 font-body mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {onAction && actionLabel && (
        <Button onClick={onAction} icon={icon}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;