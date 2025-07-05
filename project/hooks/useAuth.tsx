import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';

// Storage interface for cross-platform support
interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  deleteItem(key: string): Promise<void>;
}

// Web storage implementation
const webStorage: Storage = {
  getItem: async (key: string) => localStorage.getItem(key),
  setItem: async (key: string, value: string) => localStorage.setItem(key, value),
  deleteItem: async (key: string) => localStorage.removeItem(key),
};

// Native storage implementation
let nativeStorage: Storage | null = null;
if (Platform.OS !== 'web') {
  try {
    const SecureStore = require('expo-secure-store');
    nativeStorage = {
      getItem: SecureStore.getItemAsync,
      setItem: SecureStore.setItemAsync,
      deleteItem: SecureStore.deleteItemAsync,
    };
  } catch (error) {
    console.warn('SecureStore not available, falling back to web storage');
    nativeStorage = webStorage;
  }
}

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// API configuration
const getApiBaseUrl = () => {
  // Always use localhost for development
  return 'http://localhost:5000/api';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const storage = Platform.OS === 'web' ? webStorage : (nativeStorage || webStorage);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await storage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const API_BASE_URL = getApiBaseUrl();
      console.log('🔄 Checking stored auth token...');
      
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.log('❌ Stored token invalid, removing...');
        await storage.deleteItem('auth_token');
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.status === 'success' && data.data?.user) {
        console.log('✅ User authenticated from stored token');
        setUser(data.data.user);
      } else {
        await storage.deleteItem('auth_token');
        setUser(null);
      }
    } catch (err) {
      console.error('❌ Error loading stored auth:', err);
      try {
        await storage.deleteItem('auth_token');
      } catch (deleteError) {
        console.error('Error deleting token:', deleteError);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please provide both email and password');
        return false;
      }

      const API_BASE_URL = getApiBaseUrl();
      console.log('🔐 Attempting login to:', `${API_BASE_URL}/auth/login`);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          password: password.trim()
        }),
      });

      console.log('📡 Login response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Login error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: 'Server error' };
        }

        if (response.status === 401) {
          Alert.alert(
            'Login Failed',
            errorData.message || 'Invalid email or password'
          );
        } else if (response.status >= 500) {
          Alert.alert('Server Error', 'Please try again later');
        } else {
          Alert.alert('Error', errorData.message || 'Login failed');
        }
        return false;
      }

      const data = await response.json();
      console.log('✅ Login successful');

      if (data.status === 'success' && data.data?.token && data.data?.user) {
        await storage.setItem('auth_token', data.data.token);
        setUser(data.data.user);
        return true;
      }

      Alert.alert('Error', 'Login failed. Please try again.');
      return false;
    } catch (err) {
      console.error('❌ Login error:', err);
      Alert.alert(
        'Network Error', 
        'Could not connect to the server. Please make sure the backend is running and try again.'
      );
      return false;
    }
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      if (!data.email || !data.password || !data.name) {
        Alert.alert('Error', 'Please fill all required fields');
        return false;
      }

      if (data.password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long');
        return false;
      }

      const API_BASE_URL = getApiBaseUrl();
      console.log('📝 Attempting signup to:', `${API_BASE_URL}/auth/register`);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          email: data.email.trim().toLowerCase(),
          password: data.password.trim(),
          name: data.name.trim()
        }),
      });

      console.log('📡 Signup response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Signup error response:', errorText);
        
        let responseData;
        try {
          responseData = JSON.parse(errorText);
        } catch {
          responseData = { message: 'Server error' };
        }

        if (response.status === 409) {
          Alert.alert(
            'Account Exists',
            'An account with this email already exists. Please try logging in instead.'
          );
        } else if (response.status >= 500) {
          Alert.alert('Server Error', 'Please try again later');
        } else {
          Alert.alert(
            'Signup Failed',
            responseData.message || 'Could not create account'
          );
        }
        return false;
      }

      const responseData = await response.json();
      console.log('✅ Signup successful');

      if (responseData.status === 'success' && responseData.data?.token && responseData.data?.user) {
        await storage.setItem('auth_token', responseData.data.token);
        setUser(responseData.data.user);
        Alert.alert('Success', 'Account created successfully!');
        return true;
      }

      Alert.alert('Error', 'Signup failed. Please try again.');
      return false;
    } catch (err) {
      console.error('❌ Signup error:', err);
      Alert.alert('Network Error', 'Please check your connection and make sure the backend is running.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = await storage.getItem('auth_token');
      if (token) {
        const API_BASE_URL = getApiBaseUrl();
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (logoutError) {
          console.error('Logout API error:', logoutError);
        }
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      try {
        await storage.deleteItem('auth_token');
      } catch (deleteError) {
        console.error('Error deleting token:', deleteError);
      }
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};