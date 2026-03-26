import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Filter,
  Search,
  Grid,
  List,
  Star,
  ShoppingBag,
  TrendingUp,
  Zap,
  Shield,
  Truck,
  ChevronRight,
  Heart,
  Eye,
  Clock,
  TrendingDown,
  IndianRupee,
  Check,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";
import PageHelmet from "../../component/common/PageHelmet";
import { api } from "../../utils/app";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
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

const ProductPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);

  // Use the cart hook
  const {
    cartItems,
    showToast,
    isCartOpen,
    setIsCartOpen,
    setShowToast,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    isInWishlist,
    getCartQuantity,
    getTotalItems,
  } = useCart();

  // Fetch category data
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/category/${category}`);

        if (response.data?.status) {
          setCategoryData(response.data.data);
        } else {
          toast.error("Category not found");
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        toast.error("Failed to load category data");
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryData();
    }
  }, [category]);

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";

    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }

    const storageUrl = import.meta.env.VITE_STORAGE_URL || "";
    return `${storageUrl}/${imagePath}`;
  };

  // Get product image
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const thumbnail = product.images.find((img) => img.is_thumbnail === 1);
      if (thumbnail) {
        return getImageUrl(thumbnail.image);
      }
      return getImageUrl(product.images[0].image);
    }
    return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
  };

  // Format price
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("en-IN");
  };

  // Get badge based on product data
  const getProductBadge = (product) => {
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
      return "BESTSELLER";
    }
    if (product.stock < 5) {
      return "LOW STOCK";
    }
    return null;
  };

  // Map category products to display format
  const categoryProducts =
    categoryData?.category_products?.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category?.name || "Equipment",
      image: getProductImage(product),
      price: product.sale_price
        ? parseFloat(product.sale_price)
        : parseFloat(product.price),
      sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
      originalPrice: parseFloat(product.price),
      rating: product.rating || 4.5,
      reviews: product.review_count || 0,
      badge: getProductBadge(product),
      slug: product.slug,
      stock: product.stock || 10,
      variants: product.variants || [],
    })) || [];

  // Filter options
  const filters = [
    { id: "featured", label: "Featured", icon: TrendingUp },
    { id: "newest", label: "Newest", icon: Zap },
    { id: "price-high", label: "Price: High to Low", icon: TrendingDown },
    { id: "price-low", label: "Price: Low to High", icon: TrendingDown },
    { id: "rating", label: "Highest Rated", icon: Star },
  ];

  // Sort products based on selected option
  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  if (loading) return <PageLoader />;

  return (
    <>
      <PageHelmet
        title={`${categoryData?.category?.name || category} - ONE REP MORE`}
      />

      <div className="min-h-screen pt-30 md:pt-40 bg-main">
        {/* Hero Banner */}
        <div className="relative py-12 md:py-20 px-4 md:px-8 mb-12 overflow-hidden bg-gradient-to-r from-main to-[#1a1a1a] border-b border-theme">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  <span className="text-primary">Premium </span>
                  <span className="text-brand">
                    {categoryData?.category?.name || category}
                  </span>
                </h1>
                <p className="text-xl mb-8 max-w-2xl text-muted">
                  Discover our premium collection of{" "}
                  {categoryData?.category?.name || category} equipment designed
                  for serious athletes and fitness enthusiasts.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Shield size={20} className="text-success" />
                    <span className="text-primary">2-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={20} className="text-success" />
                    <span className="text-primary">Free Shipping</span>
                  </div>
                </div>
              </div>

              <div className="relative w-full md:w-1/3">
                <div className="absolute inset-0 bg-gradient-to-r from-brand to-transparent opacity-20 rounded-3xl" />
                <img
                  src={
                    categoryData?.category?.image
                      ? getImageUrl(categoryData.category.image)
                      : "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
                  }
                  alt={categoryData?.category?.name || category}
                  className="rounded-3xl w-full h-64 md:h-80 object-cover relative z-10"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
          {/* Subcategories Section - Show only if subcategories exist */}
          {categoryData?.subcategories &&
            categoryData.subcategories.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-primary">
                      Shop By Subcategory
                    </h2>
                    <p className="text-muted">
                      Browse our wide range of {categoryData?.category?.name}{" "}
                      categories
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryData.subcategories.map((subcat) => (
                    <Link
                      key={subcat.id}
                      to={`/products/${categoryData.category.slug}/${subcat.slug}`}
                      className="group"
                    >
                      <div className="h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 card">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={
                              subcat.image
                                ? getImageUrl(subcat.image)
                                : "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop"
                            }
                            alt={subcat.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-bold text-primary mb-1">
                              {subcat.name}
                            </h3>
                            <p className="text-sm text-primary/80">
                              {subcat.products?.length || 0} items
                            </p>
                          </div>
                        </div>

                        <div className="p-6">
                          <p className="mb-4 text-muted">
                            Explore our collection of {subcat.name} for your
                            fitness needs.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 text-xs rounded-full bg-primary-light text-brand border border-primary/20">
                              {subcat.products?.length || 0} Products
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* Products Section - Show only if products exist */}
          {categoryProducts.length > 0 ? (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-primary">
                    {categoryData?.category?.name} Products
                  </h2>
                  <p className="text-muted">
                    Browse our collection of {categoryData?.category?.name}{" "}
                    equipment
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex items-center gap-2 p-1 rounded-lg bg-card">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded transition-all ${
                        viewMode === "grid"
                          ? "bg-primary text-primary"
                          : "text-muted hover:text-primary"
                      }`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded transition-all ${
                        viewMode === "list"
                          ? "bg-primary text-primary"
                          : "text-muted hover:text-primary"
                      }`}
                    >
                      <List size={20} />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg focus:outline-none bg-card border-theme text-primary cursor-pointer"
                  >
                    {filters.map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Grid/List */}
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                    : "space-y-4"
                } gap-6`}
              >
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group block cursor-pointer"
                    onClick={() => navigate(`/product-details/${product.slug}`)}
                  >
                    <div
                      className={`${
                        viewMode === "grid"
                          ? "rounded-2xl overflow-hidden h-full card"
                          : "flex items-center gap-6 p-4 rounded-2xl card"
                      }`}
                    >
                      {/* Product Image */}
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === "grid"
                            ? "h-48"
                            : "w-32 h-32 flex-shrink-0"
                        }`}
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
                        {product.badge && (
                          <div className="absolute top-3 left-3">
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded ${
                                product.badge.includes("% OFF")
                                  ? "badge-success"
                                  : product.badge === "BESTSELLER"
                                  ? "badge-primary"
                                  : product.badge === "LOW STOCK"
                                  ? "badge-warning"
                                  : "badge-primary"
                              }`}
                            >
                              {product.badge}
                            </span>
                          </div>
                        )}

                        {/* Stock Indicator */}
                        {product.stock < 5 && (
                          <div className="absolute bottom-3 left-3">
                            <span className="px-2 py-1 text-xs font-bold rounded badge-warning">
                              Only {product.stock} left
                            </span>
                          </div>
                        )}

                        {/* Cart Quantity Badge */}
                        {getCartQuantity(product.id) > 0 && (
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 text-xs font-bold rounded flex items-center gap-1 badge-primary">
                              <ShoppingCart size={12} />
                              {getCartQuantity(product.id)}
                            </span>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center mb-2 bg-card text-primary hover:bg-primary hover:text-primary transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product-details/${product.slug}`);
                            }}
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div
                        className={`${viewMode === "grid" ? "p-4" : "flex-1"}`}
                      >
                        <div className="mb-2">
                          <span className="text-xs font-semibold uppercase px-2 py-1 rounded bg-primary-light text-brand">
                            {categoryData?.category?.name}
                          </span>
                        </div>

                        <h3 className="font-bold mb-2 group-hover:text-brand transition-colors text-primary">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${
                                  i < Math.floor(product.rating)
                                    ? "text-warning fill-warning"
                                    : "text-border"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted">
                            ({product.reviews})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center">
                            <IndianRupee size={16} className="text-primary" />
                            <span className="text-xl font-bold ml-1 text-primary">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="flex items-center">
                              <IndianRupee size={12} className="text-muted" />
                              <span className="text-sm line-through ml-1 text-muted">
                                {formatPrice(product.originalPrice)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        {getCartQuantity(product.id) > 0 ? (
                          <div className="flex items-center gap-2 mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(
                                  product.id,
                                  getCartQuantity(product.id) - 1,
                                );
                              }}
                              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all bg-card border-theme text-primary hover:bg-primary hover:text-primary"
                            >
                              <Minus size={18} />
                            </button>

                            <span className="flex-1 text-center font-bold py-2 rounded-lg bg-primary-light text-brand">
                              {getCartQuantity(product.id)} in cart
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(
                                  product.id,
                                  getCartQuantity(product.id) + 1,
                                );
                              }}
                              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all bg-card border-theme text-primary hover:bg-primary hover:text-primary"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="w-full mt-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-primary-hover btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                          >
                            <ShoppingBag size={18} />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // No Products Message
            <div className="text-center py-16 mb-16">
              <div className="max-w-md mx-auto">
                <ShoppingBag size={64} className="mx-auto mb-4 text-muted" />
                <h3 className="text-2xl font-bold mb-2 text-primary">
                  No Products Found
                </h3>
                <p className="mb-6 text-muted">
                  We couldn't find any products in this category. Please check
                  back later or explore other categories.
                </p>
              </div>
            </div>
          )}
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
    </>
  );
};

export default ProductPage;