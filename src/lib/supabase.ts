import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

// Create a single instance of the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'regionalexpo'
    }
  }
})

// Test the connection
const testConnection = async () => {
  try {
    await supabase.from('attendees').select('count').limit(1);
    console.log('Supabase connection test successful');
  } catch (error: unknown) {
    console.error('Supabase connection test failed:', error);
  }
};

testConnection();

export default supabase 