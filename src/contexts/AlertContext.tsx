import React, { createContext, useContext, useState, useEffect } from 'react';

// Define alert types
export interface Alert {
  id: string;
  title: string;
  message: string;
  level: 'safe' | 'warning' | 'danger' | 'emergency';
  location: string;
  timestamp: Date;
  expires?: Date;
}

interface AlertContextType {
  activeAlerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  removeAlert: (id: string) => void;
  getAlertsByLocation: (location: string) => Alert[];
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);

  // Mock initial data - in a real app, this would come from an API
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: 'Flash Flood Warning',
        message: 'Flash flooding reported in downtown area. Seek higher ground immediately.',
        level: 'emergency',
        location: 'Downtown',
        timestamp: new Date(),
        expires: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      },
      {
        id: '2',
        title: 'Thunderstorm Watch',
        message: 'Severe thunderstorms possible this afternoon. Stay indoors if possible.',
        level: 'warning',
        location: 'North County',
        timestamp: new Date(),
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      },
      {
        id: '3',
        title: 'Road Closure',
        message: 'Main Street bridge closed due to flooding. Use alternate routes.',
        level: 'danger',
        location: 'Riverside',
        timestamp: new Date(),
      },
    ];
    
    setActiveAlerts(mockAlerts);
    
    // Clean up expired alerts every minute
    const interval = setInterval(() => {
      const now = new Date();
      setActiveAlerts(prev => 
        prev.filter(alert => !alert.expires || alert.expires > now)
      );
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setActiveAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id: string) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertsByLocation = (location: string) => {
    return activeAlerts.filter(alert => 
      alert.location.toLowerCase() === location.toLowerCase()
    );
  };

  return (
    <AlertContext.Provider value={{ activeAlerts, addAlert, removeAlert, getAlertsByLocation }}>
      {children}
    </AlertContext.Provider>
  );
};