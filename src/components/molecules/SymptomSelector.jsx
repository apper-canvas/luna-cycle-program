import React from 'react';
import { motion } from 'framer-motion';

const SymptomSelector = ({ value = [], onChange, className = '' }) => {
  const symptoms = [
    { value: 'cramps', label: 'Cramps', icon: '🤕' },
    { value: 'headache', label: 'Headache', icon: '🤯' },
    { value: 'fatigue', label: 'Fatigue', icon: '😴' },
    { value: 'bloating', label: 'Bloating', icon: '🎈' },
    { value: 'nausea', label: 'Nausea', icon: '🤢' },
    { value: 'backache', label: 'Back Pain', icon: '🦴' },
    { value: 'tender', label: 'Tender Breasts', icon: '💔' },
    { value: 'acne', label: 'Acne', icon: '🔴' }
  ];

  const toggleSymptom = (symptom) => {
    if (value.includes(symptom)) {
      onChange(value.filter(s => s !== symptom));
    } else {
      onChange([...value, symptom]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-medium font-display text-gray-900">Symptoms</h3>
      <div className="grid grid-cols-2 gap-2">
        {symptoms.map((symptom) => (
          <motion.button
            key={symptom.value}
            type="button"
            onClick={() => toggleSymptom(symptom.value)}
            className={`
              p-3 rounded-lg border text-left transition-all duration-200
              ${value.includes(symptom.value)
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{symptom.icon}</span>
              <span className="text-sm font-medium">{symptom.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SymptomSelector;