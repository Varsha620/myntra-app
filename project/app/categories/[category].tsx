import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Filter, ArrowUpDown } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { FilterModal } from '@/components/FilterModal';
import { SortModal } from '@/components/SortModal';
import { products } from '@/data/products';
import { FilterOptions, Product } from '@/types';

const { width: screenWidth } = Dimensions.get('window');

export default function CategoryScreen() {
  const { category } = useLocalSearchParams();
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: { min: 0, max: 50000 },
    rating: 0,
    brands: []
  });

  const router = useRouter();

  useEffect(() => {
    const categoryName = Array.isArray(category) ? category[0] : category;
    const filtered = products.filter(product => 
      product.category.toLowerCase() === categoryName?.toLowerCase()
    );
    setCategoryProducts(filtered);
  }, [category]);

  const applyFiltersAndSort = (productList: Product[]) => {
    let filtered = [...productList];

    // Apply filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
      );
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply sorting
    switch (selectedSort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return filtered;
  };

  const filteredProducts = applyFiltersAndSort(categoryProducts);

  const getSortLabel = () => {
    switch (selectedSort) {
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      case 'rating': return 'Customer Rating';
      case 'newest': return 'Newest First';
      default: return 'Popularity';
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.brands.length > 0) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  const categoryName = Array.isArray(category) ? category[0] : category;
  const displayName = categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{displayName}</Text>
        <View style={styles.headerRight}>
          <Text style={styles.resultCount}>{filteredProducts.length} items</Text>
        </View>
      </View>

      {/* Filter and Sort Bar */}
      <View style={styles.filterSortBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={18} color="#333" />
          <Text style={styles.filterText}>
            Filter {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <ArrowUpDown size={18} color="#333" />
          <Text style={styles.sortText}>{getSortLabel()}</Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              width={(screenWidth - 48) / 2}
            />
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={setFilters}
        availableBrands={[]} // Add this line
      />

      {/* Sort Modal */}
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  resultCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  filterSortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  sortText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});