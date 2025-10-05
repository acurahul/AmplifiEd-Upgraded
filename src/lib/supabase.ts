// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

// Read the variables the Next.js way
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// A safety check to make sure you've set up your environment variables correctly.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in your .env.local file");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)