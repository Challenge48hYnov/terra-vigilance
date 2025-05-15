import React, { useState } from 'react';
import { 
  Map as MapIcon, Layers, AlertTriangle, Info, Home, 
  Navigation, List, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useAlertContext } from '../contexts/AlertContext';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleMap from '../components/GoogleMap'; // Import the new component

// Lyon districts data for filtering
const lyonDistricts = [
  { id: 1, name: "Presqu'île", color: "#4ADE80" },
  { id: 2, name: "Confluence", color: "#86EFAC" },
  { id: 3, name: "Part-Dieu", color: "#38BDF8" },
  { id: 4, name: "Croix-Rousse", color: "#4ADE80" },
  { id: 5, name: "Vieux Lyon / Fourvière", color: "#FB923C" },
  { id: 6, name: "Brotteaux", color: "#0EA5E9" },
  { id: 7, name: "Guillotière", color: "#7DD3FC" },
  { id: 8, name: "Monplaisir", color: "#BAE6FD" },
  { id: 9, name: "Vaise", color: "#FDBA74" }
];

const MapPage: React.FC = () => {
  const { activeAlerts } = useAlertContext();
  const [showLegend, setShowLegend] = useState(true);
  // Update state to use Lyon district names instead of generic zones
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([
    "Presqu'île", "Confluence", "Part-Dieu"
  ]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['alerts', 'flood', 'roads']);
  
  // Update toggle function to work with districts
  const toggleDistrict = (district: string) => {
    if (selectedDistricts.includes(district)) {
      setSelectedDistricts(selectedDistricts.filter(d => d !== district));
    } else {
      setSelectedDistricts([...selectedDistricts, district]);
    }
  };
  
  const toggleLayer = (layer: string) => {
    if (selectedLayers.includes(layer)) {
      setSelectedLayers(selectedLayers.filter(l => l !== layer));
    } else {
      setSelectedLayers([...selectedLayers, layer]);
    }
  };
  
  // Map legacy zone names to district names for alerts compatibility
  const zoneToDistrictMap: Record<string, string> = {
    'Downtown': "Presqu'île",
    'Riverside': 'Confluence',
    'North County': 'Croix-Rousse',
    'East Side': 'Part-Dieu',
    'West Hills': 'Vieux Lyon / Fourvière'
  };
  
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
          
          {/* Districts Filter - Updated from Zones Filter */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <Navigation size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
              Lyon Districts
            </h3>
            <div className="space-y-2">
              {lyonDistricts.map(district => (
                <label key={district.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDistricts.includes(district.name)}
                    onChange={() => toggleDistrict(district.name)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="ml-2 flex items-center">
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-1.5"
                      style={{ backgroundColor: district.color }}
                    ></span>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      {district.name}
                    </span>
                    {activeAlerts.some(alert => zoneToDistrictMap[alert.location] === district.name) && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {activeAlerts.filter(alert => zoneToDistrictMap[alert.location] === district.name).length} alert(s)
                      </span>
                    )}
                  </div>
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
          
          {/* Active Alerts in Map - Updated to use district mapping */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <List size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
              Active Alerts on Map
            </h3>
            {activeAlerts.filter(alert => 
              selectedDistricts.includes(zoneToDistrictMap[alert.location])
            ).length > 0 ? (
              <div className="space-y-3">
                {activeAlerts
                  .filter(alert => selectedDistricts.includes(zoneToDistrictMap[alert.location]))
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
                            {zoneToDistrictMap[alert.location] || alert.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                No alerts in selected districts
              </p>
            )}
          </div>
        </div>
        
        {/* Map Container */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
            {/* Update the GoogleMap to use selectedDistricts instead of selectedZones */}
            <GoogleMap 
              selectedZones={selectedDistricts}
              selectedLayers={selectedLayers}
              activeAlerts={activeAlerts}
              zoneToDistrictMap={zoneToDistrictMap} // Add this prop
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;