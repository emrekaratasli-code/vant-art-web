import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
        console.error('Supabase Init Failed:', e);
    }
} else {
    console.warn('⚠️ Supabase URL or Anon Key is missing! Check .env file or Vercel Environment Variables.');
}

// Fallback dummy object to prevent crash like "cannot read property 'from' of null"
// if initialization fails.
const dummyClient = {
    from: () => ({
        select: () => Promise.resolve({ data: [], error: 'Supabase keys missing' }),
        insert: () => Promise.resolve({ data: null, error: 'Supabase keys missing' }),
        update: () => Promise.resolve({ data: null, error: 'Supabase keys missing' }),
        delete: () => Promise.resolve({ data: null, error: 'Supabase keys missing' }),
        on: () => ({ subscribe: () => { } })
    }),
    auth: {
        getUser: () => Promise.resolve({ data: { user: null } }),
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signInWithPassword: () => Promise.resolve({ error: { message: 'No Supabase connection' } }),
        signOut: () => Promise.resolve({})
    },
    channel: () => ({
        on: () => ({ subscribe: () => { } })
    }),
    removeChannel: () => { }
};

export const supabase = supabaseInstance || dummyClient;
