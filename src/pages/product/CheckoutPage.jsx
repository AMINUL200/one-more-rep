import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard, Truck, Shield, Lock, CheckCircle,
  ChevronRight, MapPin, Package, Clock, ArrowLeft,
  User, Mail, Phone, Plus, Trash2, AlertCircle
} from 'lucide-react';
import PageLoader from '../../component/common/PageLoader';

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [saveInfo, setSaveInfo] = useState(true);

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

  const cartItems = [
    {
      id: 1,
      name: "Adjustable Dumbbell Set",
      image: "/image/dumbset.webp",
      price: 12999,
      quantity: 1,
      weight: "45 kg"
    },
    {
      id: 2,
      name: "Premium Yoga Mat",
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=200&h=200&fit=crop",
      price: 2999,
      quantity: 2,
      color: "Forest Green"
    },
    {
      id: 3,
      name: "Resistance Bands Set",
      image: "/image/bandset.jpeg",
      price: 1499,
      quantity: 1,
      type: "5-Piece Set"
    }
  ];

  const steps = [
    { number: 1, title: "Delivery", icon: Truck },
    { number: 2, title: "Payment", icon: CreditCard },
    { number: 3, title: "Confirm", icon: CheckCircle }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: CreditCard },
    { id: 'netbanking', name: 'Net Banking', icon: CreditCard },
    { id: 'cod', name: 'Cash on Delivery', icon: Package }
  ];

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 2000 ? 0 : 199;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  };

  const totals = calculateTotal();

   if (loading) return <PageLoader />;

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen py-8 px-4 md:px-8 pt-30 md:pt-40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${colors.primary}20`,
                border: `1px solid ${colors.primary}30`,
              }}
            >
              <Lock size={24} style={{ color: colors.primary }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: colors.text }}>
                Secure Checkout
              </h1>
              <p className="text-lg" style={{ color: colors.muted }}>
                Complete your purchase in 3 easy steps
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12 relative">
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.number}>
                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    step >= stepItem.number 
                      ? 'scale-110 shadow-lg' 
                      : 'opacity-50'
                  }`}
                    style={{
                      backgroundColor: step >= stepItem.number ? colors.primary : colors.cardBg,
                      border: `2px solid ${step >= stepItem.number ? colors.primary : colors.border}`,
                    }}
                  >
                    <stepItem.icon 
                      size={20} 
                      style={{ 
                        color: step >= stepItem.number ? colors.text : colors.muted 
                      }}
                    />
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    step >= stepItem.number ? 'text-white' : 'text-[#B3B3B3]'
                  }`}>
                    {stepItem.title}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 relative">
                    <div className="absolute inset-0 bg-[#262626] rounded-full" />
                    <div 
                      className="absolute inset-0 rounded-full transition-all duration-500"
                      style={{
                        width: step > stepItem.number ? '100%' : '0%',
                        backgroundColor: colors.primary,
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Forms */}
          <div className="space-y-8">
            {/* Step 1: Delivery Information */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20` }}>
                    <Truck size={20} style={{ color: colors.primary }} />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                    Delivery Information
                  </h2>
                </div>

                <div 
                  className="rounded-2xl p-6 mb-6"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <form className="space-y-6">
                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          First Name *
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          Last Name *
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: colors.muted }} />
                        <input
                          type="email"
                          className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: colors.muted }} />
                        <input
                          type="tel"
                          className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Delivery Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3" size={18} style={{ color: colors.muted }} />
                        <textarea
                          rows="3"
                          className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all resize-none"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="Street, City, State, PIN Code"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          City *
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="Mumbai"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="400001"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="save-info"
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.primary,
                        }}
                      />
                      <label htmlFor="save-info" className="text-sm" style={{ color: colors.muted }}>
                        Save this information for next time
                      </label>
                    </div>
                  </form>
                </div>

                <div className="flex justify-between">
                  <Link 
                    to="/cart"
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5"
                    style={{
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <ArrowLeft size={18} />
                    Back to Cart
                  </Link>
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                    }}
                  >
                    Continue to Payment
                    <ChevronRight size={18} className="inline ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20` }}>
                    <CreditCard size={20} style={{ color: colors.primary }} />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                    Payment Method
                  </h2>
                </div>

                <div 
                  className="rounded-2xl p-6 mb-6"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="space-y-4 mb-8">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                          paymentMethod === method.id ? 'border-[#E10600] bg-[#E10600]/10' : ''
                        }`}
                        style={{
                          border: `1px solid ${paymentMethod === method.id ? colors.primary : colors.border}`,
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                          style={{
                            color: colors.primary,
                          }}
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${colors.primary}10`,
                              border: `1px solid ${colors.primary}20`,
                            }}
                          >
                            <method.icon size={18} style={{ color: colors.primary }} />
                          </div>
                          <span className="font-medium" style={{ color: colors.text }}>
                            {method.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Card Details (if card selected) */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                        Card Details
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          Card Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                            style={{
                              backgroundColor: colors.background,
                              border: `1px solid ${colors.border}`,
                              color: colors.text,
                            }}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            CVV
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                            style={{
                              backgroundColor: colors.background,
                              border: `1px solid ${colors.border}`,
                              color: colors.text,
                            }}
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                          }}
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  )}

                  {/* Security Note */}
                  <div 
                    className="mt-6 p-4 rounded-lg flex items-start gap-3"
                    style={{
                      backgroundColor: `${colors.success}10`,
                      border: `1px solid ${colors.success}30`,
                    }}
                  >
                    <Shield size={16} style={{ color: colors.success }} className="mt-0.5 flex-shrink-0" />
                    <p className="text-sm" style={{ color: colors.success }}>
                      Your payment is secure and encrypted. We never store your card details.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5"
                    style={{
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <ArrowLeft size={18} />
                    Back to Delivery
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                    }}
                  >
                    Review Order
                    <ChevronRight size={18} className="inline ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}20` }}>
                    <CheckCircle size={20} style={{ color: colors.primary }} />
                  </div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                    Order Confirmation
                  </h2>
                </div>

                <div 
                  className="rounded-2xl p-6 mb-6"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                        Order Summary
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span style={{ color: colors.muted }}>Order ID</span>
                          <span style={{ color: colors.text }}>#ORD-789456</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: colors.muted }}>Order Date</span>
                          <span style={{ color: colors.text }}>Dec 15, 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: colors.muted }}>Estimated Delivery</span>
                          <span style={{ color: colors.success }}>Dec 18-20, 2024</span>
                        </div>
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="terms"
                          className="w-4 h-4 mt-1 rounded"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.primary,
                          }}
                        />
                        <label htmlFor="terms" className="text-sm" style={{ color: colors.muted }}>
                          I agree to the Terms of Service and Privacy Policy
                        </label>
                      </div>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="warranty"
                          className="w-4 h-4 mt-1 rounded"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.primary,
                          }}
                        />
                        <label htmlFor="warranty" className="text-sm" style={{ color: colors.muted }}>
                          I understand the 2-year warranty terms and conditions
                        </label>
                      </div>
                    </div>

                    {/* Final Note */}
                    <div 
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: `${colors.primary}10`,
                        border: `1px solid ${colors.primary}30`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle size={16} style={{ color: colors.primary }} className="mt-0.5 flex-shrink-0" />
                        <p className="text-sm" style={{ color: colors.text }}>
                          By placing this order, you agree to receive email and SMS updates about your order status.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5"
                    style={{
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <ArrowLeft size={18} />
                    Back to Payment
                  </button>
                  <button
                    className="px-8 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-xl hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                      boxShadow: `0 0 40px ${colors.primary}40`,
                    }}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Cart */}
          <div>
            <div 
              className="rounded-2xl overflow-hidden sticky top-24"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* Header */}
              <div 
                className="p-6 border-b"
                style={{ 
                  borderColor: colors.border,
                  background: `linear-gradient(135deg, ${colors.primary}20, transparent)`
                }}
              >
                <h3 className="text-xl font-bold" style={{ color: colors.text }}>
                  Order Summary
                </h3>
                <p className="text-sm mt-1" style={{ color: colors.muted }}>
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your order
                </p>
              </div>

              {/* Cart Items */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1" style={{ color: colors.text }}>
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm">
                          <span style={{ color: colors.muted }}>Qty: {item.quantity}</span>
                          {item.weight && (
                            <span style={{ color: colors.muted }}>Weight: {item.weight}</span>
                          )}
                          {item.color && (
                            <span style={{ color: colors.muted }}>Color: {item.color}</span>
                          )}
                          {item.type && (
                            <span style={{ color: colors.muted }}>Type: {item.type}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold" style={{ color: colors.text }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-sm" style={{ color: colors.muted }}>
                          ₹{item.price.toLocaleString()} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-6 border-t" style={{ borderColor: colors.border }}>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: colors.muted }}>Subtotal</span>
                    <span style={{ color: colors.text }}>₹{totals.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.muted }}>Shipping</span>
                    <span style={{ color: totals.shipping === 0 ? colors.success : colors.text }}>
                      {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.muted }}>Tax (18%)</span>
                    <span style={{ color: colors.text }}>₹{totals.tax.toFixed(0)}</span>
                  </div>
                  
                  {totals.subtotal > 2000 && (
                    <div className="flex justify-between">
                      <span style={{ color: colors.success }}>Shipping Discount</span>
                      <span style={{ color: colors.success }}>-₹199</span>
                    </div>
                  )}

                  <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold" style={{ color: colors.text }}>
                        Total Amount
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: colors.text }}>
                          ₹{totals.total.toLocaleString()}
                        </div>
                        <div className="text-sm" style={{ color: colors.muted }}>
                          Includes all taxes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div 
                className="p-6 border-t"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: `${colors.primary}05`
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Truck size={18} style={{ color: colors.primary }} />
                  <h4 className="font-semibold" style={{ color: colors.text }}>
                    Delivery Information
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={14} style={{ color: colors.muted }} />
                    <span className="text-sm" style={{ color: colors.muted }}>
                      Estimated Delivery: 3-5 business days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package size={14} style={{ color: colors.muted }} />
                    <span className="text-sm" style={{ color: colors.muted }}>
                      Free shipping on orders above ₹2,000
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={14} style={{ color: colors.muted }} />
                    <span className="text-sm" style={{ color: colors.muted }}>
                      All orders include 2-year warranty
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help Section */}
            <div 
              className="mt-6 p-6 rounded-2xl"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h4 className="font-semibold mb-3" style={{ color: colors.text }}>
                Need Help?
              </h4>
              <p className="text-sm mb-4" style={{ color: colors.muted }}>
                Contact our support team for assistance with your order.
              </p>
              <button className="w-full py-3 rounded-lg font-medium transition-all hover:bg-white/5"
                style={{
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;