import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Loader,
  Tag,
  Type,
  AlignLeft,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Target
} from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../utils/app';

const HandleYourGoalsSection = () => {
  const [goalsList, setGoalsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [formData, setFormData] = useState({
    badge_text: '',
    title: '',
    description: '',
    status: true
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

  // Fetch goals list
  const fetchGoalsList = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/goal-sections');
      if (response.data?.status) {
        setGoalsList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching goals sections:', error);
      toast.error('Failed to load goals sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsList();
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
    
    if (!formData.badge_text.trim()) {
      errors.badge_text = 'Badge text is required';
    }
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
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
      badge_text: formData.badge_text,
      title: formData.title,
      description: formData.description,
      status: formData.status ? 1 : 0
    };
    
    try {
      let response;
      
      if (editingGoal) {
        // Update
        response = await api.post(`/admin/goal-sections/update/${editingGoal.id}`, submitData);
      } else {
        // Create
        response = await api.post('/admin/goal-sections', submitData);
      }
      
      if (response.data?.status) {
        toast.success(editingGoal ? 'Goal section updated successfully' : 'Goal section added successfully');
        setShowForm(false);
        setEditingGoal(null);
        resetForm();
        fetchGoalsList();
      }
    } catch (error) {
      console.error('Error saving goal section:', error);
      
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
        toast.error(error.response?.data?.message || 'Failed to save goal section');
      }
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      badge_text: '',
      title: '',
      description: '',
      status: true
    });
    setFormErrors({});
  };

  // Handle edit click
  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      badge_text: goal.badge_text || '',
      title: goal.title || '',
      description: goal.description || '',
      status: goal.status === 1 || goal.status === true
    });
    setFormErrors({});
    setShowForm(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle add click
  const handleAdd = () => {
    setEditingGoal(null);
    resetForm();
    setShowForm(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/your-goals-sections/${id}`);
      if (response.data?.status) {
        toast.success('Goal section deleted successfully');
        setDeleteConfirm(null);
        fetchGoalsList();
      }
    } catch (error) {
      console.error('Error deleting goal section:', error);
      toast.error(error.response?.data?.message || 'Failed to delete goal section');
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (goal) => {
    try {
      const response = await api.patch(`/admin/your-goals-sections/${goal.id}/status`, {
        status: !(goal.status === 1 || goal.status === true) ? 1 : 0
      });
      if (response.data?.status) {
        toast.success('Status updated successfully');
        fetchGoalsList();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Filter goals list based on search
  const filteredGoalsList = goalsList.filter(goal =>
    goal.badge_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p style={{ color: colors.textLight }}>Loading goals sections...</p>
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
              Your Goals Sections
            </h1>
            <p className="mt-2 text-sm" style={{ color: colors.textLight }}>
              Manage your goals sections for the website
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
            <span>Add New Goal Section</span>
          </button>
        </div>

        {/* Add/Edit Form - Shows at top when form is open */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-lg border p-6" style={{ borderColor: colors.border }}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                  <Target size={20} style={{ color: colors.primary }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                    {editingGoal ? 'Edit Goal Section' : 'Add New Goal Section'}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                    {editingGoal ? `Editing: ${editingGoal.title}` : 'Create a new goal section'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingGoal(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} style={{ color: colors.textLight }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
              {/* Badge Text */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: colors.text }}>
                  <Tag size={16} style={{ color: colors.primary }} />
                  Badge Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="badge_text"
                  value={formData.badge_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${formErrors.badge_text ? colors.danger : colors.border}`,
                    color: colors.text
                  }}
                  placeholder="e.g., Your Goals, Our Mission, etc."
                />
                {formErrors.badge_text && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: colors.danger }}>
                    <AlertCircle size={12} />
                    {formErrors.badge_text}
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
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${formErrors.title ? colors.danger : colors.border}`,
                    color: colors.text
                  }}
                  placeholder="Enter section title"
                />
                {formErrors.title && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: colors.danger }}>
                    <AlertCircle size={12} />
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
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${formErrors.description ? colors.danger : colors.border}`,
                    color: colors.text
                  }}
                  placeholder="Enter section description"
                />
                {formErrors.description && (
                  <p className="mt-1 text-xs flex items-center gap-1" style={{ color: colors.danger }}>
                    <AlertCircle size={12} />
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg" style={{ backgroundColor: colors.background }}>
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded"
                    style={{
                      accentColor: colors.primary
                    }}
                  />
                  <div>
                    <span style={{ color: colors.text }} className="font-medium">Active Status</span>
                    <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                      Enable to show this goal section on the website
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
                    setEditingGoal(null);
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
                    <span>{editingGoal ? 'Update Section' : 'Save Section'}</span>
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
              placeholder="Search by badge text, title or description..."
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

        {/* Goals List Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: colors.border }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: colors.background }}>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Badge Text</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Description</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Created At</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGoalsList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center">
                      <Target size={40} className="mx-auto mb-3" style={{ color: colors.muted }} />
                      <p style={{ color: colors.textLight }}>No goal sections found</p>
                      <button
                        onClick={handleAdd}
                        className="mt-3 text-sm font-medium hover:underline"
                        style={{ color: colors.primary }}
                      >
                        Add your first goal section
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredGoalsList.map((goal) => (
                    <tr key={goal.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium" style={{ color: colors.text }}>#{goal.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${colors.primary}10`,
                            color: colors.primary
                          }}
                        >
                          {goal.badge_text || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium" style={{ color: colors.text }}>
                          {truncateText(goal.title, 30)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm" style={{ color: colors.textLight }}>
                          {truncateText(goal.description, 40)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(goal)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            goal.status === 1 || goal.status === true
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {(goal.status === 1 || goal.status === true) ? (
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
                          {new Date(goal.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="p-2 rounded-lg mr-2 transition-all hover:bg-gray-100 group"
                          title="Edit"
                        >
                          <Edit2 size={16} style={{ color: colors.primary }} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(goal)}
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
                    Delete Goal Section
                  </h3>
                  <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <p className="mb-4" style={{ color: colors.textLight }}>
                Are you sure you want to delete the goal section <span className="font-medium" style={{ color: colors.text }}>"{deleteConfirm.title}"</span>?
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
                  <span>Delete Section</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleYourGoalsSection;