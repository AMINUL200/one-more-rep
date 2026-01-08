import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Filter, Star, ChevronDown, ChevronUp, Search, 
  ShoppingBag, Heart, TrendingUp, Shield, Truck,
  Grid, List, Check, X, Sparkles
} from 'lucide-react';
import PageLoader from '../../component/common/PageLoader';

const ProductListPage = () => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filter states
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showRatingFilter, setShowRatingFilter] = useState(true);
  const [showBrandFilter, setShowBrandFilter] = useState(true);


  // 🔥 Simulate API call (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

 
  
  // Sample brands based on category
  const brands = {
    shoes: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'ASICS'],
    tshirts: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Gymshark', 'Myntra'],
    pants: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Decathlon', 'HRX']
  };

  // Sample products data
  const sampleProducts = {
    shoes: [
      {
        id: 1,
        name: "Nike Air Max 270",
        brand: "Nike",
        price: 8999,
        originalPrice: 11999,
        rating: 4.5,
        reviewCount: 342,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        category: "Running",
        color: "Black/White",
        inStock: true,
        fastDelivery: true,
        discount: 25
      },
      {
        id: 2,
        name: "Adidas Ultraboost 22",
        brand: "Adidas",
        price: 12999,
        originalPrice: 14999,
        rating: 4.8,
        reviewCount: 289,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
        category: "Running",
        color: "White",
        inStock: true,
        fastDelivery: false,
        discount: 13
      },
      {
        id: 3,
        name: "Puma RS-X",
        brand: "Puma",
        price: 6999,
        originalPrice: 8999,
        rating: 4.2,
        reviewCount: 156,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
        category: "Casual",
        color: "Blue/Orange",
        inStock: true,
        fastDelivery: true,
        discount: 22
      },
      {
        id: 4,
        name: "Reebok Nano X2",
        brand: "Reebok",
        price: 10999,
        originalPrice: 13999,
        rating: 4.6,
        reviewCount: 198,
        image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop",
        category: "Training",
        color: "Black",
        inStock: false,
        fastDelivery: false,
        discount: 21
      },
      {
        id: 5,
        name: "Under Armour HOVR Sonic 5",
        brand: "Under Armour",
        price: 8499,
        originalPrice: 10999,
        rating: 4.3,
        reviewCount: 123,
        image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop",
        category: "Running",
        color: "Gray",
        inStock: true,
        fastDelivery: true,
        discount: 23
      },
      {
        id: 6,
        name: "ASICS Gel-Kayano 29",
        brand: "ASICS",
        price: 13999,
        originalPrice: 16999,
        rating: 4.7,
        reviewCount: 234,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        category: "Running",
        color: "White/Red",
        inStock: true,
        fastDelivery: true,
        discount: 18
      }
    ],
    tshirts: [
      {
        id: 1,
        name: "Nike Dri-FIT T-Shirt",
        brand: "Nike",
        price: 2499,
        originalPrice: 3499,
        rating: 4.4,
        reviewCount: 189,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        category: "Workout",
        color: "Black",
        inStock: true,
        fastDelivery: true,
        discount: 29
      },
      {
        id: 2,
        name: "Adidas Essentials T-Shirt",
        brand: "Adidas",
        price: 1999,
        originalPrice: 2999,
        rating: 4.2,
        reviewCount: 145,
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop",
        category: "Casual",
        color: "White",
        inStock: true,
        fastDelivery: false,
        discount: 33
      }
    ]
  };

  // Initialize with sample data
  useEffect(() => {
    const currentProducts = sampleProducts[subcategory] || sampleProducts.shoes;
    setProducts(currentProducts);
    setFilteredProducts(currentProducts);
    setLoading(false);
  }, [category, subcategory]);

  // Filter products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(product =>
        selectedRatings.some(rating => product.rating >= rating && product.rating < rating + 1)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [searchQuery, priceRange, selectedRatings, selectedBrands, sortBy, products]);

  const handleRatingSelect = (rating) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange({ min: 0, max: 50000 });
    setSelectedRatings([]);
    setSelectedBrands([]);
    setSortBy('featured');
  };

  const formatIndianRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < Math.floor(rating)
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-400'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

   if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-10 pt-32 md:pt-40">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
            {subcategory.replace(/-/g, ' ')}
          </h1>
          <p className="text-gray-400 mt-2">
            Showing {filteredProducts.length} products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-1/4">
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 sticky top-32">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </h2>
                {(selectedRatings.length > 0 || selectedBrands.length > 0 || priceRange.min > 0 || priceRange.max < 50000) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#E10600] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <X size={16} />
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0B0B0B] border border-[#262626] text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600] transition-colors"
                  />
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <button
                  onClick={() => setShowPriceFilter(!showPriceFilter)}
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <h3 className="font-semibold text-white">Price Range</h3>
                  {showPriceFilter ? <ChevronUp size={20} className="text-[#E10600]" /> : <ChevronDown size={20} className="text-[#E10600]" />}
                </button>
                {showPriceFilter && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{formatIndianRupees(priceRange.min)}</span>
                      <span>{formatIndianRupees(priceRange.max)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E10600]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                        className="px-3 py-2 rounded-lg bg-[#0B0B0B] border border-[#262626] text-white text-sm focus:outline-none focus:border-[#E10600]"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 50000 })}
                        className="px-3 py-2 rounded-lg bg-[#0B0B0B] border border-[#262626] text-white text-sm focus:outline-none focus:border-[#E10600]"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <button
                  onClick={() => setShowRatingFilter(!showRatingFilter)}
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <h3 className="font-semibold text-white">Customer Rating</h3>
                  {showRatingFilter ? <ChevronUp size={20} className="text-[#E10600]" /> : <ChevronDown size={20} className="text-[#E10600]" />}
                </button>
                {showRatingFilter && (
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedRatings.includes(rating)}
                          onChange={() => handleRatingSelect(rating)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          selectedRatings.includes(rating)
                            ? 'bg-[#E10600] border-[#E10600]'
                            : 'bg-[#0B0B0B] border-[#262626] group-hover:border-[#E10600]'
                        }`}>
                          {selectedRatings.includes(rating) && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(rating)}
                          <span className="text-gray-400 text-sm ml-2">& above</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <button
                  onClick={() => setShowBrandFilter(!showBrandFilter)}
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <h3 className="font-semibold text-white">Brand</h3>
                  {showBrandFilter ? <ChevronUp size={20} className="text-[#E10600]" /> : <ChevronDown size={20} className="text-[#E10600]" />}
                </button>
                {showBrandFilter && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {brands[subcategory]?.map((brand) => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandSelect(brand)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          selectedBrands.includes(brand)
                            ? 'bg-[#E10600] border-[#E10600]'
                            : 'bg-[#0B0B0B] border-[#262626] group-hover:border-[#E10600]'
                        }`}>
                          {selectedBrands.includes(brand) && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-gray-300 group-hover:text-white transition-colors">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Filters */}
              {(selectedRatings.length > 0 || selectedBrands.length > 0) && (
                <div className="mt-6 pt-6 border-t border-[#262626]">
                  <h4 className="font-semibold text-white mb-3">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRatings.map(rating => (
                      <div key={rating} className="px-3 py-1 bg-[#E10600]/20 text-[#E10600] rounded-full text-sm flex items-center gap-1">
                        {rating}+ Stars
                        <button
                          onClick={() => handleRatingSelect(rating)}
                          className="ml-1 hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {selectedBrands.map(brand => (
                      <div key={brand} className="px-3 py-1 bg-[#E10600]/20 text-[#E10600] rounded-full text-sm flex items-center gap-1">
                        {brand}
                        <button
                          onClick={() => handleBrandSelect(brand)}
                          className="ml-1 hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Products */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-[#E10600] text-white'
                          : 'bg-[#0B0B0B] text-gray-400 hover:text-white'
                      }`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-[#E10600] text-white'
                          : 'bg-[#0B0B0B] text-gray-400 hover:text-white'
                      }`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                  <span className="text-gray-400 text-sm hidden sm:block">
                    {filteredProducts.length} products
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-[#0B0B0B] border border-[#262626] text-white focus:outline-none focus:border-[#E10600] transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No products found</div>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-[#E10600] text-white rounded-lg hover:bg-[#FF0000] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden group hover:border-[#E10600] transition-colors"
                  >
                    <Link to={`/${category}/${subcategory}/${product.name.toLowerCase().replace(/ /g, '-')}`}>
                      {/* Product Image */}
                      <div className="relative overflow-hidden">
                        <div className="h-64">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Discount Badge */}
                        {product.discount && (
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-[#E10600] text-white text-sm font-bold rounded-full">
                              {product.discount}% OFF
                            </span>
                          </div>
                        )}

                        {/* Out of Stock */}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="px-4 py-2 bg-gray-800 text-white rounded-lg">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-[#E10600] transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-gray-400 text-sm">{product.brand}</p>
                          </div>
                          <button className="text-gray-400 hover:text-[#E10600] transition-colors">
                            <Heart size={20} />
                          </button>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          {renderStars(product.rating)}
                          <span className="text-gray-500 text-sm">
                            ({product.reviewCount})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-white">
                            {formatIndianRupees(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-500 line-through">
                              {formatIndianRupees(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Features */}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          {product.fastDelivery && (
                            <div className="flex items-center gap-1">
                              <Truck size={14} />
                              <span>Free Delivery</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Shield size={14} />
                            <span>1 Year Warranty</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden group hover:border-[#E10600] transition-colors"
                  >
                    <Link to={`/${category}/${subcategory}/${product.name.toLowerCase().replace(/ /g, '-')}`}>
                      <div className="flex flex-col md:flex-row">
                        {/* Product Image */}
                        <div className="md:w-1/3 relative">
                          <div className="h-64 md:h-auto">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {product.discount && (
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-[#E10600] text-white text-sm font-bold rounded-full">
                                {product.discount}% OFF
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="md:w-2/3 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-[#E10600] transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-gray-400">{product.brand} • {product.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="text-gray-400 hover:text-[#E10600] transition-colors">
                                <Heart size={20} />
                              </button>
                              <button className="text-gray-400 hover:text-[#E10600] transition-colors">
                                <ShoppingBag size={20} />
                              </button>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-4">
                            {renderStars(product.rating)}
                            <span className="text-gray-500">
                              ({product.reviewCount} reviews)
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-300 mb-6">
                            Premium quality {product.category.toLowerCase()} designed for performance and comfort. 
                            Perfect for your active lifestyle.
                          </p>

                          {/* Features */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Sparkles size={14} />
                              <span>Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Truck size={14} />
                              <span>{product.fastDelivery ? 'Free Delivery' : 'Standard Delivery'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Shield size={14} />
                              <span>1 Year Warranty</span>
                            </div>
                          </div>

                          {/* Price and Action */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-white">
                                  {formatIndianRupees(product.price)}
                                </span>
                                {product.originalPrice && (
                                  <>
                                    <span className="text-gray-500 line-through">
                                      {formatIndianRupees(product.originalPrice)}
                                    </span>
                                    <span className="text-[#E10600] font-semibold">
                                      Save {product.discount}%
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm mt-1">
                                EMI starts at {formatIndianRupees(product.price / 6)}/month
                              </p>
                            </div>
                            <button className="px-6 py-3 bg-[#E10600] text-white rounded-lg font-semibold hover:bg-[#FF0000] transition-colors flex items-center gap-2">
                              <ShoppingBag size={18} />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-8">
                <button className="px-8 py-3 border border-[#262626] text-white rounded-lg hover:border-[#E10600] hover:bg-[#E10600]/10 transition-colors">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;