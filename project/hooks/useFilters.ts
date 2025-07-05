import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Product, FilterOptions } from '@/types';

const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }
  return 'http://192.168.1.100:5000/api';
};

export function useFilters() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: { min: 0, max: 50000 },
    rating: 0,
    brands: []
  });
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortBy, searchQuery, allProducts]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = getApiBaseUrl();
      
      const params = new URLSearchParams({
        limit: '100', // Load more products for better filtering
      });

      const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          const transformedProducts = data.data.products.map(transformProduct);
          setAllProducts(transformedProducts);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
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

  const applyFiltersAndSort = () => {
    let filtered = [...allProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory?.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    // Apply price range filter
    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
      );
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply sorting
    switch (sortBy) {
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
        filtered.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    setFilteredProducts(filtered);
  };

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const updateSort = (newSort: string) => {
    setSortBy(newSort);
  };

  const updateSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 50000 },
      rating: 0,
      brands: []
    });
    setSearchQuery('');
    setSortBy('popularity');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 50000) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchQuery('');
      return;
    }

    try {
      setLoading(true);
      const API_BASE_URL = getApiBaseUrl();
      
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=50`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          const transformedProducts = data.data.products.map(transformProduct);
          setFilteredProducts(transformedProducts);
          setSearchQuery(query);
        }
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    filteredProducts,
    allProducts,
    filters,
    sortBy,
    searchQuery,
    loading,
    updateFilters,
    updateSort,
    updateSearch,
    searchProducts,
    clearFilters,
    getActiveFiltersCount,
    refreshProducts: loadProducts,
  };
}