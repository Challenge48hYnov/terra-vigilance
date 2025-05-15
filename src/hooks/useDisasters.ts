import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Définissez les types pour vos données avec uniquement flood et earthquake
export interface Disaster {
  id: number;
  name: string;
  disaster_type: 'flood' | 'earthquake'; // Restreint uniquement à ces deux types
  description: string;
  start_date: string;
  end_date: string | null;
  main_location: {
    district?: string;
    coordinates?: {
      lat: number;
      lng: number;
    }
  };
  is_prediction: boolean;
  zone_id: number;
  // Propriétés supplémentaires pour compatibilité avec l'interface d'alerte existante
  level: 'emergency' | 'danger' | 'warning' | 'safe';
  location: string;
  title: string;
  message: string;
}

export function useDisasters() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Récupérer les catastrophes où end_date est null (catastrophes en cours)
        // Et uniquement de type 'flood' ou 'earthquake'
        const { data, error } = await supabase
          .from('disasters')
          .select(`
            *,
            zones (name)
          `)
          .is('end_date', null)
          .in('disaster_type', ['flood', 'earthquake']);

        if (error) throw error;

        if (data) {
          // Transformer les données pour correspondre au format attendu par le composant GoogleMap
          const formattedDisasters = data.map(disaster => {
            // Toujours utiliser le niveau d'urgence pour tous les types de catastrophes
            const level: 'emergency' | 'danger' | 'warning' | 'safe' = 'emergency';

            return {
              id: disaster.id,
              name: disaster.name,
              disaster_type: disaster.disaster_type as 'flood' | 'earthquake',
              description: disaster.description,
              start_date: disaster.start_date,
              end_date: disaster.end_date,
              main_location: disaster.main_location,
              is_prediction: disaster.is_prediction,
              zone_id: disaster.zone_id,
              // Propriétés pour compatibilité avec le système d'alerte
              level, // Toujours emergency
              location: disaster.zones?.name || 'Unknown',
              title: disaster.name || `${disaster.disaster_type === 'flood' ? 'Inondation' : 'Tremblement de terre'}`,
              message: disaster.description || 
                      `${disaster.disaster_type === 'flood' ? 'Zone inondée' : 'Zone affectée par un séisme'}`
            };
          });

          setDisasters(formattedDisasters);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();

    // Optionnel : configurer une mise à jour périodique
    const intervalId = setInterval(fetchDisasters, 60000); // Rafraîchir toutes les minutes
    
    return () => clearInterval(intervalId);
  }, []);

  return { disasters, loading, error };
}