import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // GODMODE EMAIL
    const OWNER_EMAIL = 'emrekaratasli@vantonline.com';

    useEffect(() => {
        let mounted = true;

        // 1. SAFETY TIMEOUT: Force load after 5 seconds
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn('⚠️ CRITICAL: Auth check timed out (5s). Forcing app to load.');
                setLoading(false);
            }
        }, 5000);

        const initAuth = async () => {
            try {
                // Fallback handling if supabase client is dummy or missing
                if (!supabase?.auth?.getSession) {
                    console.warn('Supabase client invalid. Skipping auth check.');
                    return;
                }

                // Get Session
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    // If session check fails (network?), just log and continue as guest
                    console.error('Session Check Error:', error);
                    return;
                }

                if (session) {
                    await fetchProfile(session.user);
                }
            } catch (err) {
                console.error('Auth Uncaught Error:', err);
            } finally {
                // ALWAYS finish loading
                if (mounted) {
                    clearTimeout(safetyTimeout);
                    setLoading(false);
                }
            }
        };

        // Run Init
        initAuth();

        // 2. Listen for auth changes
        let subscription;
        if (supabase?.auth?.onAuthStateChange) {
            const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    if (session) await fetchProfile(session.user);
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setLoading(false);
                }
            });
            subscription = data.subscription;
        }

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            if (subscription && subscription.unsubscribe) subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (authUser) => {
        try {
            // Fetch extra profile data from 'employees' table
            const { data: profile, error } = await supabase
                .from('employees')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            // GODMODE OVERRIDE
            const isOwner = authUser.email === OWNER_EMAIL;

            const userData = {
                id: authUser.id,
                email: authUser.email,
                // Fallback to Auth Metadata if Profile Table is empty/missing
                name: profile?.name || authUser.user_metadata?.full_name || 'Kullanıcı',
                role: isOwner ? 'owner' : (profile?.role || 'customer'),
                status: isOwner ? 'active' : (profile?.status || 'pending'),
                is_approved: isOwner ? true : (profile?.status === 'active')
            };

            setUser(userData);
        } catch (error) {
            console.error('Critical Profile Error:', error);
            // Fallback: If DB fails, still let user in as basic user
            setUser({
                id: authUser.id,
                email: authUser.email,
                name: authUser.email.split('@')[0],
                role: 'customer',
                status: 'pending'
            });
        }
        // fetchProfile is usually called inside initAuth or onAuthStateChange
        // We do NOT set loading(false) here because initAuth handles the main loading state via finally.
        // However, if called from onAuthStateChange, we might need to verify loading state logic.
        // But the 5s timeout + initAuth finally block covers the initial load.
    };

    const login = async (email, password) => {
        if (supabase.isDummy) {
            alert('SİSTEM HATASI: Supabase API anahtarları bulunamadı. Lütfen yönetici ile iletişime geçin.');
            return;
        }
        try {
            const cleanEmail = String(email).trim();
            const cleanPassword = String(password).trim();

            const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Login Error:', error);
            alert('Giriş Başarısız: ' + (error.message || error.error_description || 'Bilinmeyen hata'));
            throw error;
        }
    };

    const register = async (email, password, fullName) => {
        if (supabase.isDummy) {
            alert('SİSTEM HATASI: Kayıt işlemi için API anahtarları eksik. Lütfen yönetici ile iletişime geçin.');
            return;
        }
        try {
            let cleanEmail = email;
            if (typeof email === 'object' && email !== null && email.email) {
                cleanEmail = email.email;
            }
            cleanEmail = String(cleanEmail).trim();
            const cleanPassword = String(password).trim();

            const { data, error } = await supabase.auth.signUp({
                email: cleanEmail,
                password: cleanPassword,
                options: {
                    data: { full_name: fullName }
                }
            });

            if (error) throw error;

            console.log('Register Success:', data);

            if (email.endsWith('@vantonline.com') && data.user) {
                const { error: insertError } = await supabase.from('employees').insert([{
                    id: data.user.id,
                    email: email,
                    name: fullName,
                    role: 'worker',
                    status: 'pending'
                }]);
                if (insertError) console.error('Employee Insert Error:', insertError);
            }

            return data;
        } catch (error) {
            console.error('Register Error:', error);
            alert('Kayıt Başarısız: ' + (error.message || error.error_description || 'Beklenmeyen sunucu hatası'));
            throw error;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const LoadingScreen = () => (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#000',
            color: '#d4af37',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '50%',
                borderTopColor: '#d4af37',
                animation: 'spin 1s ease-in-out infinite'
            }}></div>
            <p style={{ fontFamily: 'sans-serif', letterSpacing: '2px' }}>VANT LOADING</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {loading ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
};
