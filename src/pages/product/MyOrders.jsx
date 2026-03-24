import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, Truck, CheckCircle, Clock, XCircle, 
  Repeat, Eye, Download, MessageSquare, Star,
  Filter, Search, Calendar, CreditCard, MapPin,
  ChevronRight, ArrowRight, RefreshCw, AlertCircle,
  User, Phone, Home, IndianRupee
} from 'lucide-react';
import PageLoader from '../../component/common/PageLoader';
import PageHelmet from '../../component/common/PageHelmet';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/app';

const MyOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Status colors mapping using CSS variables
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'var(--color-success)';
      case 'processing':
      case 'pending':
        return 'var(--color-warning)';
      case 'shipped':
        return 'var(--color-primary)';
      case 'cancelled':
        return '#DC2626';
      case 'paid':
        return 'var(--color-success)';
      default:
        return 'var(--text-muted)';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return CheckCircle;
      case 'processing':
      case 'pending':
        return Clock;
      case 'shipped':
        return Truck;
      case 'cancelled':
        return XCircle;
      case 'paid':
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/user/my-compleate-orders');
        
        if (response.data?.status) {
          setOrders(response.data.data);
          setFilteredOrders(response.data.data);
        } else {
          toast.error('Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  // Filter orders based on status and search
  useEffect(() => {
    let filtered = orders;
    
    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.order_status?.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.receiver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  }, [activeFilter, searchTerm, orders]);

  // Get filter counts
  const getFilterCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.order_status?.toLowerCase() === status.toLowerCase()).length;
  };

  // Filter options
  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  // Calculate stats
  const stats = [
    { 
      label: 'Total Orders', 
      value: orders.length.toString(),
      change: ''
    },
    { 
      label: 'Total Spent', 
      value: formatCurrency(orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0)),
      change: ''
    },
    { 
      label: 'Pending Orders', 
      value: orders.filter(o => o.order_status === 'pending').length.toString(),
      change: ''
    },
    { 
      label: 'Delivered Orders', 
      value: orders.filter(o => o.order_status === 'delivered').length.toString(),
      change: ''
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <>
      <PageHelmet title="My Orders - ONE REP MORE" />
      <div className="min-h-screen py-8 px-4 md:px-8 pt-30 md:pt-40 bg-main">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary-light border border-primary/30">
                  <Package size={24} className="text-brand" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    My Orders
                  </h1>
                  <p className="text-lg text-muted">
                    Track and manage your equipment orders
                  </p>
                </div>
              </div>
              
              <Link 
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-primary-hover bg-gradient-primary text-primary"
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
                  className="p-4 rounded-xl bg-card border border-theme"
                >
                  <p className="text-sm mb-1 text-muted">
                    {stat.label}
                  </p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-primary">
                      {stat.value}
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
                        ? 'text-primary' 
                        : 'hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: activeFilter === filter.id ? 'var(--color-primary)' : 'transparent',
                      border: `1px solid ${activeFilter === filter.id ? 'var(--color-primary)' : 'var(--bg-border)'}`,
                      color: activeFilter === filter.id ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {filter.label}
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: activeFilter === filter.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-border)',
                        color: activeFilter === filter.id ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      {getFilterCount(filter.id)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
                <input
                  type="text"
                  placeholder="Search by order ID or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg focus:outline-none w-full sm:w-64 bg-card border-theme text-primary"
                  style={{
                    border: '1px solid var(--bg-border)',
                  }}
                />
              </div>
            </div>

            {/* Order Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.order_status);
                const statusColor = getStatusColor(order.order_status);
                
                return (
                  <div 
                    key={order.id}
                    className="rounded-2xl overflow-hidden group cursor-pointer hover:border-primary transition-all duration-300 bg-card border border-theme"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-theme">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <StatusIcon size={20} style={{ color: statusColor }} />
                            <div>
                              <h3 className="text-lg font-bold text-primary">
                                Order {order.order_number}
                              </h3>
                              <p className="text-sm text-muted">
                                Placed on {formatDate(order.created_at)}
                              </p>
                            </div>
                          </div>
                          
                          <span className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: `${statusColor}20`,
                              color: statusColor,
                            }}
                          >
                            {getStatusText(order.order_status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold mb-1 flex items-center justify-end text-primary">
                              <IndianRupee size={18} />
                              {parseFloat(order.total_amount).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-muted">
                              Payment: {order.payment_method}
                            </p>
                          </div>
                          <ChevronRight size={20} className="text-muted group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Customer Details */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted">
                            Customer Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <User size={14} className="text-muted" />
                              <span className="text-sm text-primary">
                                {order.receiver_name || order.customer_name}
                              </span>
                            </div>
                            
                            {(order.receiver_phone || order.phone) && (
                              <div className="flex items-center gap-2">
                                <Phone size={14} className="text-muted" />
                                <span className="text-sm text-primary">
                                  {order.receiver_phone || order.phone}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-start gap-2">
                              <MapPin size={14} className="text-muted mt-0.5" />
                              <span className="text-sm text-primary">
                                {order.address}, {order.city}, {order.state} - {order.pincode}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted">
                            Payment Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CreditCard size={14} className="text-muted" />
                              <span className="text-sm text-primary">
                                {order.payment_method} • {order.payment_status}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <IndianRupee size={14} className="text-muted" />
                              <span className="text-sm font-semibold text-brand">
                                Total: {formatCurrency(order.total_amount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-theme">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/order/${order.id}`);
                          }}
                          className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors hover:bg-white/5 text-primary border border-theme"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Support functionality
                          }}
                          className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors hover:bg-white/5 text-primary border border-theme"
                        >
                          <MessageSquare size={16} />
                          Support
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* No Orders State */
              <div className="rounded-2xl p-12 text-center bg-card border border-theme">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-primary-light border border-primary/30">
                  <Package size={32} className="text-brand" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">
                  No orders found
                </h3>
                <p className="mb-8 max-w-md mx-auto text-muted">
                  {searchTerm 
                    ? `No orders matching "${searchTerm}"`
                    : `You haven't placed any orders yet. Start building your dream gym!`
                  }
                </p>
                <Link 
                  to="/products"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-primary transition-all hover:shadow-primary-hover bg-gradient-primary"
                >
                  Browse Equipment
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-12">
            <div className="rounded-2xl p-8 bg-gradient-to-r from-card to-main border border-theme">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-primary">
                    Need help with your order?
                  </h3>
                  <p className="mb-4 text-muted">
                    Our support team is here to help with tracking, returns, or any questions.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => navigate('/contact')}
                    className="px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-primary-hover bg-gradient-primary text-primary"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrders;