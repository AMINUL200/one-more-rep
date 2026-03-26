import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Phone,
  MessageSquare,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Download,
  ChevronRight,
  Calendar,
  User,
  AtSign,
  Tag,
  AlertCircle,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
  Edit3,
  FileText,
  Activity,
  FileEdit,
  History,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsRight,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/app';
import * as XLSX from 'xlsx';

const SalesLead = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: '',
    minutes: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Color scheme
  const colors = {
    primary: '#1B2B4C',
    primaryLight: '#2A3F66',
    background: '#FFFFFF',
    cardBg: '#F8F9FA',
    border: '#E2E8F0',
    text: '#1E293B',
    textLight: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6'
  };

  // Status badge styles
  const statusStyles = {
    new: { bg: '#EFF6FF', text: '#3B82F6', icon: <MessageCircle size={12} />, label: 'New' },
    replied: { bg: '#FEF3C7', text: '#F59E0B', icon: <RefreshCw size={12} />, label: 'Replied' },
    closed: { bg: '#D1FAE5', text: '#10B981', icon: <CheckCircle size={12} />, label: 'Closed' },
    pending: { bg: '#FEF3C7', text: '#F59E0B', icon: <Clock size={12} />, label: 'Pending' }
  };

  // Items per page options
  const itemsPerPageOptions = [5, 10, 20, 50, 100];

  // Fetch leads
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/sales-contacts');
      if (response.data?.status) {
        setLeads(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  // Filter leads based on search and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Update total pages when filtered data changes
  useEffect(() => {
    const total = Math.ceil(filteredLeads.length / itemsPerPage);
    setTotalPages(total);
    // Reset to first page when filters change
    if (currentPage > total) {
      setCurrentPage(1);
    }
  }, [filteredLeads, itemsPerPage, currentPage]);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLeads.slice(startIndex, endIndex);
  };

  const currentItems = getCurrentPageItems();

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle view lead details
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setStatusUpdateData({
      status: lead.status,
      minutes: lead.minutes || ''
    });
    setShowDetailsModal(true);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!statusUpdateData.status) {
      toast.error('Please select a status');
      return;
    }

    if (!statusUpdateData.minutes) {
      toast.error('Please add notes/comments for this update');
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await api.patch(`/admin/sales-contacts/status/${selectedLead.id}`, {
        status: statusUpdateData.status,
        minutes: statusUpdateData.minutes
      });

      if (response.data?.status) {
        toast.success('Lead status updated successfully');
        fetchLeads();
        setShowDetailsModal(false);
        setSelectedLead(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Excel Export Function
  const exportToExcel = () => {
    if (filteredLeads.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      // Prepare data for export
      const exportData = filteredLeads.map(lead => ({
        'ID': lead.id,
        'Full Name': lead.full_name,
        'Email': lead.email,
        'Phone Number': lead.phone_number,
        'Subject': lead.subject,
        'Message': lead.message,
        'Status': lead.status.charAt(0).toUpperCase() + lead.status.slice(1),
        'Notes': lead.minutes || 'No notes',
        'Created Date': new Date(lead.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        'Last Updated': new Date(lead.updated_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Adjust column widths
      const colWidths = [
        { wch: 8 },  // ID
        { wch: 25 }, // Full Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone Number
        { wch: 20 }, // Subject
        { wch: 50 }, // Message
        { wch: 12 }, // Status
        { wch: 40 }, // Notes
        { wch: 20 }, // Created Date
        { wch: 20 }  // Last Updated
      ];
      ws['!cols'] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sales Leads');

      // Generate filename with current date and filter info
      const date = new Date();
      const fileName = `sales_leads_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${statusFilter !== 'all' ? statusFilter : 'all'}_${searchTerm ? 'filtered' : 'all'}.xlsx`;
      
      // Export file
      XLSX.writeFile(wb, fileName);
      
      toast.success(`Exported ${filteredLeads.length} leads successfully!`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export data');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const style = statusStyles[status] || statusStyles.new;
    return (
      <span 
        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {style.icon}
        {style.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.text }}>
            Sales Leads
          </h1>
          <p className="mt-2" style={{ color: colors.textLight }}>
            Manage and track all incoming leads and inquiries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.textLight }}>Total Leads</p>
                <p className="text-2xl font-bold" style={{ color: colors.text }}>{leads.length}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                <Users size={20} style={{ color: colors.primary }} />
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl border shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.textLight }}>New Leads</p>
                <p className="text-2xl font-bold" style={{ color: colors.text }}>{leads.filter(l => l.status === 'new').length}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.info}10` }}>
                <MessageCircle size={20} style={{ color: colors.info }} />
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl border shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.textLight }}>Replied</p>
                <p className="text-2xl font-bold" style={{ color: colors.text }}>{leads.filter(l => l.status === 'replied').length}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.warning}10` }}>
                <RefreshCw size={20} style={{ color: colors.warning }} />
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl border shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.textLight }}>Closed</p>
                <p className="text-2xl font-bold" style={{ color: colors.text }}>{leads.filter(l => l.status === 'closed').length}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.success}10` }}>
                <CheckCircle size={20} style={{ color: colors.success }} />
              </div>
            </div>
          </div>
        </div>

        {/* Search, Filter and Export */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textLight }} />
            <input
              type="text"
              placeholder="Search by name, email, phone or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text
              }}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'new', 'replied', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  statusFilter === status
                    ? 'text-white'
                    : 'border hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: statusFilter === status ? colors.primary : 'transparent',
                  color: statusFilter === status ? '#FFFFFF' : colors.textLight,
                  borderColor: colors.border
                }}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
          
          {/* Export to Excel Button */}
          <button
            onClick={exportToExcel}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:shadow-md"
            style={{
              backgroundColor: colors.success,
              color: '#FFFFFF'
            }}
          >
            <FileSpreadsheet size={18} />
            Export to Excel
          </button>
        </div>

        {/* Leads Table */}
        <div className="rounded-xl border shadow-sm overflow-hidden" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#F9FAFB' }}>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Actions</th>
                 </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center" style={{ color: colors.textLight }}>
                      No leads found
                    </td>
                  </tr>
                ) : (
                  currentItems.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: `1px solid ${colors.border}` }} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10` }}>
                            <User size={14} style={{ color: colors.primary }} />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: colors.text }}>{lead.full_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail size={12} style={{ color: colors.textLight }} />
                            <span className="text-sm" style={{ color: colors.text }}>{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone size={12} style={{ color: colors.textLight }} />
                            <span className="text-sm" style={{ color: colors.text }}>{lead.phone_number}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Tag size={12} style={{ color: colors.textLight }} />
                          <span className="text-sm font-medium" style={{ color: colors.text }}>{lead.subject}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm line-clamp-2 max-w-xs" style={{ color: colors.textLight }}>
                          {lead.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(lead.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Clock size={12} style={{ color: colors.textLight }} />
                          <span className="text-sm" style={{ color: colors.textLight }}>{formatDate(lead.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewLead(lead)}
                          className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                          style={{ color: colors.primary }}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredLeads.length > 0 && (
            <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: colors.border }}>
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: colors.textLight }}>Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-1 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text
                  }}
                >
                  {itemsPerPageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <span className="text-sm" style={{ color: colors.textLight }}>entries</span>
              </div>

              {/* Pagination info */}
              <div className="text-sm" style={{ color: colors.textLight }}>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} entries
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  style={{ borderColor: colors.border, color: colors.textLight }}
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  style={{ borderColor: colors.border, color: colors.textLight }}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-[36px] h-9 px-3 rounded-lg border transition-colors ${
                          currentPage === pageNum
                            ? 'text-white'
                            : 'hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: currentPage === pageNum ? colors.primary : 'transparent',
                          borderColor: colors.border,
                          color: currentPage === pageNum ? '#FFFFFF' : colors.textLight
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  style={{ borderColor: colors.border, color: colors.textLight }}
                >
                  <ChevronRightIcon size={16} />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  style={{ borderColor: colors.border, color: colors.textLight }}
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead Details Modal (same as before) */}
      {showDetailsModal && selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6" style={{ borderColor: colors.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: colors.text }}>Lead Details</h2>
                  <p className="text-sm mt-1" style={{ color: colors.textLight }}>View and update lead information</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XCircle size={20} style={{ color: colors.textLight }} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} style={{ color: colors.primary }} />
                    <span className="text-xs uppercase font-semibold" style={{ color: colors.textLight }}>Full Name</span>
                  </div>
                  <p className="font-medium" style={{ color: colors.text }}>{selectedLead.full_name}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={16} style={{ color: colors.primary }} />
                    <span className="text-xs uppercase font-semibold" style={{ color: colors.textLight }}>Email</span>
                  </div>
                  <p className="font-medium" style={{ color: colors.text }}>{selectedLead.email}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={16} style={{ color: colors.primary }} />
                    <span className="text-xs uppercase font-semibold" style={{ color: colors.textLight }}>Phone Number</span>
                  </div>
                  <p className="font-medium" style={{ color: colors.text }}>{selectedLead.phone_number}</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={16} style={{ color: colors.primary }} />
                    <span className="text-xs uppercase font-semibold" style={{ color: colors.textLight }}>Subject</span>
                  </div>
                  <p className="font-medium" style={{ color: colors.text }}>{selectedLead.subject}</p>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={16} style={{ color: colors.primary }} />
                  <span className="text-xs uppercase font-semibold" style={{ color: colors.textLight }}>Message</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: colors.text }}>{selectedLead.message}</p>
              </div>

              {/* Notes/Comments Section - Display existing notes */}
              {selectedLead.minutes && (
                <div className="p-4 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: `${colors.info}10` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <History size={16} style={{ color: colors.primary }} />
                    <span className="text-xs uppercase font-semibold" style={{ color: colors.textLight }}>Previous Notes</span>
                  </div>
                  <p className="text-sm leading-relaxed italic" style={{ color: colors.text }}>
                    "{selectedLead.minutes}"
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Clock size={12} style={{ color: colors.textLight }} />
                    <span className="text-xs" style={{ color: colors.textLight }}>
                      Added on: {formatDate(selectedLead.updated_at || selectedLead.created_at)}
                    </span>
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="p-4 rounded-lg border" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={16} style={{ color: colors.primary }} />
                  <span className="text-xs uppercase font-semibold" style={{ color: colors.textLight }}>Update Status & Notes</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>Status</label>
                    <div className="flex gap-3">
                      {['new', 'replied', 'closed'].map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            checked={statusUpdateData.status === status}
                            onChange={(e) => setStatusUpdateData({ ...statusUpdateData, status: e.target.value })}
                            className="w-4 h-4"
                            style={{ accentColor: colors.primary }}
                          />
                          <span className="text-sm capitalize" style={{ color: colors.text }}>{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Notes / Comments <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={statusUpdateData.minutes}
                      onChange={(e) => setStatusUpdateData({ ...statusUpdateData, minutes: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.text
                      }}
                      placeholder={`Add notes/comments for this ${statusUpdateData.status || 'status'} update...`}
                    />
                    <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                      {statusUpdateData.status === 'new' && "Add initial notes about this lead"}
                      {statusUpdateData.status === 'replied' && "Add notes about your response to this lead"}
                      {statusUpdateData.status === 'closed' && "Add closing notes, comments, or follow-up actions"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end gap-3" style={{ borderColor: colors.border }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 rounded-lg border transition-colors"
                style={{ borderColor: colors.border, color: colors.textLight }}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus}
                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-all hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: colors.primary }}
              >
                {updatingStatus ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Update Status & Notes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesLead;