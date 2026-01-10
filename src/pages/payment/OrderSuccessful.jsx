import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, Package, Truck, Home, Download,
  Share2, Star, Repeat, MessageSquare, Clock,
  MapPin, CreditCard, User, Mail, Phone,
  ChevronRight, Gift, Shield, Calendar,
  Copy
} from 'lucide-react';

const OrderSuccessful = () => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [showConfetti, setShowConfetti] = useState(true);

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

  // Order details
  const orderDetails = {
    id: 'ORD-789456123',
    date: 'Dec 15, 2024, 2:30 PM',
    total: '₹24,897',
    paymentMethod: 'Credit Card',
    items: [
      { name: 'Adjustable Dumbbell Set', quantity: 1, price: '₹12,999' },
      { name: 'Premium Yoga Mat', quantity: 2, price: '₹5,998' },
      { name: 'Elite Training Bench', quantity: 1, price: '₹4,499' },
      { name: 'Weightlifting Gloves', quantity: 1, price: '₹1,399' },
    ],
    shipping: {
      name: 'John Fitness',
      address: '123 Gym Street, Mumbai, Maharashtra 400001',
      phone: '+91 98765 43210',
      email: 'john.fitness@example.com',
      estimatedDelivery: 'Dec 18-20, 2024'
    },
    tracking: 'TRK-789456123XYZ'
  };

  // Delivery timeline
  const timeline = [
    { status: 'Order Placed', time: 'Today, 2:30 PM', completed: true, icon: CheckCircle },
    { status: 'Processing', time: 'Today, 3:00 PM', completed: true, icon: Package },
    { status: 'Shipped', time: 'Tomorrow, 10:00 AM', completed: false, icon: Truck },
    { status: 'Delivered', time: 'Dec 18-20, 2024', completed: false, icon: Home },
  ];

  // Recommended products
  const recommendedProducts = [
    {
      id: 1,
      name: 'Resistance Bands Set',
      price: '₹1,499',
      image: 'https://images.unsplash.com/photo-1595079676339-153e7f4d4a1c?w=200&h=200&fit=crop',
      rating: 4.7
    },
    {
      id: 2,
      name: 'Foam Roller',
      price: '₹899',
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=200&h=200&fit=crop',
      rating: 4.5
    },
    {
      id: 3,
      name: 'Jump Rope',
      price: '₹599',
      image: 'https://images.unsplash.com/photo-1598266663438-ef4efa42275b?w=200&h=200&fit=crop',
      rating: 4.8
    },
  ];

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen pt-30 md:pt-40">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                backgroundColor: [colors.primary, colors.success, colors.warning][i % 3],
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            {/* Animated Checkmark */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full animate-ping-slow"
                style={{ backgroundColor: colors.success, opacity: 0.2 }}
              />
              <div className="absolute inset-4 rounded-full flex items-center justify-center animate-scaleIn"
                style={{
                  backgroundColor: colors.success,
                  boxShadow: `0 0 60px ${colors.success}80`,
                }}
              >
                <CheckCircle size={64} style={{ color: colors.text }} />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full animate-bounce"
              style={{ backgroundColor: colors.primary }}
            >
              <Gift size={24} className="text-white m-3" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full animate-bounce-delayed"
              style={{ backgroundColor: colors.warning }}
            >
              <Star size={24} className="text-white m-3" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: colors.text }}>
            Order <span style={{ color: colors.success }}>Confirmed!</span>
          </h1>
          <p className="text-xl mb-6" style={{ color: colors.muted }}>
            Thank you for choosing One Rep More! Your gym equipment is on its way.
          </p>
          
          {/* Order ID Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
            }}
          >
            <span className="text-sm" style={{ color: colors.muted }}>Order ID:</span>
            <span className="font-mono font-bold text-lg" style={{ color: colors.text }}>
              {orderDetails.id}
            </span>
            <button className="ml-2 hover:opacity-80 transition-opacity">
              <Copy size={18} style={{ color: colors.primary }} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Order Summary */}
          <div>
            {/* Order Timeline */}
            <div 
              className="rounded-2xl p-6 mb-8"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${colors.success}20`,
                    border: `1px solid ${colors.success}30`,
                  }}
                >
                  <Clock size={20} style={{ color: colors.success }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                  Delivery Timeline
                </h2>
              </div>

              <div className="space-y-6 relative">
                {/* Connecting Line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5"
                  style={{ backgroundColor: colors.border }}
                />
                
                {timeline.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        step.completed ? 'scale-110 shadow-lg' : ''
                      }`}
                        style={{
                          backgroundColor: step.completed ? colors.success : colors.cardBg,
                          border: `2px solid ${step.completed ? colors.success : colors.border}`,
                        }}
                      >
                        <Icon size={20} style={{ color: step.completed ? colors.text : colors.muted }} />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold" style={{ 
                            color: step.completed ? colors.text : colors.muted 
                          }}>
                            {step.status}
                          </h3>
                          {step.completed && (
                            <span className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: `${colors.success}20`,
                                color: colors.success,
                              }}
                            >
                              COMPLETED
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: colors.muted }}>{step.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div 
              className="rounded-2xl p-6"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text }}>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b"
                    style={{ borderColor: colors.border }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold" style={{ color: colors.primary }}>
                        {item.quantity}×
                      </span>
                      <span style={{ color: colors.text }}>{item.name}</span>
                    </div>
                    <span className="font-semibold" style={{ color: colors.text }}>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                <div className="flex justify-between">
                  <span style={{ color: colors.muted }}>Subtotal</span>
                  <span style={{ color: colors.text }}>₹24,895</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.muted }}>Shipping</span>
                  <span style={{ color: colors.success }}>FREE</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: colors.muted }}>Tax</span>
                  <span style={{ color: colors.text }}>₹4,482</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t"
                  style={{ borderColor: colors.border }}
                >
                  <span style={{ color: colors.text }}>Total Amount</span>
                  <span style={{ color: colors.text }}>{orderDetails.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Shipping & Actions */}
          <div>
            {/* Shipping Information */}
            <div 
              className="rounded-2xl p-6 mb-8"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${colors.primary}20`,
                    border: `1px solid ${colors.primary}30`,
                  }}
                >
                  <MapPin size={20} style={{ color: colors.primary }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                  Shipping Details
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} style={{ color: colors.muted }} />
                    <span className="text-sm" style={{ color: colors.muted }}>Recipient</span>
                  </div>
                  <p className="text-lg font-semibold" style={{ color: colors.text }}>
                    {orderDetails.shipping.name}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} style={{ color: colors.muted }} />
                    <span className="text-sm" style={{ color: colors.muted }}>Delivery Address</span>
                  </div>
                  <p style={{ color: colors.text }}>{orderDetails.shipping.address}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone size={16} style={{ color: colors.muted }} />
                      <span className="text-sm" style={{ color: colors.muted }}>Phone</span>
                    </div>
                    <p style={{ color: colors.text }}>{orderDetails.shipping.phone}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={16} style={{ color: colors.muted }} />
                      <span className="text-sm" style={{ color: colors.muted }}>Email</span>
                    </div>
                    <p style={{ color: colors.text }}>{orderDetails.shipping.email}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg"
                  style={{
                    backgroundColor: `${colors.success}10`,
                    border: `1px solid ${colors.success}30`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={20} style={{ color: colors.success }} />
                    <div>
                      <p className="font-semibold" style={{ color: colors.success }}>
                        Estimated Delivery
                      </p>
                      <p style={{ color: colors.text }}>{orderDetails.shipping.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div 
              className="rounded-2xl p-6"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h2 className="text-xl font-bold mb-6" style={{ color: colors.text }}>
                What would you like to do next?
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/track"
                  className="p-4 rounded-lg text-center group hover:bg-white/5 transition-all"
                  style={{
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      border: `1px solid ${colors.primary}30`,
                    }}
                  >
                    <Truck size={24} style={{ color: colors.primary }} />
                  </div>
                  <span className="font-medium" style={{ color: colors.text }}>Track Order</span>
                </Link>

                <Link 
                  to="/products"
                  className="p-4 rounded-lg text-center group hover:bg-white/5 transition-all"
                  style={{
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: `${colors.success}20`,
                      border: `1px solid ${colors.success}30`,
                    }}
                  >
                    <Repeat size={24} style={{ color: colors.success }} />
                  </div>
                  <span className="font-medium" style={{ color: colors.text }}>Shop More</span>
                </Link>

                <button className="p-4 rounded-lg text-center group hover:bg-white/5 transition-all"
                  style={{
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: `${colors.warning}20`,
                      border: `1px solid ${colors.warning}30`,
                    }}
                  >
                    <Download size={24} style={{ color: colors.warning }} />
                  </div>
                  <span className="font-medium" style={{ color: colors.text }}>Invoice</span>
                </button>

                <button className="p-4 rounded-lg text-center group hover:bg-white/5 transition-all"
                  style={{
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: `${colors.accent}20`,
                      border: `1px solid ${colors.accent}30`,
                    }}
                  >
                    <Share2 size={24} style={{ color: colors.accent }} />
                  </div>
                  <span className="font-medium" style={{ color: colors.text }}>Share</span>
                </button>
              </div>

              {/* Support Note */}
              <div className="mt-6 p-4 rounded-lg flex items-start gap-3"
                style={{
                  backgroundColor: `${colors.primary}10`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <MessageSquare size={18} style={{ color: colors.primary }} />
                <p className="text-sm" style={{ color: colors.text }}>
                  Need help? Our support team is available 24/7 at support@onerepmore.com
                </p>
              </div>
            </div>
          </div>
        </div>

      

        {/* Auto Redirect */}
        <div 
          className="rounded-2xl p-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.cardBg} 0%, #1a1a1a 100%)`,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.success}20`,
                  border: `1px solid ${colors.success}30`,
                }}
              >
                <Shield size={24} style={{ color: colors.success }} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold mb-1" style={{ color: colors.text }}>
                  Order Secured & Confirmed
                </h3>
                <p style={{ color: colors.muted }}>
                  Your equipment will be shipped within 24 hours
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
                {timeLeft}s
              </div>
              <p style={{ color: colors.muted }}>
                Redirecting to home page in {timeLeft} seconds
              </p>
              <Link 
                to="/"
                className="inline-block mt-4 px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.text,
                }}
              >
                Go Home Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s ease-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .animate-bounce-delayed {
          animation: bounce-delayed 2s ease-in-out infinite 0.5s;
        }
        
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessful;