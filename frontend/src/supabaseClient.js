import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lawzwstbftiawplrweyk.supabase.co';
const supabaseAnonKey = 'sb_publishable_yBu6L8XUJYTg9VFWP2a6hA_dRiWoR6V';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);