import { createClient } from '@supabase/supabase-js'

// For demo purposes, we'll use a mock authentication system
// In production, you would use real Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

// Create a mock client for demo purposes
const mockAuth = {
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    // Demo credentials for testing
    const validCredentials = [
      { email: 'admin@amplified.in', password: 'admin123' },
      { email: 'tutor@amplified.in', password: 'tutor123' },
      { email: 'student@amplified.in', password: 'student123' }
    ]
    
    const isValid = validCredentials.some(cred => cred.email === email && cred.password === password)
    
    if (isValid) {
      const mockUser = {
        id: `user-${Date.now()}`,
        email,
        created_at: new Date().toISOString()
      }
      return { 
        data: { user: mockUser, session: { user: mockUser } }, 
        error: null 
      }
    } else {
      return { 
        data: null, 
        error: { message: 'Invalid login credentials' } 
      }
    }
  },
  
  signUp: async ({ email, password }: { email: string; password: string }) => {
    // For demo, just return success
    return { 
      data: { user: { email }, session: null }, 
      error: null 
    }
  },
  
  signOut: async () => {
    return { error: null }
  },
  
  getSession: async () => {
    return { data: { session: null }, error: null }
  },
  
  onAuthStateChange: (callback: Function) => {
    return { data: { subscription: { unsubscribe: () => {} } } }
  }
}

export const supabase = {
  auth: mockAuth
}