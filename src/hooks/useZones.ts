import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface Zone {
    id: number;
    created_at: string;
    name: string;
    number: number;
    boundary_coordinates: { lat: number, lng: number }[];
    color: string;
}

export const useZones = () => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
                const supabase = createClient(supabaseUrl, supabaseKey);

                setLoading(true);

                const { data, error } = await supabase
                    .from('zones')
                    .select('*')
                    .order('number', { ascending: true });

                if (error) {
                    throw new Error(error.message);
                }

                if (data) {
                    // Parse the JSON coordinates if they're stored as strings
                    const parsedZones = data.map(zone => ({
                        ...zone,
                        boundary_coordinates: Array.isArray(zone.boundary_coordinates)
                            ? zone.boundary_coordinates
                            : JSON.parse(zone.boundary_coordinates)
                    }));

                    setZones(parsedZones);
                }
            } catch (err: any) {
                setError(err instanceof Error ? err : new Error('Une erreur inconnue est survenue'));
                console.error('Error fetching zones:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchZones();

        // Rafraîchissement périodique des données
        const intervalId = setInterval(fetchZones, 60000); // Rafraîchir toutes les minutes
        return () => clearInterval(intervalId);
    }, []);

    return { zones, loading, error };
};