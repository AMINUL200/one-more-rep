import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dumbbell,
  Shirt,
  Utensils,
  Weight,
  HeartPulse,
  ArrowRight,
  Star,
  ShoppingBag,
  Truck,
  Shield,
  ChevronRight,
  Eye,
  ShoppingCart,
  IndianRupee,
  Heart,
  Check,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { premiumFadeUp, premiumItem } from "../../animations/motionVariants";
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
        type === "success" ? "bg-success" : "bg-primary"
      }`}
    >
      {type === "success" ? (
        <Check size={20} className="text-primary" />
      ) : (
        <ShoppingCart size={20} className="text-primary" />
      )}
      <span className="text-primary font-medium">{message}</span>
    </motion.div>
  );
};

// Cart Drawer Component
const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getSubtotal,
    getTotalItems,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-overlay z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-main z-50 shadow-2xl border-l border-theme"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-theme bg-card">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <ShoppingCart className="text-brand" />
                    Your Cart
                    <span className="text-sm bg-primary text-primary px-2 py-1 rounded-full">
                      {getTotalItems()}
                    </span>
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-border rounded-full transition"
                  >
                    <ChevronRight className="text-primary" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-border mx-auto mb-4" />
                    <p className="text-muted">Your cart is empty</p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2 bg-primary text-primary rounded-lg hover:bg-primary-hover transition"
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
                      className="flex gap-4 p-4 bg-card rounded-lg border border-theme"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-primary font-semibold line-clamp-2 text-sm">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <IndianRupee className="w-4 h-4 text-brand" />
                          <span className="text-brand font-bold">
                            {item.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1 bg-border rounded hover:bg-primary transition group"
                            >
                              <Minus
                                size={14}
                                className="text-primary group-hover:text-primary"
                              />
                            </button>
                            <span className="text-primary w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 bg-border rounded hover:bg-primary transition group"
                            >
                              <Plus
                                size={14}
                                className="text-primary group-hover:text-primary"
                              />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-error hover:bg-error/20 rounded transition"
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
                <div className="p-6 border-t border-theme bg-card">
                  <div className="flex justify-between mb-4">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-primary font-bold flex items-center">
                      <IndianRupee size={16} className="text-brand" />
                      {getSubtotal().toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/checkout");
                    }}
                    className="w-full py-3 bg-primary text-primary font-bold rounded-lg hover:bg-primary-hover transition mb-2"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2 text-muted hover:text-primary transition"
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

const ProductSection = ({ productData, title }) => {
  const navigate = useNavigate();

  const formatTitle = (title) => {
    if (!title) return { first: "", last: "" };

    const words = title.split(" ");
    const last = words.pop(); // last word
    const first = words.join(" "); // remaining

    return { first, last };
  };
  const { first, last } = formatTitle(title || "Premium Gym Products");

  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Use the cart hook
  const {
    cartItems,
    showToast,
    isCartOpen,
    isLoaded,
    setIsCartOpen,
    setShowToast,
    addToCart,
    toggleWishlist,
    isInWishlist,
    getCartQuantity,
    getTotalItems,
  } = useCart();

  // Get image URL - memoized to prevent recreation
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
    }

    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }

    const storageUrl = import.meta.env.VITE_STORAGE_URL || "";
    return `${storageUrl}/${imagePath}`;
  }, []);

  // Get product image - memoized
  const getProductImage = useCallback(
    (product) => {
      if (product.images && product.images.length > 0) {
        const thumbnail = product.images.find((img) => img.is_thumbnail === 1);
        if (thumbnail) {
          return getImageUrl(thumbnail.image);
        }
        return getImageUrl(product.images[0].image);
      }
      return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
    },
    [getImageUrl],
  );

  // Get icon based on category name - memoized
  const getCategoryIcon = useCallback((categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes("equipment") || name.includes("machine"))
      return <Dumbbell className="w-5 h-5" />;
    if (
      name.includes("wear") ||
      name.includes("clothing") ||
      name.includes("shoe")
    )
      return <Shirt className="w-5 h-5" />;
    if (name.includes("supplement") || name.includes("protein"))
      return <Utensils className="w-5 h-5" />;
    if (name.includes("accessories")) return <Weight className="w-5 h-5" />;
    if (name.includes("cardio")) return <HeartPulse className="w-5 h-5" />;
    return <Dumbbell className="w-5 h-5" />;
  }, []);

  // Get color based on category name - memoized
  const getCategoryColor = useCallback((categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes("equipment") || name.includes("machine"))
      return "from-success to-[#4ADE80]";
    if (name.includes("wear") || name.includes("clothing"))
      return "from-[#8B5CF6] to-[#A78BFA]";
    if (name.includes("supplement")) return "from-warning to-[#FDE047]";
    if (name.includes("accessories")) return "from-[#3B82F6] to-[#60A5FA]";
    if (name.includes("cardio")) return "from-error to-[#F87171]";
    return "from-brand to-[#FF4D4D]";
  }, []);

  // Get badge based on product data - memoized
  const getProductBadge = useCallback((product) => {
    if (
      product.sale_price &&
      parseFloat(product.sale_price) < parseFloat(product.price)
    ) {
      const discount = Math.round(
        ((parseFloat(product.price) - parseFloat(product.sale_price)) /
          parseFloat(product.price)) *
          100,
      );
      return `${discount}% OFF`;
    }
    if (product.rating >= 4.5 && product.review_count > 5) {
      return "BEST SELLER";
    }
    if (product.stock < 5) {
      return "LOW STOCK";
    }
    return "FEATURED";
  }, []);

  // Format price in rupees - memoized
  const formatPrice = useCallback((price) => {
    return parseFloat(price).toLocaleString("en-IN");
  }, []);

  // Memoize allProducts to prevent recalculation on every render
  const allProducts = useMemo(() => {
    if (!productData || productData.length === 0) return [];

    return productData.map((product) => ({
      id: product.id,
      name: product.name,
      category:
        product.category?.slug ||
        `cat-${product.category?.id}` ||
        "uncategorized",
      categoryName: product.category?.name || "Uncategorized",
      price: product.sale_price
        ? parseFloat(product.sale_price)
        : parseFloat(product.price),
      sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
      originalPrice: parseFloat(product.price),
      rating: product.rating || 4.5,
      reviews: product.review_count || 0,
      image: getProductImage(product),
      description: product.description || "Premium quality gym equipment",
      features: product.features?.map((f) => f.feature).slice(0, 3) || [
        "High Quality",
        "Durable",
        "Premium",
      ],
      badge: getProductBadge(product),
      slug: product.slug,
      stock: product.stock || 10,
      variants: product.variants || [],
    }));
  }, [productData, getProductImage, getProductBadge]);

  // Memoize categories to prevent recalculation on every render
  const categories = useMemo(() => {
    if (!productData || productData.length === 0) return [];

    const uniqueCategories = [];
    const categoryMap = new Map();

    productData.forEach((product) => {
      if (product.category && !categoryMap.has(product.category.id)) {
        categoryMap.set(product.category.id, {
          id: product.category.slug || `cat-${product.category.id}`,
          name: product.category.name,
          icon: getCategoryIcon(product.category.name),
          color: getCategoryColor(product.category.name),
        });
      }
    });

    // Add "All Products" at the beginning
    return [
      {
        id: "all",
        name: "All Products",
        icon: <ShoppingBag className="w-5 h-5" />,
        color: "from-brand to-[#FF4D4D]",
      },
      ...Array.from(categoryMap.values()),
    ];
  }, [productData, getCategoryIcon, getCategoryColor]);

  // Filter products based on category - with proper dependencies
  useEffect(() => {
    if (!allProducts.length) return;

    let filtered;
    if (activeCategory === "all") {
      filtered = showAll ? allProducts : allProducts.slice(0, 3);
    } else {
      const filteredByCategory = allProducts.filter(
        (product) => product.category === activeCategory,
      );
      filtered = showAll ? filteredByCategory : filteredByCategory.slice(0, 3);
    }
    setFilteredProducts(filtered);
  }, [activeCategory, showAll, allProducts]);

  // Benefits data - static, no need to memoize
  const benefits = [
    { icon: <Truck className="w-6 h-6" />, text: "Free Shipping Over ₹999" },
    { icon: <Shield className="w-6 h-6" />, text: "2 Year Warranty" },
    { icon: <Star className="w-6 h-6" />, text: "Premium Quality" },
  ];

  // Don't render if no products
  if (!productData || productData.length === 0) {
    return (
      <div className="bg-main py-16 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted">No products available</p>
        </div>
      </div>
    );
  }

  // Show loading state while cart is being loaded
  if (!isLoaded) {
    return (
      <div className="bg-main py-16 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="loading-pulse">
            <div className="h-8 bg-border rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-border rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-main py-16 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 relative">
          <motion.h2
            variants={premiumFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-5xl font-bold mb-4"
          >
            <span className="text-primary">{first} </span>
            <span className="text-brand">{last}</span>
          </motion.h2>

          <motion.p
            variants={premiumFadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
            className="text-muted text-lg md:text-xl max-w-3xl mx-auto"
          >
            Discover professional-grade equipment, supplements, and apparel
            designed for serious athletes
          </motion.p>
        </div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                  onClick={() => {
                    setActiveCategory(category.id);
                    setShowAll(false);
                  }}
                  className={`group flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeCategory === category.id
                      ? `bg-gradient-to-r ${category.color} border-transparent text-primary shadow-lg scale-105`
                      : "bg-card border-theme text-muted hover:border-brand hover:text-primary"
                  }`}
                >
                  <div
                    className={`${
                      activeCategory === category.id
                        ? "text-primary"
                        : "text-current"
                    }`}
                  >
                    {category.icon}
                  </div>
                  <span className="font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-12">
          {filteredProducts.length > 0 ? (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    variants={premiumItem}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{
                      y: -10,
                      scale: 1.03,
                    }}
                    className="group card rounded-2xl overflow-hidden hover:border-primary hover:transform hover:scale-[1.02] transition-all duration-300"
                  >
                    {/* Product Image */}
                    <motion.div
                      whileHover={{ scale: 1.12 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="relative h-64 overflow-hidden"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
                        }}
                      />

                      {/* Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 badge ${
                            product.badge.includes("% OFF")
                              ? "badge-success"
                              : product.badge === "BEST SELLER"
                                ? "badge-primary"
                                : product.badge === "LOW STOCK"
                                  ? "badge-warning"
                                  : "badge-primary"
                          }`}
                        >
                          {product.badge}
                        </span>
                      </div>

                      {/* Category Tag */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-overlay backdrop-blur-sm text-primary text-xs font-medium rounded-full">
                          {product.categoryName || product.category}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute bottom-4 right-4 p-2 bg-overlay backdrop-blur-sm rounded-full hover:bg-primary transition group"
                      >
                        <Heart
                          size={18}
                          className={
                            isInWishlist(product.id)
                              ? "fill-primary text-primary"
                              : "text-primary group-hover:text-primary"
                          }
                        />
                      </button>

                      {/* Stock Indicator */}
                      {product.stock < 5 && (
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 badge-warning">
                            Only {product.stock} left
                          </span>
                        </div>
                      )}

                      {/* Cart Quantity Badge */}
                      {getCartQuantity(product.id) > 0 && (
                        <div className="absolute top-16 left-4">
                          <span className="px-3 py-1 badge-primary flex items-center gap-1">
                            <ShoppingCart size={12} />
                            {getCartQuantity(product.id)} in cart
                          </span>
                        </div>
                      )}
                    </motion.div>

                    {/* Product Info */}
                    <div className="p-6">
                      {/* Product Name & Rating */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-brand transition-colors">
                          {product.name}
                        </h3>
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? "text-warning"
                                    : "text-border"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-muted text-sm">
                            {product.rating.toFixed(1)} ({product.reviews})
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {product.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-main border border-theme text-muted text-xs rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price in Rupees */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-baseline gap-2">
                            <div className="flex items-center">
                              <IndianRupee className="w-5 h-5 text-brand" />
                              <span className="text-2xl font-bold text-primary ml-1">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                            {product.originalPrice &&
                              product.originalPrice !== product.price && (
                                <div className="flex items-center">
                                  <IndianRupee className="w-4 h-4 text-brand" />
                                  <span className="price-original text-brand line-through ml-1">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                </div>
                              )}
                          </div>
                          {/* {product.originalPrice &&
                            product.originalPrice !== product.price && (
                              <div className="mt-1">
                                <span className="text-success text-sm font-semibold">
                                  Save ₹
                                  {(
                                    product.originalPrice - product.price
                                  ).toLocaleString("en-IN")}
                                </span>
                              </div>
                            )} */}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        {/* VIEW BUTTON */}
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() =>
                            navigate(
                              `/product-details/${product.slug || product.id}`,
                            )
                          }
                          className="
                            flex-1 flex items-center justify-center gap-2
                            px-5 py-3 btn-secondary
                            rounded-lg
                          "
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>

                        {/* ADD TO CART BUTTON */}
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          className={`
                            flex-1 flex items-center justify-center gap-2
                            px-5 py-3 btn-primary
                            rounded-lg
                            ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                          onClick={() =>
                            product.stock > 0 && addToCart(product)
                          }
                          disabled={product.stock === 0}
                        >
                          {getCartQuantity(product.id) > 0 ? (
                            <>
                              <Check className="w-4 h-4" />
                              Added ({getCartQuantity(product.id)})
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Dumbbell className="w-16 h-16 text-border mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary mb-2">
                  No Products Found
                </h3>
                <p className="text-muted">
                  No products available in this category. Please check back
                  later.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View All Button */}
        {filteredProducts.length > 0 && !showAll && (
          <div className="text-center mb-16">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(true)}
              className="
                group inline-flex items-center gap-3
                px-8 py-4 btn-secondary
                rounded-lg
                focus:outline-none
                focus:ring-2 focus:ring-brand/50
              "
            >
              View All{" "}
              {activeCategory === "all"
                ? "Products"
                : categories.find((c) => c.id === activeCategory)?.name ||
                  "Products"}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Benefits Bar */}
      <div className="border-t border-theme bg-main py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-3 text-primary"
              >
                <div className="text-brand">{benefit.icon}</div>
                <span className="font-medium">{benefit.text}</span>
              </motion.div>
            ))}
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
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: var(--bg-border);
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary-hover);
        }
      `}</style>
    </div>
  );
};

export default ProductSection;
