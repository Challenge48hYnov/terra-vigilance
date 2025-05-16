import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user types
interface UserLocation {
  lat: number;
  lng: number;
  address: string;
  zone: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  location: UserLocation;
  emergencyContacts: string[];
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  safetyCheckedIn: boolean;
}

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  updateUserLocation: (location: Partial<UserLocation>) => void;
  updateNotificationPreferences: (prefs: Partial<User['notificationPreferences']>) => void;
  safetyCheckIn: () => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data - in a real app, this would come from authentication
  useEffect(() => {
    // Simulate API fetch
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUser: User = {
          id: '123',
          name: 'Jane Doe',
          email: 'jane@example.com',
          location: {
            lat: 34.0522,
            lng: -118.2437,
            address: '123 Main St, Los Angeles, CA',
            zone: 'Downtown',
          },
          emergencyContacts: ['john@example.com', 'mom@example.com'],
          notificationPreferences: {
            email: true,
            push: true,
            sms: false,
          },
          safetyCheckedIn: false,
        };

        setCurrentUser(mockUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUserLocation = (location: Partial<UserLocation>) => {
    if (!currentUser) return;

    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        location: {
          ...prev.location,
          ...location,
        },
      };
    });
  };

  const updateNotificationPreferences = (prefs: Partial<User['notificationPreferences']>) => {
    if (!currentUser) return;

    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          ...prefs,
        },
      };
    });
  };

  const safetyCheckIn = () => {
    if (!currentUser) return;

    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        safetyCheckedIn: true,
      };
    });
  };

  return (
    <UserContext.Provider 
      value={{ 
        currentUser, 
        isLoading, 
        updateUserLocation, 
        updateNotificationPreferences, 
        safetyCheckIn,
        setCurrentUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
