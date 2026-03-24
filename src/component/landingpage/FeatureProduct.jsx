import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  ShoppingCart,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Check,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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

const FeatureProduct = ({ featureProduct }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

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

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
    }

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
    return "FEATURED";
  };

  const getBadgeColor = (badge) => {
    if (badge.includes("% OFF")) return "badge-success";
    if (badge === "BESTSELLER") return "badge-primary";
    if (badge === "LOW STOCK") return "badge-warning";
    return "badge-primary";
  };

  // Format price in rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Prepare products
  const products =
    featureProduct && featureProduct.length > 0
      ? featureProduct.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.sale_price
            ? parseFloat(product.sale_price)
            : parseFloat(product.price),
          sale_price: product.sale_price
            ? parseFloat(product.sale_price)
            : null,
          originalPrice: parseFloat(product.price),
          image: getProductImage(product),
          badge: getProductBadge(product),
          rating: product.rating || 4.5,
          reviews: product.review_count || 0,
          slug: product.slug,
          stock: product.stock || 10,
          variants: product.variants || [],
        }))
      : [];

  // Don't render if no products
  if (!featureProduct || featureProduct.length === 0) {
    return (
      <section className="py-16 bg-main">
        <div className="max-w-8xl mx-auto px-4 text-center">
          <p className="text-muted">No featured products available</p>
        </div>
      </section>
    );
  }

  // Show loading state while cart is being loaded
  if (!isLoaded) {
    return (
      <section className="py-16 bg-main">
        <div className="max-w-8xl mx-auto px-4 text-center">
          <div className="loading-pulse">
            <div className="h-8 bg-border rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-border rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-main">
      <div className="max-w-8xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 relative">
          <motion.h2
            variants={premiumFadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl font-bold mb-4"
          >
            <span className="text-primary">Featured </span>
            <span className="text-brand">Products</span>
          </motion.h2>

          <motion.p
            variants={premiumFadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="text-muted text-lg max-w-2xl mx-auto"
          >
            Premium gym equipment handpicked for serious athletes. Build
            strength, build legacy.
          </motion.p>
        </div>

        {/* Swiper Carousel */}
        <div className="relative px-4 md:px-16">
          <Swiper
            // modules={[Navigation, Pagination, Autoplay]}
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              el: ".swiper-pagination-custom",
              clickable: true,
            }}
            // autoplay={{
            //   delay: 4000,
            //   disableOnInteraction: false,
            // }}
            loop={true}
            speed={800}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="pb-16"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <motion.div
                  variants={premiumItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: (product.id % 10) * 0.05 }}
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <motion.div
                    whileHover={{ y: -14, scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 160, damping: 18 }}
                    className={`card group rounded-2xl overflow-hidden border-2 transition-all duration-300 h-full ${
                      hoveredCard === product.id
                        ? "border-primary shadow-primary"
                        : "border-theme"
                    }`}
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden group">
                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
                          }}
                        />
                      </motion.div>

                      {/* Badge */}
                      <div
                        className={`absolute top-4 left-4 badge ${getBadgeColor(
                          product.badge,
                        )}`}
                      >
                        {product.badge}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-4 right-4 p-2 bg-overlay backdrop-blur-sm rounded-full hover:bg-primary transition group"
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
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-primary text-xl font-bold mb-2 group-hover:text-brand line-clamp-1">
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

                      {/* Price in Rupees */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center text-primary ">
                          <IndianRupee className="w-5 h-5 text-brand" />
                          <span className="price text-2xl font-bold ml-1">
                            {formatPrice(product.price).replace("₹", "")}
                          </span>
                        </div>
                        {product.sale_price &&
                          product.sale_price < product.originalPrice && (
                            <div className="flex items-center">
                              <span className="price-original text-lg text-brand line-through">
                                ₹{product.originalPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {/* VIEW BUTTON */}
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.94 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="
                            flex-1 flex items-center justify-center gap-2
                            py-3 btn-secondary
                            rounded-lg
                          "
                          onClick={() =>
                            navigate(
                              `/product-details/${product.slug || product.id}`,
                            )
                          }
                        >
                          <Eye className="w-5 h-5" />
                          View
                        </motion.button>

                        {/* ADD TO CART BUTTON */}
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.94 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className={`
                            flex-1 flex items-center justify-center gap-2
                            py-3 btn-primary
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
                              <Check className="w-5 h-5" />
                              Added ({getCartQuantity(product.id)})
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" />
                              Add to Cart
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 btn-primary p-4 rounded-full swiper-button-custom"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 btn-primary p-4 rounded-full swiper-button-custom"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Custom Pagination */}
          <div className="swiper-pagination-custom flex justify-center gap-2 mt-4"></div>
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
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: var(--bg-border);
          opacity: 1;
          transition: all 0.3s;
          border-radius: 4px;
        }

        .swiper-pagination-custom .swiper-pagination-bullet-active {
          width: 32px;
          background: var(--color-primary);
        }

        .swiper-pagination-custom .swiper-pagination-bullet:hover {
          background: var(--text-muted);
        }
      `}</style>
    </section>
  );
};

export default FeatureProduct;
