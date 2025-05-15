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
}

const GoogleMap: React.FC<GoogleMapProps> = ({ selectedZones, selectedLayers, activeAlerts }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  
  const lyonCoordinates = { lat: 45.764043, lng: 4.835659 }; // Lyon, France coordinates
  
  useEffect(() => {
    // Load Google Maps script
    const initMap = () => {
      if (mapRef.current && !map) {
        const mapOptions = {
          center: lyonCoordinates,
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          restriction: {
            latLngBounds: {
              north: 45.8082, // North of Lyon
              south: 45.7077, // South of Lyon
              east: 4.9023,   // East of Lyon
              west: 4.7695    // West of Lyon
            },
            strictBounds: true
          },
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            }
          ]
        };
        
        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBhtMVuPCeEo_HG2TDjWsR6-1AoUsOvpzE&libraries=places`;
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
      // Map zones to Lyon neighborhoods
      const zoneToCoordinates: Record<string, { lat: number; lng: number }> = {
        'Downtown': { lat: 45.7620, lng: 4.8350 },
        'Riverside': { lat: 45.7550, lng: 4.8280 },
        'North County': { lat: 45.7760, lng: 4.8420 },
        'East Side': { lat: 45.7590, lng: 4.8750 },
        'West Hills': { lat: 45.7680, lng: 4.8080 }
      };
      
      activeAlerts
        .filter(alert => selectedZones.includes(alert.location))
        .forEach(alert => {
          const coordinates = zoneToCoordinates[alert.location] || lyonCoordinates;
          
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
            }
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
            content: `<div><strong>${alert.title}</strong><br/>${alert.location}</div>`
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
  
  return <div ref={mapRef} style={{ width: '100%', height: '700px' }} />;
};

export default GoogleMap;