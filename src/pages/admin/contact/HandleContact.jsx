import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Loader,
  Eye,
  Check,
  Clock,
  XCircle,
  Mail,
  Phone,
  User,
  Calendar,
  MessageSquare,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../../utils/app";

const HandleContact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
    info: "#3B82F6",
  };

  // Status options
  const statusOptions = [
    { value: "new", label: "New", color: colors.info },
    { value: "replied", label: "Replied", color: colors.success },
    { value: "closed", label: "Closed", color: colors.muted },
  ];

  // Fetch contacts
  const fetchContacts = async (page = 1, search = "", status = "all") => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (status !== "all") params.status = status;

      const response = await api.get("/admin/contacts");

      if (response.data?.status) {
        setContacts(response.data.data);
        if (response.data.meta) {
          setTotalPages(response.data.meta.last_page);
        }
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(currentPage, searchTerm, statusFilter);
  }, [currentPage, statusFilter]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1);
        fetchContacts(1, searchTerm, statusFilter);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  // Handle status update
  const handleStatusUpdate = async (contactId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await api.patch(`/admin/contacts/status/${contactId}`, {
        status: newStatus,
      });

      if (response.data?.status) {
        toast.success(`Status updated to ${newStatus}`);

        // Update local state
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact((prev) => ({ ...prev, status: newStatus }));
        }

        // Refresh list
        fetchContacts(currentPage, searchTerm, statusFilter);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle view click
  const handleView = (contact) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return colors.info;
      case "replied":
        return colors.success;
      case "closed":
        return colors.muted;
      default:
        return colors.muted;
    }
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    return {
      backgroundColor: `${color}20`,
      color: color,
    };
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Filter contacts based on search
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && contacts.length === 0) {
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
          <p style={{ color: colors.textLight }}>Loading messages...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
            Contact Messages
          </h1>
          <p className="mt-2 text-sm" style={{ color: colors.textLight }}>
            View and manage user contact inquiries
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: colors.muted }}
            />
            <input
              type="text"
              placeholder="Search by name, email, subject or message..."
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

          {/* Status Filter */}
          <div className="relative">
            <Filter
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: colors.muted }}
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all appearance-none"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            >
              <option value="all">All Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contacts Table */}
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
                    Name
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Email
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Phone
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Subject
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
                    Date
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
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-10 text-center"
                      style={{ color: colors.textLight }}
                    >
                      <MessageSquare
                        size={40}
                        className="mx-auto mb-3"
                        style={{ color: colors.muted }}
                      />
                      <p>No messages found</p>
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-gray-50 transition-colors"
                      style={{ borderBottom: `1px solid ${colors.border}` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.text }}
                        >
                          #{contact.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User size={14} style={{ color: colors.muted }} />
                          <span style={{ color: colors.text }}>
                            {contact.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail size={14} style={{ color: colors.muted }} />
                          <a
                            href={`mailto:${contact.email}`}
                            className="hover:underline"
                            style={{ color: colors.primary }}
                          >
                            {contact.email}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contact.phone_number ? (
                          <div className="flex items-center gap-2">
                            <Phone size={14} style={{ color: colors.muted }} />
                            <a
                              href={`tel:${contact.phone_number}`}
                              className="hover:underline"
                              style={{ color: colors.textLight }}
                            >
                              {contact.phone_number}
                            </a>
                          </div>
                        ) : (
                          <span style={{ color: colors.muted }}>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span style={{ color: colors.textLight }}>
                          {contact.subject || "No subject"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={getStatusBadge(contact.status)}
                        >
                          {contact.status?.charAt(0).toUpperCase() +
                            contact.status?.slice(1) || "New"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} style={{ color: colors.muted }} />
                          <span style={{ color: colors.textLight }}>
                            {new Date(contact.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleView(contact)}
                          className="p-2 rounded-lg transition-all hover:bg-gray-100"
                          title="View Details"
                        >
                          <Eye size={18} style={{ color: colors.primary }} />
                        </button>
                      </td>
                    </tr>
                  ))
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

        {/* View Details Modal */}
        {showViewModal && selectedContact && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div
              className="rounded-lg w-full max-w-2xl p-6 relative shadow-xl max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* Modal Header */}
              <div
                className="flex justify-between items-center mb-6 pb-4 border-b"
                style={{ borderColor: colors.border }}
              >
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: colors.text }}
                  >
                    Contact Details
                  </h2>
                  <p
                    className="text-sm mt-1"
                    style={{ color: colors.textLight }}
                  >
                    Message from {selectedContact.full_name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedContact(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} style={{ color: colors.textLight }} />
                </button>
              </div>

              {/* Message Details */}
              <div className="space-y-6">
                {/* Status Update */}
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.textLight }}
                      >
                        Current Status
                      </span>
                      <div className="mt-1">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold"
                          style={getStatusBadge(selectedContact.status)}
                        >
                          {selectedContact.status?.charAt(0).toUpperCase() +
                            selectedContact.status?.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleStatusUpdate(selectedContact.id, option.value)
                          }
                          disabled={
                            updatingStatus ||
                            selectedContact.status === option.value
                          }
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                          style={{
                            backgroundColor:
                              selectedContact.status === option.value
                                ? `${option.color}20`
                                : "transparent",
                            color: option.color,
                            border: `1px solid ${option.color}`,
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User size={16} style={{ color: colors.primary }} />
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        Full Name
                      </span>
                    </div>
                    <p style={{ color: colors.textLight }}>
                      {selectedContact.full_name}
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={16} style={{ color: colors.primary }} />
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        Email Address
                      </span>
                    </div>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="hover:underline"
                      style={{ color: colors.primary }}
                    >
                      {selectedContact.email}
                    </a>
                  </div>

                  {selectedContact.phone_number && (
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBg }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Phone size={16} style={{ color: colors.primary }} />
                        <span
                          className="text-sm font-medium"
                          style={{ color: colors.text }}
                        >
                          Phone Number
                        </span>
                      </div>
                      <a
                        href={`tel:${selectedContact.phone_number}`}
                        className="hover:underline"
                        style={{ color: colors.textLight }}
                      >
                        {selectedContact.phone_number}
                      </a>
                    </div>
                  )}

                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} style={{ color: colors.primary }} />
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        Received On
                      </span>
                    </div>
                    <p style={{ color: colors.textLight }}>
                      {formatDate(selectedContact.created_at)}
                    </p>
                  </div>
                </div>

                {/* Subject */}
                {selectedContact.subject && (
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare
                        size={16}
                        style={{ color: colors.primary }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.text }}
                      >
                        Subject
                      </span>
                    </div>
                    <p style={{ color: colors.textLight }}>
                      {selectedContact.subject}
                    </p>
                  </div>
                )}

                {/* Message */}
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare
                      size={16}
                      style={{ color: colors.primary }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.text }}
                    >
                      Message
                    </span>
                  </div>
                  <p
                    className="whitespace-pre-wrap"
                    style={{ color: colors.textLight }}
                  >
                    {selectedContact.message}
                  </p>
                </div>

                {/* Quick Reply */}
                <div
                  className="mt-6 pt-4 border-t"
                  style={{ borderColor: colors.border }}
                >
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your Inquiry"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
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
                    <Mail size={16} />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleContact;
