import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('vant_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('vant_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('vant_user');
        }
    }, [user]);

    const login = (email, password) => {
        // Mock login - accept any valid email for demo, or check against stored 'users'
        // For this demo, we'll simulate a successful login for any email
        if (!email.includes('@')) throw new Error('Geçersiz e-posta adresi');

        const newUser = {
            id: Date.now(),
            email,
            name: email.split('@')[0],
            role: email.includes('admin') ? 'admin' : 'customer'
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
