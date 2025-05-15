import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Map, MessageSquare, Shield, Zap } from 'lucide-react';
import { useAlertContext } from '../contexts/AlertContext';
import { useUserContext } from '../contexts/UserContext';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { activeAlerts } = useAlertContext();
  const { currentUser, isLoading } = useUserContext();
  
  // Get alerts for user's location
  const localAlerts = currentUser 
    ? activeAlerts.filter(alert => alert.location === currentUser.location.zone)
    : [];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div>
      <section className="pt-6 pb-12">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Stay Safe. Stay Informed.
          </motion.h1>
          <motion.p 
            className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Real-time disaster alerts and community resources to keep you and your loved ones safe during emergencies.
          </motion.p>
        </div>

        {/* User Location Status */}
        {!isLoading && currentUser && (
          <motion.div 
            className="mb-8 bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-medium">Your Location</h2>
                <p className="text-neutral-600 dark:text-neutral-400">{currentUser.location.address}</p>
              </div>
              <div className="flex items-center">
                <span 
                  className={`inline-flex h-3 w-3 rounded-full mr-2 ${
                    localAlerts.length > 0 ? 'bg-danger' : 'bg-safe'
                  }`}
                ></span>
                <span>
                  {localAlerts.length > 0 
                    ? `${localAlerts.length} active alert${localAlerts.length > 1 ? 's' : ''} in your area` 
                    : 'No active alerts in your area'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Access Buttons */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Link 
              to="/alerts" 
              className="block bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
                  <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Active Alerts</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  View all active emergency alerts and warnings for your area
                </p>
              </div>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link 
              to="/map" 
              className="block bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-4">
                  <Map size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Hazard Map</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Interactive map showing affected areas and safety information
                </p>
              </div>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link 
              to="/chat" 
              className="block bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4">
                  <MessageSquare size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Local Chat</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Connect with your community during emergencies
                </p>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Recent Alerts Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Alerts</h2>
            <Link 
              to="/alerts" 
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all
            </Link>
          </div>
          
          {activeAlerts.length > 0 ? (
            <div className="space-y-4">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div 
                  key={alert.id} 
                  className={`
                    p-4 rounded-lg border 
                    ${alert.level === 'emergency' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : ''}
                    ${alert.level === 'danger' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : ''}
                    ${alert.level === 'warning' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' : ''}
                    ${alert.level === 'safe' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : ''}
                  `}
                >
                  <div className="flex items-start">
                    <div 
                      className={`
                        p-2 rounded-full mr-4 flex-shrink-0
                        ${alert.level === 'emergency' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : ''}
                        ${alert.level === 'danger' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : ''}
                        ${alert.level === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : ''}
                        ${alert.level === 'safe' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : ''}
                      `}
                    >
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold mr-2">{alert.title}</h3>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {alert.location}
                        </span>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 mb-2">{alert.message}</p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">No active alerts at this time.</p>
            </div>
          )}
        </div>
        
        {/* Resources */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Emergency Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-4 flex-shrink-0">
                  <Shield size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Prepare Your Emergency Kit</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Essential supplies to have ready before disaster strikes.
                  </p>
                </div>
              </div>
              <Link 
                to="/prepared" 
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
              >
                Learn more →
              </Link>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-full mr-4 flex-shrink-0">
                  <Zap size={20} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Find Local Resources</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Locate shelters, medical help, and supplies near you.
                  </p>
                </div>
              </div>
              <Link 
                to="/resources" 
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
              >
                Find resources →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;