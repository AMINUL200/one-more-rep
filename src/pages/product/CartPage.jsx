import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  CreditCard,
  Lock,
  ChevronLeft,
  Calendar,
  CheckCircle,
  IndianRupee,
  Receipt,
  Percent,
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";
import PageHelmet from "../../component/common/PageHelmet";
import { useCart } from "../../hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../../utils/app";

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Use the cart hook
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getSubtotal,
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

  // Loader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

  const formatIndianRupees = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0,
    );
  };

  const calculateSavings = () => {
    return cartItems.reduce((sum, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return sum + (item.originalPrice - item.price) * (item.quantity || 1);
      }
      return sum;
    }, 0);
  };

  const total = calculateSubtotal(); // Total is same as subtotal (no GST or shipping)

  const [couponCode, setCouponCode] = useState("");
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  const applyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim() === "FITNESS10") {
      setCouponApplied(true);
      setCouponCode("");
      setShowCouponForm(false);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location },
      });
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setCheckoutLoading(true);

    try {
      // Prepare order data
      const orderData = {
        products: cartItems.map(item => ({
          product_id: item.id,
          qty: item.quantity || 1,
          price: item.price
        }))
      };

      console.log("Order Data:", orderData);
      console.log("user Data ::", user)

      const response = await api.post("/user/checkout", orderData);

      if (response.data?.status) {
        toast.success("Order placed successfully!");
        navigate(`/checkout/${response.data.data?.id}`);
      } else {
        toast.error(response.data?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      
      if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          Object.values(errors).forEach(msg => {
            toast.error(msg[0]);
          });
        } else {
          toast.error("Please check your order details");
        }
      } else {
        toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <>
      <PageHelmet title="Shopping Cart - ONE REP MORE" />
      <div
        style={{ backgroundColor: colors.background }}
        className="min-h-screen py-8 px-4 md:px-8 pt-30 md:pt-40"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <ShoppingCart size={24} style={{ color: colors.primary }} />
              </div>
              <div>
                <h1
                  className="text-3xl md:text-4xl font-bold"
                  style={{ color: colors.text }}
                >
                  Your Shopping Cart
                </h1>
                <p className="text-lg" style={{ color: colors.muted }}>
                  {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}{" "}
                  in your cart
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                {["Cart", "Shipping", "Payment", "Confirmation"].map(
                  (step, index) => (
                    <div key={step} className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            index === 0
                              ? "bg-[#E10600] text-white"
                              : "bg-[#262626] text-[#B3B3B3]"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            index === 0 ? "text-white" : "text-[#B3B3B3]"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                      {index < 3 && <div className="w-12 h-px bg-[#262626]" />}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              {/* Cart Items List */}
              {cartItems.length > 0 ? (
                <AnimatePresence>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="rounded-2xl overflow-hidden group"
                        style={{
                          backgroundColor: colors.cardBg,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Product Image */}
                            <div className="relative">
                              <div className="w-32 h-32 rounded-xl overflow-hidden">
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
                                  }}
                                />
                              </div>
                              {item.originalPrice &&
                                item.originalPrice > item.price && (
                                  <div className="absolute -top-2 -left-2">
                                    <span
                                      className="px-2 py-1 rounded text-xs font-bold text-white"
                                      style={{
                                        backgroundColor: colors.primary,
                                      }}
                                    >
                                      SAVE{" "}
                                      {formatIndianRupees(
                                        (item.originalPrice - item.price) *
                                          (item.quantity || 1),
                                      )}
                                    </span>
                                  </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className="text-xs font-semibold uppercase px-2 py-1 rounded"
                                      style={{
                                        backgroundColor: `${colors.primary}20`,
                                        color: colors.primary,
                                      }}
                                    >
                                      {item.category || "Equipment"}
                                    </span>
                                    {item.stock > 0 ? (
                                      <span
                                        className="text-xs font-semibold px-2 py-1 rounded flex items-center gap-1"
                                        style={{
                                          backgroundColor: `${colors.success}20`,
                                          color: colors.success,
                                        }}
                                      >
                                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                        In Stock
                                      </span>
                                    ) : (
                                      <span
                                        className="text-xs font-semibold px-2 py-1 rounded flex items-center gap-1"
                                        style={{
                                          backgroundColor: `${colors.primary}20`,
                                          color: colors.primary,
                                        }}
                                      >
                                        Out of Stock
                                      </span>
                                    )}
                                  </div>
                                  <h3
                                    className="text-xl font-bold mb-1"
                                    style={{ color: colors.text }}
                                  >
                                    {item.name}
                                  </h3>

                                  {/* Stock Status */}
                                  {item.stock && item.stock < 5 && (
                                    <p
                                      className="text-xs mt-2"
                                      style={{ color: colors.warning }}
                                    >
                                      Only {item.stock} left in stock
                                    </p>
                                  )}
                                </div>

                                {/* Remove Button */}
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white/5"
                                  style={{ color: colors.muted }}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>

                              {/* Price and Quantity */}
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-4">
                                  {/* Quantity Selector */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          (item.quantity || 1) - 1,
                                        )
                                      }
                                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                                      style={{
                                        border: `1px solid ${colors.border}`,
                                        color: colors.text,
                                      }}
                                    >
                                      <Minus size={16} />
                                    </button>
                                    <span
                                      className="w-12 text-center font-semibold"
                                      style={{ color: colors.text }}
                                    >
                                      {item.quantity || 1}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          (item.quantity || 1) + 1,
                                        )
                                      }
                                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                                      style={{
                                        border: `1px solid ${colors.border}`,
                                        color: colors.text,
                                      }}
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>

                                  {/* Price */}
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center">
                                        <IndianRupee
                                          size={18}
                                          style={{ color: colors.text }}
                                        />
                                        <span
                                          className="text-2xl font-bold ml-1"
                                          style={{ color: colors.text }}
                                        >
                                          {(
                                            (item.price || 0) *
                                            (item.quantity || 1)
                                          ).toLocaleString("en-IN")}
                                        </span>
                                      </div>
                                      {item.originalPrice &&
                                        item.originalPrice > item.price && (
                                          <div className="flex items-center">
                                            <IndianRupee
                                              size={14}
                                              style={{ color: colors.muted }}
                                            />
                                            <span
                                              className="text-sm line-through ml-1"
                                              style={{ color: colors.muted }}
                                            >
                                              {(
                                                item.originalPrice *
                                                (item.quantity || 1)
                                              ).toLocaleString("en-IN")}
                                            </span>
                                          </div>
                                        )}
                                    </div>
                                    <p
                                      className="text-xs mt-1"
                                      style={{ color: colors.muted }}
                                    >
                                      ₹{item.price?.toLocaleString("en-IN")}{" "}
                                      each
                                    </p>
                                  </div>
                                </div>

                                {/* Delivery Info */}
                                <div
                                  className="flex items-center gap-2 text-sm"
                                  style={{ color: colors.success }}
                                >
                                  <Truck size={16} />
                                  Free Shipping
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              ) : (
                /* Empty Cart State */
                <div
                  className="rounded-2xl p-12 text-center"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      border: `1px solid ${colors.primary}30`,
                    }}
                  >
                    <ShoppingCart size={32} style={{ color: colors.primary }} />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: colors.text }}
                  >
                    Your cart is empty
                  </h3>
                  <p className="mb-8" style={{ color: colors.muted }}>
                    Add some premium gym equipment to get started!
                  </p>
                  <button
                    onClick={() => navigate("/products")}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-white transition-all hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                    }}
                  >
                    Browse Equipment
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {/* Benefits Section */}
              {cartItems.length > 0 && (
                <div className="mt-8 grid md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Truck,
                      title: "Free Shipping",
                      description: "On all orders over ₹5,000",
                      color: colors.success,
                    },
                    {
                      icon: Shield,
                      title: "2-Year Warranty",
                      description: "On all equipment",
                      color: colors.warning,
                    },
                    {
                      icon: RotateCcw,
                      title: "30-Day Returns",
                      description: "Free returns & exchanges",
                      color: colors.primary,
                    },
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl flex items-start gap-3"
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${benefit.color}20`,
                          border: `1px solid ${benefit.color}30`,
                        }}
                      >
                        <benefit.icon
                          size={18}
                          style={{ color: benefit.color }}
                        />
                      </div>
                      <div>
                        <h4
                          className="font-semibold mb-1"
                          style={{ color: colors.text }}
                        >
                          {benefit.title}
                        </h4>
                        <p className="text-xs" style={{ color: colors.muted }}>
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            {cartItems.length > 0 && (
              <div className="lg:col-span-1">
                <div
                  className="rounded-2xl overflow-hidden sticky top-8"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {/* Order Summary Header */}
                  <div
                    className="p-6 border-b"
                    style={{
                      borderColor: colors.border,
                      background: `linear-gradient(135deg, ${colors.primary}20, transparent)`,
                    }}
                  >
                    <h3
                      className="text-xl font-bold"
                      style={{ color: colors.text }}
                    >
                      Order Summary
                    </h3>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    {/* Price Breakdown */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span style={{ color: colors.muted }}>Subtotal</span>
                        <span
                          className="font-semibold flex items-center"
                          style={{ color: colors.text }}
                        >
                          <IndianRupee size={14} />
                          {calculateSubtotal().toLocaleString("en-IN")}
                        </span>
                      </div>

                      {calculateSavings() > 0 && (
                        <div className="flex justify-between">
                          <span style={{ color: colors.success }}>Savings</span>
                          <span
                            className="font-semibold flex items-center"
                            style={{ color: colors.success }}
                          >
                            -<IndianRupee size={14} />
                            {calculateSavings().toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}

                      {/* Coupon Code */}
                      {couponApplied ? (
                        <div
                          className="flex justify-between items-center py-2 px-3 rounded-lg"
                          style={{
                            backgroundColor: `${colors.success}20`,
                            border: `1px solid ${colors.success}30`,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              size={16}
                              style={{ color: colors.success }}
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: colors.success }}
                            >
                              Coupon APPLIED
                            </span>
                          </div>
                          <button
                            onClick={() => setCouponApplied(false)}
                            className="text-sm font-semibold hover:text-white transition-colors"
                            style={{ color: colors.success }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : showCouponForm ? (
                        <form onSubmit={applyCoupon} className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              placeholder="Enter coupon code"
                              className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
                              style={{
                                backgroundColor: colors.background,
                                border: `1px solid ${colors.border}`,
                                color: colors.text,
                              }}
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-white/5"
                              style={{
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                              }}
                            >
                              Apply
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowCouponForm(false)}
                            className="text-sm hover:text-white transition-colors"
                            style={{ color: colors.muted }}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => setShowCouponForm(true)}
                          className="text-sm font-semibold transition-colors hover:text-white"
                          style={{ color: colors.primary }}
                        >
                          + Add coupon code
                        </button>
                      )}
                    </div>

                    {/* Total */}
                    <div
                      className="py-4 border-y mb-6"
                      style={{ borderColor: colors.border }}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className="text-lg font-bold"
                          style={{ color: colors.text }}
                        >
                          Total
                        </span>
                        <div className="text-right">
                          <div
                            className="text-2xl font-bold mb-1 flex items-center"
                            style={{ color: colors.text }}
                          >
                            <IndianRupee size={20} />
                            {total.toLocaleString("en-IN")}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: colors.muted }}
                          >
                            {couponApplied ? "Includes 10% discount" : "Total Amount"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="block w-full py-4 rounded-lg font-semibold text-white text-center transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                      }}
                    >
                      {checkoutLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </button>

                    {/* Security & Payment Info */}
                    <div className="space-y-4">
                      <div
                        className="flex items-center justify-center gap-2 text-sm"
                        style={{ color: colors.muted }}
                      >
                        <Lock size={14} />
                        <span>Secure checkout</span>
                      </div>

                      <div className="flex justify-center gap-4">
                        {[CreditCard, "visa", "mastercard", "amex"].map(
                          (icon, index) => (
                            <div
                              key={index}
                              className="w-10 h-6 rounded flex items-center justify-center"
                              style={{
                                backgroundColor: colors.background,
                                border: `1px solid ${colors.border}`,
                              }}
                            >
                              {typeof icon === "string" ? (
                                <span
                                  className="text-xs font-bold"
                                  style={{ color: colors.text }}
                                >
                                  {icon === "visa"
                                    ? "VISA"
                                    : icon === "mastercard"
                                      ? "MC"
                                      : "AMEX"}
                                </span>
                              ) : (
                                <icon
                                  size={16}
                                  style={{ color: colors.muted }}
                                />
                              )}
                            </div>
                          ),
                        )}
                      </div>

                      <p
                        className="text-xs text-center pt-4 border-t"
                        style={{
                          borderColor: colors.border,
                          color: colors.muted,
                        }}
                      >
                        By completing your purchase you agree to our Terms of
                        Service
                      </p>
                    </div>
                  </div>
                </div>

              
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;