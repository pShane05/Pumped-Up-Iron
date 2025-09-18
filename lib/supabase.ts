import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

const supabaseUrl = "https://jaiojceqsruebaockwpb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphaW9qY2Vxc3J1ZWJhb2Nrd3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MjQxNDYsImV4cCI6MjA2NjUwMDE0Nn0.yG5xU7W9WvpxrCOCw7iVGq597YeM1wUCxHQlJ9KIM3Y"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
})



// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})



export async function getDailyQuests() {
  try {
    // Get user's timezone automatically
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Get current session to include auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    // Call your Edge Function
    const { data, error } = await supabase.functions.invoke('daily-quests', {
      body: { 
        timezone: userTimezone 
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('Error calling daily-quests function:', error);
      throw error;
    }

    return data; // Returns { quests: [...], generated_date: "2024-XX-XX", is_new: boolean }
    
  } catch (error) {
    console.error('Failed to get daily quests:', error);
    throw error;
  }
}