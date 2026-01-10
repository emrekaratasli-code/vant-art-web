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
        // 1. Check active session
        const getSession = async () => {
            // Fallback handling if supabase client is dummy
            if (supabase?.auth?.getSession) {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (session) {
                    await fetchProfile(session.user);
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        getSession();

        // 2. Listen for auth changes
        let subscription;
        if (supabase?.auth?.onAuthStateChange) {
            const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
                if (session) {
                    await fetchProfile(session.user);
                } else {
                    setUser(null);
                    setLoading(false);
                }
            });
            subscription = data.subscription;
        }

        return () => {
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

            if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found (expected for new users)
                console.error('Error fetching profile:', error);
            }

            // GODMODE OVERRIDE
            const isOwner = authUser.email === OWNER_EMAIL;

            const userData = {
                id: authUser.id,
                email: authUser.email,
                name: profile?.name || authUser.user_metadata?.full_name || 'Kullanıcı',
                role: isOwner ? 'owner' : (profile?.role || 'customer'),
                status: isOwner ? 'active' : (profile?.status || 'pending'),
                is_approved: isOwner ? true : (profile?.status === 'active')
            };

            setUser(userData);
        } catch (error) {
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            return data;
        } catch (error) {
            alert('Giriş Hatası: ' + error.message);
            throw error;
        }
    };

    const register = async (email, password, fullName) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName }
                }
            });

            if (error) throw error;

            // If signup successful, trying to create employee record if domain matches
            if (email.endsWith('@vantonline.com')) {
                // We rely on a trigger or manual insertion. 
                // For simplicity in this client-side demo, we insert if user id exists
                if (data.user) {
                    await supabase.from('employees').insert([{
                        id: data.user.id,
                        email: email,
                        name: fullName,
                        role: 'worker',
                        status: 'pending' // Default pending
                    }]);
                }
            }

            return data;
        } catch (error) {
            alert('Kayıt Hatası: ' + error.message);
            throw error;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
