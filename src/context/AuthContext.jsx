import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    // Fetch user details from KeyStone
                    const response = await authClient.get('/users/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    logout();
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);
            const response = await authClient.post('/auth/login', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const { access_token, refresh_token } = response.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            setToken(access_token);
            setIsAuthenticated(true);

            // Allow caller to handle redirect or success
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const signup = async (email, password, fullName) => {
        try {
            await authClient.post('/auth/signup', { email, password, full_name: fullName });
            return true;
        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
