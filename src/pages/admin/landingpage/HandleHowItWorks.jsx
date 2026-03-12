import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Loader,
  Globe,
  Youtube,
  Film,
  List,
  CheckSquare,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Link as LinkIcon,
  PlayCircle,
  Award,
  Shield,
  Zap,
  Users,
  Star
} from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../utils/app';

const HandleHowItWorks = () => {
  const [howItWorksList, setHowItWorksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [formData, setFormData] = useState({
    section_title: '',
    section_subtitle: '',
    tab_name: '',
    youtube_url: '',
    video_title: '',
    step1: '',
    step2: '',
    step3: '',
    step4: '',
    feature1: '',
    feature2: '',
    feature3: '',
    feature4: '',
    button_text: '',
    button_link: '',
    status: true,
    sort_order: 0
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

  // Fetch how it works list
  const fetchHowItWorksList = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/how-it-works');
      if (response.data?.status) {
        // Sort by sort_order
        const sortedData = response.data.data.sort((a, b) => a.sort_order - b.sort_order);
        setHowItWorksList(sortedData);
      }
    } catch (error) {
      console.error('Error fetching how it works sections:', error);
      toast.error('Failed to load how it works sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHowItWorksList();
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
    
    if (!formData.section_title.trim()) {
      errors.section_title = 'Section title is required';
    }
    
    if (!formData.tab_name.trim()) {
      errors.tab_name = 'Tab name is required';
    }
    
    if (formData.youtube_url && !isValidYoutubeUrl(formData.youtube_url)) {
      errors.youtube_url = 'Please enter a valid YouTube URL';
    }
    
    if (!formData.step1.trim()) {
      errors.step1 = 'Step 1 is required';
    }
    
    if (!formData.feature1.trim()) {
      errors.feature1 = 'Feature 1 is required';
    }
    
    if (formData.button_text && !formData.button_link) {
      errors.button_link = 'Button link is required when button text is provided';
    }
    
    if (formData.sort_order && (isNaN(formData.sort_order) || formData.sort_order < 0)) {
      errors.sort_order = 'Please enter a valid sort order';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate YouTube URL
  const isValidYoutubeUrl = (url) => {
    if (!url) return true;
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    
    try {
      let response;
      
      if (editingItem) {
        // Update
        response = await api.put(`/admin/how-it-works/${editingItem.id}`, formData);
      } else {
        // Create
        response = await api.post('/admin/how-it-works', formData);
      }
      
      if (response.data?.status) {
        toast.success(editingItem ? 'How it works section updated successfully' : 'How it works section added successfully');
        setShowForm(false);
        setEditingItem(null);
        resetForm();
        fetchHowItWorksList();
      }
    } catch (error) {
      console.error('Error saving how it works section:', error);
      
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
        toast.error(error.response?.data?.message || 'Failed to save how it works section');
      }
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      section_title: '',
      section_subtitle: '',
      tab_name: '',
      youtube_url: '',
      video_title: '',
      step1: '',
      step2: '',
      step3: '',
      step4: '',
      feature1: '',
      feature2: '',
      feature3: '',
      feature4: '',
      button_text: '',
      button_link: '',
      status: true,
      sort_order: howItWorksList.length + 1
    });
    setFormErrors({});
  };

  // Handle edit click
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      section_title: item.section_title || '',
      section_subtitle: item.section_subtitle || '',
      tab_name: item.tab_name || '',
      youtube_url: item.youtube_url || '',
      video_title: item.video_title || '',
      step1: item.step1 || '',
      step2: item.step2 || '',
      step3: item.step3 || '',
      step4: item.step4 || '',
      feature1: item.feature1 || '',
      feature2: item.feature2 || '',
      feature3: item.feature3 || '',
      feature4: item.feature4 || '',
      button_text: item.button_text || '',
      button_link: item.button_link || '',
      status: item.status === 1 || item.status === true,
      sort_order: item.sort_order || 0
    });
    setFormErrors({});
    setShowForm(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle add click
  const handleAdd = () => {
    setEditingItem(null);
    resetForm();
    setShowForm(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/how-it-works/${id}`);
      if (response.data?.status) {
        toast.success('How it works section deleted successfully');
        setDeleteConfirm(null);
        fetchHowItWorksList();
      }
    } catch (error) {
      console.error('Error deleting how it works section:', error);
      toast.error(error.response?.data?.message || 'Failed to delete how it works section');
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (item) => {
    try {
      const response = await api.patch(`/admin/how-it-works/${item.id}/status`, {
        status: !(item.status === 1 || item.status === true) ? 1 : 0
      });
      if (response.data?.status) {
        toast.success('Status updated successfully');
        fetchHowItWorksList();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Handle sort order change
  const handleSortOrder = async (id, newOrder) => {
    try {
      const response = await api.patch(`/admin/how-it-works/${id}/sort-order`, {
        sort_order: newOrder
      });
      if (response.data?.status) {
        toast.success('Sort order updated');
        fetchHowItWorksList();
      }
    } catch (error) {
      console.error('Error updating sort order:', error);
      toast.error('Failed to update sort order');
    }
  };

  // Filter list based on search
  const filteredList = howItWorksList.filter(item =>
    item.section_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tab_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.video_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Truncate text
  const truncateText = (text, length = 40) => {
    if (!text) return '-';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  // Extract YouTube video ID from URL
  const getYoutubeThumbnail = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/default.jpg` : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={40} style={{ color: colors.primary }} />
          <p style={{ color: colors.textLight }}>Loading how it works sections...</p>
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
              How It Works
            </h1>
            <p className="mt-2 text-sm" style={{ color: colors.textLight }}>
              Manage how it works sections for your website
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
            <span>Add New Section</span>
          </button>
        </div>

        {/* Add/Edit Form - Shows at top when form is open */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-lg border p-6" style={{ borderColor: colors.border }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                  {editingItem ? 'Edit How It Works Section' : 'Add New How It Works Section'}
                </h2>
                <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                  {editingItem ? `Editing: ${editingItem.tab_name}` : 'Create a new how it works section'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} style={{ color: colors.textLight }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section Title & Subtitle */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                    <Globe size={16} style={{ color: colors.primary }} />
                    Section Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="section_title"
                    value={formData.section_title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.section_title ? colors.danger : colors.border}`,
                      color: colors.text
                    }}
                    placeholder="e.g., How It Works"
                  />
                  {formErrors.section_title && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                      {formErrors.section_title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    name="section_subtitle"
                    value={formData.section_subtitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text
                    }}
                    placeholder="Enter section subtitle"
                  />
                </div>
              </div>

              {/* Tab Name */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                  <List size={16} style={{ color: colors.primary }} />
                  Tab Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tab_name"
                  value={formData.tab_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${formErrors.tab_name ? colors.danger : colors.border}`,
                    color: colors.text
                  }}
                  placeholder="e.g., Adjustable Dumbbells"
                />
                {formErrors.tab_name && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                    {formErrors.tab_name}
                  </p>
                )}
              </div>

              {/* Video Section */}
              <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg" style={{ borderColor: colors.border }}>
                <h3 className="col-span-2 text-md font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                  <Youtube size={18} style={{ color: colors.primary }} />
                  Video Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youtube_url"
                    value={formData.youtube_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.youtube_url ? colors.danger : colors.border}`,
                      color: colors.text
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {formErrors.youtube_url && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                      {formErrors.youtube_url}
                    </p>
                  )}
                  {formData.youtube_url && (
                    <div className="mt-2">
                      <img 
                        src={getYoutubeThumbnail(formData.youtube_url)} 
                        alt="YouTube Thumbnail" 
                        className="h-16 object-contain border rounded"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Video Title
                  </label>
                  <input
                    type="text"
                    name="video_title"
                    value={formData.video_title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text
                    }}
                    placeholder="e.g., Using Gym Accessories"
                  />
                </div>
              </div>

              {/* Steps Section */}
              <div className="p-4 border rounded-lg" style={{ borderColor: colors.border }}>
                <h3 className="text-md font-medium mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                  <PlayCircle size={18} style={{ color: colors.primary }} />
                  Steps (How to use)
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Step 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="step1"
                      value={formData.step1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.step1 ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter step 1"
                    />
                    {formErrors.step1 && (
                      <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                        {formErrors.step1}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Step 2
                    </label>
                    <input
                      type="text"
                      name="step2"
                      value={formData.step2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter step 2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Step 3
                    </label>
                    <input
                      type="text"
                      name="step3"
                      value={formData.step3}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter step 3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Step 4
                    </label>
                    <input
                      type="text"
                      name="step4"
                      value={formData.step4}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter step 4"
                    />
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="p-4 border rounded-lg" style={{ borderColor: colors.border }}>
                <h3 className="text-md font-medium mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                  <Award size={18} style={{ color: colors.primary }} />
                  Features
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Feature 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="feature1"
                      value={formData.feature1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.feature1 ? colors.danger : colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter feature 1"
                    />
                    {formErrors.feature1 && (
                      <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                        {formErrors.feature1}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Feature 2
                    </label>
                    <input
                      type="text"
                      name="feature2"
                      value={formData.feature2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter feature 2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Feature 3
                    </label>
                    <input
                      type="text"
                      name="feature3"
                      value={formData.feature3}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter feature 3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Feature 4
                    </label>
                    <input
                      type="text"
                      name="feature4"
                      value={formData.feature4}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text
                      }}
                      placeholder="Enter feature 4"
                    />
                  </div>
                </div>
              </div>

              {/* Button Section */}
              <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg" style={{ borderColor: colors.border }}>
                <h3 className="col-span-2 text-md font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                  <LinkIcon size={18} style={{ color: colors.primary }} />
                  Call to Action Button
                </h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text
                    }}
                    placeholder="e.g., View Gym Accessories"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Button Link
                  </label>
                  <input
                    type="text"
                    name="button_link"
                    value={formData.button_link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.button_link ? colors.danger : colors.border}`,
                      color: colors.text
                    }}
                    placeholder="e.g., /products"
                  />
                  {formErrors.button_link && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                      {formErrors.button_link}
                    </p>
                  )}
                </div>
              </div>

              {/* Status and Sort Order */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Sort Order
                  </label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.sort_order ? colors.danger : colors.border}`,
                      color: colors.text
                    }}
                    min="0"
                    step="1"
                  />
                  {formErrors.sort_order && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                      {formErrors.sort_order}
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

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
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
              placeholder="Search by section title, tab name or video title..."
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

        {/* How It Works List Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: colors.border }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: colors.background }}>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Sort</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Tab Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Section Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Video</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Steps</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Features</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-10 text-center" style={{ color: colors.textLight }}>
                      No how it works sections found
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSortOrder(item.id, item.sort_order - 1)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            disabled={item.sort_order === 1}
                          >
                            <ArrowUp size={14} style={{ color: item.sort_order === 1 ? colors.muted : colors.primary }} />
                          </button>
                          <span className="text-sm font-medium" style={{ color: colors.text }}>{item.sort_order}</span>
                          <button
                            onClick={() => handleSortOrder(item.id, item.sort_order + 1)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            disabled={item.sort_order === filteredList.length}
                          >
                            <ArrowDown size={14} style={{ color: item.sort_order === filteredList.length ? colors.muted : colors.primary }} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.textLight }}>#{item.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium" style={{ color: colors.text }}>
                          {item.tab_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: colors.textLight }}>
                          {truncateText(item.section_title, 30)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.youtube_url ? (
                          <div className="flex items-center gap-2">
                            <Youtube size={16} style={{ color: colors.danger }} />
                            <span className="text-xs" style={{ color: colors.textLight }}>
                              {item.video_title ? truncateText(item.video_title, 20) : 'Video'}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: colors.textLight }}>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {item.step1 && <div className="text-xs">1. {truncateText(item.step1, 15)}</div>}
                          {item.step2 && <div className="text-xs">2. {truncateText(item.step2, 15)}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {item.feature1 && <div className="text-xs">• {truncateText(item.feature1, 15)}</div>}
                          {item.feature2 && <div className="text-xs">• {truncateText(item.feature2, 15)}</div>}
                        </div>
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
                  Delete How It Works Section
                </h3>
              </div>
              
              <p className="mb-4" style={{ color: colors.textLight }}>
                Are you sure you want to delete the how it works section for "{deleteConfirm.tab_name}"? This action cannot be undone.
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

export default HandleHowItWorks;