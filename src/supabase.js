import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hnydxtucqvmqdkfjhpym.supabase.co'
const SUPABASE_ANON_KEY = 'TUA_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
