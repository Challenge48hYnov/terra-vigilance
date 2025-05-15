import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Define message types
export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  location: string;
  isOfficial?: boolean;
}

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string, location: string, isOfficial?: boolean) => void;
  getMessagesByLocation: (location: string) => ChatMessage[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInfo] = useState({
    name: 'Anonymous User', // In a real app, this would come from authentication
  });

  // Mock initial data - in a real app, this would come from an API
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        sender: 'Emergency Services',
        text: 'Flooding reported on Main St. Please avoid the area and use alternate routes.',
        timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
        location: 'Downtown',
        isOfficial: true,
      },
      {
        id: '2',
        sender: 'Sarah Johnson',
        text: 'Anyone know if the evacuation center at Central High School is open yet?',
        timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        location: 'Downtown',
      },
      {
        id: '3',
        sender: 'City Official',
        text: 'Central High School evacuation center is now open. It has capacity for 200 people and is pet-friendly.',
        timestamp: new Date(Date.now() - 25 * 60000), // 25 minutes ago
        location: 'Downtown',
        isOfficial: true,
      },
      {
        id: '4',
        sender: 'Michael Wong',
        text: 'Thanks for the info. Heading there now with my family.',
        timestamp: new Date(Date.now() - 20 * 60000), // 20 minutes ago
        location: 'Downtown',
      },
      {
        id: '5',
        sender: 'Lisa Garcia',
        text: 'Does anyone know if Pine Road is still accessible? Need to get my elderly parents.',
        timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
        location: 'Downtown',
      },
    ];
    
    setMessages(mockMessages);
  }, []);

  const sendMessage = useCallback((text: string, location: string, isOfficial = false) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: userInfo.name,
      text,
      timestamp: new Date(),
      location,
      isOfficial,
    };
    setMessages(prev => [...prev, newMessage]);
  }, [userInfo.name]);

  const getMessagesByLocation = useCallback((location: string) => {
    return messages.filter(message => 
      message.location.toLowerCase() === location.toLowerCase()
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [messages]);

  return (
    <ChatContext.Provider value={{ messages, sendMessage, getMessagesByLocation }}>
      {children}
    </ChatContext.Provider>
  );
};