import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Heart } from 'lucide-react-native';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/types';

export default function CartScreen() {
  const {
    cartItems,
    savedItems,
    loading,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Add some items to your cart before checkout.');
      return;
    }
    Alert.alert('Checkout', 'Proceeding to payment gateway...');
  };

  const renderCartItem = (item: CartItem) => (
    <View key={`${item.product.id}-${item.size}-${item.color}`} style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemBrand}>{item.product.brand}</Text>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.itemVariant}>Size: {item.size} | Color: {item.color}</Text>
        
        <View style={styles.itemFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>₹{item.product.price.toLocaleString()}</Text>
            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
              <Text style={styles.itemOriginalPrice}>₹{item.product.originalPrice.toLocaleString()}</Text>
            )}
          </View>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
            >
              <Minus size={14} color="#333" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
            >
              <Plus size={14} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => saveForLater(item.product.id, item.size, item.color)}
          >
            <Heart size={14} color="#666" />
            <Text style={styles.actionText}>SAVE FOR LATER</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => removeFromCart(item.product.id, item.size, item.color)}
          >
            <Trash2 size={14} color="#E91E63" />
            <Text style={[styles.actionText, { color: '#E91E63' }]}>REMOVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSavedItem = (item: CartItem) => (
    <View key={`saved-${item.product.id}-${item.size}-${item.color}`} style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemBrand}>{item.product.brand}</Text>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.itemVariant}>Size: {item.size} | Color: {item.color}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.itemPrice}>₹{item.product.price.toLocaleString()}</Text>
          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
            <Text style={styles.itemOriginalPrice}>₹{item.product.originalPrice.toLocaleString()}</Text>
          )}
        </View>
        
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => moveToCart(item.product.id, item.size, item.color)}
          >
            <ShoppingBag size={14} color="#E91E63" />
            <Text style={[styles.actionText, { color: '#E91E63' }]}>MOVE TO BAG</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => removeSavedItem(item.product.id, item.size, item.color)}
          >
            <Trash2 size={14} color="#666" />
            <Text style={styles.actionText}>REMOVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BAG</Text>
        {cartItems.length > 0 && (
          <Text style={styles.itemCount}>{getTotalItems()} Items</Text>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BAG ({cartItems.length})</Text>
            {cartItems.map(renderCartItem)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <ShoppingBag size={64} color="#ccc" />
            <Text style={styles.emptyText}>Hey, it feels so light!</Text>
            <Text style={styles.emptySubtext}>There is nothing in your bag. Let's add some items.</Text>
          </View>
        )}

        {/* Saved for Later */}
        {savedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SAVED FOR LATER ({savedItems.length})</Text>
            {savedItems.map(renderSavedItem)}
          </View>
        )}

        {/* Price Details */}
        {cartItems.length > 0 && (
          <View style={styles.priceDetails}>
            <Text style={styles.priceDetailsTitle}>PRICE DETAILS ({getTotalItems()} Items)</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total MRP</Text>
              <Text style={styles.priceValue}>₹{getTotalPrice().toLocaleString()}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Discount on MRP</Text>
              <Text style={[styles.priceValue, { color: '#4CAF50' }]}>-₹0</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Coupon Discount</Text>
              <Text style={[styles.priceValue, { color: '#E91E63' }]}>Apply Coupon</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Platform Fee</Text>
              <Text style={[styles.priceValue, { color: '#4CAF50' }]}>FREE</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Shipping Fee</Text>
              <Text style={[styles.priceValue, { color: '#4CAF50' }]}>FREE</Text>
            </View>
            
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₹{getTotalPrice().toLocaleString()}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Checkout */}
      {cartItems.length > 0 && (
        <View style={styles.checkout}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.checkoutTotal}>₹{getTotalPrice().toLocaleString()}</Text>
            <Text style={styles.checkoutSubtext}>VIEW DETAILS</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>PLACE ORDER</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    letterSpacing: 0.5,
  },
  itemCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemBrand: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  itemVariant: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginRight: 8,
  },
  itemOriginalPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
    padding: 2,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  quantity: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginHorizontal: 12,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#666',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  priceDetails: {
    margin: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  priceDetailsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  checkout: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutTotal: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  checkoutSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#E91E63',
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  checkoutText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
});