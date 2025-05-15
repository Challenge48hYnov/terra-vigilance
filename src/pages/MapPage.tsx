import React, { useState } from 'react';
import { 
  Map as MapIcon, Layers, AlertTriangle, Info, Home, 
  Navigation, List, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useAlertContext } from '../contexts/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';

const MapPage: React.FC = () => {
  const { activeAlerts } = useAlertContext();
  const [showLegend, setShowLegend] = useState(true);
  const [selectedZones, setSelectedZones] = useState<string[]>(['Downtown', 'Riverside', 'North County']);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['alerts', 'flood', 'roads']);
  
  const toggleZone = (zone: string) => {
    if (selectedZones.includes(zone)) {
      setSelectedZones(selectedZones.filter(z => z !== zone));
    } else {
      setSelectedZones([...selectedZones, zone]);
    }
  };
  
  const toggleLayer = (layer: string) => {
    if (selectedLayers.includes(layer)) {
      setSelectedLayers(selectedLayers.filter(l => l !== layer));
    } else {
      setSelectedLayers([...selectedLayers, layer]);
    }
  };
  
  // Available zones - in a real app, these would come from an API
  const availableZones = ['Downtown', 'North County', 'Riverside', 'East Side', 'West Hills'];
  
  // Available map layers - in a real app, these would be actual map layers
  const availableLayers = [
    { id: 'alerts', name: 'Active Alerts', icon: <AlertTriangle size={16} /> },
    { id: 'flood', name: 'Flood Zones', icon: <MapIcon size={16} /> },
    { id: 'roads', name: 'Road Closures', icon: <MapIcon size={16} /> },
    { id: 'resources', name: 'Emergency Resources', icon: <Info size={16} /> },
    { id: 'shelters', name: 'Shelters', icon: <Home size={16} /> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Hazard Map</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Interactive map showing affected areas and safety information
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map Controls and Filters */}
        <div className="md:col-span-1 space-y-4">
          {/* Zones Filter */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
            <button 
              className="w-full px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700"
              onClick={() => setShowLegend(!showLegend)}
            >
              <div className="flex items-center">
                <MapIcon size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
                <span className="font-medium">Map Legend & Filters</span>
              </div>
              {showLegend ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            <AnimatePresence>
              {showLegend && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 py-3"
                >
                  <div className="mb-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <AlertTriangle size={16} className="mr-1 text-amber-600 dark:text-amber-400" />
                      Alert Severity
                    </h3>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-red-600 rounded-full mr-2"></span>
                        <span className="text-sm">Emergency (Immediate action required)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-orange-500 rounded-full mr-2"></span>
                        <span className="text-sm">Danger (High risk)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-amber-400 rounded-full mr-2"></span>
                        <span className="text-sm">Warning (Be prepared)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm">Safe (No immediate danger)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Home size={16} className="mr-1 text-blue-600 dark:text-blue-400" />
                      Resources
                    </h3>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center">
                        <span className="w-4 h-4 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mr-2">H</span>
                        <span className="text-sm">Hospital</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full mr-2">S</span>
                        <span className="text-sm">Shelter</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 flex items-center justify-center bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full mr-2">F</span>
                        <span className="text-sm">Food & Water</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <MapIcon size={16} className="mr-1 text-cyan-600 dark:text-cyan-400" />
                      Other Symbols
                    </h3>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center">
                        <span className="w-4 h-0.5 bg-red-500 mr-2"></span>
                        <span className="text-sm">Road Closure</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 border-2 border-blue-500 bg-blue-100 dark:bg-blue-900 bg-opacity-50 mr-2"></span>
                        <span className="text-sm">Flood Zone</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Zones Filter */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <Navigation size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
              Filter Areas
            </h3>
            <div className="space-y-2">
              {availableZones.map(zone => (
                <label key={zone} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedZones.includes(zone)}
                    onChange={() => toggleZone(zone)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                    {zone}
                    {activeAlerts.some(alert => alert.location === zone) && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {activeAlerts.filter(alert => alert.location === zone).length} alert(s)
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Map Layers */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <Layers size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
              Map Layers
            </h3>
            <div className="space-y-2">
              {availableLayers.map(layer => (
                <label key={layer.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLayers.includes(layer.id)}
                    onChange={() => toggleLayer(layer.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 flex items-center text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="mr-1">{layer.icon}</span>
                    {layer.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Active Alerts in Map */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <List size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
              Active Alerts on Map
            </h3>
            {activeAlerts.filter(alert => selectedZones.includes(alert.location)).length > 0 ? (
              <div className="space-y-3">
                {activeAlerts
                  .filter(alert => selectedZones.includes(alert.location))
                  .map(alert => (
                    <div 
                      key={alert.id} 
                      className={`
                        p-2 rounded border text-sm
                        ${alert.level === 'emergency' ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50' : ''}
                        ${alert.level === 'danger' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800/50' : ''}
                        ${alert.level === 'warning' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/50' : ''}
                        ${alert.level === 'safe' ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/50' : ''}
                      `}
                    >
                      <div className="flex items-start">
                        <AlertTriangle size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                            {alert.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                No alerts in selected areas
              </p>
            )}
          </div>
        </div>
        
        {/* Map Container */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
            {/* Map Placeholder - In a real app, this would be an actual map component */}
            <div className="relative h-[700px] bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <div className="text-center">
                <MapIcon size={48} className="mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Interactive map would be displayed here
                </p>
                <p className="text-neutral-500 dark:text-neutral-500 max-w-sm mx-auto mt-2 text-sm">
                  In a real implementation, this would use Leaflet or Google Maps with real-time data overlays
                </p>
              </div>
              
              {/* Map visualization placeholder */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Downtown flood zone */}
                {selectedZones.includes('Downtown') && selectedLayers.includes('flood') && (
                  <div className="absolute left-[40%] top-[45%] w-[20%] h-[15%] bg-blue-500 opacity-30 rounded-full"></div>
                )}
                
                {/* Riverside flood zone */}
                {selectedZones.includes('Riverside') && selectedLayers.includes('flood') && (
                  <div className="absolute left-[60%] top-[60%] w-[25%] h-[18%] bg-blue-500 opacity-30 rounded-full"></div>
                )}
                
                {/* Road closures */}
                {selectedLayers.includes('roads') && (
                  <>
                    <div className="absolute left-[30%] top-[50%] w-[15%] h-[2px] bg-red-500 rotate-45"></div>
                    <div className="absolute left-[50%] top-[40%] w-[20%] h-[2px] bg-red-500"></div>
                  </>
                )}
                
                {/* Alert markers */}
                {selectedLayers.includes('alerts') && activeAlerts.map((alert, index) => {
                  if (!selectedZones.includes(alert.location)) return null;
                  
                  // Different positions for different locations
                  let positionStyle = {};
                  switch(alert.location) {
                    case 'Downtown':
                      positionStyle = { left: '45%', top: '50%' };
                      break;
                    case 'Riverside':
                      positionStyle = { left: '65%', top: '65%' };
                      break;
                    case 'North County':
                      positionStyle = { left: '35%', top: '25%' };
                      break;
                    case 'East Side':
                      positionStyle = { left: '75%', top: '40%' };
                      break;
                    case 'West Hills':
                      positionStyle = { left: '20%', top: '60%' };
                      break;
                  }
                  
                  let bgColor = 'bg-green-500';
                  if (alert.level === 'emergency') bgColor = 'bg-red-600';
                  if (alert.level === 'danger') bgColor = 'bg-orange-500';
                  if (alert.level === 'warning') bgColor = 'bg-amber-400';
                  
                  return (
                    <div 
                      key={alert.id}
                      className={`absolute w-4 h-4 ${bgColor} rounded-full flex items-center justify-center animate-pulse`}
                      style={positionStyle}
                    >
                      <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${bgColor} opacity-75`}></span>
                      </span>
                    </div>
                  );
                })}
                
                {/* Resource markers */}
                {selectedLayers.includes('resources') && (
                  <>
                    <div className="absolute left-[40%] top-[30%] w-5 h-5 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                      H
                    </div>
                    <div className="absolute left-[60%] top-[40%] w-5 h-5 bg-white border-2 border-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                      F
                    </div>
                  </>
                )}
                
                {/* Shelter markers */}
                {selectedLayers.includes('shelters') && (
                  <>
                    <div className="absolute left-[50%] top-[60%] w-5 h-5 bg-white border-2 border-green-600 rounded-full flex items-center justify-center text-xs font-bold text-green-600">
                      S
                    </div>
                    <div className="absolute left-[30%] top-[70%] w-5 h-5 bg-white border-2 border-green-600 rounded-full flex items-center justify-center text-xs font-bold text-green-600">
                      S
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;