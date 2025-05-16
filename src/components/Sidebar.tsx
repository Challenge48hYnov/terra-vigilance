import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Map, AlertTriangle, MessageSquare,
  Activity, User, Zap, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';


interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/', name: t('home'), icon: <Home size={20} /> },
    { path: '/alerts', name: t('alerts'), icon: <AlertTriangle size={20} /> },
    { path: '/map', name: t('hazardMap'), icon: <Map size={20} /> },
    { path: '/resources', name: t('resources'), icon: <Zap size={20} /> },
    { path: '/activities', name: t('activities'), icon: <Activity size={20} /> },
    { path: '/chat', name: t('localChat'), icon: <MessageSquare size={20} /> },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar for mobile */}
      <motion.div
        className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-neutral-800 z-50 shadow-lg lg:hidden"
        initial="closed"
        animate={open ? 'open' : 'closed'}
        variants={sidebarVariants}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
          <Link to="/" className="flex items-center">
            <AlertTriangle size={24} className="text-danger mr-2" />
            <span className="text-xl font-bold">
              {t('appName')}
            </span>
          </Link>
          <button
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-700'
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:block w-64 min-h-[calc(100vh-64px)] bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700">
        <nav className="p-3 pt-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'hover:bg-gray-100 dark:hover:bg-neutral-700'
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;