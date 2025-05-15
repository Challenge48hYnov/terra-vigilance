import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmergencyBannerProps {
  message: string;
  level: 'safe' | 'warning' | 'danger' | 'emergency';
}

const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ message, level }) => {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  const bgColors = {
    safe: 'bg-green-100 dark:bg-green-900/30',
    warning: 'bg-amber-100 dark:bg-amber-900/30',
    danger: 'bg-red-100 dark:bg-red-900/30',
    emergency: 'bg-red-600 dark:bg-red-700',
  };
  
  const textColors = {
    safe: 'text-green-800 dark:text-green-200',
    warning: 'text-amber-800 dark:text-amber-200',
    danger: 'text-red-800 dark:text-red-200',
    emergency: 'text-white',
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`${bgColors[level]} ${textColors[level]} py-3 px-4 ${level === 'emergency' ? 'emergency-pulse' : ''}`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
          <p className="font-medium">{message}</p>
        </div>
        <button 
          onClick={() => setDismissed(true)}
          className="ml-4 p-1 rounded-full hover:bg-black/10"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default EmergencyBanner;