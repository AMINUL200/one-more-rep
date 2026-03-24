import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Download,
  MessageSquare,
  CreditCard,
  MapPin,
  User,
  Phone,
  Calendar,
  IndianRupee,
  ShoppingBag,
  Copy,
  ExternalLink,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";
import PageHelmet from "../../component/common/PageHelmet";
import { api } from "../../utils/app";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Get status color using CSS variables
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'var(--color-success)';
      case 'shipped':
        return 'var(--color-primary)';
      case 'pending':
      case 'processing':
        return 'var(--color-warning)';
      case 'cancelled':
        return '#DC2626';
      case 'paid':
        return 'var(--color-success)';
      default:
        return 'var(--text-muted)';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return CheckCircle;
      case 'shipped':
        return Truck;
      case 'pending':
      case 'processing':
        return Clock;
      case 'cancelled':
        return XCircle;
      case 'paid':
        return CheckCircle;
      default:
        return Package;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(`/user/my-compleate-orders/details/${id}`);
        
        if (response.data?.status) {
          setOrderData(response.data.data);
        } else {
          toast.error("Failed to load order details");
          navigate("/my-orders");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to load order details");
        navigate("/my-orders");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, isAuthenticated, navigate]);

  // Copy order number
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderData.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Order number copied!");
  };

  if (loading) return <PageLoader />;

  if (!orderData) return null;

  const OrderStatusIcon = getStatusIcon(orderData.order_status);
  const PaymentStatusIcon = getStatusIcon(orderData.payment_status);
  const statusColor = getStatusColor(orderData.order_status);
  const paymentStatusColor = getStatusColor(orderData.payment_status);

  return (
    <>
      <PageHelmet title={`Order ${orderData.order_number} - ONE REP MORE`} />
      
      <div className="min-h-screen py-8 px-4 md:px-8 pt-30 md:pt-40 bg-main">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-2 mb-6 transition-colors hover:text-primary text-muted"
          >
            <ArrowLeft size={18} />
            <span>Back to My Orders</span>
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary-light border border-primary/30">
                <Package size={24} className="text-brand" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    Order {orderData.order_number}
                  </h1>
                  <button
                    onClick={copyOrderNumber}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    title="Copy order number"
                  >
                    <Copy size={16} className="text-muted" />
                  </button>
                </div>
                <p className="text-lg text-muted">
                  Placed on {formatDate(orderData.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                style={{
                  backgroundColor: `${statusColor}20`,
                  color: statusColor,
                }}
              >
                <OrderStatusIcon size={16} />
                Order: {orderData.order_status}
              </span>
              <span
                className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
                style={{
                  backgroundColor: `${paymentStatusColor}20`,
                  color: paymentStatusColor,
                }}
              >
                <PaymentStatusIcon size={16} />
                Payment: {orderData.payment_status}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items Card */}
              <div className="rounded-2xl overflow-hidden bg-card border border-theme">
                <div className="p-6 border-b border-theme">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                    <ShoppingBag size={20} className="text-brand" />
                    Order Items
                  </h2>
                </div>

                <div className="divide-y divide-theme">
                  {orderData.items?.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={
                              item.product?.images?.find(img => img.is_thumbnail === 1)?.image
                                ? `${import.meta.env.VITE_STORAGE_URL}/${item.product.images.find(img => img.is_thumbnail === 1).image}`
                                : item.product?.images?.[0]?.image
                                ? `${import.meta.env.VITE_STORAGE_URL}/${item.product.images[0].image}`
                                : "https://via.placeholder.com/100"
                            }
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100";
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-bold mb-2 text-primary">
                                {item.product?.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-muted">
                                  Quantity: {item.qty}
                                </span>
                                <span className="text-muted">
                                  Price per unit: {formatCurrency(item.price)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold flex items-center justify-end text-brand">
                                <IndianRupee size={16} />
                                {(item.qty * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </p>
                              <Link
                                to={`/product-details/${item.product?.slug}`}
                                className="text-sm mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all text-brand"
                              >
                                View Product
                                <ChevronRight size={14} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="p-6 border-t border-theme">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-muted">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold flex items-center text-primary">
                      <IndianRupee size={20} />
                      {parseFloat(orderData.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details Card */}
              {orderData.payment && (
                <div className="rounded-2xl overflow-hidden bg-card border border-theme">
                  <div className="p-6 border-b border-theme">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                      <CreditCard size={20} className="text-brand" />
                      Payment Details
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm mb-1 text-muted">
                          Payment Gateway
                        </p>
                        <p className="font-medium text-primary">
                          {orderData.payment.payment_gateway}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm mb-1 text-muted">
                          Transaction ID
                        </p>
                        <p className="font-mono text-sm text-primary">
                          {orderData.payment.transaction_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm mb-1 text-muted">
                          Payment ID
                        </p>
                        <p className="font-mono text-sm text-primary">
                          {orderData.payment.payment_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm mb-1 text-muted">
                          Payment Status
                        </p>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                          style={{
                            backgroundColor: `${paymentStatusColor}20`,
                            color: paymentStatusColor,
                          }}
                        >
                          <PaymentStatusIcon size={12} />
                          {orderData.payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Customer & Order Info */}
            <div className="space-y-6">
              {/* Customer Details Card */}
              <div className="rounded-2xl overflow-hidden bg-card border border-theme">
                <div className="p-6 border-b border-theme">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                    <User size={20} className="text-brand" />
                    Customer Details
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <User size={18} className="text-muted mt-0.5" />
                    <div>
                      <p className="text-sm mb-1 text-muted">
                        Receiver Name
                      </p>
                      <p className="font-medium text-primary">
                        {orderData.receiver_name || orderData.customer_name}
                      </p>
                    </div>
                  </div>

                  {orderData.receiver_phone && (
                    <div className="flex items-start gap-3">
                      <Phone size={18} className="text-muted mt-0.5" />
                      <div>
                        <p className="text-sm mb-1 text-muted">
                          Phone Number
                        </p>
                        <p className="font-medium text-primary">
                          {orderData.receiver_phone}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-muted mt-0.5" />
                    <div>
                      <p className="text-sm mb-1 text-muted">
                        Shipping Address
                      </p>
                      <p className="font-medium text-primary">
                        {orderData.address}, {orderData.city}
                      </p>
                      <p className="font-medium text-primary">
                        {orderData.state} - {orderData.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="rounded-2xl overflow-hidden bg-card border border-theme">
                <div className="p-6 border-b border-theme">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
                    <Package size={20} className="text-brand" />
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted">Order Number</span>
                    <span className="font-mono text-sm text-primary">
                      {orderData.order_number}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted">Order Date</span>
                    <span className="text-primary">
                      {new Date(orderData.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted">Total Items</span>
                    <span className="text-primary">
                      {orderData.items?.length || 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted">Payment Method</span>
                    <span className="capitalize text-primary">
                      {orderData.payment_method}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-theme">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold flex items-center text-brand">
                        <IndianRupee size={18} />
                        {parseFloat(orderData.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-primary-hover bg-gradient-primary text-primary"
                >
                  <MessageSquare size={18} />
                  Need Help? Contact Support
                </button>
              </div>

              {/* Order Status Timeline */}
              <div className="rounded-2xl p-6 bg-card border border-theme">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
                  <Clock size={18} className="text-brand" />
                  Order Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--color-success)20',
                        color: 'var(--color-success)',
                      }}
                    >
                      <CheckCircle size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Order Placed
                      </p>
                      <p className="text-xs text-muted">
                        {formatDate(orderData.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: orderData.order_status === 'shipped' || orderData.order_status === 'delivered'
                          ? 'var(--color-success)20'
                          : 'var(--color-warning)20',
                        color: orderData.order_status === 'shipped' || orderData.order_status === 'delivered'
                          ? 'var(--color-success)'
                          : 'var(--color-warning)',
                      }}
                    >
                      <Truck size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Order Shipped
                      </p>
                      {orderData.order_status === 'shipped' || orderData.order_status === 'delivered' ? (
                        <p className="text-xs text-muted">
                          {formatDate(orderData.updated_at)}
                        </p>
                      ) : (
                        <p className="text-xs text-muted">
                          Pending
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: orderData.order_status === 'delivered'
                          ? 'var(--color-success)20'
                          : 'var(--text-muted)20',
                        color: orderData.order_status === 'delivered'
                          ? 'var(--color-success)'
                          : 'var(--text-muted)',
                      }}
                    >
                      <CheckCircle size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Delivered
                      </p>
                      {orderData.order_status === 'delivered' ? (
                        <p className="text-xs text-muted">
                          {formatDate(orderData.updated_at)}
                        </p>
                      ) : (
                        <p className="text-xs text-muted">
                          Pending
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;