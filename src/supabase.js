import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hnydxtucqvmqdkfjhpym.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueWR4dHVjcXZtcWRrZmpocHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjQ0MzQsImV4cCI6MjA5MTQwMDQzNH0.vP1-5xOC3lP7hUKv2AZodQ4eMAUJiW6dEGRdN3GVYgk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
