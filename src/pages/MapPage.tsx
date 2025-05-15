import React, { useState } from 'react';
import { 
  Map as MapIcon, Layers, AlertTriangle, Info, Home, 
  Navigation, List, ChevronDown, ChevronUp, Loader2, Waves, Mountain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleMap from '../components/GoogleMap';
import { useDisasters } from '../hooks/useDisasters';
import { useZones } from '../hooks/useZones';

const MapPage: React.FC = () => {
  // Utilisation du hook pour récupérer les catastrophes
  const { disasters, loading: disastersLoading, error: disastersError } = useDisasters();
  // Utilisation du hook pour récupérer les zones
  const { zones, loading: zonesLoading, error: zonesError } = useZones();
  
  const [showLegend, setShowLegend] = useState(true);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(['alerts', 'flood', 'roads']);
  const [selectedDisasterTypes, setSelectedDisasterTypes] = useState<string[]>(['flood', 'earthquake']);
  
  // Sélectionner les trois premiers districts par défaut quand ils sont chargés
  React.useEffect(() => {
    if (zones.length > 0 && selectedDistricts.length === 0) {
      const initialDistricts = zones.slice(0, 3).map(zone => zone.name);
      setSelectedDistricts(initialDistricts);
    }
  }, [zones]);
  
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

  const toggleDisasterType = (type: string) => {
    if (selectedDisasterTypes.includes(type)) {
      setSelectedDisasterTypes(selectedDisasterTypes.filter(t => t !== type));
    } else {
      setSelectedDisasterTypes([...selectedDisasterTypes, type]);
    }
  };
  
  // Filtrer les catastrophes en fonction des types sélectionnés
  const filteredDisasters = disasters.filter(disaster => 
    selectedDisasterTypes.includes(disaster.disaster_type)
  );
  
  // Correspondance entre les anciennes zones et les noms de quartiers pour compatibilité
  const zoneToDistrictMap: Record<string, string> = {
    'Downtown': "Presqu'île",
    'Riverside': 'Confluence',
    'North County': 'Croix-Rousse',
    'East Side': 'Part-Dieu',
    'West Hills': 'Vieux Lyon / Fourvière'
  };
  
  // Couches de carte disponibles
  const availableLayers = [
    { id: 'alerts', name: 'Alertes actives', icon: <AlertTriangle size={16} /> },
    { id: 'resources', name: 'Ressources d\'urgence', icon: <Info size={16} /> },
    { id: 'shelters', name: 'Abris', icon: <Home size={16} /> },
  ];

  // Types de catastrophes disponibles
  const disasterTypes = [
    { id: 'flood', name: 'Inondations', icon: <Waves size={16} /> },
    { id: 'earthquake', name: 'Tremblements de terre', icon: <Mountain size={16} /> },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Carte des risques</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Carte interactive montrant les zones affectées et les informations de sécurité
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contrôles et filtres de carte */}
        <div className="md:col-span-1 space-y-4">
          {/* Filtre de zones */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
            <button 
              className="w-full px-4 py-3 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700"
              onClick={() => setShowLegend(!showLegend)}
            >
              <div className="flex items-center">
                <MapIcon size={18} className="mr-2 text-primary-600 dark:text-primary-400" />
                <span className="font-medium">Légende & Filtres</span>
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
                      <AlertTriangle size={16} className="mr-1 text-red-600 dark:text-red-400" />
                      Alertes de catastrophes
                    </h3>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center">
                        <span className="w-4 h-4 bg-red-600 rounded-full mr-2"></span>
                        <span className="text-sm">Zone de catastrophe active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Home size={16} className="mr-1 text-blue-600 dark:text-blue-400" />
                      Ressources
                    </h3>
                    <div className="space-y-2 pl-6">
                      <div className="flex items-center">
                        <span className="w-4 h-4 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full mr-2">H</span>
                        <span className="text-sm">Hôpital</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full mr-2">S</span>
                        <span className="text-sm">Abri</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 flex items-center justify-center bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full mr-2">F</span>
                        <span className="text-sm">Nourriture & Eau</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Filtre de type de catastrophes */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <AlertTriangle size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
              Types de catastrophes
            </h3>
            <div className="space-y-2">
              {disasterTypes.map(type => (
                <label key={type.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDisasterTypes.includes(type.id)}
                    onChange={() => toggleDisasterType(type.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 flex items-center text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="mr-1">{type.icon}</span>
                    {type.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Filtre des quartiers */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <Navigation size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
              Quartiers de Lyon
            </h3>
            
            {zonesLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                <span className="ml-2 text-sm">Chargement des quartiers...</span>
              </div>
            ) : zonesError ? (
              <p className="text-red-500 text-sm">Erreur de chargement des quartiers: {zonesError.message}</p>
            ) : (
              <div className="space-y-2">
                {zones.map(zone => (
                  <label key={zone.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDistricts.includes(zone.name)}
                      onChange={() => toggleDistrict(zone.name)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-2 flex items-center">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-1.5"
                        style={{ backgroundColor: zone.color }}
                      ></span>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {zone.name}
                      </span>
                      {filteredDisasters.some(disaster => 
                        (zoneToDistrictMap[disaster.location] === zone.name || disaster.location === zone.name)
                      ) && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          {filteredDisasters.filter(disaster => 
                            zoneToDistrictMap[disaster.location] === zone.name || 
                            disaster.location === zone.name
                          ).length} alerte(s)
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {/* Couches de carte */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <Layers size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
              Couches de carte
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
          
          {/* Alertes actives sur la carte */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <List size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
              Alertes actives sur la carte
            </h3>
            
            {disastersLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                <span className="ml-2 text-sm">Chargement des catastrophes...</span>
              </div>
            ) : disastersError ? (
              <p className="text-red-500 text-sm">Erreur de chargement: {disastersError.message}</p>
            ) : filteredDisasters.filter(disaster => 
              selectedDistricts.includes(zoneToDistrictMap[disaster.location] || disaster.location)
            ).length > 0 ? (
              <div className="space-y-3">
                {filteredDisasters
                  .filter(disaster => 
                    selectedDistricts.includes(zoneToDistrictMap[disaster.location] || disaster.location)
                  )
                  .map(disaster => (
                    <div 
                      key={disaster.id} 
                      className="p-2 rounded border text-sm bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50"
                    >
                      <div className="flex items-start">
                        <AlertTriangle size={14} className="mr-1 mt-0.5 flex-shrink-0 text-red-600" />
                        <div>
                          <p className="font-medium">{disaster.title || disaster.name}</p>
                          <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                            {disaster.disaster_type === 'flood' ? 'Inondation' : 'Tremblement de terre'} - 
                            {zoneToDistrictMap[disaster.location] || disaster.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Aucune alerte dans les quartiers sélectionnés ou pour les types choisis
              </p>
            )}
          </div>
        </div>
        
        {/* Conteneur de carte */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
            <GoogleMap 
              selectedZones={selectedDistricts}
              selectedLayers={selectedLayers}
              activeAlerts={filteredDisasters}
              zoneToDistrictMap={zoneToDistrictMap}
              zones={zones}
              zonesLoading={zonesLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;