import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance = null;

// Explicitly check for valid non-empty strings
const isConfigured = supabaseUrl && supabaseUrl.length > 0 && supabaseAnonKey && supabaseAnonKey.length > 0;

if (isConfigured) {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Supabase Client Initialized');
    } catch (e) {
        console.error('CRITICAL: Supabase Init Failed:', e);
    }
} else {
    // This logs to the browser console so the developer can see why it's not working
    console.error('🚨 Supabase Configuration Missing! Check Vercel Environment Variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
    console.log('Provided URL:', supabaseUrl);
    // Be careful not to log full secrets, just existence
    console.log('Provided Key:', supabaseAnonKey ? 'EXISTS (Hidden)' : 'MISSING');
}

// Fallback Dummy Client to prevent "SupabaseUrl is required" crash
// This allows the app to render, but functionality will show errors.
const dummyClient = {
    isDummy: true,
    from: (table) => {
        console.warn(`Attempted to access table '${table}' with missing Supabase config.`);
        return {
            select: () => Promise.resolve({ data: [], error: { message: 'YAPI HATASI: Supabase bağlantısı eksik. Lütfen Vercel ayarlarını kontrol edin.' } }),
            insert: () => Promise.resolve({ data: null, error: { message: 'Bağlantı Hatası' } }),
            update: () => Promise.resolve({ data: null, error: { message: 'Bağlantı Hatası' } }),
            delete: () => Promise.resolve({ data: null, error: { message: 'Bağlantı Hatası' } }),
            upsert: () => Promise.resolve({ data: null, error: { message: 'Bağlantı Hatası' } }),
        };
    },
    auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'No Connect' } }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signInWithPassword: () => Promise.resolve({ error: { message: 'Sistem Bağlantı Hatası: API Anahtarları Eksik' } }),
        signUp: () => Promise.resolve({ error: { message: 'Sistem Bağlantı Hatası: API Anahtarları Eksik' } }),
        signOut: () => Promise.resolve({})
    },
    channel: () => ({
        on: () => ({ subscribe: () => { } }),
        subscribe: () => { }
    }),
    removeChannel: () => { }
};

export const supabase = supabaseInstance || dummyClient;
