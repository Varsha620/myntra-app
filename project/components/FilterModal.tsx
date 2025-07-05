import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { FilterOptions } from '@/types';
import { categories, brands } from '@/data/products';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  availableBrands?: string[];
}

const { height: screenHeight } = Dimensions.get('window');

export function FilterModal({ visible, onClose, filters, onApplyFilters, availableBrands = brands }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const toggleCategory = (category: string) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    
    setLocalFilters({
      ...localFilters,
      categories: newCategories
    });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...localFilters.brands, brand];
    
    setLocalFilters({
      ...localFilters,
      brands: newBrands
    });
  };

  const setPriceRange = (min: number, max: number) => {
    setLocalFilters({
      ...localFilters,
      priceRange: { min, max }
    });
  };

  const setRating = (rating: number) => {
    setLocalFilters({
      ...localFilters,
      rating: localFilters.rating === rating ? 0 : rating
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = {
      categories: [],
      priceRange: { min: 0, max: 50000 },
      rating: 0,
      brands: []
    };
    setLocalFilters(clearedFilters);
  };

  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
    { label: '₹5000 - ₹10000', min: 5000, max: 10000 },
    { label: 'Above ₹10000', min: 10000, max: 50000 },
  ];

  const ratings = [4, 3, 2, 1];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>FILTERS</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CATEGORIES</Text>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={styles.filterItem}
                onPress={() => toggleCategory(category.name)}
              >
                <Text style={styles.filterLabel}>{category.name}</Text>
                {localFilters.categories.includes(category.name) && (
                  <Check size={18} color="#E91E63" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRICE</Text>
            {priceRanges.map((range, index) => (
              <TouchableOpacity
                key={index}
                style={styles.filterItem}
                onPress={() => setPriceRange(range.min, range.max)}
              >
                <Text style={styles.filterLabel}>{range.label}</Text>
                {localFilters.priceRange.min === range.min && 
                 localFilters.priceRange.max === range.max && (
                  <Check size={18} color="#E91E63" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CUSTOMER RATING</Text>
            {ratings.map(rating => (
              <TouchableOpacity
                key={rating}
                style={styles.filterItem}
                onPress={() => setRating(rating)}
              >
                <Text style={styles.filterLabel}>{rating}★ & Above</Text>
                {localFilters.rating === rating && (
                  <Check size={18} color="#E91E63" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Brands */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BRAND</Text>
            <ScrollView style={styles.brandsList} nestedScrollEnabled>
              {availableBrands.map(brand => (
                <TouchableOpacity
                  key={brand}
                  style={styles.filterItem}
                  onPress={() => toggleBrand(brand)}
                >
                  <Text style={styles.filterLabel}>{brand}</Text>
                  {localFilters.brands.includes(brand) && (
                    <Check size={18} color="#E91E63" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>CLEAR ALL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>APPLY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  brandsList: {
    maxHeight: 200,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#666',
    letterSpacing: 0.5,
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
});