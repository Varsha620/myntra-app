import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, Star, ShoppingBag, Share } from 'lucide-react-native';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useWishlist } from '@/hooks/useWishlist';
import { Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }
  return 'http://192.168.1.100:5000/api';
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const router = useRouter();
  const { addToCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    loadProduct();
  }, [id]);

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

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productId = Array.isArray(id) ? id[0] : id;
      
      if (productId) {
        const API_BASE_URL = getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.data?.product) {
            const transformedProduct = transformProduct(data.data.product);
            setProduct(transformedProduct);
            setSelectedSize(transformedProduct.sizes[0] || '');
            setSelectedColor(transformedProduct.colors[0] || '');
            
            // Add to recently viewed
            await addToRecentlyViewed(transformedProduct);
          } else {
            Alert.alert('Error', 'Product not found');
            router.back();
          }
        } else {
          Alert.alert('Error', 'Product not found');
          router.back();
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedSize || !selectedColor) {
      Alert.alert('Selection Required', 'Please select size and color');
      return;
    }

    setAddingToCart(true);
    try {
      const success = await addToCart(product, selectedSize, selectedColor, 1);
      if (success) {
        Alert.alert('Success', 'Product added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!product) return;

    if (isWishlisted) {
      const success = await removeFromWishlist(product.id);
      if (success) {
        Alert.alert('Removed', 'Product removed from wishlist');
      }
    } else {
      const success = await addToWishlist(product);
      if (success) {
        Alert.alert('Added', 'Product added to wishlist');
      }
    }
  };

  const handleShare = () => {
    Alert.alert('Share Product', 'Share functionality coming soon!');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleWishlist}>
            <Heart size={22} color={isWishlisted ? "#E91E63" : "#666"} fill={isWishlisted ? "#E91E63" : "none"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setSelectedImageIndex(index);
            }}
          >
            {product.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
              />
            ))}
          </ScrollView>
          
          {/* Image Indicators */}
          {product.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    selectedImageIndex === index && styles.activeIndicator
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Star size={12} color="#fff" fill="#fff" />
            </View>
            <Text style={styles.reviewCount}>({product.reviewCount} reviews)</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</Text>
                <Text style={styles.discount}>({product.discount}% OFF)</Text>
              </>
            )}
          </View>

          <Text style={styles.taxInfo}>inclusive of all taxes</Text>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <View style={styles.selectionSection}>
              <Text style={styles.selectionTitle}>SELECT SIZE</Text>
              <View style={styles.optionsContainer}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.optionButton,
                      selectedSize === size && styles.selectedOption
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedSize === size && styles.selectedOptionText
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <View style={styles.selectionSection}>
              <Text style={styles.selectionTitle}>SELECT COLOR</Text>
              <View style={styles.optionsContainer}>
                {product.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      selectedColor === color && styles.selectedColorOption
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text
                      style={[
                        styles.colorText,
                        selectedColor === color && styles.selectedColorText
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Product Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>PRODUCT DETAILS</Text>
            <Text style={styles.description}>{product.description}</Text>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
            
            {product.subcategory && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{product.subcategory}</Text>
              </View>
            )}
          </View>

          {/* Delivery Info */}
          <View style={styles.deliverySection}>
            <Text style={styles.deliveryTitle}>DELIVERY OPTIONS</Text>
            <Text style={styles.deliveryText}>• Free delivery on orders above ₹499</Text>
            <Text style={styles.deliveryText}>• Cash on delivery available</Text>
            <Text style={styles.deliveryText}>• Easy 30 days returns and exchanges</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.wishlistButton} onPress={handleWishlist}>
          <Heart size={20} color={isWishlisted ? "#E91E63" : "#666"} fill={isWishlisted ? "#E91E63" : "none"} />
          <Text style={styles.wishlistText}>WISHLIST</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.addToCartButton, addingToCart && styles.disabledButton]} 
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <ShoppingBag size={20} color="#fff" />
              <Text style={styles.addToCartText}>ADD TO BAG</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: screenWidth,
    height: 400,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  productInfo: {
    padding: 20,
  },
  brand: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  originalPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 12,
  },
  discount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginLeft: 8,
  },
  taxInfo: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4CAF50',
    marginBottom: 24,
  },
  selectionSection: {
    marginBottom: 24,
  },
  selectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#E91E63',
    backgroundColor: '#E91E63',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  colorOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  selectedColorOption: {
    borderColor: '#E91E63',
    backgroundColor: '#E91E63',
  },
  colorText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  selectedColorText: {
    color: '#fff',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    flex: 1,
  },
  deliverySection: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  deliveryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  deliveryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  wishlistButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E91E63',
    borderRadius: 8,
    paddingVertical: 14,
  },
  wishlistText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#E91E63',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  addToCartButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingVertical: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  addToCartText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});