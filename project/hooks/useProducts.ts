import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Product, FilterOptions } from '@/types';

// Standardized API base URL
const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api' 
  : 'http://192.168.1.100:5000/api';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const transformProduct = (backendProduct: any): Product => ({
    id: backendProduct._id,
    name: backendProduct.name,
    brand: backendProduct.brand,
    price: backendProduct.price,
    originalPrice: backendProduct.originalPrice,
    discount: backendProduct.discount,
    rating: backendProduct.rating?.average || 0,
    reviewCount: backendProduct.rating?.count || 0,
    image: backendProduct.images?.[0]?.url || backendProduct.images?.[0] || backendProduct.primaryImage || '',
    images: backendProduct.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [],
    category: backendProduct.category,
    description: backendProduct.description || '',
    sizes: backendProduct.sizes || [],
    colors: backendProduct.colors?.map((color: any) => typeof color === 'string' ? color : color.name) || [],
    inStock: backendProduct.inStock !== false,
    isNew: backendProduct.isNew,
    isBestseller: backendProduct.isBestseller,
  });

  const fetchProducts = async (filters?: FilterOptions, sortBy?: string, page = 1, limit = 20) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.categories && filters.categories.length > 0) {
        params.append('category', filters.categories[0]); // Backend expects single category
      }

      if (filters?.brands && filters.brands.length > 0) {
        params.append('brands', filters.brands.join(','));
      }

      if (filters?.priceRange) {
        if (filters.priceRange.min > 0) {
          params.append('minPrice', filters.priceRange.min.toString());
        }
        if (filters.priceRange.max < 50000) {
          params.append('maxPrice', filters.priceRange.max.toString());
        }
      }

      if (filters?.rating > 0) {
        params.append('minRating', filters.rating.toString());
      }

      if (sortBy) {
        params.append('sortBy', sortBy);
      }

      const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          const transformedProducts = data.data.products.map(transformProduct);
          setProducts(transformedProducts);
          return {
            products: transformedProducts,
            pagination: data.data.pagination,
            filters: data.data.filters,
          };
        }
      }
      
      return { products: [], pagination: null, filters: null };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: [], pagination: null, filters: null };
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          const transformedProducts = data.data.products.map(transformProduct);
          setFeaturedProducts(transformedProducts);
          return transformedProducts;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setCategories(data.data.categories);
          return data.data.categories;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/brands`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          const brandNames = data.data.brands.map((brand: any) => brand._id);
          setBrands(brandNames);
          return brandNames;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  };

  const fetchProductById = async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          return transformProduct(data.data.product);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  const searchProducts = async (query: string, limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          return data.data.products.map(transformProduct);
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  };

  return {
    products,
    featuredProducts,
    categories,
    brands,
    loading,
    fetchProducts,
    fetchFeaturedProducts,
    fetchCategories,
    fetchBrands,
    fetchProductById,
    searchProducts,
  };
}