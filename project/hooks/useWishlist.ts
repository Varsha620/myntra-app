import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { Product } from '@/types';
import { useAuth } from './useAuth';

// Platform-specific storage
const getStorageValue = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    try {
      const SecureStore = await import('expo-secure-store');
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  }
};

const setStorageValue = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    try {
      const SecureStore = await import('expo-secure-store');
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Fallback to memory storage
    }
  }
};

const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }
  return 'http://192.168.1.100:5000/api';
};

const getAuthToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('auth_token');
  } else {
    try {
      const SecureStore = await import('expo-secure-store');
      return await SecureStore.getItemAsync('auth_token');
    } catch {
      return null;
    }
  }
};

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      loadLocalWishlist();
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    if (!isAuthenticated) {
      await loadLocalWishlist();
      return;
    }

    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) return;

      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/users/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setWishlistItems(data.data.wishlist || []);
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      await loadLocalWishlist();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalWishlist = async () => {
    try {
      const data = await getStorageValue('wishlist_items');
      if (data) {
        setWishlistItems(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading local wishlist:', error);
    }
  };

  const saveLocalWishlist = async (items: Product[]) => {
    try {
      await setStorageValue('wishlist_items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving local wishlist:', error);
    }
  };

  const addToWishlist = async (product: Product): Promise<boolean> => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return false;

        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/users/wishlist/${product.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const newWishlist = [...wishlistItems, product];
          setWishlistItems(newWishlist);
          return true;
        } else {
          const errorData = await response.json();
          if (response.status === 400 && errorData.message?.includes('already in wishlist')) {
            Alert.alert('Info', 'Product is already in your wishlist');
            return false;
          }
          throw new Error(errorData.message || 'Failed to add to wishlist');
        }
      } else {
        // Local storage for non-authenticated users
        const isAlreadyInWishlist = wishlistItems.some(item => item.id === product.id);
        if (isAlreadyInWishlist) {
          Alert.alert('Info', 'Product is already in your wishlist');
          return false;
        }

        const newWishlist = [...wishlistItems, product];
        setWishlistItems(newWishlist);
        await saveLocalWishlist(newWishlist);
        return true;
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      Alert.alert('Error', 'Failed to add item to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return false;

        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/users/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const newWishlist = wishlistItems.filter(item => item.id !== productId);
          setWishlistItems(newWishlist);
          return true;
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        // Local storage for non-authenticated users
        const newWishlist = wishlistItems.filter(item => item.id !== productId);
        setWishlistItems(newWishlist);
        await saveLocalWishlist(newWishlist);
        return true;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      Alert.alert('Error', 'Failed to remove item from wishlist');
      return false;
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = async (): Promise<boolean> => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return false;

        // Clear each item individually since there's no bulk clear endpoint
        const promises = wishlistItems.map(item => removeFromWishlist(item.id));
        await Promise.all(promises);
      } else {
        setWishlistItems([]);
        await saveLocalWishlist([]);
      }
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      Alert.alert('Error', 'Failed to clear wishlist');
      return false;
    }
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    refreshWishlist: loadWishlist,
  };
}