import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 z-40">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-around">
          {routeArray.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) => `
                flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200
                ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}
                ${route.isCenter ? 'relative' : ''}
              `}
            >
              {({ isActive }) => (
                <>
                  {route.isCenter ? (
                    <motion.div
                      className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg -mt-6
                        ${isActive ? 'bg-gradient-button' : 'bg-primary'}
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon 
                        name={route.icon} 
                        size={24} 
                        className="text-white" 
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon 
                        name={route.icon} 
                        size={20} 
                        className={isActive ? 'text-primary' : 'text-gray-500'}
                      />
                    </motion.div>
                  )}
                  
                  <span className={`
                    text-xs font-medium mt-1 font-body
                    ${route.isCenter ? 'text-transparent' : ''}
                    ${isActive ? 'text-primary' : 'text-gray-500'}
                  `}>
                    {route.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;