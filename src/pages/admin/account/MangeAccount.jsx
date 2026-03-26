import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Loader,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../utils/app';

const ManageAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'accounts'
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

  // Role options
  const roleOptions = [
    { value: 'accounts', label: 'Accounts', icon: '💰' },
    { value: 'sales', label: 'Sales', icon: '📊' }
  ];

  // Fetch accounts list
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/employee-details');
      if (response.data?.status) {
        setAccounts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!editingAccount && !formData.password) {
      errors.password = 'Password is required for new accounts';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      errors.role = 'Role is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const submitData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role
    };

    // Only include password if it's provided (for new accounts or when changing password)
    if (formData.password) {
      submitData.password = formData.password;
    }

    try {
      let response;
      if (editingAccount) {
        // Edit account
        response = await api.put(`/admin/add-employee/${editingAccount.id}`, submitData);
      } else {
        // Add account
        response = await api.post('/admin/add-employee', submitData);
      }

      if (response.data?.status) {
        toast.success(
          editingAccount 
            ? 'Account updated successfully' 
            : 'Account created successfully'
        );
        setShowModal(false);
        setEditingAccount(null);
        resetForm();
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error saving account:', error);
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || {};
        const formattedErrors = {};
        Object.keys(validationErrors).forEach(key => {
          formattedErrors[key] = validationErrors[key][0];
        });
        setFormErrors(formattedErrors);
        toast.error('Please check the form for errors');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save account');
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle edit click
  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      email: account.email,
      phone: account.phone,
      password: '',
      role: account.role
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Handle add click
  const handleAdd = () => {
    setEditingAccount(null);
    resetForm();
    setFormErrors({});
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'accounts'
    });
    setShowPassword(false);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/employees/${id}`);
      if (response.data?.status) {
        toast.success('Account deleted successfully');
        setDeleteConfirm(null);
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  // Filter accounts based on search
  const filteredAccounts = accounts.filter(account =>
    account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.phone?.includes(searchTerm) ||
    account.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get role badge color
  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'accounts':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-200'
        };
      case 'sales':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-200'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200'
        };
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={40} style={{ color: colors.primary }} />
          <p style={{ color: colors.textLight }}>Loading accounts...</p>
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
              Manage Accounts
            </h1>
            <p className="mt-2 text-sm" style={{ color: colors.textLight }}>
              Create and manage employee accounts for the system
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
            <span>Add New Account</span>
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
              placeholder="Search by name, email, phone or role..."
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

        {/* Accounts Table */}
        <div 
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
          style={{ borderColor: colors.border }}
        >
          <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead style={{ backgroundColor: colors.background }}>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: colors.textLight }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center" style={{ color: colors.textLight }}>
                      No accounts found
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => {
                    const roleStyle = getRoleBadgeStyle(account.role);
                    return (
                      <tr key={account.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.textLight }}>
                          #{account.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
                            >
                              {account.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium" style={{ color: colors.text }}>
                              {account.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Mail size={14} style={{ color: colors.muted }} />
                            <span style={{ color: colors.text }}>{account.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Phone size={14} style={{ color: colors.muted }} />
                            <span style={{ color: colors.text }}>{account.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${roleStyle.bg} ${roleStyle.text}`}
                          >
                            {account.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: colors.textLight }}>
                          {new Date(account.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {/* <button
                            onClick={() => handleEdit(account)}
                            className="p-2 rounded-lg mr-2 transition-all hover:bg-gray-100"
                            title="Edit"
                          >
                            <Edit2 size={16} style={{ color: colors.primary }} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(account)}
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                            title="Delete"
                          >
                            <Trash2 size={16} style={{ color: colors.danger }} />
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

        {/* Add/Edit Account Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div 
              className="rounded-lg w-full max-w-md p-6 relative shadow-xl"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* Modal Header */}
              <div 
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                    {editingAccount ? 'Edit Account' : 'Add New Account'}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                    {editingAccount ? 'Update account details' : 'Create a new employee account'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingAccount(null);
                    resetForm();
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-all"
                >
                  <X size={20} style={{ color: colors.textLight }} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.muted }} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.name ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="Enter full name"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.muted }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.email ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="Enter email address"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.muted }} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.phone ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Password {!editingAccount && <span className="text-red-500">*</span>}
                    {editingAccount && <span className="text-xs text-muted"> (Leave blank to keep current)</span>}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.muted }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.password ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder={editingAccount ? "Enter new password (optional)" : "Enter password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={16} style={{ color: colors.muted }} /> : <Eye size={16} style={{ color: colors.muted }} />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.password}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    {roleOptions.map((role) => (
                      <label key={role.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                          style={{ accentColor: colors.primary }}
                        />
                        <span style={{ color: colors.text }}>
                          <span className="mr-1">{role.icon}</span>
                          {role.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formErrors.role && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.role}</p>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingAccount(null);
                      resetForm();
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
                    disabled={saving}
                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#FFFFFF",
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
                        <span>{editingAccount ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <span>{editingAccount ? 'Update Account' : 'Create Account'}</span>
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
                  Delete Account
                </h3>
              </div>
              <p className="mb-4" style={{ color: colors.textLight }}>
                Are you sure you want to delete the account for <strong>{deleteConfirm.name}</strong>? 
                This action cannot be undone.
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
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAccount;