import React, { useRef, useEffect, useState } from 'react';
import { Zone } from '../hooks/useZones';
import { Loader2 } from 'lucide-react';

// Declare google as a global variable for TypeScript
declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

interface GoogleMapProps {
    selectedZones: string[];
    selectedLayers: string[];
    activeAlerts: any[];
    zoneToDistrictMap?: Record<string, string>;
    zones: Zone[];
    zonesLoading: boolean;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
    selectedZones, 
    selectedLayers, 
    activeAlerts, 
    zoneToDistrictMap = {},
    zones,
    zonesLoading
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [districtPolygons, setDistrictPolygons] = useState<any[]>([]);
    const [mapsLoaded, setMapsLoaded] = useState(!!window.google?.maps);
    const [isLoading, setIsLoading] = useState(true);

    // Centré sur Lyon
    const lyonCoordinates = { lat: 45.760, lng: 4.830 };

    useEffect(() => {
        // Ne chargez l'API que si elle n'est pas déjà disponible
        if (window.google?.maps) {
            setMapsLoaded(true);
            setIsLoading(false);
            return;
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        // Définir la fonction d'initialisation de la carte au niveau global
        window.initMap = () => {
            setMapsLoaded(true);
            setIsLoading(false);
        };

        // Charger le script Google Maps
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing,geometry&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            console.error('Erreur lors du chargement de Google Maps API');
            setIsLoading(false);
        };
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
            // Nettoyage de la fonction globale
            if (window.initMap) {
                // @ts-ignore
                delete window.initMap;
            }
        };
    }, []);

    // Initialiser la carte une fois l'API chargée
    useEffect(() => {
        if (!mapsLoaded || !mapRef.current || map) return;

        try {
            const mapOptions = {
                center: lyonCoordinates,
                zoom: 14,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
                zoomControl: true,
                restriction: {
                    latLngBounds: {
                        north: 45.7900,
                        south: 45.7300,
                        east: 4.8900,
                        west: 4.7950
                    },
                    strictBounds: true
                },
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                    }
                ]
            };

            const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
            setMap(newMap);
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la carte:', error);
        }
    }, [mapsLoaded, mapRef.current]);

    // Dessiner les polygones des quartiers une fois que les zones sont chargées et que la carte est initialisée
    useEffect(() => {
        if (!map || zones.length === 0 || zonesLoading) return;
        
        try {
            drawDistrictBoundaries(map);

            // Ajustement automatique de la vue pour qu'elle englobe tous les districts
            setTimeout(() => {
                try {
                    // Créer un bounds qui contient tous les districts
                    const bounds = new window.google.maps.LatLngBounds();

                    // Ajouter tous les points à notre bounds
                    zones.forEach(zone => {
                        if (Array.isArray(zone.boundary_coordinates)) {
                            zone.boundary_coordinates.forEach(coord => {
                                if (coord && typeof coord.lat === 'number' && typeof coord.lng === 'number') {
                                    bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
                                }
                            });
                        }
                    });

                    // Vérifier que le bounds a des coordonnées valides
                    if (bounds.isEmpty()) {
                        // Si bounds est vide, centrer sur Lyon
                        map.setCenter(lyonCoordinates);
                        map.setZoom(14);
                    } else {
                        // Ajuster la vue pour englober tous les districts
                        map.fitBounds(bounds);
                        // Ajouter un petit espace autour
                        map.setZoom(Math.max(13, map.getZoom() - 0.3));
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'ajustement de la vue:', error);
                    // Centrer sur Lyon en cas d'erreur
                    map.setCenter(lyonCoordinates);
                    map.setZoom(14);
                }
            }, 500);
        } catch (error) {
            console.error('Erreur lors du dessin des districts:', error);
        }
    }, [map, zones, zonesLoading]);

    // Draw district boundaries based on zones from DB
    const drawDistrictBoundaries = (map: any) => {
        // Clear any existing district polygons
        districtPolygons.forEach(polygon => {
            try {
                if (polygon && polygon.setMap) {
                    polygon.setMap(null);
                }
            } catch (error) {
                console.error('Erreur lors du nettoyage des polygones:', error);
            }
        });

        // Create polygons from zone data
        try {
            const polygons = zones.map(zone => {
                if (!Array.isArray(zone.boundary_coordinates) || zone.boundary_coordinates.length === 0) {
                    return [];
                }
                
                // Create the polygon for this district
                try {
                    const polygon = new window.google.maps.Polygon({
                        paths: zone.boundary_coordinates,
                        strokeColor: '#FFFFFF',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: zone.color || '#FF0000',
                        fillOpacity: 0.5,
                        map,
                        zIndex: 1
                    });

                    // Add district number label at the center
                    const bounds = new window.google.maps.LatLngBounds();
                    zone.boundary_coordinates.forEach(coord => {
                        if (coord && typeof coord.lat === 'number' && typeof coord.lng === 'number') {
                            bounds.extend(coord);
                        }
                    });
                    
                    if (!bounds.isEmpty()) {
                        const center = bounds.getCenter();
                        
                        const marker = new window.google.maps.Marker({
                            position: center,
                            map,
                            icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 0, // Hide the default marker
                                strokeWeight: 0
                            },
                            label: {
                                text: zone.number?.toString() || '',
                                color: '#000000', // Black text for better visibility on all colors
                                fontSize: '16px',
                                fontWeight: 'bold'
                            },
                            title: zone.name,
                            zIndex: 2
                        });

                        // Add click listener to show district info
                        polygon.addListener('click', () => {
                            const infoWindow = new window.google.maps.InfoWindow({
                                content: `<div style="padding: 10px;">
                                    <h3 style="margin: 0 0 5px;">District ${zone.number}: ${zone.name}</h3>
                                </div>`,
                                position: center
                            });
                            infoWindow.open(map);
                        });

                        return [polygon, marker];
                    }
                    
                    return [polygon];
                } catch (error) {
                    console.error('Erreur lors de la création d\'un polygone:', error, zone);
                    return [];
                }
            }).flat().filter(Boolean);

            setDistrictPolygons(polygons);
        } catch (error) {
            console.error('Erreur dans drawDistrictBoundaries:', error);
        }
    };

    // Update markers when selectedZones, selectedLayers, or activeAlerts change
    useEffect(() => {
        if (!map || !window.google) return;

        try {
            // Clear existing markers
            markers.forEach(marker => {
                try {
                    if (marker && marker.setMap) {
                        marker.setMap(null);
                    }
                } catch (error) {
                    console.error('Erreur lors du nettoyage des marqueurs:', error);
                }
            });
            setMarkers([]);

            const newMarkers: any[] = [];

            // Example: Add emergency resource markers
            if (selectedLayers.includes('resources')) {
                const hospitalLocations = [
                    { position: { lat: 45.7671, lng: 4.8548 }, type: 'H', title: 'Hôpital Édouard Herriot' },
                    { position: { lat: 45.7580, lng: 4.8660 }, type: 'H', title: 'Hôpital Lyon Sud' }
                ];

                const foodLocations = [
                    { position: { lat: 45.7599, lng: 4.8289 }, type: 'F', title: 'Centre de distribution alimentaire' },
                    { position: { lat: 45.7730, lng: 4.8250 }, type: 'F', title: 'Point de ravitaillement' }
                ];

                hospitalLocations.forEach(location => {
                    try {
                        const marker = new window.google.maps.Marker({
                            position: location.position,
                            map,
                            title: location.title,
                            icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: 'white',
                                fillOpacity: 1,
                                strokeColor: '#2563eb',
                                strokeWeight: 2
                            },
                            label: {
                                text: location.type,
                                color: '#2563eb',
                                fontSize: '10px',
                                fontWeight: 'bold'
                            }
                        });

                        newMarkers.push(marker);
                    } catch (error) {
                        console.error('Erreur lors de la création d\'un marqueur d\'hôpital:', error);
                    }
                });

                foodLocations.forEach(location => {
                    try {
                        const marker = new window.google.maps.Marker({
                            position: location.position,
                            map,
                            title: location.title,
                            icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: 'white',
                                fillOpacity: 1,
                                strokeColor: '#9333ea',
                                strokeWeight: 2
                            },
                            label: {
                                text: location.type,
                                color: '#9333ea',
                                fontSize: '10px',
                                fontWeight: 'bold'
                            }
                        });

                        newMarkers.push(marker);
                    } catch (error) {
                        console.error('Erreur lors de la création d\'un marqueur alimentaire:', error);
                    }
                });
            }

            // Add shelter markers
            if (selectedLayers.includes('shelters')) {
                const shelterLocations = [
                    { position: { lat: 45.7513, lng: 4.8409 }, title: 'Abri temporaire - Parc Blandan' },
                    { position: { lat: 45.7690, lng: 4.8370 }, title: 'Centre d\'hébergement - La Croix-Rousse' }
                ];

                shelterLocations.forEach(location => {
                    try {
                        const marker = new window.google.maps.Marker({
                            position: location.position,
                            map,
                            title: location.title,
                            icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: 'white',
                                fillOpacity: 1,
                                strokeColor: '#16a34a',
                                strokeWeight: 2
                            },
                            label: {
                                text: 'S',
                                color: '#16a34a',
                                fontSize: '10px',
                                fontWeight: 'bold'
                            }
                        });

                        newMarkers.push(marker);
                    } catch (error) {
                        console.error('Erreur lors de la création d\'un marqueur d\'abri:', error);
                    }
                });
            }

            // Add alert markers based on active alerts
            if (selectedLayers.includes('alerts') && zones.length > 0) {
                try {
                    // Create a mapping from district names to coordinates for alert placement
                    const districtToCoordinates: Record<string, { lat: number; lng: number }> = {};
                    
                    // Fill the mapping from the zones data
                    zones.forEach(zone => {
                        if (!Array.isArray(zone.boundary_coordinates) || zone.boundary_coordinates.length === 0) {
                            return;
                        }
                        
                        // Calculate the center of the district for marker placement
                        try {
                            const bounds = new window.google.maps.LatLngBounds();
                            let hasValidCoords = false;
                            
                            zone.boundary_coordinates.forEach(coord => {
                                if (coord && typeof coord.lat === 'number' && typeof coord.lng === 'number') {
                                    bounds.extend(coord);
                                    hasValidCoords = true;
                                }
                            });
                            
                            if (hasValidCoords) {
                                const center = bounds.getCenter();
                                
                                districtToCoordinates[zone.name] = { 
                                    lat: center.lat(), 
                                    lng: center.lng() 
                                };
                            }
                        } catch (error) {
                            console.error('Erreur lors du calcul du centre d\'un district:', error, zone);
                        }
                    });

                    // Filtrer les alertes par zones sélectionnées
                    const filteredAlerts = activeAlerts.filter(alert => {
                        const districtName = zoneToDistrictMap[alert.location] || alert.location;
                        return selectedZones.includes(districtName);
                    });
                    
                    // Grouper les alertes par district pour les répartir
                    const alertsByDistrict: Record<string, any[]> = {};
                    filteredAlerts.forEach(alert => {
                        const districtName = zoneToDistrictMap[alert.location] || alert.location;
                        if (!alertsByDistrict[districtName]) {
                            alertsByDistrict[districtName] = [];
                        }
                        alertsByDistrict[districtName].push(alert);
                    });
                    
                    // Pour chaque district, distribuer les points autour du centre
                    Object.entries(alertsByDistrict).forEach(([districtName, districtAlerts]) => {
                        // Obtenir les coordonnées de base pour ce district
                        const baseCoordinates = districtToCoordinates[districtName] || lyonCoordinates;
                        
                        // Calculer le nombre de points à distribuer
                        const numAlerts = districtAlerts.length;
                        
                        // Distribuer les points en cercle autour du centre si plus d'un point
                        districtAlerts.forEach((alert, index) => {
                            // Calculer de nouvelles coordonnées
                            let coordinates;
                            
                            if (numAlerts === 1) {
                                // Si un seul point, utiliser le centre
                                coordinates = baseCoordinates;
                            } else {
                                // Sinon, distribuer les points en cercle
                                const radius = 0.0015; // ~150 mètres sur la carte
                                const angle = (index / numAlerts) * Math.PI * 2;
                                coordinates = {
                                    lat: baseCoordinates.lat + Math.sin(angle) * radius,
                                    lng: baseCoordinates.lng + Math.cos(angle) * radius
                                };
                            }
                            
                            // Utiliser une couleur rouge pour toutes les alertes
                            const color = '#dc2626'; // red pour toutes les alertes

                            const alertMarker = new window.google.maps.Marker({
                                position: coordinates,
                                map,
                                title: alert.title,
                                icon: {
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    scale: 8,
                                    fillColor: color,
                                    fillOpacity: 0.8,
                                    strokeWeight: 0
                                },
                                zIndex: 100 // Make sure alerts appear above district polygons
                            });

                            // Add pulse animation to all alerts using a more robust approach
                            let animationId: number;
                            let isAnimating = true;
                            
                            const animationStep = () => {
                                if (!isAnimating) return;
                                
                                try {
                                    const scale = 8 + Math.sin(Date.now() / 300) * 2;
                                    alertMarker.setIcon({
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        scale,
                                        fillColor: color,
                                        fillOpacity: 0.8,
                                        strokeWeight: 0
                                    });
                                } catch (error) {
                                    console.error('Erreur dans l\'animation du marqueur:', error);
                                    isAnimating = false;
                                    return;
                                }
                                
                                animationId = requestAnimationFrame(animationStep);
                            };
                            
                            animationId = requestAnimationFrame(animationStep);

                            // Nettoyer l'animation quand le marqueur est supprimé
                            const originalSetMap = alertMarker.setMap;
                            alertMarker.setMap = function(map: any) {
                                if (map === null) {
                                    isAnimating = false;
                                    cancelAnimationFrame(animationId);
                                }
                                return originalSetMap.call(this, map);
                            };

                            // Modifier l'info window pour ne plus afficher le niveau d'alerte
                            const infoWindow = new window.google.maps.InfoWindow({
                                content: `
                                <div style="padding: 5px;">
                                    <strong>${alert.title}</strong><br/>
                                    <span style="color: ${color}; font-weight: bold;">
                                        Type: ${alert.disaster_type === 'flood' ? 'Inondation' : 'Tremblement de terre'}
                                    </span>
                                    <br/>
                                    <span>District: ${districtName}</span>
                                    ${alert.message ? `<p style="margin-top: 5px; margin-bottom: 0;">${alert.message}</p>` : ''}
                                </div>
                                `
                            });

                            alertMarker.addListener("click", () => {
                                infoWindow.open({
                                    anchor: alertMarker,
                                    map
                                });
                            });

                            newMarkers.push(alertMarker);
                        });
                    });
                } catch (error) {
                    console.error('Erreur dans le traitement des alertes:', error);
                }
            }

            setMarkers(newMarkers);
        } catch (error) {
            console.error('Erreur générale dans la mise à jour des marqueurs:', error);
        }
    }, [map, selectedZones, selectedLayers, activeAlerts, zones, mapsLoaded]);

    if (zonesLoading || isLoading) {
        return (
            <div style={{ width: '100%', height: '550px', borderRadius: '8px' }} className="flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <span className="mt-2">Chargement de la carte...</span>
                </div>
            </div>
        );
    }

    if (!mapsLoaded) {
        return (
            <>
                <div style={{ width: '100%', height: '550px', borderRadius: '8px' }} className="flex items-center justify-center bg-gray-100 dark:bg-neutral-800"></div>
                <div className="flex flex-col items-center text-center p-4">
                    <p className="text-red-500 mb-2">Impossible de charger Google Maps</p>
                    <p className="text-sm">Vérifiez votre clé API et votre connexion internet</p>
                </div>
            </>
        );
    }

    return <div ref={mapRef} style={{ width: '100%', height: '550px', borderRadius: '8px' }} />;
};

export default GoogleMap;