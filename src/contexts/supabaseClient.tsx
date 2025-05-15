import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rddshqhfmrhwrvyqdfcu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkZHNocWhmbXJod3J2eXFkZmN1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI5NzMxMiwiZXhwIjoyMDYyODczMzEyfQ.fO6UdErqFc_0loSFOTuvwNignDn8cc3LQDAz0ofawWU'; // à remplacer

export const supabase = createClient(supabaseUrl, supabaseAnonKey);