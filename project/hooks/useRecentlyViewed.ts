import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
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

interface RecentlyViewedItem {
  product: Product;
  viewedAt: string;
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadRecentlyViewed();
    } else {
      loadLocalRecentlyViewed();
    }
  }, [isAuthenticated]);

  const loadRecentlyViewed = async () => {
    if (!isAuthenticated) {
      await loadLocalRecentlyViewed();
      return;
    }

    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) return;

      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/users/recently-viewed`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          const items = data.data.recentlyViewed.map((item: any) => ({
            product: transformProduct(item.product),
            viewedAt: item.viewedAt
          }));
          setRecentlyViewed(items);
        }
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
      await loadLocalRecentlyViewed();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalRecentlyViewed = async () => {
    try {
      const data = await getStorageValue('recently_viewed');
      if (data) {
        const parsed = JSON.parse(data);
        setRecentlyViewed(parsed);
      }
    } catch (error) {
      console.error('Error loading local recently viewed:', error);
    }
  };

  const transformProduct = (backendProduct: any): Product => ({
    id: backendProduct._id,
    name: backendProduct.name,
    brand: backendProduct.brand,
    price: backendProduct.price,
    originalPrice: backendProduct.originalPrice,
    discount: backendProduct.discount,
    rating: backendProduct.rating?.average || 0,
    reviewCount: backendProduct.rating?.count || 0,
    image: backendProduct.images?.[0]?.url || backendProduct.primaryImage || '',
    images: backendProduct.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [],
    category: backendProduct.category,
    subcategory: backendProduct.subcategory,
    description: backendProduct.description || '',
    sizes: backendProduct.sizes || [],
    colors: backendProduct.colors?.map((color: any) => typeof color === 'string' ? color : color.name) || [],
    inStock: backendProduct.inStock !== false,
    isNew: backendProduct.isNew,
    isBestseller: backendProduct.isBestseller,
  });

  const addToRecentlyViewed = async (product: Product) => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return;

        const API_BASE_URL = getApiBaseUrl();
        await fetch(`${API_BASE_URL}/products/${product.id}/view`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Reload recently viewed to get updated list
        await loadRecentlyViewed();
      } else {
        // Local storage for non-authenticated users
        const filtered = recentlyViewed.filter(item => item.product.id !== product.id);
        
        const newItem: RecentlyViewedItem = {
          product,
          viewedAt: new Date().toISOString()
        };
        
        const newRecentlyViewed = [newItem, ...filtered].slice(0, 20);
        
        setRecentlyViewed(newRecentlyViewed);
        await setStorageValue('recently_viewed', JSON.stringify(newRecentlyViewed));
      }
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  };

  const clearRecentlyViewed = async () => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return;

        const API_BASE_URL = getApiBaseUrl();
        await fetch(`${API_BASE_URL}/users/recently-viewed`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      setRecentlyViewed([]);
      await setStorageValue('recently_viewed', JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  const getRecentlyViewedProducts = () => {
    return recentlyViewed.map(item => item.product);
  };

  return {
    recentlyViewed: getRecentlyViewedProducts(),
    loading,
    addToRecentlyViewed,
    clearRecentlyViewed,
    refreshRecentlyViewed: loadRecentlyViewed,
  };
}