import React, { useState } from 'react';
import { AlertTriangle, Filter, MapPin, Bell, Calendar } from 'lucide-react';
import { useAlertContext, Alert } from '../contexts/AlertContext';
import { motion } from 'framer-motion';

const AlertsPage: React.FC = () => {
  const { activeAlerts } = useAlertContext();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter alerts based on level and search query
  const filteredAlerts = activeAlerts.filter(alert => {
    const matchesLevel = filter === 'all' || alert.level === filter;
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesLevel && matchesSearch;
  });
  
  // Function to render the appropriate icon for the alert level
  const renderAlertIcon = (level: Alert['level']) => {
    const iconClasses = {
      emergency: 'text-red-600 dark:text-red-400',
      danger: 'text-orange-600 dark:text-orange-400',
      warning: 'text-amber-600 dark:text-amber-400',
      safe: 'text-green-600 dark:text-green-400',
    };
    
    return (
      <div 
        className={`p-2 rounded-full mr-4 flex-shrink-0 bg-opacity-20 dark:bg-opacity-30
          ${level === 'emergency' ? 'bg-red-100 dark:bg-red-900/30' : ''}
          ${level === 'danger' ? 'bg-orange-100 dark:bg-orange-900/30' : ''}
          ${level === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' : ''}
          ${level === 'safe' ? 'bg-green-100 dark:bg-green-900/30' : ''}
        `}
      >
        <AlertTriangle size={20} className={iconClasses[level]} />
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Active Alerts</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Stay informed about current alerts and warnings in your area
        </p>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search alerts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
                <Bell size={16} />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Filter size={16} className="mr-2 text-neutral-500" />
            <span className="mr-2 text-sm text-neutral-600 dark:text-neutral-400">Filter:</span>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'all' 
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'emergency' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'
                }`}
                onClick={() => setFilter('emergency')}
              >
                Emergency
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'danger' 
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'
                }`}
                onClick={() => setFilter('danger')}
              >
                Danger
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'warning' 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'
                }`}
                onClick={() => setFilter('warning')}
              >
                Warning
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'safe' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'
                }`}
                onClick={() => setFilter('safe')}
              >
                Safe
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alerts */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <motion.div 
              key={alert.id} 
              className={`
                p-5 rounded-lg border shadow-sm hover:shadow-md transition-shadow
                ${alert.level === 'emergency' ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50' : ''}
                ${alert.level === 'danger' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800/50' : ''}
                ${alert.level === 'warning' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/50' : ''}
                ${alert.level === 'safe' ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/50' : ''}
              `}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start">
                {renderAlertIcon(alert.level)}
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{alert.title}</h3>
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${alert.level === 'emergency' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : ''}
                      ${alert.level === 'danger' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' : ''}
                      ${alert.level === 'warning' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' : ''}
                      ${alert.level === 'safe' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : ''}
                    `}>
                      {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-3">{alert.message}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="hidden sm:block h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{alert.timestamp.toLocaleString()}</span>
                    </div>
                    {alert.expires && (
                      <>
                        <div className="hidden sm:block h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
                        <div>Expires: {alert.expires.toLocaleString()}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8 text-center">
            <AlertTriangle size={40} className="mx-auto mb-4 text-neutral-400" />
            <h3 className="text-xl font-medium mb-2">No alerts found</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {filter !== 'all' 
                ? `No ${filter} alerts currently active` 
                : 'No alerts match your search criteria'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AlertsPage;