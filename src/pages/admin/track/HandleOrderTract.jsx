import React, { useEffect, useState } from "react";
import {
  Package,
  Search,
  Filter,
  Eye,
  X,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  DollarSign,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  RefreshCw,
  Loader,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../utils/app";

const HandleOrderTract = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  // Color Schema - Light mode for admin
  const colors = {
    primary: "#2563eb", // Dark blue
    primaryHover: "#1d4ed8",
    background: "#f3f4f6", // Light gray background
    cardBg: "#ffffff", // White cards
    border: "#e5e7eb", // Light border
    text: "#111827", // Dark text
    textLight: "#6b7280", // Gray text
    muted: "#6b7280",
    success: "#10b981", // Green
    warning: "#f59e0b", // Orange
    danger: "#ef4444", // Red
    info: "#3b82f6", // Blue
  };

  // Status configurations
  const statusConfig = {
    pending: { color: colors.warning, icon: Clock, label: "Pending" },
    processing: { color: colors.info, icon: RefreshCw, label: "Processing" },
    shipped: { color: colors.primary, icon: Truck, label: "Shipped" },
    completed: { color: colors.success, icon: CheckCircle, label: "Completed" },
    cancelled: { color: colors.danger, icon: AlertCircle, label: "Cancelled" },
  };

  // Payment status configurations
  const paymentStatusConfig = {
    pending: { color: colors.warning, icon: Clock, label: "Pending" },
    paid: { color: colors.success, icon: CheckCircle, label: "Paid" },
    failed: { color: colors.danger, icon: AlertCircle, label: "Failed" },
    refunded: { color: colors.info, icon: DollarSign, label: "Refunded" },
  };

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/orders");
      if (response.data?.status) {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.order_number
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customer_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.receiver_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.order_status === statusFilter,
      );
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.payment_status === paymentFilter,
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, paymentFilter, orders]);

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus, message = "") => {
    setUpdatingOrder(orderId);
    try {
      const response = await api.post(`/admin/orders/status/${orderId}`, {
        status: newStatus,
        message: message || `Order ${newStatus}`,
      });

      if (response.data?.status) {
        toast.success(`Order status updated to ${newStatus}`);
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, order_status: newStatus }
              : order,
          ),
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, order_status: newStatus }));
        }
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrder(null);
      setShowStatusDropdown(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      const response = await api.post(`/admin/orders/payment/${orderId}`, {
        payment_status: newStatus,
      });

      if (response.data?.status) {
        toast.success(`Payment status updated to ${newStatus}`);
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, payment_status: newStatus }
              : order,
          ),
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, payment_status: newStatus }));
        }
      } else {
        toast.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingOrder(null);
      setShowPaymentDropdown(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
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
          <p style={{ color: colors.textLight }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ backgroundColor: colors.background }}
        className="min-h-screen py-8 px-4 md:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.primary}15`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <Package size={24} style={{ color: colors.primary }} />
              </div>
              <div>
                <h1
                  className="text-3xl md:text-4xl font-bold"
                  style={{ color: colors.text }}
                >
                  Order Management
                </h1>
                <p className="text-lg" style={{ color: colors.textLight }}>
                  Track and manage all customer orders
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={18}
                  style={{ color: colors.textLight }}
                />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    focusRing: colors.primary,
                  }}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  focusRing: colors.primary,
                }}
              >
                <option value="all">All Order Status</option>
                {Object.keys(statusConfig).map((status) => (
                  <option key={status} value={status}>
                    {statusConfig[status].label}
                  </option>
                ))}
              </select>

              {/* Payment Filter */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  focusRing: colors.primary,
                }}
              >
                <option value="all">All Payment Status</option>
                {Object.keys(paymentStatusConfig).map((status) => (
                  <option key={status} value={status}>
                    {paymentStatusConfig[status].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <p style={{ color: colors.textLight }}>
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>

          {/* Orders Table */}
          <div
            className="rounded-xl overflow-hidden shadow-sm"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: `${colors.background}` }}>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold"
                      style={{ color: colors.textLight }}
                    >
                      Order #
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold"
                      style={{ color: colors.textLight }}
                    >
                      Customer
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold"
                      style={{ color: colors.textLight }}
                    >
                      Date
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold"
                      style={{ color: colors.textLight }}
                    >
                      Amount
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold"
                      style={{ color: colors.textLight }}
                    >
                      Payment
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold"
                      style={{ color: colors.textLight }}
                    >
                      Status
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold"
                      style={{ color: colors.textLight }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const StatusIcon =
                      statusConfig[order.order_status]?.icon || Clock;
                    const PaymentIcon =
                      paymentStatusConfig[order.payment_status]?.icon ||
                      CreditCard;

                    return (
                      <tr
                        key={order.id}
                        className="border-t"
                        style={{ borderColor: colors.border }}
                      >
                        <td className="px-6 py-4">
                          <span
                            className="font-mono font-bold"
                            style={{ color: colors.primary }}
                          >
                            {order.order_number}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div style={{ color: colors.text }}>
                            {order.receiver_name || order.customer_name}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: colors.textLight }}
                          >
                            {order.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="text-sm"
                            style={{ color: colors.text }}
                          >
                            {formatDate(order.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="font-bold flex items-center"
                            style={{ color: colors.text }}
                          >
                            <IndianRupee size={14} />
                            {parseFloat(order.total_amount).toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <PaymentIcon
                              size={14}
                              style={{
                                color:
                                  paymentStatusConfig[order.payment_status]
                                    ?.color,
                              }}
                            />
                            <span
                              className="text-sm"
                              style={{
                                color:
                                  paymentStatusConfig[order.payment_status]
                                    ?.color,
                              }}
                            >
                              {paymentStatusConfig[order.payment_status]
                                ?.label || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StatusIcon
                              size={14}
                              style={{
                                color: statusConfig[order.order_status]?.color,
                              }}
                            />
                            <span
                              className="text-sm"
                              style={{
                                color: statusConfig[order.order_status]?.color,
                              }}
                            >
                              {statusConfig[order.order_status]?.label ||
                                "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="p-2 rounded-lg transition-all hover:scale-105"
                            style={{
                              color: colors.primary,
                              backgroundColor: `${colors.primary}10`,
                            }}
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package
                  size={48}
                  className="mx-auto mb-4"
                  style={{ color: colors.textLight }}
                />
                <p style={{ color: colors.textLight }}>No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              style={{ pointerEvents: "none" }}
            >
              <div className="min-h-screen px-4 flex items-center justify-center">
                <div
                  className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    pointerEvents: "auto",
                    maxHeight: "90vh",
                    overflowY: "auto",
                  }}
                >
                  {/* Modal Header */}
                  <div
                    className="p-6 border-b flex justify-between items-center sticky top-0"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.cardBg,
                      zIndex: 10,
                    }}
                  >
                    <div>
                      <h2
                        className="text-2xl font-bold"
                        style={{ color: colors.text }}
                      >
                        Order #{selectedOrder.order_number}
                      </h2>
                      <p
                        className="text-sm mt-1"
                        style={{ color: colors.textLight }}
                      >
                        Placed on {formatDate(selectedOrder.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={20} style={{ color: colors.textLight }} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-6">
                    {/* Status Cards */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Order Status Card */}
                      <div
                        className="p-4 rounded-xl relative"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className="font-semibold"
                            style={{ color: colors.text }}
                          >
                            Order Status
                          </h3>
                          <button
                            onClick={() =>
                              setShowStatusDropdown(!showStatusDropdown)
                            }
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                          >
                            <ChevronDown
                              size={16}
                              style={{ color: colors.textLight }}
                            />
                          </button>
                        </div>

                        {/* Status Dropdown */}
                        {showStatusDropdown && (
                          <div
                            className="absolute top-16 left-4 right-4 rounded-lg shadow-xl z-20"
                            style={{
                              backgroundColor: colors.cardBg,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            {Object.keys(statusConfig).map((status) => {
                              const Icon = statusConfig[status].icon;
                              return (
                                <button
                                  key={status}
                                  onClick={() => {
                                    const message = prompt(
                                      "Enter status message (optional):",
                                      `Order ${status}`,
                                    );
                                    if (message !== null) {
                                      updateOrderStatus(
                                        selectedOrder.id,
                                        status,
                                        message,
                                      );
                                    }
                                  }}
                                  disabled={updatingOrder === selectedOrder.id}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                  <Icon
                                    size={16}
                                    style={{
                                      color: statusConfig[status].color,
                                    }}
                                  />
                                  <span style={{ color: colors.text }}>
                                    {statusConfig[status].label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          {React.createElement(
                            statusConfig[selectedOrder.order_status]?.icon ||
                              Clock,
                            {
                              size: 24,
                              style: {
                                color:
                                  statusConfig[selectedOrder.order_status]
                                    ?.color,
                              },
                            },
                          )}
                          <div>
                            <div
                              className="text-lg font-bold"
                              style={{
                                color:
                                  statusConfig[selectedOrder.order_status]
                                    ?.color,
                              }}
                            >
                              {statusConfig[selectedOrder.order_status]
                                ?.label || "Unknown"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Status Card */}
                      <div
                        className="p-4 rounded-xl relative"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3
                            className="font-semibold"
                            style={{ color: colors.text }}
                          >
                            Payment Status
                          </h3>
                          <button
                            onClick={() =>
                              setShowPaymentDropdown(!showPaymentDropdown)
                            }
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                          >
                            <ChevronDown
                              size={16}
                              style={{ color: colors.textLight }}
                            />
                          </button>
                        </div>

                        {/* Payment Status Dropdown */}
                        {showPaymentDropdown && (
                          <div
                            className="absolute top-16 left-4 right-4 rounded-lg shadow-xl z-20"
                            style={{
                              backgroundColor: colors.cardBg,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            {Object.keys(paymentStatusConfig).map((status) => {
                              const Icon = paymentStatusConfig[status].icon;
                              return (
                                <button
                                  key={status}
                                  onClick={() =>
                                    updatePaymentStatus(
                                      selectedOrder.id,
                                      status,
                                    )
                                  }
                                  disabled={updatingOrder === selectedOrder.id}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                  <Icon
                                    size={16}
                                    style={{
                                      color: paymentStatusConfig[status].color,
                                    }}
                                  />
                                  <span style={{ color: colors.text }}>
                                    {paymentStatusConfig[status].label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          {React.createElement(
                            paymentStatusConfig[selectedOrder.payment_status]
                              ?.icon || CreditCard,
                            {
                              size: 24,
                              style: {
                                color:
                                  paymentStatusConfig[
                                    selectedOrder.payment_status
                                  ]?.color,
                              },
                            },
                          )}
                          <div>
                            <div
                              className="text-lg font-bold"
                              style={{
                                color:
                                  paymentStatusConfig[
                                    selectedOrder.payment_status
                                  ]?.color,
                              }}
                            >
                              {paymentStatusConfig[selectedOrder.payment_status]
                                ?.label || "Pending"}
                            </div>
                            {selectedOrder.payment_method && (
                              <div
                                className="text-xs"
                                style={{ color: colors.textLight }}
                              >
                                via {selectedOrder.payment_method}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Payment Details */}
                        {selectedOrder.payment && (
                          <div
                            className="mt-3 pt-3 border-t"
                            style={{ borderColor: colors.border }}
                          >
                            <p
                              className="text-xs"
                              style={{ color: colors.textLight }}
                            >
                              Transaction ID:{" "}
                              {selectedOrder.payment.transaction_id || "N/A"}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: colors.textLight }}
                            >
                              Payment ID:{" "}
                              {selectedOrder.payment.payment_id || "N/A"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <h3
                        className="font-semibold mb-4"
                        style={{ color: colors.text }}
                      >
                        Customer Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <User size={16} style={{ color: colors.textLight }} />
                          <div>
                            <p
                              className="text-sm"
                              style={{ color: colors.textLight }}
                            >
                              Name
                            </p>
                            <p style={{ color: colors.text }}>
                              {selectedOrder.receiver_name ||
                                selectedOrder.customer_name ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail size={16} style={{ color: colors.textLight }} />
                          <div>
                            <p
                              className="text-sm"
                              style={{ color: colors.textLight }}
                            >
                              Email
                            </p>
                            <p style={{ color: colors.text }}>
                              {selectedOrder.email || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={16} style={{ color: colors.textLight }} />
                          <div>
                            <p
                              className="text-sm"
                              style={{ color: colors.textLight }}
                            >
                              Phone
                            </p>
                            <p style={{ color: colors.text }}>
                              {selectedOrder.receiver_phone ||
                                selectedOrder.phone ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {(selectedOrder.address ||
                      selectedOrder.city ||
                      selectedOrder.state ||
                      selectedOrder.pincode) && (
                      <div
                        className="p-4 rounded-xl"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <h3
                          className="font-semibold mb-4"
                          style={{ color: colors.text }}
                        >
                          Delivery Address
                        </h3>
                        <div className="flex items-start gap-3">
                          <MapPin
                            size={16}
                            style={{ color: colors.textLight }}
                            className="mt-1"
                          />
                          <div>
                            <p style={{ color: colors.text }}>
                              {selectedOrder.address && (
                                <>
                                  {selectedOrder.address}
                                  <br />
                                </>
                              )}
                              {selectedOrder.city &&
                                selectedOrder.state &&
                                selectedOrder.pincode && (
                                  <>
                                    {selectedOrder.city}, {selectedOrder.state}{" "}
                                    - {selectedOrder.pincode}
                                  </>
                                )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <h3
                        className="font-semibold mb-4"
                        style={{ color: colors.text }}
                      >
                        Order Summary
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span style={{ color: colors.textLight }}>Subtotal</span>
                          <span
                            className="font-bold flex items-center"
                            style={{ color: colors.text }}
                          >
                            <IndianRupee size={14} />
                            {parseFloat(
                              selectedOrder.total_amount,
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div
                          className="flex justify-between pt-2 border-t"
                          style={{ borderColor: colors.border }}
                        >
                          <span
                            className="font-bold"
                            style={{ color: colors.text }}
                          >
                            Total
                          </span>
                          <span
                            className="text-xl font-bold flex items-center"
                            style={{ color: colors.primary }}
                          >
                            <IndianRupee size={18} />
                            {parseFloat(
                              selectedOrder.total_amount,
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HandleOrderTract;