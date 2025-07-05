import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Filter, ArrowRight, Star, Heart, ShoppingBag, LogOut } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { useFilters } from '@/hooks/useFilters';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

const { width: screenWidth } = Dimensions.get('window');

const categories = [
  { id: 'men', name: 'Men', icon: '👔', count: 5 },
  { id: 'women', name: 'Women', icon: '👗', count: 5 },
  { id: 'kids', name: 'Kids', icon: '🧸', count: 2 },
  { id: 'sports', name: 'Sports', icon: '⚽', count: 2 },
  { id: 'accessories', name: 'Accessories', icon: '👜', count: 3 },
  { id: 'beauty', name: 'Beauty', icon: '💄', count: 2 },
  { id: 'home', name: 'Home', icon: '🏠', count: 1 }
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  
  const router = useRouter();
  const { searchQuery, updateSearch, filteredProducts, allProducts, loading, searchProducts } = useFilters();
  const { recentlyViewed } = useRecentlyViewed();
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    loadInitialData();
  }, [allProducts]);

  const loadInitialData = async () => {
    if (allProducts.length === 0) return;

    // Load featured products (bestsellers)
    const featured = allProducts.filter(product => product.isBestseller).slice(0, 8);
    setFeaturedProducts(featured);

    // Load trending products (high rating)
    const trending = allProducts.filter(product => product.rating >= 4.3).slice(0, 6);
    setTrendingProducts(trending);

    // Load new arrivals
    const newItems = allProducts.filter(product => product.isNew).slice(0, 6);
    setNewArrivals(newItems);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    updateSearch(query);
    if (query.trim()) {
      searchProducts(query);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const renderCategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => router.push(`/categories/${item.id}`)}
    >
      <View style={styles.categoryImageContainer}>
        <Image
          source={{ uri: getCategoryImage(item.id) }}
          style={styles.categoryImage}
        />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.count} items</Text>
    </TouchableOpacity>
  );

  const getCategoryImage = (categoryId: string) => {
    const categoryImages: { [key: string]: string } = {
      'men': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      'women': 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg',
      'kids': 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
      'sports': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
      'accessories': 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
      'beauty': 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
      'home': 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    };
    return categoryImages[categoryId] || 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg';
  };

  const renderBrandCard = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.brandCard}>
      <Text style={styles.brandName}>{item}</Text>
    </TouchableOpacity>
  );

  const displayProducts = searchQuery.trim() ? filteredProducts : allProducts.slice(0, 12);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.logo}>Myntra</Text>
              <Text style={styles.subtitle}>FASHION & LIFESTYLE</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Heart size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => router.push('/(tabs)/cart')}
              >
                <ShoppingBag size={24} color="#fff" />
                {getTotalItems() > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
                  </View>
                )}
              </TouchableOpacity>
              {isAuthenticated && (
                <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
                  <LogOut size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => router.push('/(tabs)/categories')}
          >
            <Filter size={20} color="#E91E63" />
          </TouchableOpacity>
        </View>

        {/* Auth Banner */}
        {!isAuthenticated && (
          <View style={styles.authBanner}>
            <Text style={styles.authBannerText}>Sign in for personalized experience</Text>
            <TouchableOpacity 
              style={styles.authButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.authButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Welcome Message for Authenticated Users */}
        {isAuthenticated && user && (
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeText}>Welcome back, {user.name}! 👋</Text>
            <Text style={styles.welcomeSubtext}>Discover amazing deals just for you</Text>
          </View>
        )}

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg' }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>FLAT 50-80% OFF</Text>
            <Text style={styles.bannerSubtitle}>+ Extra 10% Off</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>SHOP NOW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SHOP BY CATEGORY</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Recently Viewed */}
        {!searchQuery.trim() && recentlyViewed.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENTLY VIEWED</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.horizontalProductsContainer}>
                {recentlyViewed.slice(0, 6).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    width={160}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Deal of the Day */}
        <View style={styles.dealSection}>
          <View style={styles.dealHeader}>
            <Text style={styles.dealTitle}>DEAL OF THE DAY</Text>
            <View style={styles.dealTimer}>
              <Text style={styles.dealTimerText}>22h 59m Left</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dealProductsContainer}>
              {featuredProducts.slice(0, 4).map((product) => (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.dealProductCard}
                  onPress={() => router.push(`/product/${product.id}`)}
                >
                  <Image source={{ uri: product.image }} style={styles.dealProductImage} />
                  <View style={styles.dealProductInfo}>
                    <Text style={styles.dealProductBrand}>{product.brand}</Text>
                    <Text style={styles.dealProductName} numberOfLines={2}>{product.name}</Text>
                    <View style={styles.dealProductPricing}>
                      <Text style={styles.dealProductPrice}>₹{product.price}</Text>
                      <Text style={styles.dealProductOriginalPrice}>₹{product.originalPrice}</Text>
                      <Text style={styles.dealProductDiscount}>({product.discount}% OFF)</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Products / Search Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery.trim() ? `SEARCH RESULTS (${filteredProducts.length})` : 'TRENDING NOW'}
          </Text>
          {displayProducts.length > 0 ? (
            <View style={styles.productsGrid}>
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  width={(screenWidth - 48) / 2}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {searchQuery.trim() ? 'No products found' : 'Loading products...'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery.trim() ? 'Try a different search term' : 'Please wait while we load the latest products'}
              </Text>
            </View>
          )}
        </View>

        {/* New Arrivals */}
        {!searchQuery.trim() && newArrivals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>NEW ARRIVALS</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.horizontalProductsContainer}>
                {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    width={160}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Brands */}
        {!searchQuery.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRENDING BRANDS</Text>
            <FlatList
              data={['ZARA', 'H&M', 'Nike', 'Adidas', 'Levis', 'Puma']}
              renderItem={renderBrandCard}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.brandsList}
            />
          </View>
        )}

        {/* Bottom Banner */}
        {!searchQuery.trim() && (
          <View style={styles.bottomBannerContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg' }}
              style={styles.bottomBannerImage}
            />
            <View style={styles.bottomBannerOverlay}>
              <Text style={styles.bottomBannerTitle}>MYNTRA INSIDER</Text>
              <Text style={styles.bottomBannerSubtitle}>Become an Insider & get exciting perks</Text>
              <TouchableOpacity style={styles.bottomBannerButton}>
                <Text style={styles.bottomBannerButtonText}>JOIN NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  authBanner: {
    backgroundColor: '#FFF3E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  authBannerText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#E65100',
  },
  authButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  authButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  welcomeBanner: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2E7D32',
    marginBottom: 2,
  },
  welcomeSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4CAF50',
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  bannerButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    letterSpacing: 0.5,
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
    letterSpacing: 0.5,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 90,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  dealSection: {
    backgroundColor: '#fff3e0',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dealTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#E91E63',
    letterSpacing: 0.5,
  },
  dealTimer: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  dealTimerText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#fff',
  },
  dealProductsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dealProductCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 140,
    overflow: 'hidden',
  },
  dealProductImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  dealProductInfo: {
    padding: 8,
  },
  dealProductBrand: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginBottom: 2,
  },
  dealProductName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#333',
    marginBottom: 4,
  },
  dealProductPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dealProductPrice: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginRight: 4,
  },
  dealProductOriginalPrice: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  dealProductDiscount: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  horizontalProductsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  brandsList: {
    paddingHorizontal: 16,
  },
  brandCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  brandName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  bottomBannerContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bottomBannerImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  bottomBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(233, 30, 99, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBannerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  bottomBannerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  bottomBannerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bottomBannerButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#E91E63',
  },
});