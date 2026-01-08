import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Truck, CheckCircle, Clock, XCircle, 
  Repeat, Eye, Download, MessageSquare, Star,
  Filter, Search, Calendar, CreditCard, MapPin,
  ChevronRight, ArrowRight, RefreshCw, AlertCircle
} from 'lucide-react';
import PageLoader from '../../component/common/PageLoader';

const MyOrders = () => {
  const [loading, setLoading] = useState(true);

  // 🔥 Simulate API call (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
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
    danger: "#DC2626",
  };
  
  const statusColors = {
    delivered: colors.success,
    processing: colors.warning,
    shipped: colors.primary,
    cancelled: colors.danger,
    pending: colors.muted
  };
  
  const filters = [
    { id: 'all', label: 'All Orders', count: 8 },
    { id: 'processing', label: 'Processing', count: 2 },
    { id: 'shipped', label: 'Shipped', count: 3 },
    { id: 'delivered', label: 'Delivered', count: 2 },
    { id: 'cancelled', label: 'Cancelled', count: 1 }
  ];
  
  const orders = [
    {
      id: 'ORD-7894',
      date: 'Today, 2:30 PM',
      items: [
        { 
          name: 'Adjustable Dumbbell Set',
          image: 'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=150&h=150&fit=crop',
          quantity: 1,
          price: 299.99
        },
        { 
          name: 'Weightlifting Gloves',
          image: 'https://images.unsplash.com/photo-1595079835354-69d9930ae90c?w=150&h=150&fit=crop',
          quantity: 1,
          price: 24.99
        }
      ],
      total: 324.98,
      status: 'delivered',
      tracking: 'TRK-789456123',
      deliveryDate: 'Dec 15, 2024',
      address: '123 Fitness St, Mumbai, MH 400001'
    },
    {
      id: 'ORD-7893',
      date: 'Yesterday, 10:15 AM',
      items: [
        { 
          name: 'Elite Training Bench',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
          quantity: 1,
          price: 449.99
        }
      ],
      total: 449.99,
      status: 'processing',
      estimatedDelivery: 'Dec 20-22, 2024',
      installation: 'Professional installation included'
    },
    {
      id: 'ORD-7892',
      date: 'Dec 5, 2024',
      items: [
        { 
          name: 'Premium Yoga Mat',
          image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=150&h=150&fit=crop',
          quantity: 2,
          price: 89.99
        },
        { 
          name: 'Resistance Bands Set',
          image: 'https://images.unsplash.com/photo-1595079676339-153e7f4d4a1c?w=150&h=150&fit=crop',
          quantity: 1,
          price: 39.99
        }
      ],
      total: 219.97,
      status: 'shipped',
      tracking: 'TRK-321654987',
      estimatedDelivery: 'Dec 18, 2024'
    },
    {
      id: 'ORD-7891',
      date: 'Dec 1, 2024',
      items: [
        { 
          name: 'Barbell Olympic Set',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop',
          quantity: 1,
          price: 599.99
        }
      ],
      total: 599.99,
      status: 'cancelled',
      reason: 'Order cancelled by customer'
    },
    {
      id: 'ORD-7890',
      date: 'Nov 28, 2024',
      items: [
        { 
          name: 'Treadmill Pro',
          image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=150&h=150&fit=crop',
          quantity: 1,
          price: 1299.99
        }
      ],
      total: 1299.99,
      status: 'delivered',
      deliveryDate: 'Dec 3, 2024',
      warranty: '3-year warranty activated'
    }
  ];
  
  const filteredOrders = orders.filter(order => {
    if (activeFilter !== 'all' && order.status !== activeFilter) return false;
    if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return CheckCircle;
      case 'processing': return Clock;
      case 'shipped': return Truck;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'delivered': return 'Delivered';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };
  
  // Changed from $ to ₹ and updated values
  const stats = [
    { label: 'Total Orders', value: '8', change: '+2' },
    { label: 'Total Spent', value: '₹2,45,000', change: '+₹58,000' }, // Changed from $3,450 to ₹2,45,000
    { label: 'Avg. Order Value', value: '₹30,625', change: '+₹3,375' }, // Changed from $431 to ₹30,625
    { label: 'Items Ordered', value: '14', change: '+3' },
  ];
  
  if (loading) return <PageLoader />;
  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen py-8 px-4 md:px-8 pt-30 md:pt-40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <Package size={24} style={{ color: colors.primary }} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold" style={{ color: colors.text }}>
                  My Orders
                </h1>
                <p className="text-lg" style={{ color: colors.muted }}>
                  Track and manage your equipment orders
                </p>
              </div>
            </div>
            
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                color: colors.text,
              }}
            >
              <ArrowRight size={20} className="rotate-180" />
              Continue Shopping
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <p className="text-sm mb-1" style={{ color: colors.muted }}>
                  {stat.label}
                </p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold" style={{ color: colors.text }}>
                    {stat.value}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: colors.success }}>
                    {stat.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                    activeFilter === filter.id 
                      ? 'text-white' 
                      : 'hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: activeFilter === filter.id ? colors.primary : 'transparent',
                    border: `1px solid ${activeFilter === filter.id ? colors.primary : colors.border}`,
                    color: activeFilter === filter.id ? colors.text : colors.muted,
                  }}
                >
                  {filter.label}
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                    style={{
                      backgroundColor: activeFilter === filter.id ? 'rgba(255,255,255,0.2)' : colors.border,
                      color: activeFilter === filter.id ? colors.text : colors.muted,
                    }}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: colors.muted }} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg focus:outline-none w-full sm:w-64"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                />
              </div>
              
              <button className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors hover:bg-white/5"
                style={{
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Filter size={18} />
                More Filters
              </button>
            </div>
          </div>

          {/* Order Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: colors.muted }}>
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <button className="text-sm font-medium flex items-center gap-2 transition-colors hover:text-white"
              style={{ color: colors.primary }}
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              const statusColor = statusColors[order.status];
              
              return (
                <div 
                  key={order.id}
                  className="rounded-2xl overflow-hidden group"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {/* Order Header */}
                  <div className="p-6 border-b" style={{ borderColor: colors.border }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <StatusIcon size={20} style={{ color: statusColor }} />
                          <div>
                            <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                              Order {order.id}
                            </h3>
                            <p className="text-sm" style={{ color: colors.muted }}>
                              Placed on {order.date}
                            </p>
                          </div>
                        </div>
                        
                        <span className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: `${statusColor}20`,
                            color: statusColor,
                          }}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {/* Changed from $ to ₹ */}
                          <p className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                            ₹{order.total.toFixed(2)}
                          </p>
                          <p className="text-xs" style={{ color: colors.muted }}>
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <ChevronRight size={20} style={{ color: colors.muted }} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Images */}
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="relative">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border-2"
                              style={{ 
                                borderColor: colors.cardBg,
                                backgroundColor: colors.background,
                              }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {index === 2 && order.items.length > 3 && (
                              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-bold" style={{ color: colors.text }}>
                                  +{order.items.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <div className="flex-1">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Left Column - Products */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider"
                              style={{ color: colors.muted }}
                            >
                              Items Ordered
                            </h4>
                            <div className="space-y-3">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded overflow-hidden">
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium" style={{ color: colors.text }}>
                                        {item.name}
                                      </p>
                                      <p className="text-xs" style={{ color: colors.muted }}>
                                        Qty: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  {/* Changed from $ to ₹ */}
                                  <p className="text-sm font-semibold" style={{ color: colors.text }}>
                                    ₹{item.price.toFixed(2)}
                                  </p>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-sm text-center pt-2" style={{ color: colors.primary }}>
                                  + {order.items.length - 2} more items
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right Column - Order Info */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider"
                              style={{ color: colors.muted }}
                            >
                              Order Information
                            </h4>
                            <div className="space-y-3">
                              {order.tracking && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Truck size={14} style={{ color: colors.muted }} />
                                    <span className="text-sm" style={{ color: colors.muted }}>
                                      Tracking
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: colors.text }}>
                                    {order.tracking}
                                  </span>
                                </div>
                              )}
                              
                              {order.deliveryDate && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Calendar size={14} style={{ color: colors.muted }} />
                                    <span className="text-sm" style={{ color: colors.muted }}>
                                      Delivered
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: colors.success }}>
                                    {order.deliveryDate}
                                  </span>
                                </div>
                              )}
                              
                              {order.estimatedDelivery && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Clock size={14} style={{ color: colors.muted }} />
                                    <span className="text-sm" style={{ color: colors.muted }}>
                                      Est. Delivery
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium" style={{ color: colors.warning }}>
                                    {order.estimatedDelivery}
                                  </span>
                                </div>
                              )}
                              
                              {order.address && (
                                <div className="flex items-center gap-2">
                                  <MapPin size={14} style={{ color: colors.muted }} />
                                  <span className="text-sm" style={{ color: colors.muted }}>
                                    {order.address}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Notes */}
                    {(order.installation || order.warranty || order.reason) && (
                      <div className={`mt-6 p-4 rounded-lg ${
                        order.status === 'cancelled' 
                          ? 'bg-red-500/10 border border-red-500/20'
                          : 'bg-blue-500/10 border border-blue-500/20'
                      }`}>
                        <div className="flex items-start gap-3">
                          <AlertCircle size={16} className="mt-0.5 flex-shrink-0"
                            style={{ color: order.status === 'cancelled' ? colors.danger : colors.primary }}
                          />
                          <div className="text-sm">
                            {order.installation && (
                              <p style={{ color: colors.text }}>{order.installation}</p>
                            )}
                            {order.warranty && (
                              <p style={{ color: colors.success }}>{order.warranty}</p>
                            )}
                            {order.reason && (
                              <p style={{ color: colors.danger }}>{order.reason}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t" style={{ borderColor: colors.border }}>
                      <button className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors hover:bg-white/5"
                        style={{
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      
                      {order.status === 'delivered' && (
                        <>
                          <button className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors hover:bg-white/5"
                            style={{
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            <Repeat size={16} />
                            Reorder
                          </button>
                          <button className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors hover:bg-white/5"
                            style={{
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            <Star size={16} />
                            Rate Product
                          </button>
                        </>
                      )}
                      
                      {order.status === 'shipped' && (
                        <button className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors hover:bg-white/5"
                          style={{
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          <Truck size={16} />
                          Track Order
                        </button>
                      )}
                      
                      <button className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors hover:bg-white/5"
                        style={{
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <MessageSquare size={16} />
                        Support
                      </button>
                      
                      <button className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors hover:bg-white/5"
                        style={{
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <Download size={16} />
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* No Orders State */
            <div 
              className="rounded-2xl p-12 text-center"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <Package size={32} style={{ color: colors.primary }} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
                No orders found
              </h3>
              <p className="mb-8 max-w-md mx-auto" style={{ color: colors.muted }}>
                {searchTerm 
                  ? `No orders matching "${searchTerm}"`
                  : `You haven't placed any orders yet. Start building your dream gym!`
                }
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
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-8 pt-8 border-t" style={{ borderColor: colors.border }}>
            <div className="text-sm" style={{ color: colors.muted }}>
              Showing 1-{filteredOrders.length} of {orders.length} orders
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5 disabled:opacity-30"
                style={{
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
                disabled
              >
                ←
              </button>
              {[1, 2, 3].map(page => (
                <button 
                  key={page}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    page === 1 
                      ? 'text-white' 
                      : 'hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: page === 1 ? colors.primary : 'transparent',
                    border: `1px solid ${page === 1 ? colors.primary : colors.border}`,
                    color: page === 1 ? colors.text : colors.muted,
                  }}
                >
                  {page}
                </button>
              ))}
              <button className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                style={{
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12">
          <div 
            className="rounded-2xl p-8"
            style={{
              background: `linear-gradient(135deg, ${colors.cardBg} 0%, #1a1a1a 100%)`,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
                  Need help with your order?
                </h3>
                <p className="mb-4" style={{ color: colors.muted }}>
                  Our support team is here to help with tracking, returns, or any questions.
                </p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                    color: colors.text,
                  }}
                >
                  Contact Support
                </button>
                <button className="px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5"
                  style={{
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;