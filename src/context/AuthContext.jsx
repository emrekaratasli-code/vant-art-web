import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const OWNER_EMAIL = 'emrekaratasli@vantonline.com';

    useEffect(() => {
        let mounted = true;
        console.log('🚀 Auth Provider Mounted. Starting Init...');

        // 1. EMERGENCY BRAKE: Force stop loading after 5 seconds no matter what
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.error('🛑 AUTH TIMEOUT (5s): Forcing loading to false. Potential connection hang.');
                setLoading(false);
            }
        }, 5000);

        const initAuth = async () => {
            console.log('🔄 InitAuth started...');
            try {
                // Check if Supabase client is valid
                if (!supabase || !supabase.auth) {
                    console.warn('⚠️ Supabase client seems invalid (dummy?). Skipping auth.');
                    return;
                }

                // Get Session
                console.log('📡 Fetching Session...');
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('❌ Session Error:', error.message);
                    // Network error or configuration error
                    return;
                }

                if (session) {
                    console.log('✅ Session Found for:', session.user.email);
                    await fetchProfile(session.user);
                } else {
                    console.log('ℹ️ No Session (Guest)');
                }

            } catch (err) {
                console.error('💥 CRITICAL AUTH ERROR:', err);
            } finally {
                if (mounted) {
                    console.log('🏁 InitAuth FINALLY block reached. Setting loading=false');
                    setLoading(false);
                    clearTimeout(safetyTimeout); // Clear the safety timer if we finished normally
                }
            }
        };

        initAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`🔔 Auth State Change: ${event}`);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session) await fetchProfile(session.user);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (authUser) => {
        console.log('👤 Fetching Profile...');
        try {
            const { data: profile, error } = await supabase
                .from('employees')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.warn('⚠️ Profile Fetch Warning:', error.message);
                alert(`Profil Verisi Alınamadı: ${error.message}\n(Tablo: employees)`);
            }

            // RELAXED CHECK: If user is not in employees table, treat as CUSTOMER.
            const isOwner = authUser.email === OWNER_EMAIL;

            if (!profile) {
                console.log('ℹ️ User has no profile in employees table. Defaulting to Customer.');
            }

            const userData = {
                id: authUser.id,
                email: authUser.email,
                name: profile?.name || authUser.user_metadata?.full_name || 'Kullanıcı',
                role: isOwner ? 'owner' : (profile?.role || 'customer'),
                status: isOwner ? 'active' : (profile?.status || 'active'),
                is_approved: true
            };

            console.log('✅ Profile Loaded (or Defaulted):', userData.email);
            setUser(userData);
        } catch (error) {
            console.error('❌ Profile Fetch Failed:', error);
            alert('Kritik Hata: ' + error.message);
            // Even if everything fails, try to let them use the app as guest?
            // For now, let's just stop loading so they aren't stuck.
        } finally {
            setLoading(false);
        }
    };
};

const login = async (email, password) => {
    if (supabase.isDummy) { alert('SİSTEM HATASI: API Anahtarları Eksik'); return; }
    try {
        const cleanEmail = String(email).trim();
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (error) throw error;
        return data;
    } catch (error) {
        alert('Giriş Başarısız: ' + error.message);
        throw error;
    }
};

const register = async (email, password, fullName) => {
    if (supabase.isDummy) { alert('SİSTEM HATASI: API Anahtarları Eksik'); return; }
    try {
        let cleanEmail = email;
        if (typeof email === 'object' && email?.email) cleanEmail = email.email;
        cleanEmail = String(cleanEmail).trim();

        const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: { data: { full_name: fullName } }
        });
        if (error) throw error;

        // Auto-create employee entry
        if (cleanEmail.endsWith('@vantonline.com') && data.user) {
            await supabase.from('employees').insert([{
                id: data.user.id, email: cleanEmail, name: fullName, role: 'worker', status: 'pending'
            }]);
        }
        return data;
    } catch (error) {
        alert('Kayıt Başarısız: ' + error.message);
        throw error;
    }
};

const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
};

const LoadingScreen = () => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#d4af37' }}>
        <div className="spinner" style={{
            width: 40, height: 40, border: '3px solid rgba(212,175,55,0.3)',
            borderTopColor: '#d4af37', borderRadius: '50%', animation: 'spin 1s infinite'
        }}></div>
        <p style={{ marginTop: 20, letterSpacing: 2 }}>VANT LOADING...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
);

return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
        {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
);
};
