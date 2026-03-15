import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Filter,
  Star,
  ChevronDown,
  ChevronUp,
  Search,
  ShoppingBag,
  Heart,
  TrendingUp,
  Shield,
  Truck,
  Grid,
  List,
  Check,
  X,
  Sparkles,
  IndianRupee,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";
import PageHelmet from "../../component/common/PageHelmet";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
// import { useCart } from "../../hooks/useCart";
import { api } from "../../utils/app";
import { useCart } from "../../context/CartContext";

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 50, x: "-50%" }}
      className={`fixed bottom-4 left-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 ${
        type === "success" ? "bg-[#22C55E]" : "bg-[#E10600]"
      }`}
    >
      {type === "success" ? <Check size={20} /> : <ShoppingCart size={20} />}
      <span className="text-white font-medium">{message}</span>
    </motion.div>
  );
};

// Cart Drawer Component
const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getTotalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-[#0B0B0B] z-50 shadow-2xl border-l border-[#262626]"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-[#262626] bg-[#141414]">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="text-[#E10600]" />
                    Your Cart
                    <span className="text-sm bg-[#E10600] text-white px-2 py-1 rounded-full">
                      {getTotalItems()}
                    </span>
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-[#262626] rounded-full transition"
                  >
                    <ChevronRight className="text-white" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-[#262626] mx-auto mb-4" />
                    <p className="text-[#B3B3B3]">Your cart is empty</p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2 bg-[#E10600] text-white rounded-lg hover:bg-[#FF0800] transition"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 bg-[#141414] rounded-lg border border-[#262626]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold line-clamp-2 text-sm">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <IndianRupee className="w-4 h-4 text-[#E10600]" />
                          <span className="text-[#E10600] font-bold">
                            {item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 bg-[#262626] rounded hover:bg-[#E10600] transition"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-white w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 bg-[#262626] rounded hover:bg-[#E10600] transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-red-500 hover:bg-red-500/20 rounded transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[#262626] bg-[#141414]">
                  <div className="flex justify-between mb-4">
                    <span className="text-[#B3B3B3]">Subtotal</span>
                    <span className="text-white font-bold flex items-center">
                      <IndianRupee size={16} />
                      {getSubtotal().toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/checkout");
                    }}
                    className="w-full py-3 bg-[#E10600] text-white font-bold rounded-lg hover:bg-[#FF0800] transition mb-2"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2 text-[#B3B3B3] hover:text-white transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProductListPage = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategoryData, setSubcategoryData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  // Filter states
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showRatingFilter, setShowRatingFilter] = useState(true);
  const [showBrandFilter, setShowBrandFilter] = useState(true);

  // Use the cart hook - ADD updateQuantity here
  const {
    cartItems,
    showToast,
    isCartOpen,
    setIsCartOpen,
    setShowToast,
    addToCart,
    updateQuantity,  // Make sure this is included
    removeFromCart,  // Add this too
    toggleWishlist,
    isInWishlist,
    getCartQuantity,
    getTotalItems,
  } = useCart();

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

  // Get image URL
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
    
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    
    const storageUrl = import.meta.env.VITE_STORAGE_URL || '';
    return `${storageUrl}/${imagePath}`;
  }, []);

  // Get product image
  const getProductImage = useCallback((product) => {
    if (product.images && product.images.length > 0) {
      const thumbnail = product.images.find(img => img.is_thumbnail === 1);
      if (thumbnail) {
        return getImageUrl(thumbnail.image);
      }
      return getImageUrl(product.images[0].image);
    }
    return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
  }, [getImageUrl]);

  // Format price
  const formatIndianRupees = useCallback((amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Get badge based on product data
  const getProductBadge = useCallback((product) => {
    if (product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price)) {
      const discount = Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100);
      return `${discount}% OFF`;
    }
    if (product.rating >= 4.5 && product.review_count > 5) {
      return "BESTSELLER";
    }
    if (product.stock < 5) {
      return "LOW STOCK";
    }
    return null;
  }, []);

  // Fetch products based on subcategory
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/subcategory-products/${subcategory}`);
        
        if (response.data?.status) {
          const data = response.data.data;
          setSubcategoryData(data.subcategory);
          
          // Map products to display format
          const mappedProducts = data.products.map(product => ({
            id: product.id,
            name: product.name,
            brand: product.brand || "Premium", // Default brand if not available
            price: product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.price),
            sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
            originalPrice: parseFloat(product.price),
            rating: product.rating || 4.5,
            reviewCount: product.review_count || 0,
            image: getProductImage(product),
            category: data.subcategory.name,
            color: product.images?.[0]?.image_alt || "Various",
            inStock: product.stock > 0,
            fastDelivery: product.stock > 5, // Fast delivery if stock > 5
            discount: product.sale_price ? Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100) : 0,
            badge: getProductBadge(product),
            slug: product.slug,
            stock: product.stock,
            description: product.description,
            features: product.features?.map(f => f.feature) || [],
          }));
          
          setProducts(mappedProducts);
          setFilteredProducts(mappedProducts);
          
          // Set max price based on products
          const maxPrice = Math.max(...mappedProducts.map(p => p.originalPrice));
          setPriceRange({ min: 0, max: maxPrice || 100000 });
        } else {
          toast.error("Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    if (subcategory) {
      fetchProducts();
    }
  }, [subcategory, getProductImage, getProductBadge]);

  // Extract unique brands from products
  const brands = [...new Set(products.map(p => p.brand))];

  // Filter products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max,
    );

    // Rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((product) =>
        selectedRatings.some(
          (rating) => product.rating >= rating && product.rating < rating + 1,
        ),
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand),
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [
    searchQuery,
    priceRange,
    selectedRatings,
    selectedBrands,
    sortBy,
    products,
  ]);

  const handleRatingSelect = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating],
    );
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.originalPrice)) : 100000;
    setPriceRange({ min: 0, max: maxPrice });
    setSelectedRatings([]);
    setSelectedBrands([]);
    setSortBy("featured");
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
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-400"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) return <PageLoader />;

  return (
    <>
      <PageHelmet title={`${subcategoryData?.name || subcategory} - ONE REP MORE`} />

      <div className="min-h-screen bg-[#0B0B0B] py-10 pt-32 md:pt-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
              {subcategoryData?.name || subcategory.replace(/-/g, " ")}
            </h1>
            <p className="text-gray-400 mt-2">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {/* Cart Button - Fixed Position */}
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-8 right-8 z-40 bg-[#141414] p-4 rounded-full border border-[#262626] hover:border-[#E10600] transition group shadow-2xl"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-white group-hover:text-[#E10600] transition" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E10600] text-white text-xs rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
          </motion.button> */}

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
                  {(selectedRatings.length > 0 ||
                    selectedBrands.length > 0 ||
                    priceRange.min > 0 ||
                    priceRange.max < (products.length > 0 ? Math.max(...products.map(p => p.originalPrice)) : 100000)) && (
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
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
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
                    {showPriceFilter ? (
                      <ChevronUp size={20} className="text-[#E10600]" />
                    ) : (
                      <ChevronDown size={20} className="text-[#E10600]" />
                    )}
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
                        max={products.length > 0 ? Math.max(...products.map(p => p.originalPrice)) : 100000}
                        step="1000"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E10600]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              min: parseInt(e.target.value) || 0,
                            })
                          }
                          className="px-3 py-2 rounded-lg bg-[#0B0B0B] border border-[#262626] text-white text-sm focus:outline-none focus:border-[#E10600]"
                          placeholder="Min"
                        />
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              max: parseInt(e.target.value) || (products.length > 0 ? Math.max(...products.map(p => p.originalPrice)) : 100000),
                            })
                          }
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
                    <h3 className="font-semibold text-white">
                      Customer Rating
                    </h3>
                    {showRatingFilter ? (
                      <ChevronUp size={20} className="text-[#E10600]" />
                    ) : (
                      <ChevronDown size={20} className="text-[#E10600]" />
                    )}
                  </button>
                  {showRatingFilter && (
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedRatings.includes(rating)}
                            onChange={() => handleRatingSelect(rating)}
                            className="hidden"
                          />
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              selectedRatings.includes(rating)
                                ? "bg-[#E10600] border-[#E10600]"
                                : "bg-[#0B0B0B] border-[#262626] group-hover:border-[#E10600]"
                            }`}
                          >
                            {selectedRatings.includes(rating) && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(rating)}
                            <span className="text-gray-400 text-sm ml-2">
                              & above
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brand Filter */}
                {brands.length > 0 && (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowBrandFilter(!showBrandFilter)}
                      className="flex items-center justify-between w-full text-left mb-3"
                    >
                      <h3 className="font-semibold text-white">Brand</h3>
                      {showBrandFilter ? (
                        <ChevronUp size={20} className="text-[#E10600]" />
                      ) : (
                        <ChevronDown size={20} className="text-[#E10600]" />
                      )}
                    </button>
                    {showBrandFilter && (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {brands.map((brand) => (
                          <label
                            key={brand}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => handleBrandSelect(brand)}
                              className="hidden"
                            />
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                selectedBrands.includes(brand)
                                  ? "bg-[#E10600] border-[#E10600]"
                                  : "bg-[#0B0B0B] border-[#262626] group-hover:border-[#E10600]"
                              }`}
                            >
                              {selectedBrands.includes(brand) && (
                                <Check size={12} className="text-white" />
                              )}
                            </div>
                            <span className="text-gray-300 group-hover:text-white transition-colors">
                              {brand}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Active Filters */}
                {(selectedRatings.length > 0 || selectedBrands.length > 0) && (
                  <div className="mt-6 pt-6 border-t border-[#262626]">
                    <h4 className="font-semibold text-white mb-3">
                      Active Filters
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRatings.map((rating) => (
                        <div
                          key={rating}
                          className="px-3 py-1 bg-[#E10600]/20 text-[#E10600] rounded-full text-sm flex items-center gap-1"
                        >
                          {rating}+ Stars
                          <button
                            onClick={() => handleRatingSelect(rating)}
                            className="ml-1 hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {selectedBrands.map((brand) => (
                        <div
                          key={brand}
                          className="px-3 py-1 bg-[#E10600]/20 text-[#E10600] rounded-full text-sm flex items-center gap-1"
                        >
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
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "grid"
                            ? "bg-[#E10600] text-white"
                            : "bg-[#0B0B0B] text-gray-400 hover:text-white"
                        }`}
                      >
                        <Grid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === "list"
                            ? "bg-[#E10600] text-white"
                            : "bg-[#0B0B0B] text-gray-400 hover:text-white"
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
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden group hover:border-[#E10600] transition-colors"
                    >
                      <div>
                        {/* Product Image */}
                        <div className="relative overflow-hidden">
                          <Link to={`/product-details/${product.slug}`}>
                            <div className="h-64">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </Link>

                          {/* Badge */}
                          {product.badge && (
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-[#E10600] text-white text-sm font-bold rounded-full">
                                {product.badge}
                              </span>
                            </div>
                          )}

                          {/* Discount Badge (if not already shown) */}
                          {!product.badge && product.discount > 0 && (
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-[#E10600] text-white text-sm font-bold rounded-full">
                                {product.discount}% OFF
                              </span>
                            </div>
                          )}

                          {/* Cart Quantity Badge */}
                          {getCartQuantity(product.id) > 0 && (
                            <div className="absolute top-3 right-3">
                              <span className="px-3 py-1 bg-[#E10600] text-white text-xs font-bold rounded-full flex items-center gap-1">
                                <ShoppingCart size={12} />
                                {getCartQuantity(product.id)}
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
                              <Link to={`/product-details/${product.slug}`}>
                                <h3 className="font-semibold text-white group-hover:text-[#E10600] transition-colors line-clamp-1">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="text-gray-400 text-sm">
                                {product.brand}
                              </p>
                            </div>
                            <button 
                              onClick={() => toggleWishlist(product)}
                              className="text-gray-400 hover:text-[#E10600] transition-colors"
                            >
                              <Heart 
                                size={20} 
                                className={isInWishlist(product.id) ? "fill-[#E10600] text-[#E10600]" : ""}
                              />
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
                            {product.originalPrice > product.price && (
                              <span className="text-gray-500 line-through">
                                {formatIndianRupees(product.originalPrice)}
                              </span>
                            )}
                          </div>

                          {/* Features */}
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
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

                          {/* Add to Cart Button - FIXED HERE */}
                          {getCartQuantity(product.id) > 0 ? (
                            <div className="flex items-center gap-2 mt-4">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateQuantity(product.id, getCartQuantity(product.id) - 1);
                                }}
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                                style={{
                                  backgroundColor: colors.cardBg,
                                  border: `1px solid ${colors.border}`,
                                  color: colors.text,
                                }}
                              >
                                <Minus size={18} />
                              </button>
                              
                              <span 
                                className="flex-1 text-center font-bold py-2 rounded-lg"
                                style={{
                                  backgroundColor: `${colors.primary}20`,
                                  color: colors.primary,
                                }}
                              >
                                {getCartQuantity(product.id)} in cart
                              </span>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateQuantity(product.id, getCartQuantity(product.id) + 1);
                                }}
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                                style={{
                                  backgroundColor: colors.cardBg,
                                  border: `1px solid ${colors.border}`,
                                  color: colors.text,
                                }}
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              disabled={!product.inStock}
                              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg ${
                                product.inStock 
                                  ? "bg-[#E10600] text-white hover:bg-[#FF0000]" 
                                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
                              }`}
                            >
                              <ShoppingBag size={18} />
                              {product.inStock ? "Add to Cart" : "Out of Stock"}
                            </button>
                          )}
                        </div>
                      </div>
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
                      <div>
                        <div className="flex flex-col md:flex-row">
                          {/* Product Image */}
                          <div className="md:w-1/3 relative">
                            <Link to={`/product-details/${product.slug}`}>
                              <div className="h-64 md:h-auto">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </Link>
                            
                            {/* Badge */}
                            {product.badge && (
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 bg-[#E10600] text-white text-sm font-bold rounded-full">
                                  {product.badge}
                                </span>
                              </div>
                            )}

                            {/* Cart Quantity Badge */}
                            {getCartQuantity(product.id) > 0 && (
                              <div className="absolute top-3 right-3">
                                <span className="px-3 py-1 bg-[#E10600] text-white text-xs font-bold rounded-full flex items-center gap-1">
                                  <ShoppingCart size={12} />
                                  {getCartQuantity(product.id)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="md:w-2/3 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <Link to={`/product-details/${product.slug}`}>
                                  <h3 className="text-xl font-bold text-white group-hover:text-[#E10600] transition-colors">
                                    {product.name}
                                  </h3>
                                </Link>
                                <p className="text-gray-400">
                                  {product.brand} • {product.category}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => toggleWishlist(product)}
                                  className="text-gray-400 hover:text-[#E10600] transition-colors"
                                >
                                  <Heart 
                                    size={20} 
                                    className={isInWishlist(product.id) ? "fill-[#E10600] text-[#E10600]" : ""}
                                  />
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
                            <p className="text-gray-300 mb-6 line-clamp-2">
                              {product.description || `Premium quality ${product.category.toLowerCase()} designed for performance and comfort. Perfect for your active lifestyle.`}
                            </p>

                            {/* Features */}
                            {product.features.length > 0 && (
                              <div className="grid grid-cols-2 gap-3 mb-6">
                                {product.features.slice(0, 3).map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                                    <Sparkles size={14} />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Price and Action - FIXED HERE */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl font-bold text-white">
                                    {formatIndianRupees(product.price)}
                                  </span>
                                  {product.originalPrice > product.price && (
                                    <>
                                      <span className="text-gray-500 line-through">
                                        {formatIndianRupees(product.originalPrice)}
                                      </span>
                                      {product.discount > 0 && (
                                        <span className="text-[#E10600] font-semibold">
                                          Save {product.discount}%
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                                <p className="text-gray-400 text-sm mt-1">
                                  EMI starts at {formatIndianRupees(product.price / 6)}/month
                                </p>
                              </div>

                              {getCartQuantity(product.id) > 0 ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      updateQuantity(product.id, getCartQuantity(product.id) - 1);
                                    }}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                                    style={{
                                      backgroundColor: colors.cardBg,
                                      border: `1px solid ${colors.border}`,
                                      color: colors.text,
                                    }}
                                  >
                                    <Minus size={18} />
                                  </button>
                                  
                                  <span 
                                    className="px-4 py-2 rounded-lg font-bold"
                                    style={{
                                      backgroundColor: `${colors.primary}20`,
                                      color: colors.primary,
                                    }}
                                  >
                                    {getCartQuantity(product.id)} in cart
                                  </span>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      updateQuantity(product.id, getCartQuantity(product.id) + 1);
                                    }}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                                    style={{
                                      backgroundColor: colors.cardBg,
                                      border: `1px solid ${colors.border}`,
                                      color: colors.text,
                                    }}
                                  >
                                    <Plus size={18} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(product)}
                                  disabled={!product.inStock}
                                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                                    product.inStock 
                                      ? "bg-[#E10600] text-white hover:bg-[#FF0000]" 
                                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                                  }`}
                                >
                                  <ShoppingBag size={18} />
                                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More */}
              {filteredProducts.length > 0 && filteredProducts.length < products.length && (
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

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <Toast
            message={showToast.message}
            type={showToast.type}
            onClose={() => setShowToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default ProductListPage;