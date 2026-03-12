import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Loader,
  HelpCircle,
  FileText,
  Eye,
  EyeOff,
  AlertCircle,
  MessageCircle,
  Type,
  AlignLeft,
  Globe
} from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../utils/app';

const HandleFAQs = () => {
  const [faqsList, setFaqsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [formData, setFormData] = useState({
    faq_type: '',
    faq_question: '',
    question_meta: '',
    faq_answer: '',
    faq_answer_meta: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});

  // FAQ Types for dropdown
  const faqTypes = [
    'General',
    'Contact',
    'Shipping',
    'Returns',
    'Payment',
    'Products',
    'Account',
    'Orders',
    'Technical Support',
    'Other'
  ];

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

  // Fetch FAQs list
  const fetchFaqsList = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/faqs/all');
      if (response.data?.status) {
        setFaqsList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqsList();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.faq_type.trim()) {
      errors.faq_type = 'FAQ type is required';
    }
    
    if (!formData.faq_question.trim()) {
      errors.faq_question = 'Question is required';
    } else if (formData.faq_question.length < 5) {
      errors.faq_question = 'Question must be at least 5 characters';
    }
    
    if (!formData.faq_answer.trim()) {
      errors.faq_answer = 'Answer is required';
    } else if (formData.faq_answer.length < 10) {
      errors.faq_answer = 'Answer must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    
    // Prepare data
    const submitData = {
      faq_type: formData.faq_type,
      faq_question: formData.faq_question,
      question_meta: formData.question_meta || null,
      faq_answer: formData.faq_answer,
      faq_answer_meta: formData.faq_answer_meta || null,
      is_active: formData.is_active ? 1 : 0
    };
    
    try {
      let response;
      
      if (editingFaq) {
        // Update
        response = await api.put(`/admin/faqs/${editingFaq.id}`, submitData);
      } else {
        // Create
        response = await api.post('/admin/faqs', submitData);
      }
      
      if (response.data?.status) {
        toast.success(editingFaq ? 'FAQ updated successfully' : 'FAQ added successfully');
        setShowForm(false);
        setEditingFaq(null);
        resetForm();
        fetchFaqsList();
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      
      // Handle validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || {};
        const formattedErrors = {};
        
        Object.keys(validationErrors).forEach(key => {
          formattedErrors[key] = validationErrors[key][0];
        });
        
        setFormErrors(formattedErrors);
        toast.error('Please check the form for errors');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save FAQ');
      }
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      faq_type: '',
      faq_question: '',
      question_meta: '',
      faq_answer: '',
      faq_answer_meta: '',
      is_active: true
    });
    setFormErrors({});
  };

  // Handle edit click
  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      faq_type: faq.faq_type || '',
      faq_question: faq.faq_question || '',
      question_meta: faq.question_meta || '',
      faq_answer: faq.faq_answer || '',
      faq_answer_meta: faq.faq_answer_meta || '',
      is_active: faq.is_active === 1 || faq.is_active === true
    });
    setFormErrors({});
    setShowForm(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle add click
  const handleAdd = () => {
    setEditingFaq(null);
    resetForm();
    setShowForm(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/faqs/${id}`);
      if (response.data?.status) {
        toast.success('FAQ deleted successfully');
        setDeleteConfirm(null);
        fetchFaqsList();
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error(error.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (faq) => {
    try {
      const response = await api.patch(`/admin/faqs/${faq.id}/status`, {
        is_active: !(faq.is_active === 1 || faq.is_active === true) ? 1 : 0
      });
      if (response.data?.status) {
        toast.success('Status updated successfully');
        fetchFaqsList();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Filter FAQs list based on search
  const filteredFaqsList = faqsList.filter(faq =>
    faq.faq_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.faq_question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.faq_answer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Truncate text
  const truncateText = (text, length = 60) => {
    if (!text) return '-';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={40} style={{ color: colors.primary }} />
          <p style={{ color: colors.textLight }}>Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
              Frequently Asked Questions
            </h1>
            <p className="mt-2 text-sm" style={{ color: colors.textLight }}>
              Manage your FAQ sections
            </p>
          </div>
          
          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: colors.primary,
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.primary;
            }}
          >
            <Plus size={18} />
            <span>Add New FAQ</span>
          </button>
        </div>

        {/* Add/Edit Form - Shows at top when form is open */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-lg border p-6" style={{ borderColor: colors.border }}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                  <HelpCircle size={20} style={{ color: colors.primary }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                    {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                    {editingFaq ? `Editing: ${truncateText(editingFaq.faq_question, 40)}` : 'Create a new frequently asked question'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingFaq(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} style={{ color: colors.textLight }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* FAQ Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                      <Globe size={16} style={{ color: colors.primary }} />
                      FAQ Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="faq_type"
                      value={formData.faq_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.faq_type ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                    >
                      <option value="">Select FAQ type</option>
                      {faqTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {formErrors.faq_type && (
                      <p className="mt-1 text-xs flex items-center gap-1" style={{ color: colors.danger }}>
                        <AlertCircle size={12} />
                        {formErrors.faq_type}
                      </p>
                    )}
                  </div>

                  {/* Question */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                      <Type size={16} style={{ color: colors.primary }} />
                      Question <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="faq_question"
                      value={formData.faq_question}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.faq_question ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter the FAQ question"
                    />
                    {formErrors.faq_question && (
                      <p className="mt-1 text-xs flex items-center gap-1" style={{ color: colors.danger }}>
                        <AlertCircle size={12} />
                        {formErrors.faq_question}
                      </p>
                    )}
                  </div>

                  {/* Question Meta */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                      <FileText size={16} style={{ color: colors.primary }} />
                      Question Meta (SEO)
                    </label>
                    <input
                      type="text"
                      name="question_meta"
                      value={formData.question_meta}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter meta description for the question"
                    />
                    <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                      Optional: For SEO purposes
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Answer */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                      <AlignLeft size={16} style={{ color: colors.primary }} />
                      Answer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="faq_answer"
                      value={formData.faq_answer}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.faq_answer ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter the FAQ answer"
                    />
                    {formErrors.faq_answer && (
                      <p className="mt-1 text-xs flex items-center gap-1" style={{ color: colors.danger }}>
                        <AlertCircle size={12} />
                        {formErrors.faq_answer}
                      </p>
                    )}
                  </div>

                  {/* Answer Meta */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                      <FileText size={16} style={{ color: colors.primary }} />
                      Answer Meta (SEO)
                    </label>
                    <input
                      type="text"
                      name="faq_answer_meta"
                      value={formData.faq_answer_meta}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter meta description for the answer"
                    />
                    <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                      Optional: For SEO purposes
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg" style={{ backgroundColor: colors.background }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded"
                    style={{
                      accentColor: colors.primary
                    }}
                  />
                  <div>
                    <span style={{ color: colors.text }} className="font-medium">Active Status</span>
                    <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                      Enable to show this FAQ on the website
                    </p>
                  </div>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFaq(null);
                  }}
                  className="px-6 py-2.5 rounded-lg transition-all font-medium"
                  style={{
                    border: `1px solid ${colors.border}`,
                    color: colors.textLight,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.background;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 font-medium"
                  style={{
                    backgroundColor: colors.primary,
                    color: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) {
                      e.target.style.backgroundColor = colors.primaryHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!saving) {
                      e.target.style.backgroundColor = colors.primary;
                    }
                  }}
                >
                  {saving ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingFaq ? 'Update FAQ' : 'Save FAQ'}</span>
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
              placeholder="Search by type, question or answer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
            />
          </div>
        </div>

        {/* FAQs List Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: colors.border }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: colors.background }}>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Question</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Answer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Slug</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Created</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaqsList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center">
                      <MessageCircle size={40} className="mx-auto mb-3" style={{ color: colors.muted }} />
                      <p style={{ color: colors.textLight }}>No FAQs found</p>
                      <button
                        onClick={handleAdd}
                        className="mt-3 text-sm font-medium hover:underline"
                        style={{ color: colors.primary }}
                      >
                        Add your first FAQ
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredFaqsList.map((faq) => (
                    <tr key={faq.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium" style={{ color: colors.text }}>#{faq.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${colors.primary}10`,
                            color: colors.primary
                          }}
                        >
                          {faq.faq_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium" style={{ color: colors.text }}>
                          {truncateText(faq.faq_question, 40)}
                        </div>
                        {faq.question_meta && (
                          <div className="text-xs mt-1" style={{ color: colors.textLight }}>
                            Meta: {truncateText(faq.question_meta, 30)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: colors.textLight }}>
                          {truncateText(faq.faq_answer, 50)}
                        </div>
                        {faq.faq_answer_meta && (
                          <div className="text-xs mt-1" style={{ color: colors.textLight }}>
                            Meta: {truncateText(faq.faq_answer_meta, 30)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono" style={{ color: colors.textLight }}>
                          {faq.faq_slug || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(faq)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            faq.is_active === 1 || faq.is_active === true
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {(faq.is_active === 1 || faq.is_active === true) ? (
                            <>
                              <Eye size={12} />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm" style={{ color: colors.textLight }}>
                          {new Date(faq.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="p-2 rounded-lg mr-2 transition-all hover:bg-gray-100 group"
                          title="Edit"
                        >
                          <Edit2 size={16} style={{ color: colors.primary }} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(faq)}
                          className="p-2 rounded-lg transition-all hover:bg-gray-100 group"
                          title="Delete"
                        >
                          <Trash2 size={16} style={{ color: colors.danger }} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                    Delete FAQ
                  </h3>
                  <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <p className="mb-4" style={{ color: colors.textLight }}>
                Are you sure you want to delete this FAQ?
              </p>
              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm font-medium" style={{ color: colors.text }}>{deleteConfirm.faq_question}</p>
                <p className="text-xs mt-1" style={{ color: colors.textLight }}>Type: {deleteConfirm.faq_type}</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border rounded-lg transition-all"
                  style={{
                    borderColor: colors.border,
                    color: colors.textLight
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.background;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  <span>Delete FAQ</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleFAQs;