import { createContext, useContext, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000/blogging'

interface Profile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  is_staff: boolean;
  is_admin: boolean;
  blog_count: number;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// API utility functions
const apiCall = async (endpoint: string, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'API request failed');
  }

  return data;
};

const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/api/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  localStorage.setItem('access_token', data.access);
  return data.access;
};

// Auto-retry API calls with token refresh
const apiCallWithRefresh = async (endpoint : string, options = {}) => {
  try {
    return await apiCall(endpoint, options);
  } catch (error) {
    // If token expired, try to refresh and retry
    if (error.message.includes('401') || error.message.includes('token')) {
      try {
        await refreshToken();
        return await apiCall(endpoint, options);
      } catch (refreshError) {
        // If refresh fails, clear tokens and throw error
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw refreshError;
      }
    }
    throw error;
  }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const checkAuth = async () => {
        const token = localStorage.getItem('access_token');
        
        if (token) {
            try {
            // Fetch user profile to verify token is still valid
            const userData = await apiCall('/user/profile/'); // Adjust endpoint as needed
            setUser(userData);
            setProfile(userData);
            } catch (error) {
            // Token might be expired, try to refresh
            try {
                await refreshToken();
                const userData = await apiCall('/user/profile/');
                setUser(userData);
                setProfile(userData);
            } catch (refreshError) {
                // Both access and refresh tokens are invalid
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setUser(null);
                setProfile(null);
            }
            }
        }
        
        setLoading(false);
        };

        checkAuth();
    }, []);

    const signUp = async (email: string, password: string, username: string) => {
        try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email,
            password,
            username,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.detail || 
            data.username?.[0] || 
            data.email?.[0] || 
            data.password?.[0] || 
            'Registration failed';
            
            toast.error(errorMessage);
            return { error: new Error(errorMessage) };
        }

        toast.success("Account created successfully!");

        return { data, error: null };
        } catch (error) {
        toast.error(errorMessage);
        return { error };
        }
    };

    const signIn = async (username, password) => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/token/`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            username,
            password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.detail || 'Invalid credentials';
            toast.error(errorMessage);
            return { error: new Error(errorMessage) };
        }

        // Store tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // Fetch user profile
        try {
            const userData = await apiCall('/user/profile/'); // Adjust endpoint as needed
            setUser(userData);
            setProfile(userData);
        } catch (profileError) {
            console.warn('Could not fetch user profile:', profileError);
            // Set minimal user data from token response if profile fetch fails
            setUser({ username });
        }

        toast.success("Welcome back! You have successfully signed in.");

        return { data, error: null };
        } catch (error) {
        toast.error(errorMessage);
        return { error };
        }
    };

    const signOut = async () => {
        try {
        // Optional: Call logout endpoint if you have one
        // await apiCall('/logout/', { method: 'POST' });

        // Clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Clear state
        setUser(null);
        setProfile(null);

        toast.success("You have been successfully Signed Out.");

        return { error: null };
        } catch (error) {
        // Even if API call fails, still clear local state
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        setProfile(null);

        toast.success("You have been signed out.");

        return { error: null };
        }
    };

    // Utility function to check if user is authenticated
    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('access_token');
    };

    // Utility function for making authenticated API calls
    const authenticatedApiCall = async (endpoint, options = {}) => {
        if (!isAuthenticated()) {
        throw new Error('User not authenticated');
        }
        return apiCallWithRefresh(endpoint, options);
    };

    const value = {
        user,
        session: user ? { user } : null, // For compatibility with existing code
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated,
        authenticatedApiCall,
        isAdmin: profile?.is_admin || profile?.is_staff || false,
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
