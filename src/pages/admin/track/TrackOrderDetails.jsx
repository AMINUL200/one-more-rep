import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  RefreshCw,
  Loader,
  ShoppingBag,
  Tag,
  Box,
  Receipt,
  History,
  ArrowLeft,
  Download,
  Printer,
  Share2,
  ChevronRight,
  Check,
  XCircle,
  DollarSign,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { api } from "../../../utils/app";
import PageHelmet from "../../../component/common/PageHelmet";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);

  // Color scheme
  const colors = {
    primary: "#1B2B4C",
    primaryLight: "#2A3F66",
    background: "#F8FAFC",
    cardBg: "#FFFFFF",
    border: "#E2E8F0",
    text: "#1E293B",
    textLight: "#64748B",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    purple: "#8B5CF6",
  };

  // Status configurations
  const statusConfig = {
    pending: { color: colors.warning, icon: Clock, label: "Pending", bg: "#FEF3C7" },
    processing: { color: colors.info, icon: RefreshCw, label: "Processing", bg: "#EFF6FF" },
    shipped: { color: colors.primary, icon: Truck, label: "Shipped", bg: "#EFF6FF" },
    completed: { color: colors.success, icon: CheckCircle, label: "Completed", bg: "#D1FAE5" },
    cancelled: { color: colors.danger, icon: AlertCircle, label: "Cancelled", bg: "#FEE2E2" },
  };

  // Payment status configurations
  const paymentStatusConfig = {
    pending: { color: colors.warning, icon: Clock, label: "Pending", bg: "#FEF3C7" },
    paid: { color: colors.success, icon: CheckCircle, label: "Paid", bg: "#D1FAE5" },
    failed: { color: colors.danger, icon: XCircle, label: "Failed", bg: "#FEE2E2" },
    refunded: { color: colors.info, icon: RefreshCw, label: "Refunded", bg: "#EFF6FF" },
  };

  // Fetch order details
  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/orders/${id}`);
      if (response.data?.status) {
        setOrderData(response.data.data);
        setTrackingHistory(response.data.data.tracks || []);
      } else {
        toast.error("Order not found");
        navigate("/admin/order-track");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
      navigate("/admin/order-track");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }
    const storageUrl = import.meta.env.VITE_STORAGE_URL || "";
    return `${storageUrl}/${imagePath}`;
  };

  // Get product display name with variant
  const getProductDisplayName = (item) => {
    if (item.variant) {
      return `${item.product.name} - ${item.variant.color} / ${item.variant.size}`;
    }
    return item.product.name;
  };

  // Get product image
  const getProductImage = (item) => {
    if (item.product.images && item.product.images.length > 0) {
      const thumbnail = item.product.images.find(img => img.is_thumbnail === 1);
      if (thumbnail) {
        return getImageUrl(thumbnail.image);
      }
      return getImageUrl(item.product.images[0].image);
    }
    return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop";
  };

  if (loading) {
    return (
      <div
              className="min-h-screen flex items-center justify-center"
              style={{ backgroundColor: colors.background }}
            >
              <div className="text-center">
                <Loader
                  className="animate-spin mx-auto mb-4"
                  size={40}
                  style={{ color: colors.primary }}
                />
                <p style={{ color: colors.textLight }}>Loading orders details...</p>
              </div>
            </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Package size={48} className="mx-auto mb-4" style={{ color: colors.textLight }} />
          <p className="text-lg" style={{ color: colors.textLight }}>Order not found</p>
          <button
            onClick={() => navigate("/admin/order-track")}
            className="mt-4 px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: colors.primary }}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const orderStatus = statusConfig[orderData.order_status] || statusConfig.pending;
  const paymentStatus = paymentStatusConfig[orderData.payment_status] || paymentStatusConfig.pending;
  const StatusIcon = orderStatus.icon;
  const PaymentIcon = paymentStatus.icon;

  return (
    <>
      <PageHelmet title={`Order #${orderData.order_number} - ONE REP MORE`} />
      
      <div className="min-h-screen py-8 px-4 md:px-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-7xl mx-auto">
          {/* Header with Back Button */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/order-track")}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                style={{ color: colors.text }}
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold" style={{ color: colors.text }}>
                  Order Details
                </h1>
                <p className="text-lg mt-1" style={{ color: colors.textLight }}>
                  Order #{orderData.order_number}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg flex items-center gap-2 border transition-colors hover:bg-gray-50"
                style={{ borderColor: colors.border, color: colors.text }}
              >
                <Printer size={18} />
                Print
              </button>
              {/* <button
                className="px-4 py-2 rounded-lg flex items-center gap-2 border transition-colors hover:bg-gray-50"
                style={{ borderColor: colors.border, color: colors.text }}
              >
                <Download size={18} />
                Download Invoice
              </button> */}
            </div>
          </div>

          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Order Status Card */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${orderStatus.color}10` }}>
                  <StatusIcon size={20} style={{ color: orderStatus.color }} />
                </div>
                <h3 className="font-semibold" style={{ color: colors.text }}>Order Status</h3>
              </div>
              <div>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: orderStatus.bg, color: orderStatus.color }}
                >
                  {orderStatus.label}
                </span>
                <p className="text-sm mt-3" style={{ color: colors.textLight }}>
                  Last updated: {formatDate(orderData.updated_at)}
                </p>
              </div>
            </div>

            {/* Payment Status Card */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${paymentStatus.color}10` }}>
                  <PaymentIcon size={20} style={{ color: paymentStatus.color }} />
                </div>
                <h3 className="font-semibold" style={{ color: colors.text }}>Payment Status</h3>
              </div>
              <div>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: paymentStatus.bg, color: paymentStatus.color }}
                >
                  {paymentStatus.label}
                </span>
                {orderData.payment_method && (
                  <p className="text-sm mt-3" style={{ color: colors.textLight }}>
                    via {orderData.payment_method.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            {/* Order Amount Card */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.success}10` }}>
                  <DollarSign size={20} style={{ color: colors.success }} />
                </div>
                <h3 className="font-semibold" style={{ color: colors.text }}>Order Amount</h3>
              </div>
              <div>
                <p className="text-2xl font-bold flex items-center" style={{ color: colors.text }}>
                  <IndianRupee size={20} />
                  {parseFloat(orderData.total_amount).toLocaleString("en-IN")}
                </p>
                <p className="text-sm mt-2" style={{ color: colors.textLight }}>
                  Order placed on {formatDate(orderData.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information & Shipping Address */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Customer Information */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
                <User size={20} style={{ color: colors.primary }} />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User size={16} style={{ color: colors.textLight }} />
                  <span style={{ color: colors.text }}>
                    {orderData.receiver_name || orderData.customer_name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} style={{ color: colors.textLight }} />
                  <span style={{ color: colors.text }}>{orderData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} style={{ color: colors.textLight }} />
                  <span style={{ color: colors.text }}>{orderData.receiver_phone || orderData.phone}</span>
                </div>
                {orderData.payment && (
                  <div className="pt-3 mt-2 border-t" style={{ borderColor: colors.border }}>
                    <p className="text-sm font-medium mb-2" style={{ color: colors.text }}>Payment Details</p>
                    <p className="text-sm" style={{ color: colors.textLight }}>Transaction ID: {orderData.payment.transaction_id || "N/A"}</p>
                    <p className="text-sm" style={{ color: colors.textLight }}>Payment ID: {orderData.payment.payment_id || "N/A"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-xl border p-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
                <MapPin size={20} style={{ color: colors.primary }} />
                Shipping Address
              </h3>
              {orderData.address || orderData.city ? (
                <div className="space-y-1">
                  <p style={{ color: colors.text }}>{orderData.address}</p>
                  <p style={{ color: colors.text }}>
                    {orderData.city}, {orderData.state} - {orderData.pincode}
                  </p>
                </div>
              ) : (
                <p style={{ color: colors.textLight }}>No address provided</p>
              )}
            </div>
          </div>

          {/* Order Items Table */}
          <div className="rounded-xl border overflow-hidden mb-8" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <div className="p-6 border-b" style={{ borderColor: colors.border }}>
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: colors.text }}>
                <ShoppingBag size={20} style={{ color: colors.primary }} />
                Order Items ({orderData.items?.length || 0})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: colors.background }}>
                  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Product</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Variant</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Quantity</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold" style={{ color: colors.textLight }}>Total</th>
                   </tr>
                </thead>
                <tbody>
                  {orderData.items?.map((item) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getProductImage(item)}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: colors.text }}>{item.product.name}</p>
                            {item.product.tag_line && (
                              <p className="text-xs" style={{ color: colors.textLight }}>{item.product.tag_line}</p>
                            )}
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        {item.variant ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                              <Tag size={10} />
                              {item.variant.variant_name || `${item.variant.color} / ${item.variant.size}`}
                            </span>
                            <div className="text-xs text-muted">
                              Color: {item.variant.color} | Size: {item.variant.size}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm" style={{ color: colors.textLight }}>No variant</span>
                        )}
                       </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center" style={{ color: colors.text }}>
                          <IndianRupee size={12} />
                          {parseFloat(item.price).toLocaleString("en-IN")}
                        </span>
                       </td>
                      <td className="px-6 py-4">
                        <span style={{ color: colors.text }}>{item.qty}</span>
                       </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold flex items-center justify-end" style={{ color: colors.text }}>
                          <IndianRupee size={12} />
                          {(parseFloat(item.price) * item.qty).toLocaleString("en-IN")}
                        </span>
                       </td>
                     </tr>
                  ))}
                </tbody>
                <tfoot style={{ borderTop: `1px solid ${colors.border}` }}>
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-right font-semibold" style={{ color: colors.text }}>Subtotal</td>
                    <td className="px-6 py-4 text-right font-semibold flex items-center justify-end" style={{ color: colors.text }}>
                      <IndianRupee size={12} />
                      {parseFloat(orderData.total_amount).toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-right font-semibold" style={{ color: colors.text }}>Total</td>
                    <td className="px-6 py-4 text-right text-xl font-bold flex items-center justify-end" style={{ color: colors.primary }}>
                      <IndianRupee size={16} />
                      {parseFloat(orderData.total_amount).toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order Tracking History */}
          {trackingHistory.length > 0 && (
            <div className="rounded-xl border p-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: colors.text }}>
                <History size={20} style={{ color: colors.primary }} />
                Order Tracking History
              </h3>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" style={{ backgroundColor: colors.border }}></div>
                
                <div className="space-y-6">
                  {trackingHistory.map((track, index) => {
                    const trackStatus = statusConfig[track.status] || statusConfig.pending;
                    const TrackIcon = trackStatus.icon;
                    const isLast = index === trackingHistory.length - 1;
                    
                    return (
                      <div key={track.id} className="relative pl-10">
                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-white border-2" style={{ borderColor: trackStatus.color }}>
                          <TrackIcon size={14} style={{ color: trackStatus.color }} />
                        </div>
                        
                        <div className="pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold" style={{ color: trackStatus.color }}>
                              {trackStatus.label}
                            </span>
                            <span className="text-xs" style={{ color: colors.textLight }}>
                              {formatDate(track.created_at)}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: colors.text }}>{track.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;