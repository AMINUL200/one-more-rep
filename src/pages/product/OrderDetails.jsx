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
    info: "#3B82F6",
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

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return colors.success;
      case 'shipped':
        return colors.primary;
      case 'pending':
      case 'processing':
        return colors.warning;
      case 'cancelled':
        return colors.danger;
      case 'paid':
        return colors.success;
      default:
        return colors.muted;
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
      
      <div style={{ backgroundColor: colors.background }} className="min-h-screen py-8 px-4 md:px-8 pt-30 md:pt-40">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-2 mb-6 transition-colors hover:text-white"
            style={{ color: colors.muted }}
          >
            <ArrowLeft size={18} />
            <span>Back to My Orders</span>
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <Package size={24} style={{ color: colors.primary }} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold" style={{ color: colors.text }}>
                    Order {orderData.order_number}
                  </h1>
                  <button
                    onClick={copyOrderNumber}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    title="Copy order number"
                  >
                    <Copy size={16} style={{ color: colors.muted }} />
                  </button>
                </div>
                <p className="text-lg" style={{ color: colors.muted }}>
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
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div
                  className="p-6 border-b"
                  style={{ borderColor: colors.border }}
                >
                  <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: colors.text }}>
                    <ShoppingBag size={20} style={{ color: colors.primary }} />
                    Order Items
                  </h2>
                </div>

                <div className="divide-y" style={{ borderColor: colors.border }}>
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
                              <h3 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
                                {item.product?.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm">
                                <span style={{ color: colors.muted }}>
                                  Quantity: {item.qty}
                                </span>
                                <span style={{ color: colors.muted }}>
                                  Price per unit: {formatCurrency(item.price)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold flex items-center justify-end" style={{ color: colors.primary }}>
                                <IndianRupee size={16} />
                                {(item.qty * item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </p>
                              <Link
                                to={`/product-details/${item.product?.slug}`}
                                className="text-sm mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all"
                                style={{ color: colors.primary }}
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
                <div
                  className="p-6 border-t"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg" style={{ color: colors.muted }}>
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold flex items-center" style={{ color: colors.text }}>
                      <IndianRupee size={20} />
                      {parseFloat(orderData.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details Card */}
              {orderData.payment && (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    className="p-6 border-b"
                    style={{ borderColor: colors.border }}
                  >
                    <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: colors.text }}>
                      <CreditCard size={20} style={{ color: colors.primary }} />
                      Payment Details
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm mb-1" style={{ color: colors.muted }}>
                          Payment Gateway
                        </p>
                        <p className="font-medium" style={{ color: colors.text }}>
                          {orderData.payment.payment_gateway}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm mb-1" style={{ color: colors.muted }}>
                          Transaction ID
                        </p>
                        <p className="font-mono text-sm" style={{ color: colors.text }}>
                          {orderData.payment.transaction_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm mb-1" style={{ color: colors.muted }}>
                          Payment ID
                        </p>
                        <p className="font-mono text-sm" style={{ color: colors.text }}>
                          {orderData.payment.payment_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm mb-1" style={{ color: colors.muted }}>
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
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div
                  className="p-6 border-b"
                  style={{ borderColor: colors.border }}
                >
                  <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: colors.text }}>
                    <User size={20} style={{ color: colors.primary }} />
                    Customer Details
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <User size={18} style={{ color: colors.muted }} className="mt-0.5" />
                    <div>
                      <p className="text-sm mb-1" style={{ color: colors.muted }}>
                        Receiver Name
                      </p>
                      <p className="font-medium" style={{ color: colors.text }}>
                        {orderData.receiver_name || orderData.customer_name}
                      </p>
                    </div>
                  </div>

                  {orderData.receiver_phone && (
                    <div className="flex items-start gap-3">
                      <Phone size={18} style={{ color: colors.muted }} className="mt-0.5" />
                      <div>
                        <p className="text-sm mb-1" style={{ color: colors.muted }}>
                          Phone Number
                        </p>
                        <p className="font-medium" style={{ color: colors.text }}>
                          {orderData.receiver_phone}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <MapPin size={18} style={{ color: colors.muted }} className="mt-0.5" />
                    <div>
                      <p className="text-sm mb-1" style={{ color: colors.muted }}>
                        Shipping Address
                      </p>
                      <p className="font-medium" style={{ color: colors.text }}>
                        {orderData.address}, {orderData.city}
                      </p>
                      <p className="font-medium" style={{ color: colors.text }}>
                        {orderData.state} - {orderData.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div
                  className="p-6 border-b"
                  style={{ borderColor: colors.border }}
                >
                  <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: colors.text }}>
                    <Package size={20} style={{ color: colors.primary }} />
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span style={{ color: colors.muted }}>Order Number</span>
                    <span className="font-mono text-sm" style={{ color: colors.text }}>
                      {orderData.order_number}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ color: colors.muted }}>Order Date</span>
                    <span style={{ color: colors.text }}>
                      {new Date(orderData.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ color: colors.muted }}>Total Items</span>
                    <span style={{ color: colors.text }}>
                      {orderData.items?.length || 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ color: colors.muted }}>Payment Method</span>
                    <span className="capitalize" style={{ color: colors.text }}>
                      {orderData.payment_method}
                    </span>
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold" style={{ color: colors.text }}>
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold flex items-center" style={{ color: colors.primary }}>
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
                  className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                    color: colors.text,
                  }}
                >
                  <MessageSquare size={18} />
                  Need Help? Contact Support
                </button>

                {/* <button
                  className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:bg-white/5"
                  style={{
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Download size={18} />
                  Download Invoice
                </button> */}
              </div>

              {/* Order Status Timeline */}
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
                  <Clock size={18} style={{ color: colors.primary }} />
                  Order Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${colors.success}20`,
                        color: colors.success,
                      }}
                    >
                      <CheckCircle size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text }}>
                        Order Placed
                      </p>
                      <p className="text-xs" style={{ color: colors.muted }}>
                        {formatDate(orderData.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: orderData.order_status === 'shipped' || orderData.order_status === 'delivered'
                          ? `${colors.success}20`
                          : `${colors.warning}20`,
                        color: orderData.order_status === 'shipped' || orderData.order_status === 'delivered'
                          ? colors.success
                          : colors.warning,
                      }}
                    >
                      <Truck size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text }}>
                        Order Shipped
                      </p>
                      {orderData.order_status === 'shipped' || orderData.order_status === 'delivered' ? (
                        <p className="text-xs" style={{ color: colors.muted }}>
                          {formatDate(orderData.updated_at)}
                        </p>
                      ) : (
                        <p className="text-xs" style={{ color: colors.muted }}>
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
                          ? `${colors.success}20`
                          : `${colors.muted}20`,
                        color: orderData.order_status === 'delivered'
                          ? colors.success
                          : colors.muted,
                      }}
                    >
                      <CheckCircle size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.text }}>
                        Delivered
                      </p>
                      {orderData.order_status === 'delivered' ? (
                        <p className="text-xs" style={{ color: colors.muted }}>
                          {formatDate(orderData.updated_at)}
                        </p>
                      ) : (
                        <p className="text-xs" style={{ color: colors.muted }}>
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