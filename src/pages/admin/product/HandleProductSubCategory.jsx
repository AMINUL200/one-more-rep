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
  Image as ImageIcon,
  Upload,
  FileText
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../../utils/app";

const HandleProductSubCategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    name_meta: "",
    image: null,
    image_alt: "",
    status: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Color Schema
  const colors = {
    primary: "#1B2B4C", // Dark Navy Blue
    primaryHover: "#FFFFFF",
    background: "#FFFFFF",
    cardBg: "#F8F9FA",
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

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categories");
      if (response.data?.status) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await api.get("/admin/subcategories");

      if (response.data?.status) {
        setSubcategories(response.data.data);
        if (response.data.meta) {
          setTotalPages(response.data.meta.last_page);
        }
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories(currentPage, searchTerm);
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1);
        fetchSubcategories(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle form input change
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

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 1 * 1024 * 1024) {
      toast.error('Image size should be less than 1MB');
      return;
    }

    setUploadingImage(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Update form data
    setFormData(prev => ({
      ...prev,
      image: file
    }));

    setUploadingImage(false);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:') || path.startsWith('http')) return path;
    return `${API_URL}/${path}`;
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.category_id) {
      errors.category_id = "Please select a category";
    }
    if (!formData.name.trim()) {
      errors.name = "Subcategory name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Subcategory name must be at least 3 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    const submitData = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        if (key === 'image') {
          if (formData[key] instanceof File) {
            submitData.append('image', formData[key]);
          }
        } else if (key === 'status') {
          submitData.append('status', formData.status ? '1' : '0');
        } else {
          submitData.append(key, formData[key]);
        }
      }
    });

    try {
      let response;
      
      if (editingSubCategory) {
        // Update - use POST with _method PUT for file uploads
        submitData.append('_method', 'PUT');
        response = await api.post(`/admin/subcategories/${editingSubCategory.id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create
        response = await api.post('/admin/subcategories', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data?.status) {
        toast.success(editingSubCategory ? "Subcategory updated successfully" : "Subcategory added successfully");
        setShowModal(false);
        setEditingSubCategory(null);
        setImagePreview(null);
        resetForm();
        fetchSubcategories(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error saving subcategory:", error);
      
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
        toast.error(error.response?.data?.message || "Failed to save subcategory");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      category_id: "",
      name: "",
      name_meta: "",
      image: null,
      image_alt: "",
      status: true,
    });
    setFormErrors({});
  };

  // Handle edit click
  const handleEdit = (subcategory) => {
    setEditingSubCategory(subcategory);
    
    // Set image preview if exists
    if (subcategory.image) {
      setImagePreview(getImageUrl(subcategory.image));
    } else {
      setImagePreview(null);
    }
    
    setFormData({
      category_id: subcategory.category_id,
      name: subcategory.name || "",
      name_meta: subcategory.name_meta || "",
      image: subcategory.image || null,
      image_alt: subcategory.image_alt || "",
      status: subcategory.status === 1 || subcategory.status === true,
    });
    setShowModal(true);
  };

  // Handle add click
  const handleAdd = () => {
    setEditingSubCategory(null);
    setImagePreview(null);
    resetForm();
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/subcategories/${id}`);
      if (response.data?.status) {
        toast.success("Subcategory deleted successfully");
        setDeleteConfirm(null);
        fetchSubcategories(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete subcategory",
      );
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (subcategory) => {
    try {
      const response = await api.patch(
        `/admin/subcategories/${subcategory.id}/status`,
        {
          status: !(subcategory.status === 1 || subcategory.status === true) ? 1 : 0
        },
      );
      if (response.data?.status) {
        toast.success("Status updated successfully");
        fetchSubcategories(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "N/A";
  };

  // Filter subcategories based on search
  const filteredSubcategories = subcategories.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.name_meta?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="p-6 min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Product Subcategories
          </h1>
          <p className="text-sm mt-1" style={{ color: colors.textLight }}>
            Manage your product subcategories
          </p>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group"
          style={{
            backgroundColor: colors.primary,
            color: "#FFFFFF",
            border: `1px solid ${colors.primary}`,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.primaryHover;
            e.target.style.color = colors.primary;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.primary;
            e.target.style.color = "#FFFFFF";
          }}
        >
          <Plus
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span>Add Subcategory</span>
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
            placeholder="Search subcategories or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
              color: colors.text,
            }}
          />
        </div>
      </div>

      {/* Subcategories Table */}
      <div
        className="rounded-lg overflow-hidden shadow-sm"
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead style={{ backgroundColor: colors.cardBg }}>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  ID
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Image
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Category
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Slug
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Meta
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Created At
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center">
                    <Loader
                      className="animate-spin mx-auto"
                      size={30}
                      style={{ color: colors.primary }}
                    />
                  </td>
                </tr>
              ) : filteredSubcategories.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-10 text-center"
                    style={{ color: colors.textLight }}
                  >
                    No subcategories found
                  </td>
                </tr>
              ) : (
                filteredSubcategories.map((subcategory) => (
                  <tr
                    key={subcategory.id}
                    style={{ borderBottom: `1px solid ${colors.border}` }}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: colors.textLight }}
                    >
                      #{subcategory.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subcategory.image ? (
                        <div className="w-10 h-10 rounded border overflow-hidden">
                          <img 
                            src={getImageUrl(subcategory.image)} 
                            alt={subcategory.image_alt || subcategory.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40?text=Error';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <ImageIcon size={16} style={{ color: colors.muted }} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${colors.primary}10`,
                          color: colors.primary,
                        }}
                      >
                        {subcategory.category?.name ||
                          getCategoryName(subcategory.category_id)}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap font-medium"
                      style={{ color: colors.text }}
                    >
                      {subcategory.name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: colors.textLight }}
                    >
                      {subcategory.slug}
                    </td>
                    <td className="px-6 py-4">
                      {subcategory.name_meta ? (
                        <span className="text-xs" style={{ color: colors.textLight }}>
                          {subcategory.name_meta.length > 25 
                            ? subcategory.name_meta.substring(0, 25) + '...' 
                            : subcategory.name_meta}
                        </span>
                      ) : (
                        <span style={{ color: colors.textLight }}>-</span>
                      )}
                      {subcategory.image_alt && (
                        <div className="text-xs mt-1" style={{ color: colors.muted }}>
                          Alt: {subcategory.image_alt.length > 15 
                            ? subcategory.image_alt.substring(0, 15) + '...' 
                            : subcategory.image_alt}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(subcategory)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          subcategory.status === 1 ||
                          subcategory.status === true
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {subcategory.status === 1 || subcategory.status === true
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: colors.textLight }}
                    >
                      {new Date(subcategory.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEdit(subcategory)}
                        className="p-2 rounded-lg mr-2 transition-all duration-300 group"
                        style={{
                          backgroundColor: "transparent",
                          color: colors.primary,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.primary;
                          e.target.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = colors.primary;
                        }}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(subcategory)}
                        className="p-2 rounded-lg transition-all duration-300 group"
                        style={{
                          backgroundColor: "transparent",
                          color: colors.danger,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.danger;
                          e.target.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = colors.danger;
                        }}
                        title="Delete"
                      >
                        <Trash2 size={18} />
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="rounded-lg w-full max-w-md p-6 relative shadow-xl"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                {editingSubCategory
                  ? "Edit Subcategory"
                  : "Add New Subcategory"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingSubCategory(null);
                  setImagePreview(null);
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition-all"
              >
                <X size={20} style={{ color: colors.textLight }} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Category Dropdown */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${formErrors.category_id ? colors.danger : colors.border}`,
                    color: colors.text,
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.category_id && (
                  <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                    {formErrors.category_id}
                  </p>
                )}
              </div>

              {/* Subcategory Name */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${formErrors.name ? colors.danger : colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="Enter subcategory name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Meta Name */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2 flex items-center gap-2"
                  style={{ color: colors.text }}
                >
                  <FileText size={16} style={{ color: colors.primary }} />
                  Meta Name (SEO)
                </label>
                <input
                  type="text"
                  name="name_meta"
                  value={formData.name_meta}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="Enter meta name for SEO"
                />
                <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                  Optional: For SEO purposes
                </p>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2 flex items-center gap-2"
                  style={{ color: colors.text }}
                >
                  <ImageIcon size={16} style={{ color: colors.primary }} />
                  Subcategory Image
                </label>
                <div className="relative">
                  <div 
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-opacity-100 transition-all min-h-[120px] flex items-center justify-center"
                    style={{ borderColor: colors.border }}
                    onClick={() => document.getElementById('subcategory-image-upload').click()}
                  >
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Subcategory Preview" 
                        className="max-h-20 mx-auto object-contain"
                      />
                    ) : (
                      <div>
                        <Upload size={24} className="mx-auto mb-2" style={{ color: colors.muted }} />
                        <p className="text-xs" style={{ color: colors.textLight }}>Click to upload image</p>
                        <p className="text-xs mt-1" style={{ color: colors.muted }}>Max size: 1MB</p>
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    id="subcategory-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                  
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <Loader size={20} className="animate-spin" style={{ color: colors.primary }} />
                    </div>
                  )}
                </div>
                
                {/* Current Image Info (for edit mode) */}
                {editingSubCategory && editingSubCategory.image && !imagePreview && (
                  <div className="mt-2 p-2 border rounded-lg" style={{ borderColor: colors.border }}>
                    <p className="text-xs font-medium mb-1" style={{ color: colors.textLight }}>Current image:</p>
                    <img 
                      src={getImageUrl(editingSubCategory.image)} 
                      alt="Current" 
                      className="h-16 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Image Alt Text */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Image Alt Text
                </label>
                <input
                  type="text"
                  name="image_alt"
                  value={formData.image_alt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="Enter image alt text for accessibility"
                />
                <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                  Optional: Describe the image for accessibility and SEO
                </p>
              </div>

              {/* Status Checkbox */}
              <div className="mb-6">
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
                  Enable to make this subcategory visible to users
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSubCategory(null);
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 rounded-lg transition-all"
                  style={{
                    border: `1px solid ${colors.border}`,
                    color: colors.textLight,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.cardBg;
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
                  className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
                  style={{
                    backgroundColor: colors.primary,
                    color: "#FFFFFF",
                    border: `1px solid ${colors.primary}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.target.style.backgroundColor = colors.primaryHover;
                      e.target.style.color = colors.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      e.target.style.backgroundColor = colors.primary;
                      e.target.style.color = "#FFFFFF";
                    }
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingSubCategory ? "Update" : "Save"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
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
              Are you sure you want to delete subcategory "{deleteConfirm.name}
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg transition-all"
                style={{
                  border: `1px solid ${colors.border}`,
                  color: colors.textLight,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.cardBg;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: colors.danger,
                  color: "#FFFFFF",
                  border: `1px solid ${colors.danger}`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FFFFFF";
                  e.target.style.color = colors.danger;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.danger;
                  e.target.style.color = "#FFFFFF";
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleProductSubCategory;