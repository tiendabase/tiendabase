import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const key = process.env.SUPABASE_KEY;
export const supabase = createClient('https://icccsxtaifdnegocgvpe.supabase.co', key!,)