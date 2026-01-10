import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('vant_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('vant_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('vant_user');
        }
    }, [user]);

    const login = (email, password) => {
        // Mock login
        if (!email.includes('@')) throw new Error('Geçersiz e-posta adresi');

        let role = 'customer';
        let name = email.split('@')[0];

        // GODMODE CHECK
        if (email === 'emrekaratasli@vantonline.com') {
            role = 'owner';
            name = 'Emre Karataşlı';
        }
        // Admin/Worker Domain Check
        else if (email.endsWith('@vantonline.com')) {
            // Default to 'worker' but pending approval in real app context. 
            // For this mock auth, we'll assign 'worker' role but the AdminPanel will check status.
            role = 'worker';
        }

        const newUser = {
            id: Date.now(),
            email,
            name: name,
            role: role
        };
        setUser(newUser);
        return newUser;
    };

    const register = (data) => {
        const newUser = {
            id: Date.now(),
            email: data.email,
            name: data.name,
            role: 'customer'
        };
        setUser(newUser);
        return newUser;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
