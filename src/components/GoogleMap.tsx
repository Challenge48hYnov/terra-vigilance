import React, { useRef, useEffect, useState } from 'react';

// Declare google as a global variable for TypeScript
declare global {
  interface Window {
    google: typeof google;
  }
  var google: any;
}

interface GoogleMapProps {
  selectedZones: string[];
  selectedLayers: string[];
  activeAlerts: any[];
  zoneToDistrictMap?: Record<string, string>; // Add this prop
}

const GoogleMap: React.FC<GoogleMapProps> = ({ selectedZones, selectedLayers, activeAlerts }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [districtPolygons, setDistrictPolygons] = useState<any[]>([]);
  
  // Centré plus précisément sur Lyon
  const lyonCoordinates = { lat: 45.760, lng: 4.830 };
  
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // Load Google Maps script
    const initMap = () => {
      if (mapRef.current && !map) {
        const mapOptions = {
          center: lyonCoordinates,
          zoom: 14, // Zoom augmenté pour voir les districts plus clairement
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          // Restrictions réduites pour ne montrer que les districts et un peu autour
          restriction: {
            latLngBounds: {
              north: 45.7900, // Limite nord réduite
              south: 45.7300, // Limite sud augmentée
              east: 4.8900,   // Limite est réduite
              west: 4.7950    // Limite ouest augmentée
            },
            strictBounds: true
          },
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }] // Désactive les points d'intérêt pour réduire l'encombrement
            }
          ]
        };
        
        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);
        
        // Draw district boundaries once map is loaded
        drawDistrictBoundaries(newMap);
        
        // Ajustement automatique de la vue pour qu'elle englobe tous les districts
        setTimeout(() => {
          // Créer un bounds qui contient tous les districts
          const bounds = new google.maps.LatLngBounds();
          
          // Définir les districts
          const districts = getAllDistrictCoordinates();
          
          // Ajouter tous les points à notre bounds
          districts.forEach(district => {
            district.coordinates.forEach(coord => {
              bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
            });
          });
          
          // Ajuster la vue pour englober tous les districts
          newMap.fitBounds(bounds);
          
          // Ajouter un petit espace autour
          newMap.setZoom(newMap.getZoom() - 0.3);
        }, 500);
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      initMap();
    }
  }, []);
  
  // Fonction pour obtenir tous les coordonnées de tous les districts (ajouter en haut du fichier)
  const getAllDistrictCoordinates = () => {
    return [
      {
        name: 'Presqu\'île',
        coordinates: [
          { lat: 45.7650, lng: 4.8310 },
          { lat: 45.7680, lng: 4.8360 },
          { lat: 45.7650, lng: 4.8380 },
          { lat: 45.7620, lng: 4.8350 },
          { lat: 45.7610, lng: 4.8330 },
          { lat: 45.7630, lng: 4.8300 },
        ]
      },
      {
        name: 'Confluence',
        coordinates: [
          { lat: 45.7600, lng: 4.8290 },
          { lat: 45.7610, lng: 4.8330 },
          { lat: 45.7590, lng: 4.8350 },
          { lat: 45.7560, lng: 4.8340 },
          { lat: 45.7530, lng: 4.8310 },
          { lat: 45.7540, lng: 4.8260 },
          { lat: 45.7570, lng: 4.8270 },
        ]
      },
      {
        name: 'Part-Dieu',
        coordinates: [
          { lat: 45.7660, lng: 4.8380 },
          { lat: 45.7680, lng: 4.8430 },
          { lat: 45.7700, lng: 4.8500 },
          { lat: 45.7680, lng: 4.8550 },
          { lat: 45.7660, lng: 4.8600 },
          { lat: 45.7620, lng: 4.8650 },
          { lat: 45.7580, lng: 4.8700 },
          { lat: 45.7550, lng: 4.8650 },
          { lat: 45.7560, lng: 4.8580 },
          { lat: 45.7580, lng: 4.8520 },
          { lat: 45.7590, lng: 4.8450 },
          { lat: 45.7640, lng: 4.8400 },
        ]
      },
      {
        name: 'Croix-Rousse',
        coordinates: [
          { lat: 45.7730, lng: 4.8250 },
          { lat: 45.7780, lng: 4.8300 },
          { lat: 45.7790, lng: 4.8370 },
          { lat: 45.7750, lng: 4.8400 },
          { lat: 45.7700, lng: 4.8380 },
          { lat: 45.7680, lng: 4.8360 },
          { lat: 45.7650, lng: 4.8320 },
          { lat: 45.7670, lng: 4.8280 },
          { lat: 45.7700, lng: 4.8260 },
        ]
      },
      {
        name: 'Vieux Lyon / Fourvière',
        coordinates: [
          { lat: 45.7630, lng: 4.8290 },
          { lat: 45.7600, lng: 4.8280 },
          { lat: 45.7570, lng: 4.8270 },
          { lat: 45.7540, lng: 4.8200 },
          { lat: 45.7520, lng: 4.8150 },
          { lat: 45.7550, lng: 4.8100 },
          { lat: 45.7600, lng: 4.8080 },
          { lat: 45.7650, lng: 4.8100 },
          { lat: 45.7680, lng: 4.8150 },
          { lat: 45.7690, lng: 4.8200 },
          { lat: 45.7670, lng: 4.8250 },
          { lat: 45.7650, lng: 4.8280 },
        ]
      },
      {
        name: 'Brotteaux',
        coordinates: [
          { lat: 45.7700, lng: 4.8380 },
          { lat: 45.7740, lng: 4.8400 },
          { lat: 45.7780, lng: 4.8450 },
          { lat: 45.7760, lng: 4.8500 },
          { lat: 45.7720, lng: 4.8520 },
          { lat: 45.7680, lng: 4.8480 },
          { lat: 45.7650, lng: 4.8430 },
          { lat: 45.7680, lng: 4.8400 },
        ]
      },
      {
        name: 'Guillotière',
        coordinates: [
          { lat: 45.7590, lng: 4.8350 },
          { lat: 45.7640, lng: 4.8400 },
          { lat: 45.7590, lng: 4.8450 },
          { lat: 45.7550, lng: 4.8580 },
          { lat: 45.7500, lng: 4.8500 },
          { lat: 45.7480, lng: 4.8400 },
          { lat: 45.7510, lng: 4.8330 },
          { lat: 45.7530, lng: 4.8310 },
          { lat: 45.7560, lng: 4.8340 },
        ]
      },
      {
        name: 'Monplaisir',
        coordinates: [
          { lat: 45.7550, lng: 4.8580 },
          { lat: 45.7580, lng: 4.8650 },
          { lat: 45.7600, lng: 4.8750 },
          { lat: 45.7550, lng: 4.8850 },
          { lat: 45.7480, lng: 4.8800 },
          { lat: 45.7450, lng: 4.8650 },
          { lat: 45.7480, lng: 4.8580 },
          { lat: 45.7500, lng: 4.8500 },
        ]
      },
      {
        name: 'Vaise',
        coordinates: [
          { lat: 45.7680, lng: 4.8150 },
          { lat: 45.7700, lng: 4.8100 },
          { lat: 45.7750, lng: 4.8080 },
          { lat: 45.7800, lng: 4.8150 },
          { lat: 45.7820, lng: 4.8200 },
          { lat: 45.7780, lng: 4.8300 },
          { lat: 45.7740, lng: 4.8250 },
          { lat: 45.7700, lng: 4.8260 },
          { lat: 45.7670, lng: 4.8250 },
          { lat: 45.7690, lng: 4.8200 },
        ]
      },
    ];
  };
  
  // Draw district boundaries based on the image
  const drawDistrictBoundaries = (map: any) => {
    // Clear any existing district polygons
    districtPolygons.forEach(polygon => polygon.setMap(null));
    
    // Define district polygons based on the image
    const districts = [
      // District 1 (Green - Presqu'île)
      {
        name: 'Presqu\'île',
        id: 1,
        color: '#4ADE80', // Green
        textColor: '#166534',
        coordinates: [
          { lat: 45.7650, lng: 4.8310 },
          { lat: 45.7680, lng: 4.8360 },
          { lat: 45.7650, lng: 4.8380 },
          { lat: 45.7620, lng: 4.8350 },
          { lat: 45.7610, lng: 4.8330 },
          { lat: 45.7630, lng: 4.8300 },
        ]
      },
      
      // District 2 (Green - Confluence)
      {
        name: 'Confluence',
        id: 2,
        color: '#86EFAC', // Light Green
        textColor: '#166534',
        coordinates: [
          { lat: 45.7600, lng: 4.8290 },
          { lat: 45.7610, lng: 4.8330 },
          { lat: 45.7590, lng: 4.8350 },
          { lat: 45.7560, lng: 4.8340 },
          { lat: 45.7530, lng: 4.8310 },
          { lat: 45.7540, lng: 4.8260 },
          { lat: 45.7570, lng: 4.8270 },
        ]
      },
      
      // District 3 (Blue - Part-Dieu)
      {
        name: 'Part-Dieu',
        id: 3,
        color: '#38BDF8', // Blue
        textColor: '#0369A1',
        coordinates: [
          { lat: 45.7660, lng: 4.8380 },
          { lat: 45.7680, lng: 4.8430 },
          { lat: 45.7700, lng: 4.8500 },
          { lat: 45.7680, lng: 4.8550 },
          { lat: 45.7660, lng: 4.8600 },
          { lat: 45.7620, lng: 4.8650 },
          { lat: 45.7580, lng: 4.8700 },
          { lat: 45.7550, lng: 4.8650 },
          { lat: 45.7560, lng: 4.8580 },
          { lat: 45.7580, lng: 4.8520 },
          { lat: 45.7590, lng: 4.8450 },
          { lat: 45.7640, lng: 4.8400 },
        ]
      },
      
      // District 4 (Green - Croix-Rousse)
      {
        name: 'Croix-Rousse',
        id: 4,
        color: '#4ADE80', // Green
        textColor: '#166534',
        coordinates: [
          { lat: 45.7730, lng: 4.8250 },
          { lat: 45.7780, lng: 4.8300 },
          { lat: 45.7790, lng: 4.8370 },
          { lat: 45.7750, lng: 4.8400 },
          { lat: 45.7700, lng: 4.8380 },
          { lat: 45.7680, lng: 4.8360 },
          { lat: 45.7650, lng: 4.8320 },
          { lat: 45.7670, lng: 4.8280 },
          { lat: 45.7700, lng: 4.8260 },
        ]
      },
      
      // District 5 (Orange - Old Lyon / Fourvière)
      {
        name: 'Vieux Lyon / Fourvière',
        id: 5,
        color: '#FB923C', // Orange
        textColor: '#9A3412',
        coordinates: [
          { lat: 45.7630, lng: 4.8290 },
          { lat: 45.7600, lng: 4.8280 },
          { lat: 45.7570, lng: 4.8270 },
          { lat: 45.7540, lng: 4.8200 },
          { lat: 45.7520, lng: 4.8150 },
          { lat: 45.7550, lng: 4.8100 },
          { lat: 45.7600, lng: 4.8080 },
          { lat: 45.7650, lng: 4.8100 },
          { lat: 45.7680, lng: 4.8150 },
          { lat: 45.7690, lng: 4.8200 },
          { lat: 45.7670, lng: 4.8250 },
          { lat: 45.7650, lng: 4.8280 },
        ]
      },
      
      // District 6 (Blue - Brotteaux)
      {
        name: 'Brotteaux',
        id: 6,
        color: '#0EA5E9', // Blue
        textColor: '#0369A1',
        coordinates: [
          { lat: 45.7700, lng: 4.8380 },
          { lat: 45.7740, lng: 4.8400 },
          { lat: 45.7780, lng: 4.8450 },
          { lat: 45.7760, lng: 4.8500 },
          { lat: 45.7720, lng: 4.8520 },
          { lat: 45.7680, lng: 4.8480 },
          { lat: 45.7650, lng: 4.8430 },
          { lat: 45.7680, lng: 4.8400 },
        ]
      },
      
      // District 7 (Blue - Guillotière)
      {
        name: 'Guillotière',
        id: 7,
        color: '#7DD3FC', // Light Blue
        textColor: '#0369A1',
        coordinates: [
          { lat: 45.7590, lng: 4.8350 },
          { lat: 45.7640, lng: 4.8400 },
          { lat: 45.7590, lng: 4.8450 },
          { lat: 45.7550, lng: 4.8580 },
          { lat: 45.7500, lng: 4.8500 },
          { lat: 45.7480, lng: 4.8400 },
          { lat: 45.7510, lng: 4.8330 },
          { lat: 45.7530, lng: 4.8310 },
          { lat: 45.7560, lng: 4.8340 },
        ]
      },
      
      // District 8 (Blue - Monplaisir)
      {
        name: 'Monplaisir',
        id: 8,
        color: '#BAE6FD', // Very Light Blue
        textColor: '#0369A1',
        coordinates: [
          { lat: 45.7550, lng: 4.8580 },
          { lat: 45.7580, lng: 4.8650 },
          { lat: 45.7600, lng: 4.8750 },
          { lat: 45.7550, lng: 4.8850 },
          { lat: 45.7480, lng: 4.8800 },
          { lat: 45.7450, lng: 4.8650 },
          { lat: 45.7480, lng: 4.8580 },
          { lat: 45.7500, lng: 4.8500 },
        ]
      },
      
      // District 9 (Orange - Vaise)
      {
        name: 'Vaise',
        id: 9,
        color: '#FDBA74', // Light Orange
        textColor: '#9A3412',
        coordinates: [
          { lat: 45.7680, lng: 4.8150 },
          { lat: 45.7700, lng: 4.8100 },
          { lat: 45.7750, lng: 4.8080 },
          { lat: 45.7800, lng: 4.8150 },
          { lat: 45.7820, lng: 4.8200 },
          { lat: 45.7780, lng: 4.8300 },
          { lat: 45.7740, lng: 4.8250 },
          { lat: 45.7700, lng: 4.8260 },
          { lat: 45.7670, lng: 4.8250 },
          { lat: 45.7690, lng: 4.8200 },
        ]
      },
    ];
    
    const polygons = districts.map(district => {
      // Create the polygon for this district
      const polygon = new google.maps.Polygon({
        paths: district.coordinates,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: district.color,
        fillOpacity: 0.5,
        map,
        zIndex: 1
      });
      
      // Add district number label at the center
      const bounds = new google.maps.LatLngBounds();
      district.coordinates.forEach(coord => bounds.extend(coord));
      const center = bounds.getCenter();
      
      const marker = new google.maps.Marker({
        position: center,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0, // Hide the default marker
          strokeWeight: 0
        },
        label: {
          text: district.id.toString(),
          color: district.textColor,
          fontSize: '16px',
          fontWeight: 'bold'
        },
        title: district.name,
        zIndex: 2
      });
      
      // Add click listener to show district info
      polygon.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="padding: 10px;">
            <h3 style="margin: 0 0 5px;">District ${district.id}: ${district.name}</h3>
          </div>`,
          position: center
        });
        infoWindow.open(map);
      });
      
      return [polygon, marker];
    }).flat();
    
    setDistrictPolygons(polygons);
  };

  // Update markers when selectedZones, selectedLayers, or activeAlerts change
  useEffect(() => {
    if (!map) return;
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
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
        const marker = new google.maps.Marker({
          position: location.position,
          map,
          title: location.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
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
      });
      
      foodLocations.forEach(location => {
        const marker = new google.maps.Marker({
          position: location.position,
          map,
          title: location.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
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
      });
    }
    
    // Add shelter markers
    if (selectedLayers.includes('shelters')) {
      const shelterLocations = [
        { position: { lat: 45.7513, lng: 4.8409 }, title: 'Abri temporaire - Parc Blandan' },
        { position: { lat: 45.7690, lng: 4.8370 }, title: 'Centre d\'hébergement - La Croix-Rousse' }
      ];
      
      shelterLocations.forEach(location => {
        const marker = new google.maps.Marker({
          position: location.position,
          map,
          title: location.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
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
      });
    }
    
    // Add flood zones
    if (selectedLayers.includes('flood')) {
      // Downtown flood zone (near Rhône river)
      if (selectedZones.includes('Downtown')) {
        const floodCircle = new google.maps.Circle({
          strokeColor: '#3b82f6',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#3b82f6',
          fillOpacity: 0.25,
          map,
          center: { lat: 45.7570, lng: 4.8450 },
          radius: 400
        });
        
        // Store circle in markers array for cleanup
        newMarkers.push(floodCircle as any);
      }
      
      // Riverside flood zone (along Saône river)
      if (selectedZones.includes('Riverside')) {
        const floodCircle = new google.maps.Circle({
          strokeColor: '#3b82f6',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#3b82f6',
          fillOpacity: 0.25,
          map,
          center: { lat: 45.7640, lng: 4.8280 },
          radius: 350
        });
        
        newMarkers.push(floodCircle as any);
      }
    }
    
    // Add road closures
    if (selectedLayers.includes('roads')) {
      const roadClosures = [
        [
          { lat: 45.7600, lng: 4.8360 },
          { lat: 45.7640, lng: 4.8420 }
        ],
        [
          { lat: 45.7730, lng: 4.8320 },
          { lat: 45.7780, lng: 4.8320 }
        ]
      ];
      
      roadClosures.forEach(path => {
        const roadLine = new google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#ef4444',
          strokeOpacity: 1.0,
          strokeWeight: 4,
          map
        });
        
        newMarkers.push(roadLine as any);
      });
    }
    
    // Add alert markers based on active alerts
    if (selectedLayers.includes('alerts')) {
      // Create a mapping from district names to coordinates for alert placement
      const districtToCoordinates: Record<string, { lat: number; lng: number }> = {
        "Presqu'île": { lat: 45.7630, lng: 4.8320 },
        "Confluence": { lat: 45.7570, lng: 4.8280 },
        "Part-Dieu": { lat: 45.7660, lng: 4.8520 },
        "Croix-Rousse": { lat: 45.7730, lng: 4.8350 },
        "Vieux Lyon / Fourvière": { lat: 45.7610, lng: 4.8180 },
        "Brotteaux": { lat: 45.7700, lng: 4.8450 },
        "Guillotière": { lat: 45.7540, lng: 4.8420 },
        "Monplaisir": { lat: 45.7520, lng: 4.8650 },
        "Vaise": { lat: 45.7730, lng: 4.8180 }
      };
      
      // Legacy zone mapping (keeping for compatibility with existing alerts)
      const zoneToDistrictMap: Record<string, string> = {
        'Downtown': "Presqu'île",
        'Riverside': 'Confluence',
        'North County': 'Croix-Rousse',
        'East Side': 'Part-Dieu',
        'West Hills': 'Vieux Lyon / Fourvière'
      };
      
      activeAlerts
        .filter(alert => {
          const districtName = zoneToDistrictMap[alert.location] || alert.location;
          return selectedZones.includes(districtName);
        })
        .forEach(alert => {
          // Map the alert location to district name
          const districtName = zoneToDistrictMap[alert.location] || alert.location;
          
          // Get coordinates for this district
          const coordinates = districtToCoordinates[districtName] || lyonCoordinates;
          
          // Set color based on alert level
          let color = '#22c55e'; // safe - green
          if (alert.level === 'emergency') color = '#dc2626'; // red
          if (alert.level === 'danger') color = '#ea580c'; // orange
          if (alert.level === 'warning') color = '#f59e0b'; // amber
          
          const alertMarker = new google.maps.Marker({
            position: coordinates,
            map,
            title: alert.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: color,
              fillOpacity: 0.8,
              strokeWeight: 0
            },
            zIndex: 100 // Make sure alerts appear above district polygons
          });
          
          // Add pulse animation to emergency alerts
          if (alert.level === 'emergency' || alert.level === 'danger') {
            const animationStep = () => {
              const scale = 8 + Math.sin(Date.now() / 300) * 2;
              alertMarker.setIcon({
                path: google.maps.SymbolPath.CIRCLE,
                scale,
                fillColor: color,
                fillOpacity: 0.8,
                strokeWeight: 0
              });
              requestAnimationFrame(animationStep);
            };
            requestAnimationFrame(animationStep);
          }
          
          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${alert.title}</strong><br/>${districtName}</div>`
          });
          
          alertMarker.addListener("click", () => {
            infoWindow.open({
              anchor: alertMarker,
              map
            });
          });
          
          newMarkers.push(alertMarker);
        });
    }
    
    setMarkers(newMarkers);
  }, [map, selectedZones, selectedLayers, activeAlerts]);
  
  return <div ref={mapRef} style={{ width: '100%', height: '550px', borderRadius: '8px' }} />; // Hauteur légèrement réduite
};

export default GoogleMap;