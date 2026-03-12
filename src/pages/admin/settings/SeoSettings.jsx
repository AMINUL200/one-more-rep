import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Loader,
  Globe,
  FileText,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Code,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../utils/app';

const SeoSettings = () => {
  const [seoList, setSeoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSeo, setEditingSeo] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [ogImagePreview, setOgImagePreview] = useState(null);
  const [uploadingOgImage, setUploadingOgImage] = useState(false);
  
  const [formData, setFormData] = useState({
    page_key: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    robots: 'index,follow',
    schema_json: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});

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

  // API Base URL for images
  const API_URL = import.meta.env.VITE_STORAGE_URL;

  // Fetch SEO list
  const fetchSeoList = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/seo');
      if (response.data?.status) {
        setSeoList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching SEO list:', error);
      toast.error('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoList();
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

  // Handle OG Image URL change
  const handleOgImageUrlChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      og_image: value
    }));
    setOgImagePreview(value);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Check for duplicate page_key (excluding current editing item)
    const isDuplicate = seoList.some(
      seo => seo.page_key?.toLowerCase() === formData.page_key?.toLowerCase() && 
      (!editingSeo || seo.id !== editingSeo.id)
    );
    
    if (!formData.page_key.trim()) {
      errors.page_key = 'Page key is required';
    } else if (isDuplicate) {
      errors.page_key = 'Page key has already been taken';
    }
    
    if (!formData.meta_title.trim()) {
      errors.meta_title = 'Meta title is required';
    } else if (formData.meta_title.length > 60) {
      errors.meta_title = 'Meta title should not exceed 60 characters';
    }
    
    if (!formData.meta_description.trim()) {
      errors.meta_description = 'Meta description is required';
    } else if (formData.meta_description.length > 160) {
      errors.meta_description = 'Meta description should not exceed 160 characters';
    }
    
    // Validate schema_json if provided
    if (formData.schema_json && formData.schema_json.trim()) {
      try {
        JSON.parse(formData.schema_json);
      } catch (error) {
        errors.schema_json = 'Invalid JSON format';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);

    // Prepare data - send as JSON, not FormData
    const submitData = {
      page_key: formData.page_key,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      meta_keywords: formData.meta_keywords || null,
      og_title: formData.og_title || null,
      og_description: formData.og_description || null,
      og_image: formData.og_image || null,
      canonical_url: formData.canonical_url || null,
      robots: formData.robots,
      is_active: formData.is_active ? 1 : 0
    };

    // Handle schema_json - send as object/array
    if (formData.schema_json && formData.schema_json.trim()) {
      try {
        submitData.schema_json = JSON.parse(formData.schema_json);
      } catch (error) {
        // If invalid JSON, don't include it
      }
    } else {
      submitData.schema_json = null;
    }
    
    try {
      let response;
      
      if (editingSeo) {
        // Update
        console.log('Updating SEO with ID:', editingSeo.id);
        console.log('Update data:', submitData);
        response = await api.put(`/admin/seo/${editingSeo.id}`, submitData);
      } else {
        // Create
        console.log('Creating new SEO:', submitData);
        response = await api.post('/admin/seo', submitData);
      }
      
      if (response.data?.status) {
        toast.success(editingSeo ? 'SEO settings updated successfully' : 'SEO settings added successfully');
        setShowModal(false);
        setEditingSeo(null);
        setOgImagePreview(null);
        setFormData({
          page_key: '',
          meta_title: '',
          meta_description: '',
          meta_keywords: '',
          og_title: '',
          og_description: '',
          og_image: '',
          canonical_url: '',
          robots: 'index,follow',
          schema_json: '',
          is_active: true
        });
        fetchSeoList();
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      
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
        toast.error(error.response?.data?.message || 'Failed to save SEO settings');
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle edit click - FIXED: Make sure this is working
  const handleEdit = (seo) => {
    console.log('Editing SEO:', seo); // Debug log
    setEditingSeo(seo);
    
    // Set image preview if exists
    if (seo.og_image) {
      setOgImagePreview(seo.og_image);
    } else {
      setOgImagePreview(null);
    }
    
    // Set form data
    setFormData({
      page_key: seo.page_key || '',
      meta_title: seo.meta_title || '',
      meta_description: seo.meta_description || '',
      meta_keywords: seo.meta_keywords || '',
      og_title: seo.og_title || '',
      og_description: seo.og_description || '',
      og_image: seo.og_image || '',
      canonical_url: seo.canonical_url || '',
      robots: seo.robots || 'index,follow',
      schema_json: seo.schema_json ? JSON.stringify(seo.schema_json, null, 2) : '',
      is_active: seo.is_active === 1 || seo.is_active === true
    });
    
    setFormErrors({});
    setShowModal(true);
  };

  // Handle add click
  const handleAdd = () => {
    console.log('Adding new SEO'); // Debug log
    setEditingSeo(null);
    setOgImagePreview(null);
    setFormData({
      page_key: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      canonical_url: '',
      robots: 'index,follow',
      schema_json: '',
      is_active: true
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/seo/${id}`);
      if (response.data?.status) {
        toast.success('SEO settings deleted successfully');
        setDeleteConfirm(null);
        fetchSeoList();
      }
    } catch (error) {
      console.error('Error deleting SEO settings:', error);
      toast.error(error.response?.data?.message || 'Failed to delete SEO settings');
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (seo) => {
    try {
      const response = await api.patch(`/admin/seo/${seo.id}/status`, {
        is_active: !(seo.is_active === 1 || seo.is_active === true)
      });
      if (response.data?.status) {
        toast.success('Status updated successfully');
        fetchSeoList();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Filter SEO list based on search
  const filteredSeoList = seoList.filter(seo =>
    seo.page_key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seo.meta_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seo.meta_keywords?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Truncate text
  const truncateText = (text, length = 50) => {
    if (!text) return '-';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={40} style={{ color: colors.primary }} />
          <p style={{ color: colors.textLight }}>Loading SEO settings...</p>
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
              SEO Settings
            </h1>
            <p className="mt-2 text-sm" style={{ color: colors.textLight }}>
              Manage SEO meta tags for your website pages
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
            <span>Add New SEO</span>
          </button>
        </div>

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
              placeholder="Search by page key, meta title or keywords..."
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

        {/* SEO List Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: colors.border }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: colors.background }}>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Page Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Meta Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Meta Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Keywords</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>OG Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Robots</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSeoList.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-10 text-center" style={{ color: colors.textLight }}>
                      No SEO settings found
                    </td>
                  </tr>
                ) : (
                  filteredSeoList.map((seo) => (
                    <tr key={seo.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.textLight }}>#{seo.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: `${colors.primary}10`,
                            color: colors.primary
                          }}
                        >
                          {seo.page_key}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium" style={{ color: colors.text }}>
                          {truncateText(seo.meta_title, 40)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: colors.textLight }}>
                          {truncateText(seo.meta_description, 40)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: colors.textLight }}>
                          {seo.meta_keywords ? truncateText(seo.meta_keywords, 30) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {seo.og_image ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded border overflow-hidden">
                              <img 
                                src={seo.og_image} 
                                alt="OG" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/32?text=Error';
                                }}
                              />
                            </div>
                            <span className="text-xs text-green-600">✓</span>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: colors.textLight }}>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="px-2 py-1 rounded text-xs font-mono"
                          style={{ 
                            backgroundColor: `${colors.muted}20`,
                            color: colors.text
                          }}
                        >
                          {seo.robots || 'index,follow'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(seo)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            seo.is_active === 1 || seo.is_active === true
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {(seo.is_active === 1 || seo.is_active === true) ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleEdit(seo)}
                          className="p-2 rounded-lg mr-2 transition-all hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 size={16} style={{ color: colors.primary }} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(seo)}
                          className="p-2 rounded-lg transition-all hover:bg-gray-100"
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

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white rounded-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                    {editingSeo ? 'Edit SEO Settings' : 'Add New SEO Settings'}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                    {editingSeo ? `Editing: ${editingSeo.page_key}` : 'Configure SEO meta tags for a page'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingSeo(null);
                    setOgImagePreview(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} style={{ color: colors.textLight }} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Page Key */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Page Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="page_key"
                    value={formData.page_key}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.page_key ? colors.danger : colors.border}`,
                      color: colors.text
                    }}
                    placeholder="e.g., Home, About, Contact, Products"
                  />
                  {formErrors.page_key && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                      {formErrors.page_key}
                    </p>
                  )}
                </div>

                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Meta Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.meta_title ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter meta title (max 60 characters)"
                      maxLength="60"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span 
                        className={`text-xs ${
                          formData.meta_title.length > 55 
                            ? 'text-orange-500' 
                            : formData.meta_title.length > 60 
                            ? 'text-red-500' 
                            : 'text-gray-400'
                        }`}
                      >
                        {formData.meta_title.length}/60
                      </span>
                    </div>
                  </div>
                  {formErrors.meta_title && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                      {formErrors.meta_title}
                    </p>
                  )}
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Meta Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.meta_description ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter meta description (max 160 characters)"
                      maxLength="160"
                    />
                    <div className="absolute right-3 bottom-3">
                      <span 
                        className={`text-xs ${
                          formData.meta_description.length > 150 
                            ? 'text-orange-500' 
                            : formData.meta_description.length > 160 
                            ? 'text-red-500' 
                            : 'text-gray-400'
                        }`}
                      >
                        {formData.meta_description.length}/160
                      </span>
                    </div>
                  </div>
                  {formErrors.meta_description && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                      {formErrors.meta_description}
                    </p>
                  )}
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    name="meta_keywords"
                    value={formData.meta_keywords}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text
                    }}
                    placeholder="Enter keywords separated by commas"
                  />
                  <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                    Separate keywords with commas (e.g., HRMS, payroll, attendance)
                  </p>
                </div>

                {/* Open Graph Tags */}
                <div className="border-t pt-4 mt-2" style={{ borderColor: colors.border }}>
                  <h3 className="text-md font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                    <Globe size={16} style={{ color: colors.primary }} />
                    Open Graph (Social Media)
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        OG Title
                      </label>
                      <input
                        type="text"
                        name="og_title"
                        value={formData.og_title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text
                        }}
                        placeholder="Open Graph title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        OG Description
                      </label>
                      <input
                        type="text"
                        name="og_description"
                        value={formData.og_description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text
                        }}
                        placeholder="Open Graph description"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        OG Image URL
                      </label>
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <input
                            type="url"
                            name="og_image"
                            value={formData.og_image}
                            onChange={handleOgImageUrlChange}
                            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                            style={{
                              backgroundColor: colors.background,
                              border: `1px solid ${formErrors.og_image ? colors.danger : colors.border}`,
                              color: colors.text
                            }}
                            placeholder="https://example.com/image.jpg"
                          />
                          {formErrors.og_image && (
                            <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                              {formErrors.og_image}
                            </p>
                          )}
                        </div>
                        
                        {/* Image Preview */}
                        {(ogImagePreview || formData.og_image) && (
                          <div className="w-20 h-20 rounded-lg border overflow-hidden flex-shrink-0">
                            <img 
                              src={ogImagePreview || formData.og_image} 
                              alt="OG Preview" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80?text=Error';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-xs mt-2" style={{ color: colors.textLight }}>
                        Enter the URL of your Open Graph image (recommended size: 1200x630px)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical SEO */}
                <div className="border-t pt-4 mt-2" style={{ borderColor: colors.border }}>
                  <h3 className="text-md font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                    <Code size={16} style={{ color: colors.primary }} />
                    Technical SEO
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Canonical URL
                      </label>
                      <input
                        type="url"
                        name="canonical_url"
                        value={formData.canonical_url}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text
                        }}
                        placeholder="https://example.com/page"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Robots Meta
                      </label>
                      <select
                        name="robots"
                        value={formData.robots}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text
                        }}
                      >
                        <option value="index,follow">index,follow</option>
                        <option value="noindex,follow">noindex,follow</option>
                        <option value="index,nofollow">index,nofollow</option>
                        <option value="noindex,nofollow">noindex,nofollow</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Schema JSON-LD
                    </label>
                    <textarea
                      name="schema_json"
                      value={formData.schema_json}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-2 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.schema_json ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                      placeholder='{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company"
}'
                    />
                    {formErrors.schema_json && (
                      <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                        {formErrors.schema_json}
                      </p>
                    )}
                    <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                      Enter valid JSON-LD schema markup (will be parsed to object/array)
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="border-t pt-4 mt-2" style={{ borderColor: colors.border }}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded"
                      style={{
                        accentColor: colors.primary
                      }}
                    />
                    <span style={{ color: colors.text }}>Active</span>
                  </label>
                  <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                    Enable this SEO configuration
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingSeo(null);
                      setOgImagePreview(null);
                    }}
                    className="px-4 py-2 rounded-lg transition-all"
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
                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
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
                        <Loader size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingSeo ? 'Update' : 'Save'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                  Delete SEO Settings
                </h3>
              </div>
              
              <p className="mb-4" style={{ color: colors.textLight }}>
                Are you sure you want to delete SEO settings for "{deleteConfirm.page_key}"? This action cannot be undone.
              </p>

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

export default SeoSettings;