import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Loader,
  ArrowUp,
  ArrowDown,
  FileText,
  Tag,
  Type,
  AlignLeft,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../utils/app';

const HandleWhyChoseUs = () => {
  const [whyChooseList, setWhyChooseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [formData, setFormData] = useState({
    badge: '',
    title: '',
    description: '',
    title_meta: '',
    description_meta: '',
    status: true,
    short_order: 0
  });
  const [formErrors, setFormErrors] = useState({});

  // Color Schema (matching HeroSection)
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

  // Fetch Why Choose Us list
  const fetchWhyChooseList = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/why-choose-us');
      if (response.data?.status) {
        // Sort by short_order
        const sortedData = response.data.data.sort((a, b) => a.short_order - b.short_order);
        setWhyChooseList(sortedData);
      }
    } catch (error) {
      console.error('Error fetching why choose us list:', error);
      toast.error('Failed to load why choose us list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhyChooseList();
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
    
    if (!formData.badge.trim()) {
      errors.badge = 'Badge is required';
    }
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (formData.short_order && (isNaN(formData.short_order) || formData.short_order < 0)) {
      errors.short_order = 'Please enter a valid sort order';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);

    // Prepare data for API
    const submitData = {
      badge: formData.badge,
      title: formData.title,
      description: formData.description,
      title_meta: formData.title_meta || '',
      description_meta: formData.description_meta || '',
      status: formData.status ? 1 : 0,
      short_order: parseInt(formData.short_order) || 0
    };
    
    try {
      let response;
      
      if (editingItem) {
        // Update
        response = await api.put(`/admin/why-choose-us/${editingItem.id}`, submitData);
      } else {
        // Create
        response = await api.post('/admin/why-choose-us', submitData);
      }
      
      if (response.data?.status) {
        toast.success(editingItem ? 'Item updated successfully' : 'Item added successfully');
        setShowModal(false);
        setEditingItem(null);
        resetForm();
        fetchWhyChooseList();
      }
    } catch (error) {
      console.error('Error saving why choose us:', error);
      
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
        toast.error(error.response?.data?.message || 'Failed to save item');
      }
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      badge: '',
      title: '',
      description: '',
      title_meta: '',
      description_meta: '',
      status: true,
      short_order: whyChooseList.length + 1
    });
    setFormErrors({});
  };

  // Handle edit click
  const handleEdit = (item) => {
    setEditingItem(item);
    
    setFormData({
      badge: item.badge || '',
      title: item.title || '',
      description: item.description || '',
      title_meta: item.title_meta || '',
      description_meta: item.description_meta || '',
      status: item.status === 1 || item.status === true,
      short_order: item.short_order || 0
    });
    
    setFormErrors({});
    setShowModal(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle add click
  const handleAdd = () => {
    setEditingItem(null);
    resetForm();
    setShowModal(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/why-choose-us/${id}`);
      if (response.data?.status) {
        toast.success('Item deleted successfully');
        setDeleteConfirm(null);
        fetchWhyChooseList();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(error.response?.data?.message || 'Failed to delete item');
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (item) => {
    try {
      const response = await api.patch(`/admin/why-choose-us/${item.id}/status`, {
        status: !(item.status === 1 || item.status === true) ? 1 : 0
      });
      if (response.data?.status) {
        toast.success('Status updated successfully');
        fetchWhyChooseList();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Handle sort order change
  const handleSortOrder = async (id, newOrder) => {
    try {
      const response = await api.patch(`/admin/why-choose-us/${id}/sort-order`, {
        short_order: newOrder
      });
      if (response.data?.status) {
        toast.success('Sort order updated');
        fetchWhyChooseList();
      }
    } catch (error) {
      console.error('Error updating sort order:', error);
      toast.error('Failed to update sort order');
    }
  };

  // Filter list based on search
  const filteredList = whyChooseList.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.badge?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p style={{ color: colors.textLight }}>Loading why choose us items...</p>
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
              Why Choose Us
            </h1>
            <p className="mt-2 text-sm" style={{ color: colors.textLight }}>
              Manage why choose us sections for your website
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
            <span>Add New Item</span>
          </button>
        </div>

        {/* Add/Edit Form - Shows at top when modal is open */}
        {showModal && (
          <div className="mb-8 bg-white rounded-xl shadow-lg border p-6" style={{ borderColor: colors.border }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                  {editingItem ? 'Edit Why Choose Us Item' : 'Add New Why Choose Us Item'}
                </h2>
                <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                  {editingItem ? `Editing: ${editingItem.title}` : 'Create a new why choose us item'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
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
                  {/* Badge */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                      <Tag size={16} style={{ color: colors.primary }} />
                      Badge <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="badge"
                      value={formData.badge}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.badge ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                      placeholder="e.g., Why Choose Us"
                    />
                    {formErrors.badge && (
                      <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                        {formErrors.badge}
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                      <Type size={16} style={{ color: colors.primary }} />
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.title ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter title"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                      <AlignLeft size={16} style={{ color: colors.primary }} />
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.description ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter description"
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                        {formErrors.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* SEO Fields */}
                  <div className="p-4 border rounded-lg" style={{ borderColor: colors.border }}>
                    <h3 className="text-md font-medium mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                      <FileText size={16} style={{ color: colors.primary }} />
                      SEO Settings
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="title_meta"
                        value={formData.title_meta}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text
                        }}
                        placeholder="Meta title (SEO)"
                      />
                      <textarea
                        name="description_meta"
                        value={formData.description_meta}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text
                        }}
                        placeholder="Meta description (SEO)"
                      />
                    </div>
                  </div>

                  {/* Status and Sort Order */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Sort Order
                      </label>
                      <input
                        type="number"
                        name="short_order"
                        value={formData.short_order}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${formErrors.short_order ? colors.danger : colors.border}`,
                          color: colors.text
                        }}
                        min="0"
                        step="1"
                      />
                      {formErrors.short_order && (
                        <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                          {formErrors.short_order}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Status
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <input
                          type="checkbox"
                          name="status"
                          checked={formData.status}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded"
                          style={{
                            accentColor: colors.primary
                          }}
                        />
                        <span style={{ color: colors.text }}>Active</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
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
                    <span>{editingItem ? 'Update' : 'Save'}</span>
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
              placeholder="Search by title, badge or description..."
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

        {/* Why Choose Us List Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: colors.border }}>
         <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[700px]">
              <thead style={{ backgroundColor: colors.background }}>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Sort</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Badge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Meta Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center" style={{ color: colors.textLight }}>
                      No items found
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSortOrder(item.id, item.short_order - 1)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            disabled={item.short_order === 1}
                          >
                            <ArrowUp size={14} style={{ color: item.short_order === 1 ? colors.muted : colors.primary }} />
                          </button>
                          <span className="text-sm font-medium" style={{ color: colors.text }}>{item.short_order}</span>
                          <button
                            onClick={() => handleSortOrder(item.id, item.short_order + 1)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            disabled={item.short_order === whyChooseList.length}
                          >
                            <ArrowDown size={14} style={{ color: item.short_order === whyChooseList.length ? colors.muted : colors.primary }} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.textLight }}>#{item.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.badge ? (
                          <span 
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `${colors.primary}10`,
                              color: colors.primary
                            }}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <span style={{ color: colors.textLight }}>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium" style={{ color: colors.text }}>
                          {truncateText(item.title, 30)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: colors.textLight }}>
                          {truncateText(item.description, 40)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.title_meta ? (
                          <div className="text-sm" style={{ color: colors.textLight }}>
                            {truncateText(item.title_meta, 30)}
                          </div>
                        ) : (
                          <span style={{ color: colors.textLight }}>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(item)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            item.status === 1 || item.status === true
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {(item.status === 1 || item.status === true) ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg mr-2 transition-all hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 size={16} style={{ color: colors.primary }} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item)}
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

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                  Delete Item
                </h3>
              </div>
              
              <p className="mb-4" style={{ color: colors.textLight }}>
                Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
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

export default HandleWhyChoseUs;