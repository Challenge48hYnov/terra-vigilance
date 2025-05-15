import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
export interface Disaster {
  id: number;
  name: string;
  disaster_type: 'flood' | 'earthquake';
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
  level: 'emergency'; 
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
              level: 'emergency' as 'emergency',
              location: disaster.zones?.name || 'Inconnu',
              title: disaster.name || `${disaster.disaster_type === 'flood' ? 'Inondation' : 'Tremblement de terre'}`,
              message: disaster.description || 
                      `${disaster.disaster_type === 'flood' ? 'Zone inondée' : 'Zone affectée par un séisme'}`
            };
          });

          setDisasters(formattedDisasters);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Une erreur inconnue est survenue'));
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();

    // Rafraîchissement périodique des données
    const intervalId = setInterval(fetchDisasters, 60000); // Rafraîchir toutes les minutes
    
    return () => clearInterval(intervalId);
  }, []);

  return { disasters, loading, error };
}