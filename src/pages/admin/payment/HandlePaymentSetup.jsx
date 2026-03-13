import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Loader,
  CreditCard,
  Wallet,
  Globe,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../../utils/app";

const HandlePaymentSetup = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showTestKeys, setShowTestKeys] = useState({});
  const [showLiveKeys, setShowLiveKeys] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [formData, setFormData] = useState({
    provider: "",
    mode: "test",
    test_key: "",
    test_secret: "",
    live_key: "",
    live_secret: "",
    status: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Color Schema
  const colors = {
    primary: "#1B2B4C",
    primaryHover: "#2A3F66",
    background: "#F8FAFC",
    cardBg: "#FFFFFF",
    border: "#E2E8F0",
    text: "#1E293B",
    textLight: "#64748B",
    muted: "#94A3B8",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  };

  // Payment provider options
  const providerOptions = [
    { value: "razorpay", label: "Razorpay", icon: CreditCard },
    { value: "paypal", label: "PayPal", icon: Wallet },
    { value: "stripe", label: "Stripe", icon: CreditCard },
    { value: "instamojo", label: "Instamojo", icon: Wallet },
    { value: "ccavenue", label: "CCAvenue", icon: CreditCard },
    { value: "paytm", label: "Paytm", icon: Wallet },
  ];

  // Mode options
  const modeOptions = [
    { value: "test", label: "Test Mode", color: colors.warning },
    { value: "live", label: "Live Mode", color: colors.success },
  ];

  // Fetch payments
  const fetchPayments = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;

      const response = await api.get("/admin/payment-settings");

      if (response.data?.status) {
        setPayments(response.data.data);
        if (response.data.meta) {
          setTotalPages(response.data.meta.last_page);
        }
      }
    } catch (error) {
      console.error("Error fetching payment settings:", error);
      toast.error("Failed to load payment settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage, searchTerm);
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1);
        fetchPayments(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.provider) {
      errors.provider = "Please select a payment provider";
    }

    if (!formData.mode) {
      errors.mode = "Please select a mode";
    }

    if (!formData.test_key.trim()) {
      errors.test_key = "Test key is required";
    }

    if (!formData.test_secret.trim()) {
      errors.test_secret = "Test secret is required";
    }

    if (formData.mode === "live") {
      if (!formData.live_key.trim()) {
        errors.live_key = "Live key is required in live mode";
      }
      if (!formData.live_secret.trim()) {
        errors.live_secret = "Live secret is required in live mode";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    // Prepare data
    const submitData = {
      provider: formData.provider,
      mode: formData.mode,
      test_key: formData.test_key,
      test_secret: formData.test_secret,
      live_key: formData.live_key || null,
      live_secret: formData.live_secret || null,
      status: formData.status ? 1 : 0,
    };

    try {
      let response;

      if (editingPayment) {
        // Update
        response = await api.post(`/admin/payment-settings/store`, submitData);
      } else {
        // Create
        response = await api.post("/admin/payment-settings/store", submitData);
      }

      if (response.data?.status) {
        toast.success(
          editingPayment
            ? "Payment settings updated successfully"
            : "Payment settings added successfully",
        );
        setShowForm(false);
        setEditingPayment(null);
        resetForm();
        fetchPayments(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error saving payment settings:", error);

      // Handle validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || {};
        const formattedErrors = {};

        Object.keys(validationErrors).forEach((key) => {
          formattedErrors[key] = validationErrors[key][0];
        });

        setFormErrors(formattedErrors);
        toast.error("Please check the form for errors");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to save payment settings",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      provider: "",
      mode: "test",
      test_key: "",
      test_secret: "",
      live_key: "",
      live_secret: "",
      status: false,
    });
    setFormErrors({});
  };

  // Handle edit click
  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      provider: payment.provider || "",
      mode: payment.mode || "test",
      test_key: payment.test_key || "",
      test_secret: payment.test_secret || "",
      live_key: payment.live_key || "",
      live_secret: payment.live_secret || "",
      status: payment.status === 1 || payment.status === true,
    });
    setShowForm(true);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle add click
  const handleAdd = () => {
    setEditingPayment(null);
    resetForm();
    setShowForm(true);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/payment-settings/delete/${id}`);
      if (response.data?.status) {
        toast.success("Payment settings deleted successfully");
        setDeleteConfirm(null);
        fetchPayments(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error deleting payment settings:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete payment settings",
      );
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (payment) => {
    setUpdatingStatus(true);
    try {
      const newStatus = payment.status === 1 || payment.status === true ? 0 : 1;

      const response = await api.post(
        `/admin/payment-settings/status/${payment.id}`,
        {
          status: newStatus,
        },
      );

      if (response.data?.status) {
        toast.success("Status updated successfully");
        fetchPayments(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Toggle key visibility
  const toggleTestKeyVisibility = (id) => {
    setShowTestKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLiveKeyVisibility = (id) => {
    setShowLiveKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Get provider icon
  const getProviderIcon = (provider) => {
    const found = providerOptions.find((p) => p.value === provider);
    return found?.icon || CreditCard;
  };

  // Filter payments based on search
  const filteredPayments = payments.filter(
    (payment) =>
      payment.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.mode?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading && payments.length === 0) {
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
          <p style={{ color: colors.textLight }}>Loading payment settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
              Payment Settings
            </h1>
            <p className="mt-2 text-sm" style={{ color: colors.textLight }}>
              Configure payment gateway settings
            </p>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: colors.primary,
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.primary;
            }}
          >
            <Plus size={18} />
            <span>Add Payment Settings</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div
            className="mb-8 bg-white rounded-xl shadow-lg border p-6"
            style={{ borderColor: colors.border }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${colors.primary}10` }}
                >
                  <CreditCard size={20} style={{ color: colors.primary }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: colors.text }}
                  >
                    {editingPayment
                      ? "Edit Payment Settings"
                      : "Add New Payment Settings"}
                  </h2>
                  <p
                    className="text-sm mt-1"
                    style={{ color: colors.textLight }}
                  >
                    {editingPayment
                      ? `Editing: ${editingPayment.provider}`
                      : "Configure a new payment gateway"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPayment(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} style={{ color: colors.textLight }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Provider and Mode */}
              <div className="grid grid-cols-2 gap-6">
                {/* Provider */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Payment Provider <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="provider"
                    value={formData.provider}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.provider ? colors.danger : colors.border}`,
                      color: colors.text,
                    }}
                  >
                    <option value="">Select a provider</option>
                    {providerOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.provider && (
                    <p
                      className="mt-1 text-xs flex items-center gap-1"
                      style={{ color: colors.danger }}
                    >
                      <AlertCircle size={12} />
                      {formErrors.provider}
                    </p>
                  )}
                </div>

                {/* Mode */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.mode ? colors.danger : colors.border}`,
                      color: colors.text,
                    }}
                  >
                    {modeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.mode && (
                    <p
                      className="mt-1 text-xs flex items-center gap-1"
                      style={{ color: colors.danger }}
                    >
                      <AlertCircle size={12} />
                      {formErrors.mode}
                    </p>
                  )}
                </div>
              </div>

              {/* Test Keys */}
              <div
                className="p-4 border rounded-lg"
                style={{ borderColor: colors.border }}
              >
                <h3
                  className="text-md font-medium mb-4 flex items-center gap-2"
                  style={{ color: colors.warning }}
                >
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Test Mode Keys
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Test Key <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="test_key"
                      value={formData.test_key}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.test_key ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="Enter test key"
                    />
                    {formErrors.test_key && (
                      <p
                        className="mt-1 text-xs"
                        style={{ color: colors.danger }}
                      >
                        {formErrors.test_key}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Test Secret <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="test_secret"
                      value={formData.test_secret}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.test_secret ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="Enter test secret"
                    />
                    {formErrors.test_secret && (
                      <p
                        className="mt-1 text-xs"
                        style={{ color: colors.danger }}
                      >
                        {formErrors.test_secret}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Keys */}
              <div
                className="p-4 border rounded-lg"
                style={{ borderColor: colors.border }}
              >
                <h3
                  className="text-md font-medium mb-4 flex items-center gap-2"
                  style={{ color: colors.success }}
                >
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Live Mode Keys
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Live Key
                    </label>
                    <input
                      type="text"
                      name="live_key"
                      value={formData.live_key}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.live_key ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="Enter live key"
                    />
                    {formErrors.live_key && (
                      <p
                        className="mt-1 text-xs"
                        style={{ color: colors.danger }}
                      >
                        {formErrors.live_key}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Live Secret
                    </label>
                    <input
                      type="text"
                      name="live_secret"
                      value={formData.live_secret}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.live_secret ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="Enter live secret"
                    />
                    {formErrors.live_secret && (
                      <p
                        className="mt-1 text-xs"
                        style={{ color: colors.danger }}
                      >
                        {formErrors.live_secret}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                    style={{
                      accentColor: colors.primary,
                    }}
                  />
                  <span style={{ color: colors.text }}>Active Status</span>
                </label>
                <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                  Enable this payment gateway
                </p>
              </div>

              {/* Form Actions */}
              <div
                className="flex justify-end gap-3 pt-4 border-t"
                style={{ borderColor: colors.border }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPayment(null);
                  }}
                  className="px-4 py-2 rounded-lg transition-all"
                  style={{
                    border: `1px solid ${colors.border}`,
                    color: colors.textLight,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.background;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: colors.primary,
                    color: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.target.style.backgroundColor = colors.primaryHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      e.target.style.backgroundColor = colors.primary;
                    }
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingPayment ? "Update" : "Save"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: colors.muted }}
            />
            <input
              type="text"
              placeholder="Search by provider or mode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            />
          </div>
        </div>

        {/* Payment Settings Table */}
        <div
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
          style={{ borderColor: colors.border }}
        >
          <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead style={{ backgroundColor: colors.background }}>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    ID
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Provider
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Mode
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Test Key
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Live Key
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Updated
                  </th>
                  <th
                    className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-10 text-center"
                      style={{ color: colors.textLight }}
                    >
                      <CreditCard
                        size={40}
                        className="mx-auto mb-3"
                        style={{ color: colors.muted }}
                      />
                      <p>No payment settings found</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => {
                    const ProviderIcon = getProviderIcon(payment.provider);

                    return (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50 transition-colors"
                        style={{ borderBottom: `1px solid ${colors.border}` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="text-sm font-medium"
                            style={{ color: colors.text }}
                          >
                            #{payment.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${colors.primary}10` }}
                            >
                              <ProviderIcon
                                size={16}
                                style={{ color: colors.primary }}
                              />
                            </div>
                            <span
                              className="font-medium capitalize"
                              style={{ color: colors.text }}
                            >
                              {payment.provider}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor:
                                payment.mode === "live"
                                  ? `${colors.success}20`
                                  : `${colors.warning}20`,
                              color:
                                payment.mode === "live"
                                  ? colors.success
                                  : colors.warning,
                            }}
                          >
                            {payment.mode?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <code
                              className="text-xs font-mono"
                              style={{ color: colors.textLight }}
                            >
                              {showTestKeys[payment.id]
                                ? payment.test_key
                                : payment.test_key?.replace(/./g, "•")}
                            </code>
                            <button
                              onClick={() =>
                                toggleTestKeyVisibility(payment.id)
                              }
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              {showTestKeys[payment.id] ? (
                                <EyeOff
                                  size={14}
                                  style={{ color: colors.muted }}
                                />
                              ) : (
                                <Eye
                                  size={14}
                                  style={{ color: colors.muted }}
                                />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payment.live_key ? (
                            <div className="flex items-center gap-2">
                              <code
                                className="text-xs font-mono"
                                style={{ color: colors.textLight }}
                              >
                                {showLiveKeys[payment.id]
                                  ? payment.live_key
                                  : payment.live_key?.replace(/./g, "•")}
                              </code>
                              <button
                                onClick={() =>
                                  toggleLiveKeyVisibility(payment.id)
                                }
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                {showLiveKeys[payment.id] ? (
                                  <EyeOff
                                    size={14}
                                    style={{ color: colors.muted }}
                                  />
                                ) : (
                                  <Eye
                                    size={14}
                                    style={{ color: colors.muted }}
                                  />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: colors.muted }}>-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleStatusToggle(payment)}
                            disabled={updatingStatus}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              payment.status === 1 || payment.status === true
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {payment.status === 1 || payment.status === true
                              ? "Active"
                              : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="text-sm"
                            style={{ color: colors.textLight }}
                          >
                            {formatDate(payment.updated_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleEdit(payment)}
                            className="p-2 rounded-lg mr-2 transition-all hover:bg-gray-100"
                            title="Edit"
                          >
                            <Edit2
                              size={16}
                              style={{ color: colors.primary }}
                            />
                          </button>
                          {/* <button
                            onClick={() => setDeleteConfirm(payment)}
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                            title="Delete"
                          >
                            <Trash2
                              size={16}
                              style={{ color: colors.danger }}
                            />
                          </button> */}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.textLight,
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <span style={{ color: colors.textLight }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.textLight,
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div
              className="rounded-lg w-full max-w-md p-6 shadow-xl"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: colors.text }}
              >
                Confirm Delete
              </h3>
              <p className="mb-4" style={{ color: colors.textLight }}>
                Are you sure you want to delete payment settings for "
                {deleteConfirm.provider}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border rounded-lg transition-all"
                  style={{
                    borderColor: colors.border,
                    color: colors.textLight,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.background;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandlePaymentSetup;
