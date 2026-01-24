import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

// WebView-safe hook: Returns fallback if context not available
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        console.warn('⚠️ AuthContext not available, using fallback');
        return {
            user: null,
            loading: false,
            isAuthenticated: false,
            login: async () => { },
            register: async () => { },
            logout: async () => { },
            resetPassword: async () => { },
            updatePassword: async () => { }
        };
    }

    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const OWNER_EMAIL = 'emrekaratasli@vantonline.com';
    const ADMIN_WHITELIST = ['mustafacap@vantonline.com', 'emrekaratasli@vantonline.com'];

    useEffect(() => {
        let mounted = true;
        // ... (existing useEffect content) ...
        // Fetch Profile
        const fetchProfile = async (authUser) => {
            console.log('👤 Fetching Profile...');
            try {
                const { data: profile, error } = await supabase
                    .from('employees')
                    .select('id, first_name, last_name, status, is_approved')
                    .eq('id', authUser.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.warn('⚠️ Profile Fetch Warning:', error.message);
                }

                // PERMISSION LOGIC:
                const isWhitelisted = ADMIN_WHITELIST.includes(authUser.email);

                // Allow access if Whitelisted OR if database says is_approved = true
                const isApproved = isWhitelisted || (profile?.is_approved === true);

                const userData = {
                    id: authUser.id,
                    email: authUser.email,
                    name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : (authUser.user_metadata?.full_name || 'Kullanıcı'),
                    status: isWhitelisted ? 'active' : (isApproved ? 'active' : 'pending'),
                    is_approved: isApproved,
                    isAdmin: isApproved
                };

                setUser(prev => ({ ...prev, ...userData }));
            } catch (error) {
                console.error('❌ Profile Fetch Failed:', error);
            }
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

        const register = async (email, password, fullName, phone) => {
            // ... (existing register logic) ...
            // Re-paste existing register logic or keep it if I can use replace context better.
            // Actually, since I am replacing a large block, I should carry over register logic.
            // To be safe I will just insert the new functions after `register` and before `logout`.
        };

        // 1. EMERGENCY BRAKE: Force stop loading after 2 seconds no matter what
        const safetyTimeout = setTimeout(() => {
            if (mounted && loading) {
                console.error('🛑 AUTH TIMEOUT (2s): Forcing loading to false. Potential connection hang.');
                setLoading(false);
            }
        }, 2000);

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
                    return;
                }

                if (session) {
                    console.log('✅ Session Found for:', session.user.email);
                    // IMMEDIATE ACCESS: Set user with basic info and stop loading.
                    // Profile will load in background.
                    // 1. Set basic user
                    const basicUser = {
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.full_name || 'Kullanıcı',
                        status: 'active'
                    };
                    setUser(basicUser);

                    // 2. AWAIT Profile Fetch so we have admin rights BEFORE app renders
                    console.log('⏳ Awaiting Profile Load for Persistence...');
                    await fetchProfile(session.user);

                    // 3. NOW release loading
                    setLoading(false);
                } else {
                    console.log('ℹ️ No Session (Guest)');
                    setLoading(false); // Guest is ready immediately
                }

            } catch (err) {
                console.error('💥 CRITICAL AUTH ERROR:', err);
            } finally {
                if (mounted) {
                    console.log('🏁 InitAuth FINALLY block reached. Setting loading=false');
                    setLoading(false);
                    clearTimeout(safetyTimeout);
                }
            }
        };

        initAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`🔔 Auth State Change: ${event}`);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session) {
                    const basicUser = {
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.full_name || 'Kullanıcı',
                        role: 'customer',
                        status: 'active'
                    };
                    // Update user immediately for responsiveness
                    // Update user immediately for responsiveness but keep loading if needed? 
                    // Actually for auth change we might not want to block UI, but for correctness we should.
                    setUser(prev => ({ ...basicUser, ...prev }));

                    await fetchProfile(session.user);
                    setLoading(false);
                }
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
            // EXPLICIT SELECT: Do NOT select '*' to avoid issues if schema drifts.
            // DEFINITELY do not select 'role'.
            const { data: profile, error } = await supabase
                .from('employees')
                .select('id, first_name, last_name, is_approved')
                .eq('id', authUser.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.warn('⚠️ Profile Fetch Warning:', error.message);
                // alert(`Profil Verisi Alınamadı: ${error.message}\n(Tablo: employees)`);
            }

            // PERMISSION LOGIC:
            const isWhitelisted = ADMIN_WHITELIST.includes(authUser.email);

            // Allow access if Whitelisted OR if database says is_approved = true
            const isApproved = isWhitelisted || (profile?.is_approved === true);

            if (!profile) {
                console.log('ℹ️ User has no profile in employees table.');
            }

            const userData = {
                id: authUser.id,
                email: authUser.email,
                name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : (authUser.user_metadata?.full_name || 'Kullanıcı'),
                status: isWhitelisted ? 'active' : (isApproved ? 'active' : 'pending'),
                is_approved: isApproved,
                isAdmin: isApproved // Virtual property for easy checking in UI
            };

            console.log('✅ Profile Loaded:', userData.email, '| Approved:', isApproved);
            // MERGE with existing user state
            setUser(prev => ({ ...prev, ...userData }));
        } catch (error) {
            console.error('❌ Profile Fetch Failed:', error);
            alert('Profil yüklenirken hata oluştu: ' + error.message);
        }
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

    const register = async (email, password, fullName, phone) => {
        if (supabase.isDummy) { alert('SİSTEM HATASI: API Anahtarları Eksik'); return; }
        try {
            let cleanEmail = email;
            if (typeof email === 'object' && email?.email) cleanEmail = email.email;
            cleanEmail = String(cleanEmail).trim();

            const { data, error } = await supabase.auth.signUp({
                email: cleanEmail,
                password,
                options: { data: { full_name: fullName, phone: phone } }
            });
            if (error) throw error;

            // Auto-create employee entry
            if (cleanEmail.endsWith('@vantonline.com') && data.user) {
                const nameParts = fullName.split(' ');
                const lastName = nameParts.length > 1 ? nameParts.pop() : '';
                const firstName = nameParts.join(' ');

                await supabase.from('employees').insert([{
                    id: data.user.id,
                    email: cleanEmail,
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone
                    // status: 'pending' (Removed due to schema change)
                }]);
            }
            return data;
        } catch (error) {
            alert('Kayıt Başarısız: ' + error.message);
            throw error;
        }
    };

    const resetPassword = async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
        } catch (error) {
            alert('Sıfırlama E-postası Gönderilemedi: ' + error.message);
            throw error;
        }
    };

    const updatePassword = async (newPassword) => {
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
        } catch (error) {
            alert('Şifre Güncellenemedi: ' + error.message);
            throw error;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        localStorage.clear(); // Clear all local data as requested
        sessionStorage.clear();
        setUser(null);
        window.location.href = '/login'; // Force redirect
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
        <AuthContext.Provider value={{ user, login, register, logout, resetPassword, updatePassword, loading, isAuthenticated: !!user }}>
            {loading ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
};
