import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Star } from 'lucide-react-native';
import { Product } from '@/types';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  width?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export function ProductCard({ product, width }: ProductCardProps) {
  const router = useRouter();
  const cardWidth = width || (screenWidth - 48) / 2;
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id));

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const handleWishlistPress = async () => {
    if (isWishlisted) {
      const success = await removeFromWishlist(product.id);
      if (success) {
        setIsWishlisted(false);
      }
    } else {
      const success = await addToWishlist(product);
      if (success) {
        setIsWishlisted(true);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        {/* Discount Badge */}
        {product.discount && product.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}% OFF</Text>
          </View>
        )}
        
        {/* New Badge */}
        {product.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
        
        {/* Bestseller Badge */}
        {product.isBestseller && (
          <View style={styles.bestsellerBadge}>
            <Text style={styles.bestsellerText}>BESTSELLER</Text>
          </View>
        )}
        
        {/* Wishlist Button */}
        <TouchableOpacity 
          style={styles.heartButton}
          onPress={handleWishlistPress}
        >
          <Heart 
            size={18} 
            color={isWishlisted ? "#E91E63" : "#666"} 
            fill={isWishlisted ? "#E91E63" : "none"}
            strokeWidth={1.5} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {/* Brand */}
        <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
        
        {/* Product Name */}
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        
        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FF9800" fill="#FF9800" />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
        
        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
          {product.originalPrice && product.originalPrice > product.price && (
            <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</Text>
          )}
        </View>
        
        {/* Sizes Preview */}
        {product.sizes && product.sizes.length > 0 && (
          <View style={styles.sizesContainer}>
            <Text style={styles.sizesLabel}>Sizes: </Text>
            <Text style={styles.sizesText} numberOfLines={1}>
              {product.sizes.slice(0, 3).join(', ')}
              {product.sizes.length > 3 && '...'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#E91E63',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Inter-Bold',
  },
  bestsellerBadge: {
    position: 'absolute',
    top: 32,
    left: 8,
    backgroundColor: '#FF9800',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bestsellerText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: 'Inter-Bold',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 6,
  },
  content: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 11,
    color: '#333',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 3,
  },
  reviewCount: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Inter-Regular',
    marginLeft: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter-Bold',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  sizesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizesLabel: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  sizesText: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
});