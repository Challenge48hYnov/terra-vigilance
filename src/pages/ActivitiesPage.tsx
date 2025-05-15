import React, { useState } from 'react';
import { 
  Activity, AlertTriangle, Compass, Calendar, MapPin, 
  ThumbsUp, ThumbsDown, Filter, Search, ArrowRight 
} from 'lucide-react';
import { useAlertContext } from '../contexts/AlertContext';
import { motion } from 'framer-motion';

// Define activity types
interface ActivityItem {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  safetyLevel: 'safe' | 'moderate' | 'risky' | 'dangerous';
  category: string;
  image: string;
  likes: number;
  dislikes: number;
}

const ActivitiesPage: React.FC = () => {
  const { activeAlerts } = useAlertContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSafety, setSelectedSafety] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Mock activities data - in a real app, this would come from an API
  const activities: ActivityItem[] = [
    {
      id: '1',
      title: 'Community Cleanup',
      description: 'Help clean up debris after recent flooding in downtown area. Boots and gloves required.',
      location: 'Downtown',
      date: '2025-07-15T10:00',
      safetyLevel: 'moderate',
      category: 'volunteer',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      likes: 24,
      dislikes: 2,
    },
    {
      id: '2',
      title: 'Kayaking Tours',
      description: 'Guided kayaking tours through the flooded downtown streets. Experience the city from a new perspective.',
      location: 'Downtown',
      date: '2025-07-16T14:00',
      safetyLevel: 'risky',
      category: 'recreation',
      image: 'https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      likes: 15,
      dislikes: 8,
    },
    {
      id: '3',
      title: 'Indoor Climbing',
      description: 'The climbing gym is open and operating on generator power. All skill levels welcome.',
      location: 'East Side',
      date: '2025-07-14T09:00',
      safetyLevel: 'safe',
      category: 'recreation',
      image: 'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      likes: 32,
      dislikes: 0,
    },
    {
      id: '4',
      title: 'First Aid Training',
      description: 'Learn essential first aid skills to help your community during emergencies.',
      location: 'North County',
      date: '2025-07-18T13:00',
      safetyLevel: 'safe',
      category: 'educational',
      image: 'https://images.pexels.com/photos/6823603/pexels-photo-6823603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      likes: 42,
      dislikes: 1,
    },
    {
      id: '5',
      title: 'Extreme Roof Surfing',
      description: 'Surf on the roofs of flooded buildings. Extreme thrill seekers only!',
      location: 'Riverside',
      date: '2025-07-17T11:00',
      safetyLevel: 'dangerous',
      category: 'extreme',
      image: 'https://images.pexels.com/photos/1654498/pexels-photo-1654498.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      likes: 8,
      dislikes: 45,
    },
    {
      id: '6',
      title: 'Emergency Supply Drive',
      description: 'Donate or help distribute emergency supplies to affected communities.',
      location: 'West Hills',
      date: '2025-07-19T09:00',
      safetyLevel: 'safe',
      category: 'volunteer',
      image: 'https://images.pexels.com/photos/6590920/pexels-photo-6590920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      likes: 56,
      dislikes: 0,
    },
  ];
  
  // Filter activities based on category, safety level, and search query
  const filteredActivities = activities.filter(activity => {
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesSafety = selectedSafety === 'all' || activity.safetyLevel === selectedSafety;
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSafety && matchesSearch;
  });
  
  // Helper function to get the safety level color and text
  const getSafetyInfo = (level: ActivityItem['safetyLevel']) => {
    switch (level) {
      case 'safe':
        return { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200', text: 'Safe' };
      case 'moderate':
        return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200', text: 'Moderate Risk' };
      case 'risky':
        return { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200', text: 'High Risk' };
      case 'dangerous':
        return { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200', text: 'Dangerous' };
      default:
        return { color: '', text: '' };
    }
  };
  
  // Check if an activity is in an area with active alerts
  const hasActiveAlert = (location: string) => {
    return activeAlerts.some(alert => 
      alert.location === location && 
      (alert.level === 'emergency' || alert.level === 'danger')
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Activities</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Discover things to do in your area, with real-time safety ratings
        </p>
      </div>
      
      {/* Filters and Search */}
      <div className="mb-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-neutral-500" />
              <select
                className="pl-2 pr-8 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="recreation">Recreation</option>
                <option value="volunteer">Volunteer</option>
                <option value="educational">Educational</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <AlertTriangle size={16} className="mr-2 text-neutral-500" />
              <select
                className="pl-2 pr-8 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedSafety}
                onChange={(e) => setSelectedSafety(e.target.value)}
              >
                <option value="all">All Safety Levels</option>
                <option value="safe">Safe</option>
                <option value="moderate">Moderate Risk</option>
                <option value="risky">High Risk</option>
                <option value="dangerous">Dangerous</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => {
            const safetyInfo = getSafetyInfo(activity.safetyLevel);
            const hasAlert = hasActiveAlert(activity.location);
            
            return (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative">
                  <img 
                    src={activity.image} 
                    alt={activity.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${safetyInfo.color}`}>
                      {safetyInfo.text}
                    </span>
                  </div>
                  
                  {hasAlert && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 animate-pulse">
                        <AlertTriangle size={12} className="mr-1" />
                        Alert in Area
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{activity.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                    {activity.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2" />
                      <span>{activity.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      <span>{new Date(activity.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Compass size={14} className="mr-2" />
                      <span className="capitalize">{activity.category}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <div className="flex items-center">
                        <ThumbsUp size={14} className="mr-1 text-green-600 dark:text-green-400" />
                        <span className="text-sm">{activity.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsDown size={14} className="mr-1 text-red-600 dark:text-red-400" />
                        <span className="text-sm">{activity.dislikes}</span>
                      </div>
                    </div>
                    
                    <button className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                      Details
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8 text-center">
            <Activity size={40} className="mx-auto mb-4 text-neutral-400" />
            <h3 className="text-xl font-medium mb-2">No activities found</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}
      </div>
      
      {/* Safety Disclaimer */}
      <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle size={20} className="mr-3 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Safety Disclaimer</h3>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Activities are rated based on current conditions. Always check for active alerts in your area before participating in any activity. DisasterAlert is not responsible for any injuries or damages resulting from participation in listed activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;