import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Filter, Search, Grid, List, Star, ShoppingBag,
  TrendingUp, Zap, Shield, Truck, ChevronRight,
  Heart, Eye, Clock, TrendingDown
} from 'lucide-react';
import PageLoader from '../../component/common/PageLoader';

const ProductPage = () => {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');

  const [loading, setLoading] = useState(true);

  // 🔥 Simulate API call (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  
  // Color Schema
  const colors = {
    primary: "#E10600",
    background: "#0B0B0B",
    cardBg: "#141414",
    border: "#262626",
    text: "#FFFFFF",
    muted: "#B3B3B3",
    success: "#22C55E",
    warning: "#FACC15",
  };
  
  // Gym wear categories data
  const gymWearCategories = [
    {
      id: 'shoes',
      title: 'Training Shoes',
      description: 'Performance footwear for workouts & training',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
      itemCount: 24,
      popularItems: ['Running Shoes', 'Cross-Trainers', 'Lifting Shoes'],
      path: '/products/gym-war/shoes'
    },
    {
      id: 't-shirts',
      title: 'Workout T-Shirts',
      description: 'Moisture-wicking tops for maximum comfort',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
      itemCount: 18,
      popularItems: ['Performance Tees', 'Tank Tops', 'Compression Shirts'],
      path: '/products/gym-war/t-shirts'
    },
    {
      id: 'pants',
      title: 'Training Pants',
      description: 'Flexible bottoms for all types of workouts',
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&h=600&fit=crop',
      itemCount: 15,
      popularItems: ['Joggers', 'Shorts', 'Compression Pants'],
      path: '/products/gym-war/pants'
    },
    {
      id: 'jackets',
      title: 'Gym Jackets',
      description: 'Warm-up and cool-down outerwear',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop',
      itemCount: 12,
      popularItems: ['Hoodies', 'Windbreakers', 'Track Jackets'],
      path: '/products/gym-war/jackets'
    },
    {
      id: 'accessories',
      title: 'Fitness Accessories',
      description: 'Essential gear to enhance your workout',
      image: '/image/accessories.webp',
      itemCount: 32,
      popularItems: ['Gloves', 'Headbands', 'Wrist Wraps'],
      path: '/products/gym-war/accessories'
    },
    {
      id: 'bags',
      title: 'Gym Bags',
      description: 'Carry your gear in style',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
      itemCount: 8,
      popularItems: ['Duffel Bags', 'Backpacks', 'Drawstring Bags'],
      path: '/products/gym-war/bags'
    }
  ];
  
  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      name: 'ProFlex Training Shoes',
      category: 'shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      price: 4499,
      originalPrice: 5999,
      rating: 4.8,
      reviews: 124,
      colors: ['#0B0B0B', '#E10600', '#FFFFFF'],
      sizes: ['8', '9', '10', '11'],
      badge: 'BESTSELLER'
    },
    {
      id: 2,
      name: 'Performance Tank Top',
      category: 't-shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      price: 1299,
      originalPrice: 1999,
      rating: 4.5,
      reviews: 89,
      colors: ['#1E40AF', '#0B0B0B', '#DC2626'],
      sizes: ['S', 'M', 'L', 'XL'],
      badge: 'NEW'
    },
    {
      id: 3,
      name: 'Elite Training Joggers',
      category: 'pants',
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=400&fit=crop',
      price: 2399,
      originalPrice: 2999,
      rating: 4.7,
      reviews: 67,
      colors: ['#262626', '#374151', '#0B0B0B'],
      sizes: ['M', 'L', 'XL', 'XXL'],
      badge: 'LIMITED'
    },
    {
      id: 4,
      name: 'Premium Gym Hoodie',
      category: 'jackets',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      price: 3299,
      originalPrice: 4299,
      rating: 4.9,
      reviews: 203,
      colors: ['#0B0B0B', '#374151', '#7C2D12'],
      sizes: ['S', 'M', 'L', 'XL'],
      badge: 'TRENDING'
    }
  ];
  
  const brandLogos = [
    'NIKE', 'ADIDAS', 'UNDER ARMOUR', 'REEBOK', 'PUMA', 'GYMSHARK'
  ];
  
  const filters = [
    { id: 'featured', label: 'Featured', icon: TrendingUp },
    { id: 'newest', label: 'Newest', icon: Zap },
    { id: 'price-high', label: 'Price: High to Low', icon: TrendingDown },
    { id: 'price-low', label: 'Price: Low to High', icon: TrendingDown },
    { id: 'rating', label: 'Highest Rated', icon: Star },
  ];
  
  if (loading) return <PageLoader />;
  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen pt-30 md:pt-40">
      {/* Hero Banner */}
      <div 
        className="relative py-12 md:py-20 px-4 md:px-8 mb-12 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.background} 0%, #1a1a1a 100%)`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                <span style={{ color: colors.text }}>Premium </span>
                <span style={{ color: colors.primary }}>Gym Wear</span>
              </h1>
              <p className="text-xl mb-8 max-w-2xl" style={{ color: colors.muted }}>
                Performance apparel designed for serious athletes. Shop the latest collection of training shoes, workout gear, and accessories.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Shield size={20} style={{ color: colors.success }} />
                  <span style={{ color: colors.text }}>2-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={20} style={{ color: colors.success }} />
                  <span style={{ color: colors.text }}>Free Shipping</span>
                </div>
              </div>
            </div>
            
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E10600] to-transparent opacity-20 rounded-3xl" />
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
                alt="Gym Wear"
                className="rounded-3xl w-full h-64 md:h-80 object-cover relative z-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Categories Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
                Shop By Category
              </h2>
              <p style={{ color: colors.muted }}>Browse our wide range of gym wear categories</p>
            </div>
            <Link 
              to="/categories" 
              className="flex items-center gap-2 font-semibold hover:gap-4 transition-all"
              style={{ color: colors.primary }}
            >
              View All
              <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gymWearCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.path}
                className="group"
              >
                <div 
                  className="h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{cat.title}</h3>
                      <p className="text-sm text-white/80">{cat.itemCount} items</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="mb-4" style={{ color: colors.muted }}>{cat.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.popularItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${colors.primary}10`,
                            color: colors.primary,
                            border: `1px solid ${colors.primary}20`,
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
                Featured Products
              </h2>
              <p style={{ color: colors.muted }}>Top picks from our collection</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 rounded-lg" style={{ backgroundColor: colors.cardBg }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#E10600]' : ''}`}
                  style={{ color: viewMode === 'grid' ? colors.text : colors.muted }}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#E10600]' : ''}`}
                  style={{ color: viewMode === 'list' ? colors.text : colors.muted }}
                >
                  <List size={20} />
                </button>
              </div>
              
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg focus:outline-none"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
              >
                {filters.map(filter => (
                  <option key={filter.id} value={filter.id}>{filter.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'space-y-4'} gap-6`}>
            {featuredProducts.map((product) => (
              <div 
                key={product.id}
                className={`group ${
                  viewMode === 'grid' 
                    ? 'rounded-2xl overflow-hidden' 
                    : 'flex items-center gap-6 p-4 rounded-2xl'
                }`}
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {/* Product Image */}
                <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-48' : 'w-32 h-32 flex-shrink-0'}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs font-bold rounded"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.text,
                        }}
                      >
                        {product.badge}
                      </span>
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                      style={{ backgroundColor: colors.cardBg, color: colors.text }}
                    >
                      <Heart size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.cardBg, color: colors.text }}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className={`${viewMode === 'grid' ? 'p-4' : 'flex-1'}`}>
                  <div className="mb-2">
                    <span className="text-xs font-semibold uppercase px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${colors.primary}10`,
                        color: colors.primary,
                      }}
                    >
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="font-bold mb-2" style={{ color: colors.text }}>{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14}
                          className={i < Math.floor(product.rating) ? 'text-[#FACC15] fill-[#FACC15]' : 'text-[#262626]'}
                        />
                      ))}
                    </div>
                    <span className="text-sm" style={{ color: colors.muted }}>
                      ({product.reviews})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl font-bold" style={{ color: colors.text }}>
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm line-through" style={{ color: colors.muted }}>
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Colors & Sizes */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {product.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border"
                          style={{ 
                            backgroundColor: color,
                            borderColor: colors.border
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {product.sizes.map((size, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded"
                          style={{
                            backgroundColor: colors.background,
                            color: colors.text,
                          }}
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button className="w-full mt-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.text,
                    }}
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Logos */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
              Trusted Brands
            </h3>
            <p style={{ color: colors.muted }}>We carry only premium fitness brands</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brandLogos.map((brand, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-xl flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <span className="text-lg font-bold" style={{ color: colors.text }}>
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ProductPage;