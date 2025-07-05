import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Filter, ArrowUpDown, Grid2x2 as Grid, List } from 'lucide-react-native';
import { ProductCard } from '@/components/ProductCard';
import { FilterModal } from '@/components/FilterModal';
import { SortModal } from '@/components/SortModal';
import { categories } from '@/data/products';
import { useFilters } from '@/hooks/useFilters';

const { width: screenWidth } = Dimensions.get('window');

export default function CategoriesScreen() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const {
    filteredProducts,
    filters,
    sortBy,
    updateFilters,
    updateSort,
    getActiveFiltersCount,
  } = useFilters();

  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      case 'rating': return 'Customer Rating';
      case 'newest': return 'What\'s New';
      case 'discount': return 'Better Discount';
      default: return 'Popularity';
    }
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      updateFilters({ ...filters, categories: [] });
    } else {
      const categoryName = categories.find(cat => cat.id === categoryId)?.name || '';
      updateFilters({ ...filters, categories: [categoryName] });
    }
  };

  const renderCategoryTab = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item.id && styles.activeCategoryTab
      ]}
      onPress={() => handleCategoryFilter(item.id)}
    >
      <Text style={[
        styles.categoryTabText,
        selectedCategory === item.id && styles.activeCategoryTabText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const allCategories = [{ id: 'all', name: 'All' }, ...categories];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.resultCount}>{filteredProducts.length} Products</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabsContainer}>
        <FlatList
          data={allCategories}
          renderItem={renderCategoryTab}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsList}
        />
      </View>

      {/* Filter and Sort Bar */}
      <View style={styles.filterSortBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={16} color="#333" />
          <Text style={styles.filterText}>
            Filter {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <ArrowUpDown size={16} color="#333" />
          <Text style={styles.sortText}>{getSortLabel()}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.viewModeButton}
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          {viewMode === 'grid' ? (
            <List size={16} color="#333" />
          ) : (
            <Grid size={16} color="#333" />
          )}
        </TouchableOpacity>
      </View>

      {/* Products Grid/List */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredProducts.length > 0 ? (
          <View style={[
            styles.productsContainer,
            viewMode === 'list' && styles.productsListContainer
          ]}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                width={viewMode === 'grid' ? (screenWidth - 48) / 2 : screenWidth - 32}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters or check back later</Text>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={updateFilters}
      />

      {/* Sort Modal */}
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        selectedSort={sortBy}
        onSelectSort={updateSort}
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  resultCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  categoryTabsContainer: {
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryTabsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeCategoryTab: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  categoryTabText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
  },
  activeCategoryTabText: {
    color: '#fff',
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
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 6,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#ddd',
    marginHorizontal: 12,
  },
  sortButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  sortText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 6,
  },
  viewModeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  productsListContainer: {
    flexDirection: 'column',
    alignItems: 'center',
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
    textAlign: 'center',
  },
});