import { Product } from '@/types';

export const products: Product[] = [
  // Men's Clothing
  {
    id: '1',
    name: 'Roadster Men Navy Blue Solid Round Neck T-shirt',
    brand: 'Roadster',
    price: 399,
    originalPrice: 799,
    discount: 50,
    rating: 4.2,
    reviewCount: 12045,
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    images: [
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    ],
    category: 'Men',
    subcategory: 'Tshirts',
    description: 'Navy Blue solid round neck t-shirt, has short sleeves',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy Blue', 'Black', 'White', 'Grey'],
    inStock: true,
    isNew: true,
    isBestseller: false
  },
  {
    id: '2',
    name: 'HERE&NOW Men Black Slim Fit Jeans',
    brand: 'HERE&NOW',
    price: 1199,
    originalPrice: 2399,
    discount: 50,
    rating: 4.1,
    reviewCount: 8934,
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg'
    ],
    category: 'Men',
    subcategory: 'Jeans',
    description: 'Black washed mid-rise jeans, clean look, no fade, has a button and zip closure, waistband with belt loops, 5 pockets',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Black', 'Blue', 'Grey'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },
  {
    id: '3',
    name: 'HIGHLANDER Men White & Navy Blue Striped Casual Shirt',
    brand: 'HIGHLANDER',
    price: 649,
    originalPrice: 1299,
    discount: 50,
    rating: 4.3,
    reviewCount: 5672,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    images: [
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'
    ],
    category: 'Men',
    subcategory: 'Shirts',
    description: 'White and navy blue striped casual shirt, has a spread collar, long sleeves, button closure, curved hem',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White & Navy', 'White & Black', 'Blue & White'],
    inStock: true,
    isNew: false,
    isBestseller: false
  },
  {
    id: '4',
    name: 'Levis Men 511 Slim Fit Mid-Rise Clean Look Stretchable Jeans',
    brand: 'Levis',
    price: 2799,
    originalPrice: 3999,
    discount: 30,
    rating: 4.4,
    reviewCount: 15234,
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg',
    images: [
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg'
    ],
    category: 'Men',
    subcategory: 'Jeans',
    description: 'Blue washed mid-rise jeans, clean look, no fade, has a button and zip closure, waistband with belt loops, 5 pockets',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Blue', 'Black', 'Grey'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },
  {
    id: '5',
    name: 'Nike Men Black Solid DRI-FIT Training T-shirt',
    brand: 'Nike',
    price: 1495,
    originalPrice: 1995,
    discount: 25,
    rating: 4.5,
    reviewCount: 9876,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'
    ],
    category: 'Men',
    subcategory: 'Sports',
    description: 'Black solid training t-shirt with DRI-FIT technology, has short sleeves, round neck',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Grey', 'Navy'],
    inStock: true,
    isNew: true,
    isBestseller: false
  },

  // Women's Clothing
  {
    id: '6',
    name: 'Libas Women Pink Floral Printed Anarkali Kurta',
    brand: 'Libas',
    price: 1199,
    originalPrice: 2399,
    discount: 50,
    rating: 4.3,
    reviewCount: 7845,
    image: 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg',
    images: [
      'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg',
      'https://images.pexels.com/photos/1379636/pexels-photo-1379636.jpeg'
    ],
    category: 'Women',
    subcategory: 'Kurtas',
    description: 'Pink floral printed anarkali kurta, has a round neck, three-quarter sleeves, flared hem',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Blue', 'Green', 'Yellow'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },
  {
    id: '7',
    name: 'ZARA Women Black Solid Bodycon Dress',
    brand: 'ZARA',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    rating: 4.2,
    reviewCount: 3456,
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    images: [
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
    ],
    category: 'Women',
    subcategory: 'Dresses',
    description: 'Black solid bodycon dress, has a round neck, sleeveless, above knee length',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Maroon', 'White'],
    inStock: true,
    isNew: true,
    isBestseller: false
  },
  {
    id: '8',
    name: 'H&M Women Blue High-Rise Skinny Fit Jeans',
    brand: 'H&M',
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    rating: 4.1,
    reviewCount: 6789,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg',
    images: [
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg'
    ],
    category: 'Women',
    subcategory: 'Jeans',
    description: 'Blue washed high-rise skinny fit jeans, has a button and zip closure, waistband with belt loops, 5 pockets',
    sizes: ['26', '28', '30', '32', '34'],
    colors: ['Blue', 'Black', 'White', 'Grey'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },
  {
    id: '9',
    name: 'Forever 21 Women White Solid Crop Top',
    brand: 'Forever 21',
    price: 799,
    originalPrice: 1599,
    discount: 50,
    rating: 4.0,
    reviewCount: 4321,
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    images: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg'
    ],
    category: 'Women',
    subcategory: 'Tops',
    description: 'White solid crop top, has a round neck, sleeveless, regular fit',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Black', 'Pink', 'Blue'],
    inStock: true,
    isNew: true,
    isBestseller: false
  },
  {
    id: '10',
    name: 'Vero Moda Women Black Solid Blazer',
    brand: 'Vero Moda',
    price: 2399,
    originalPrice: 4799,
    discount: 50,
    rating: 4.4,
    reviewCount: 2345,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    images: [
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'
    ],
    category: 'Women',
    subcategory: 'Blazers',
    description: 'Black solid blazer, has a notched lapel collar, long sleeves, button closure, 2 pockets',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Grey', 'White'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },

  // Kids Clothing
  {
    id: '11',
    name: 'United Colors of Benetton Kids Unisex Rainbow Striped T-shirt',
    brand: 'United Colors of Benetton',
    price: 699,
    originalPrice: 1399,
    discount: 50,
    rating: 4.5,
    reviewCount: 1234,
    image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
    images: [
      'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg'
    ],
    category: 'Kids',
    subcategory: 'Tshirts',
    description: 'Rainbow striped t-shirt for kids, has short sleeves, round neck, regular fit',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    colors: ['Rainbow', 'Blue Stripes', 'Pink Stripes'],
    inStock: true,
    isNew: true,
    isBestseller: false
  },
  {
    id: '12',
    name: 'GAP Kids Girls Pink Solid Dress',
    brand: 'GAP',
    price: 1199,
    originalPrice: 2399,
    discount: 50,
    rating: 4.3,
    reviewCount: 876,
    image: 'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg',
    images: [
      'https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg'
    ],
    category: 'Kids',
    subcategory: 'Dresses',
    description: 'Pink solid dress for girls, has a round neck, sleeveless, knee length',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['Pink', 'Blue', 'Yellow', 'White'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },

  // Footwear
  {
    id: '13',
    name: 'Nike Men Black Revolution 5 Running Shoes',
    brand: 'Nike',
    price: 3495,
    originalPrice: 4995,
    discount: 30,
    rating: 4.4,
    reviewCount: 8765,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'
    ],
    category: 'Footwear',
    subcategory: 'Sports Shoes',
    description: 'Black running shoes with lightweight design, breathable mesh upper, cushioned sole',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Black', 'White', 'Grey', 'Navy'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },
  {
    id: '14',
    name: 'Clarks Men Brown Leather Formal Shoes',
    brand: 'Clarks',
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    rating: 4.3,
    reviewCount: 3456,
    image: 'https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg',
    images: [
      'https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg'
    ],
    category: 'Footwear',
    subcategory: 'Formal Shoes',
    description: 'Brown leather formal shoes, has lace-up closure, cushioned insole, durable sole',
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Brown', 'Black', 'Tan'],
    inStock: true,
    isNew: false,
    isBestseller: false
  },
  {
    id: '15',
    name: 'Bata Women Black Solid Heels',
    brand: 'Bata',
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    rating: 4.1,
    reviewCount: 2345,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'
    ],
    category: 'Footwear',
    subcategory: 'Heels',
    description: 'Black solid heels, has a pointed toe, slip-on closure, 3-inch heel',
    sizes: ['3', '4', '5', '6', '7', '8'],
    colors: ['Black', 'Brown', 'Nude', 'Red'],
    inStock: true,
    isNew: true,
    isBestseller: false
  },

  // Accessories
  {
    id: '16',
    name: 'Fossil Men Brown Leather Wallet',
    brand: 'Fossil',
    price: 2495,
    originalPrice: 4995,
    discount: 50,
    rating: 4.5,
    reviewCount: 5432,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'
    ],
    category: 'Accessories',
    subcategory: 'Wallets',
    description: 'Brown leather wallet with multiple card slots, coin pocket, and bill compartment',
    sizes: ['One Size'],
    colors: ['Brown', 'Black', 'Tan'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },
  {
    id: '17',
    name: 'Ray-Ban Unisex Black Aviator Sunglasses',
    brand: 'Ray-Ban',
    price: 7999,
    originalPrice: 12999,
    discount: 38,
    rating: 4.6,
    reviewCount: 9876,
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    images: [
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
    ],
    category: 'Accessories',
    subcategory: 'Sunglasses',
    description: 'Black aviator sunglasses with UV protection, metal frame, gradient lenses',
    sizes: ['One Size'],
    colors: ['Black', 'Gold', 'Silver'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },
  {
    id: '18',
    name: 'Michael Kors Women Rose Gold Watch',
    brand: 'Michael Kors',
    price: 12999,
    originalPrice: 19999,
    discount: 35,
    rating: 4.4,
    reviewCount: 3456,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'
    ],
    category: 'Accessories',
    subcategory: 'Watches',
    description: 'Rose gold watch with crystal embellishments, stainless steel bracelet, water resistant',
    sizes: ['One Size'],
    colors: ['Rose Gold', 'Gold', 'Silver'],
    inStock: true,
    isNew: true,
    isBestseller: false
  },

  // Beauty Products
  {
    id: '19',
    name: 'Lakme Absolute Matte Lipstick',
    brand: 'Lakme',
    price: 650,
    originalPrice: 850,
    discount: 24,
    rating: 4.2,
    reviewCount: 6789,
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    images: [
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
    ],
    category: 'Beauty',
    subcategory: 'Lipstick',
    description: 'Matte finish lipstick with long-lasting formula, rich color payoff',
    sizes: ['One Size'],
    colors: ['Red Envy', 'Pink Supreme', 'Coral Blush', 'Berry Bold'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },
  {
    id: '20',
    name: 'Maybelline New York Fit Me Foundation',
    brand: 'Maybelline',
    price: 499,
    originalPrice: 699,
    discount: 29,
    rating: 4.1,
    reviewCount: 8765,
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    images: [
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
    ],
    category: 'Beauty',
    subcategory: 'Foundation',
    description: 'Liquid foundation with natural finish, available in multiple shades',
    sizes: ['30ml'],
    colors: ['Fair', 'Light', 'Medium', 'Deep'],
    inStock: true,
    isNew: true,
    isBestseller: false
  },

  // Home & Living
  {
    id: '21',
    name: 'Home Centre White Cotton Bed Sheet Set',
    brand: 'Home Centre',
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    rating: 4.3,
    reviewCount: 2345,
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    images: [
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
    ],
    category: 'Home & Living',
    subcategory: 'Bedsheets',
    description: 'White cotton bed sheet set with 2 pillow covers, soft and comfortable',
    sizes: ['Single', 'Double', 'Queen', 'King'],
    colors: ['White', 'Blue', 'Pink', 'Grey'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },

  // Sports & Fitness
  {
    id: '22',
    name: 'Adidas Men Black Training Track Pants',
    brand: 'Adidas',
    price: 2199,
    originalPrice: 3999,
    discount: 45,
    rating: 4.4,
    reviewCount: 5678,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'
    ],
    category: 'Sports',
    subcategory: 'Track Pants',
    description: 'Black training track pants with side stripes, elastic waistband, tapered fit',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Grey'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },
  {
    id: '23',
    name: 'Puma Women Pink Sports Bra',
    brand: 'Puma',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    rating: 4.2,
    reviewCount: 3456,
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
    images: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg'
    ],
    category: 'Sports',
    subcategory: 'Sports Bra',
    description: 'Pink sports bra with medium support, moisture-wicking fabric, racerback design',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Black', 'White', 'Purple'],
    inStock: true,
    isNew: true,
    isBestseller: false
  },

  // Electronics & Gadgets
  {
    id: '24',
    name: 'boAt Airdopes 131 Wireless Earbuds',
    brand: 'boAt',
    price: 1999,
    originalPrice: 4990,
    discount: 60,
    rating: 4.1,
    reviewCount: 15678,
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    images: [
      'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg'
    ],
    category: 'Electronics',
    subcategory: 'Earphones',
    description: 'Wireless earbuds with 12 hours playback, IPX4 water resistance, instant voice assistant',
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Blue', 'Red'],
    inStock: true,
    isNew: false,
    isBestseller: true
  },
  {
    id: '25',
    name: 'Noise ColorFit Pro 2 Smart Watch',
    brand: 'Noise',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    rating: 4.0,
    reviewCount: 8765,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'
    ],
    category: 'Electronics',
    subcategory: 'Smart Watch',
    description: 'Smart watch with heart rate monitor, sleep tracking, 10-day battery life',
    sizes: ['One Size'],
    colors: ['Black', 'Silver', 'Rose Gold'],
    inStock: true,
    isNew: true,
    isBestseller: false
  }
];

export const categories = [
  { id: 'men', name: 'Men', icon: '👔', count: 5 },
  { id: 'women', name: 'Women', icon: '👗', count: 5 },
  { id: 'kids', name: 'Kids', icon: '🧸', count: 2 },
  { id: 'footwear', name: 'Footwear', icon: '👟', count: 3 },
  { id: 'accessories', name: 'Accessories', icon: '👜', count: 3 },
  { id: 'beauty', name: 'Beauty', icon: '💄', count: 2 },
  { id: 'home', name: 'Home & Living', icon: '🏠', count: 1 },
  { id: 'sports', name: 'Sports', icon: '⚽', count: 2 },
  { id: 'electronics', name: 'Electronics', icon: '📱', count: 2 }
];

export const brands = [
  'Roadster', 'HERE&NOW', 'HIGHLANDER', 'Levis', 'Nike', 'Libas', 'ZARA', 'H&M', 
  'Forever 21', 'Vero Moda', 'United Colors of Benetton', 'GAP', 'Clarks', 'Bata', 
  'Fossil', 'Ray-Ban', 'Michael Kors', 'Lakme', 'Maybelline', 'Home Centre', 
  'Adidas', 'Puma', 'boAt', 'Noise'
];

export const subcategories = {
  'Men': ['Tshirts', 'Shirts', 'Jeans', 'Trousers', 'Jackets', 'Sports'],
  'Women': ['Kurtas', 'Dresses', 'Tops', 'Jeans', 'Blazers', 'Sarees'],
  'Kids': ['Tshirts', 'Dresses', 'Jeans', 'Shorts'],
  'Footwear': ['Sports Shoes', 'Formal Shoes', 'Casual Shoes', 'Heels', 'Sandals'],
  'Accessories': ['Wallets', 'Sunglasses', 'Watches', 'Bags', 'Belts'],
  'Beauty': ['Lipstick', 'Foundation', 'Mascara', 'Skincare'],
  'Home & Living': ['Bedsheets', 'Curtains', 'Cushions', 'Decor'],
  'Sports': ['Track Pants', 'Sports Bra', 'Gym Wear', 'Shoes'],
  'Electronics': ['Earphones', 'Smart Watch', 'Mobile Accessories']
};