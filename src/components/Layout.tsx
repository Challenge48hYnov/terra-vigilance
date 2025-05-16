import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import EmergencyBanner from './EmergencyBanner';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasEmergency, setHasEmergency] = useState(false);
  const location = useLocation();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Mock emergency alert - in a real app this would come from an API
  useEffect(() => {
    // Simulate emergency alert after 3 seconds
    const timer = setTimeout(() => {
      setHasEmergency(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {hasEmergency && (
        <EmergencyBanner
          message="EMERGENCY ALERT: Flash flooding reported in downtown area. Seek higher ground immediately."
          level="emergency"
        />
      )}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-neutral-900">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="page-container"
          >
            {children}
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;