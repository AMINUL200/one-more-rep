import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  X,
  ChevronLeft,
  Package,
  Calendar,
  CheckCircle,
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";

const CartPage = () => {
  const [loading, setLoading] = useState(true);

  // 🔥 Simulate API call (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Adjustable Dumbbell Set",
      category: "Strength Equipment",
      image: "/image/dumbset.webp",
      price: 24999, // Approx ₹24,999 ($299.99)
      originalPrice: 32999, // Approx ₹32,999 ($399.99)
      quantity: 1,
      inStock: true,
      delivery: "Free Shipping",
      weight: "20.4 kg", // 45 lbs to kg
    },
    {
      id: 2,
      name: "Premium Yoga Mat",
      category: "Yoga & Flexibility",
      image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop",
      price: 7499, // Approx ₹7,499 ($89.99)
      quantity: 2,
      inStock: true,
      delivery: "Free Shipping",
      color: "Forest Green",
    },
    {
      id: 3,
      name: "Elite Training Bench",
      category: "Strength Equipment",
      image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      price: 37499, // Approx ₹37,499 ($449.99)
      originalPrice: 45799, // Approx ₹45,799 ($549.99)
      quantity: 1,
      inStock: true,
      delivery: "Installation Required",
      estimatedDelivery: "5-7 days",
    },
  ]);
  
  const [couponCode, setCouponCode] = useState("");
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  
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
  
  const formatIndianRupees = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };
  
  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  
  const calculateSavings = () => {
    return cartItems.reduce((sum, item) => {
      if (item.originalPrice) {
        return sum + (item.originalPrice - item.price) * item.quantity;
      }
      return sum;
    }, 0);
  };
  
  const shippingFee = cartItems.length > 0 ? 0 : 0; // Free shipping
  const tax = calculateSubtotal() * 0.18; // 18% GST (Indian tax rate)
  const total = calculateSubtotal() + shippingFee + tax;
  
  const applyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim() === "FITNESS10") {
      setCouponApplied(true);
      setCouponCode("");
      setShowCouponForm(false);
    }
  };
  
  if (loading) return <PageLoader />;
  return (
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
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
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
                )
              )}
            </div>

            <Link
              to="/products/plate"
              className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-white"
              style={{ color: colors.primary }}
            >
              <ChevronLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            {/* Cart Items List */}
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
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
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {item.originalPrice && (
                            <div className="absolute -top-2 -left-2">
                              <span
                                className="px-2 py-1 rounded text-xs font-bold text-white"
                                style={{ backgroundColor: colors.primary }}
                              >
                                SAVE{" "}
                                {formatIndianRupees(
                                  item.originalPrice - item.price
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
                                  {item.category}
                                </span>
                                {item.inStock ? (
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
                                ) : null}
                              </div>
                              <h3
                                className="text-xl font-bold mb-1"
                                style={{ color: colors.text }}
                              >
                                {item.name}
                              </h3>

                              {/* Product Specifications */}
                              <div className="flex flex-wrap gap-4 mt-3">
                                {item.weight && (
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="text-sm"
                                      style={{ color: colors.muted }}
                                    >
                                      Weight:
                                    </span>
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: colors.text }}
                                    >
                                      {item.weight}
                                    </span>
                                  </div>
                                )}
                                {item.color && (
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="text-sm"
                                      style={{ color: colors.muted }}
                                    >
                                      Color:
                                    </span>
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: colors.text }}
                                    >
                                      {item.color}
                                    </span>
                                  </div>
                                )}
                                {item.estimatedDelivery && (
                                  <div className="flex items-center gap-2">
                                    <Calendar
                                      size={14}
                                      style={{ color: colors.muted }}
                                    />
                                    <span
                                      className="text-sm"
                                      style={{ color: colors.text }}
                                    >
                                      Est. Delivery: {item.estimatedDelivery}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id)}
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
                                  onClick={() => updateQuantity(item.id, -1)}
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
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
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
                                  <span
                                    className="text-2xl font-bold"
                                    style={{ color: colors.text }}
                                  >
                                    {formatIndianRupees(
                                      item.price * item.quantity
                                    )}
                                  </span>
                                  {item.originalPrice && (
                                    <span
                                      className="text-sm line-through"
                                      style={{ color: colors.muted }}
                                    >
                                      {formatIndianRupees(
                                        item.originalPrice * item.quantity
                                      )}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className="text-xs mt-1"
                                  style={{ color: colors.muted }}
                                >
                                  {formatIndianRupees(item.price)} each
                                </p>
                              </div>
                            </div>

                            {/* Delivery Info */}
                            <div
                              className="flex items-center gap-2 text-sm"
                              style={{ color: colors.success }}
                            >
                              <Truck size={16} />
                              {item.delivery}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-white transition-all hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                  }}
                >
                  Browse Equipment
                  <ArrowRight size={20} />
                </Link>
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
                      className="font-semibold"
                      style={{ color: colors.text }}
                    >
                      {formatIndianRupees(calculateSubtotal())}
                    </span>
                  </div>

                  {calculateSavings() > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: colors.success }}>Savings</span>
                      <span
                        className="font-semibold"
                        style={{ color: colors.success }}
                      >
                        -{formatIndianRupees(calculateSavings())}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span style={{ color: colors.muted }}>Shipping</span>
                    <span
                      className="font-semibold"
                      style={{ color: colors.success }}
                    >
                      {shippingFee === 0
                        ? "FREE"
                        : `${formatIndianRupees(shippingFee)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ color: colors.muted }}>GST (18%)</span>
                    <span
                      className="font-semibold"
                      style={{ color: colors.text }}
                    >
                      {formatIndianRupees(tax)}
                    </span>
                  </div>

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
                        className="text-2xl font-bold mb-1"
                        style={{ color: colors.text }}
                      >
                        {formatIndianRupees(total)}
                      </div>
                      <div className="text-xs" style={{ color: colors.muted }}>
                        {couponApplied ? "Includes 10% discount" : "INR"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="block w-full py-4 rounded-lg font-semibold text-white text-center transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                  }}
                >
                  Proceed to Checkout
                </Link>

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
                            <icon size={16} style={{ color: colors.muted }} />
                          )}
                        </div>
                      )
                    )}
                  </div>

                  <p
                    className="text-xs text-center pt-4 border-t"
                    style={{ borderColor: colors.border, color: colors.muted }}
                  >
                    By completing your purchase you agree to our Terms of
                    Service
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Items */}
            {cartItems.length > 0 && (
              <div className="mt-8">
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text }}
                >
                  Frequently Bought Together
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      name: "Weightlifting Gloves",
                      price: 2099, // Approx ₹2,099 ($24.99)
                      image:
                        "https://images.unsplash.com/photo-1595079835354-69d9930ae90c?w=200&h=200&fit=crop",
                    },
                    {
                      name: "Resistance Bands Set",
                      price: 3349, // Approx ₹3,349 ($39.99)
                      image:
                        "https://images.unsplash.com/photo-1595079676339-153e7f4d4a1c?w=200&h=200&fit=crop",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg flex items-center gap-3 group cursor-pointer hover:bg-white/5 transition-colors"
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-sm font-medium mb-1"
                          style={{ color: colors.text }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-sm font-bold"
                          style={{ color: colors.primary }}
                        >
                          {formatIndianRupees(item.price)}
                        </p>
                      </div>
                      <button
                        className="px-3 py-1 text-xs font-semibold rounded transition-colors hover:bg-white/5"
                        style={{
                          color: colors.primary,
                          border: `1px solid ${colors.primary}`,
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
