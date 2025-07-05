import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { CartItem, Product } from '@/types';
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

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCartData();
    } else {
      loadLocalCartData();
    }
  }, [isAuthenticated]);

  const loadCartData = async () => {
    if (!isAuthenticated) {
      await loadLocalCartData();
      return;
    }

    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) return;

      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setCartItems(data.data.cart || []);
          setSavedItems(data.data.savedForLater || []);
        }
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
      await loadLocalCartData();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalCartData = async () => {
    try {
      const cartData = await getStorageValue('cart_items');
      const savedData = await getStorageValue('saved_items');
      
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
      if (savedData) {
        setSavedItems(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading local cart data:', error);
    }
  };

  const saveLocalCartData = async (cart: CartItem[], saved: CartItem[]) => {
    try {
      await setStorageValue('cart_items', JSON.stringify(cart));
      await setStorageValue('saved_items', JSON.stringify(saved));
    } catch (error) {
      console.error('Error saving local cart data:', error);
    }
  };

  const addToCart = async (product: Product, size: string, color: string, quantity: number = 1): Promise<boolean> => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return false;

        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            size,
            color,
            quantity
          }),
        });

        if (response.ok) {
          await loadCartData();
          return true;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add to cart');
        }
      } else {
        // Local storage for non-authenticated users
        const existingItemIndex = cartItems.findIndex(
          item => item.product.id === product.id && 
                   item.size === size && 
                   item.color === color
        );

        let newCartItems;
        if (existingItemIndex >= 0) {
          newCartItems = [...cartItems];
          newCartItems[existingItemIndex].quantity += quantity;
        } else {
          const newItem: CartItem = {
            product,
            quantity,
            size,
            color
          };
          newCartItems = [...cartItems, newItem];
        }

        setCartItems(newCartItems);
        await saveLocalCartData(newCartItems, savedItems);
        return true;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
      return false;
    }
  };

  const removeFromCart = async (productId: string, size: string, color: string): Promise<boolean> => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return false;

        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/cart/remove`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            size,
            color
          }),
        });

        if (response.ok) {
          await loadCartData();
          return true;
        } else {
          throw new Error('Failed to remove from cart');
        }
      } else {
        const newCartItems = cartItems.filter(item => 
          !(item.product.id === productId && item.size === size && item.color === color)
        );
        
        setCartItems(newCartItems);
        await saveLocalCartData(newCartItems, savedItems);
        return true;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Failed to remove item');
      return false;
    }
  };

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number): Promise<boolean> => {
    try {
      if (quantity <= 0) {
        return await removeFromCart(productId, size, color);
      }

      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return false;

        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/cart/update`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            size,
            color,
            quantity
          }),
        });

        if (response.ok) {
          await loadCartData();
          return true;
        } else {
          throw new Error('Failed to update quantity');
        }
      } else {
        const newCartItems = cartItems.map(item => 
          item.product.id === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        );
        
        setCartItems(newCartItems);
        await saveLocalCartData(newCartItems, savedItems);
        return true;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
      return false;
    }
  };

  const saveForLater = async (productId: string, size: string, color: string): Promise<boolean> => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return false;

        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/cart/save-for-later`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            size,
            color
          }),
        });

        if (response.ok) {
          await loadCartData();
          return true;
        } else {
          throw new Error('Failed to save for later');
        }
      } else {
        const itemIndex = cartItems.findIndex(item => 
          item.product.id === productId && item.size === size && item.color === color
        );
        
        if (itemIndex >= 0) {
          const item = cartItems[itemIndex];
          const newCartItems = cartItems.filter((_, index) => index !== itemIndex);
          const newSavedItems = [...savedItems, item];
          
          setCartItems(newCartItems);
          setSavedItems(newSavedItems);
          await saveLocalCartData(newCartItems, newSavedItems);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error saving for later:', error);
      Alert.alert('Error', 'Failed to save item');
      return false;
    }
  };

  const moveToCart = async (productId: string, size: string, color: string): Promise<boolean> => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return false;

        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/cart/move-to-cart`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            size,
            color
          }),
        });

        if (response.ok) {
          await loadCartData();
          return true;
        } else {
          throw new Error('Failed to move to cart');
        }
      } else {
        const itemIndex = savedItems.findIndex(item => 
          item.product.id === productId && item.size === size && item.color === color
        );
        
        if (itemIndex >= 0) {
          const item = savedItems[itemIndex];
          const newSavedItems = savedItems.filter((_, index) => index !== itemIndex);
          const newCartItems = [...cartItems, item];
          
          setCartItems(newCartItems);
          setSavedItems(newSavedItems);
          await saveLocalCartData(newCartItems, newSavedItems);
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
      Alert.alert('Error', 'Failed to move item');
      return false;
    }
  };

  const removeSavedItem = async (productId: string, size: string, color: string): Promise<boolean> => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return false;

        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/cart/remove-saved`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            size,
            color
          }),
        });

        if (response.ok) {
          await loadCartData();
          return true;
        } else {
          throw new Error('Failed to remove saved item');
        }
      } else {
        const newSavedItems = savedItems.filter(item => 
          !(item.product.id === productId && item.size === size && item.color === color)
        );
        
        setSavedItems(newSavedItems);
        await saveLocalCartData(cartItems, newSavedItems);
        return true;
      }
    } catch (error) {
      console.error('Error removing saved item:', error);
      Alert.alert('Error', 'Failed to remove saved item');
      return false;
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      if (isAuthenticated) {
        const token = await getAuthToken();
        if (!token) return false;

        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/cart/clear`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setCartItems([]);
          return true;
        } else {
          throw new Error('Failed to clear cart');
        }
      } else {
        setCartItems([]);
        await saveLocalCartData([], savedItems);
        return true;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      Alert.alert('Error', 'Failed to clear cart');
      return false;
    }
  };

  return {
    cartItems,
    savedItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeSavedItem,
    getTotalPrice,
    getTotalItems,
    clearCart,
    refreshCart: loadCartData,
  };
}