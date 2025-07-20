/**
 * Supabase Client Configuration
 * ByteSteps Digital Skills Platform
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xchslbxjtpldnbahhnop.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaHNsYnhqdHBsZG5iYWhobm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjQ5NDMsImV4cCI6MjA2ODYwMDk0M30.uIcxQOObHwp0T6hRyf8-C8q7dwbY6n1HCydmD-H6L_w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Lazy initialization to prevent memory leaks in preview
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: typeof window !== 'undefined' ? localStorage : undefined,
        persistSession: true,
        autoRefreshToken: false, // Disable auto-refresh to prevent memory leaks
      }
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();