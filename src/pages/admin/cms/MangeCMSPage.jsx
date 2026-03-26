import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Loader,
  Image as ImageIcon,
  Upload,
  Eye,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  RefreshCw,
  Calendar,
  User,
  Globe,
  Link2,
  Info,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import CustomTextEditor from "../../../component/form/TextEditor";
import { api } from "../../../utils/app";

const MangeCMSPage = () => {
  const [cmsPages, setCmsPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPageOptions = [5, 10, 20, 50, 100];

  // Form state
  const [formData, setFormData] = useState({
    page_name: "",
    page_heading: "",
    short_desc: "",
    description: "",
    image: null,
    image_alt: "",
    image_align: "center",
    status: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Color Schema
  const colors = {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    background: "#f3f4f6",
    cardBg: "#ffffff",
    border: "#e5e7eb",
    text: "#111827",
    textLight: "#6b7280",
    muted: "#6b7280",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
  };

  // Image alignment options
  const imageAlignOptions = [
    { value: "left", label: "Left", icon: AlignLeft },
    { value: "center", label: "Center", icon: AlignCenter },
    { value: "right", label: "Right", icon: AlignRight },
  ];

  // Fetch CMS pages
  useEffect(() => {
    fetchCMSPages();
  }, []);

  const fetchCMSPages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/cms-pages");
      if (response.data?.status) {
        setCmsPages(response.data.data);
        setFilteredPages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching CMS pages:", error);
      toast.error("Failed to load CMS pages");
    } finally {
      setLoading(false);
    }
  };

  // Filter pages
  useEffect(() => {
    let filtered = [...cmsPages];
    if (searchTerm) {
      filtered = filtered.filter(
        (page) =>
          page.page_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.page_heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPages(filtered);
  }, [searchTerm, cmsPages]);

  // Update pagination
  useEffect(() => {
    const total = Math.ceil(filteredPages.length / itemsPerPage);
    setTotalPages(total);
    if (currentPage > total) {
      setCurrentPage(1);
    }
  }, [filteredPages, itemsPerPage, currentPage]);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPages.slice(startIndex, endIndex);
  };

  const currentItems = getCurrentPageItems();

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Validate image (16:9 ratio and file size)
  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(false);
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        reject("Image size must be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        reject("Please select a valid image file");
        return;
      }

      
    });
  };

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setImageError(null);

    try {
    //   await validateImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData((prev) => ({ ...prev, image: file }));
    } catch (error) {
      setImageError(error);
      toast.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageError(null);
    setFormData((prev) => ({ ...prev, image: null }));
  };

  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("data:") || path.startsWith("http")) return path;
    const storageUrl = import.meta.env.VITE_STORAGE_URL || "";
    return `${storageUrl}/${path}`;
  };

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

    if (!formData.page_name.trim()) {
      errors.page_name = "Page name is required";
    }
    if (!formData.page_heading.trim()) {
      errors.page_heading = "Page heading is required";
    }
    if (!formData.short_desc.trim()) {
      errors.short_desc = "Short description is required";
    }
    if (!formData.description) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "status") {
        submitData.append("status", formData.status ? "1" : "0");
      } else if (key === "image" && formData[key] instanceof File) {
        submitData.append("image", formData[key]);
      } else if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    try {
      let response;
      if (editingPage) {
        // submitData.append("_method", "PUT");
        response = await api.post(`/admin/cms-pages/${editingPage.id}`, submitData);
      } else {
        response = await api.post("/admin/cms-pages", submitData);
      }

      if (response.data?.status) {
        toast.success(
          editingPage
            ? "CMS page updated successfully"
            : "CMS page created successfully"
        );
        setShowModal(false);
        setEditingPage(null);
        resetForm();
        fetchCMSPages();
      }
    } catch (error) {
      console.error("Error saving CMS page:", error);
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || {};
        const formattedErrors = {};
        Object.keys(validationErrors).forEach((key) => {
          formattedErrors[key] = validationErrors[key][0];
        });
        setFormErrors(formattedErrors);
        toast.error("Please check the form for errors");
      } else {
        toast.error(error.response?.data?.message || "Failed to save CMS page");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      page_name: page.page_name || "",
      page_heading: page.page_heading || "",
      short_desc: page.short_desc || "",
      description: page.description || "",
      image: null,
      image_alt: page.image_alt || "",
      image_align: page.image_align || "center",
      status: page.status === 1,
    });
    if (page.image) {
      setImagePreview(getImageUrl(page.image));
    } else {
      setImagePreview(null);
    }
    setImageError(null);
    setFormErrors({});
    setShowModal(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle add
  const handleAdd = () => {
    setEditingPage(null);
    resetForm();
    setFormErrors({});
    setShowModal(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      page_name: "",
      page_heading: "",
      short_desc: "",
      description: "",
      image: null,
      image_alt: "",
      image_align: "center",
      status: true,
    });
    setImagePreview(null);
    setImageError(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/cms-pages/${id}`);
      if (response.data?.status) {
        toast.success("CMS page deleted successfully");
        setDeleteConfirm(null);
        fetchCMSPages();
      }
    } catch (error) {
      console.error("Error deleting CMS page:", error);
      toast.error(error.response?.data?.message || "Failed to delete CMS page");
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (page) => {
    try {
      const response = await api.patch(`/admin/cms-pages/${page.id}/status`, {
        status: page.status === 1 ? 0 : 1,
      });
      if (response.data?.status) {
        toast.success("Status updated successfully");
        fetchCMSPages();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Truncate text
  const truncateText = (text, length = 50) => {
    if (!text) return "-";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (loading) {
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
          <p style={{ color: colors.textLight }}>Loading CMS pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4 md:px-8"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: colors.text }}>
              CMS Page Management
            </h1>
            <p className="text-lg mt-2" style={{ color: colors.textLight }}>
              Create and manage content pages for your website
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:shadow-md"
            style={{
              backgroundColor: colors.primary,
              color: "#FFFFFF",
            }}
          >
            <Plus size={18} />
            Add New Page
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: colors.textLight }}
            />
            <input
              type="text"
              placeholder="Search by name, heading or slug..."
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

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div
              className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl"
              style={{ backgroundColor: colors.cardBg }}
            >
              {/* Modal Header */}
              <div
                className="sticky top-0 p-6 border-b flex justify-between items-center"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
              >
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                    {editingPage ? "Edit CMS Page" : "Add New CMS Page"}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                    {editingPage ? "Update page content" : "Create a new content page"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingPage(null);
                    resetForm();
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} style={{ color: colors.textLight }} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Page Name */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Page Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textLight }} />
                    <input
                      type="text"
                      name="page_name"
                      value={formData.page_name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.page_name ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="e.g., About Us, Privacy Policy, Terms of Service"
                    />
                  </div>
                  {formErrors.page_name && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.page_name}</p>
                  )}
                </div>

                {/* Page Heading */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Page Heading <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="page_heading"
                    value={formData.page_heading}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.page_heading ? colors.danger : colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="Main heading for the page"
                  />
                  {formErrors.page_heading && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.page_heading}</p>
                  )}
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="short_desc"
                    value={formData.short_desc}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.short_desc ? colors.danger : colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="Brief description for meta and preview"
                  />
                  {formErrors.short_desc && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.short_desc}</p>
                  )}
                </div>

                {/* Description (Rich Text) */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Full Description <span className="text-red-500">*</span>
                  </label>
                  <CustomTextEditor
                    value={formData.description}
                    onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
                    height={300}
                    placeholder="Enter detailed page content..."
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.description}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Page Image
                  </label>
                  <div className="relative">
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-opacity-100 transition-all min-h-[150px] flex items-center justify-center"
                      style={{ borderColor: imageError ? colors.danger : colors.border }}
                      onClick={() => document.getElementById("cms-image-upload").click()}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-32 mx-auto object-contain"
                        />
                      ) : (
                        <div>
                          <Upload size={32} className="mx-auto mb-2" style={{ color: colors.textLight }} />
                          <p className="text-sm" style={{ color: colors.textLight }}>Click to upload image</p>
                          <p className="text-xs mt-1" style={{ color: colors.muted }}>Max size: 2MB • 16:9 ratio (1920x1080 recommended)</p>
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      id="cms-image-upload"
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

                  {imageError && (
                    <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: `${colors.danger}10`, border: `1px solid ${colors.danger}30` }}>
                      <div className="flex items-start gap-2">
                        <AlertCircle size={14} style={{ color: colors.danger }} className="mt-0.5" />
                        <p className="text-xs" style={{ color: colors.danger }}>{imageError}</p>
                      </div>
                    </div>
                  )}

                  {editingPage && editingPage.image && !imagePreview && (
                    <div className="mt-2 p-2 border rounded-lg" style={{ borderColor: colors.border }}>
                      <p className="text-xs font-medium mb-1" style={{ color: colors.textLight }}>Current image:</p>
                      <img src={getImageUrl(editingPage.image)} alt="Current" className="h-16 object-contain" />
                    </div>
                  )}
                </div>

                {/* Image Alt Text */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
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
                    placeholder="SEO friendly alt text for image"
                  />
                </div>

                {/* Image Alignment */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Image Alignment
                  </label>
                  <div className="flex gap-3">
                    {imageAlignOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = formData.image_align === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image_align: option.value }))}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            isActive
                              ? "text-white"
                              : "border hover:bg-gray-50"
                          }`}
                          style={{
                            backgroundColor: isActive ? colors.primary : "transparent",
                            borderColor: colors.border,
                            color: isActive ? "#FFFFFF" : colors.text,
                          }}
                        >
                          <Icon size={16} />
                          {option.label}
                        </button>
                      );
                    })}
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
                      style={{ accentColor: colors.primary }}
                    />
                    <span style={{ color: colors.text }}>Active Status</span>
                  </label>
                  <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                    Enable to make this page visible on the website
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPage(null);
                      resetForm();
                    }}
                    className="px-4 py-2 rounded-lg border transition-colors"
                    style={{ borderColor: colors.border, color: colors.textLight }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-all hover:shadow-md disabled:opacity-50"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {submitting ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{editingPage ? "Update Page" : "Create Page"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CMS Pages Table */}
        <div
          className="rounded-xl overflow-hidden shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ backgroundColor: `${colors.background}` }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Page Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Heading</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Created</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: colors.textLight }}>Actions</th>
                 </tr>
              </thead>
              <tbody>
                {currentItems.map((page) => (
                  <tr key={page.id} className="border-t" style={{ borderColor: colors.border }}>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm" style={{ color: colors.textLight }}>#{page.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium" style={{ color: colors.text }}>{page.page_name}</div>
                     </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: colors.textLight }}>{page.slug}</div>
                     </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: colors.text }}>{truncateText(page.page_heading, 30)}</div>
                     </td>
                    <td className="px-6 py-4">
                      {page.image ? (
                        <div className="w-10 h-10 rounded border overflow-hidden">
                          <img
                            src={getImageUrl(page.image)}
                            alt={page.image_alt || page.page_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <ImageIcon size={16} style={{ color: colors.textLight }} />
                        </div>
                      )}
                     </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusToggle(page)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          page.status === 1
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {page.status === 1 ? "Active" : "Inactive"}
                      </button>
                     </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: colors.textLight }}>{formatDate(page.created_at)}</div>
                     </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(page)}
                        className="p-2 rounded-lg mr-2 transition-colors hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit2 size={16} style={{ color: colors.primary }} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(page)}
                        className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                        title="Delete"
                      >
                        <Trash2 size={16} style={{ color: colors.danger }} />
                      </button>
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {currentItems.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4" style={{ color: colors.textLight }} />
              <p style={{ color: colors.textLight }}>No CMS pages found</p>
            </div>
          )}

          {/* Pagination */}
          {filteredPages.length > 0 && (
            <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: colors.border }}>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: colors.textLight }}>Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-1 rounded-lg border focus:outline-none focus:ring-2 text-sm"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  {itemsPerPageOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <span className="text-sm" style={{ color: colors.textLight }}>entries</span>
              </div>

              <div className="text-sm" style={{ color: colors.textLight }}>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPages.length)} of {filteredPages.length} pages
              </div>

              <div className="flex items-center gap-2">
                <button onClick={goToFirstPage} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50" style={{ borderColor: colors.border }}>
                  <ChevronLeft size={16} className="rotate-90" />
                </button>
                <button onClick={goToPreviousPage} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50" style={{ borderColor: colors.border }}>
                  <ChevronLeft size={16} />
                </button>
                
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
                          currentPage === pageNum ? "text-white" : "hover:bg-gray-50"
                        }`}
                        style={{
                          backgroundColor: currentPage === pageNum ? colors.primary : "transparent",
                          borderColor: colors.border,
                          color: currentPage === pageNum ? "#FFFFFF" : colors.textLight,
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50" style={{ borderColor: colors.border }}>
                  <ChevronRight size={16} />
                </button>
                <button onClick={goToLastPage} disabled={currentPage === totalPages} className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50" style={{ borderColor: colors.border }}>
                  <ChevronRight size={16} className="rotate-90" />
                </button>
              </div>
            </div>
          )}
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
              <h3 className="text-lg font-bold" style={{ color: colors.text }}>Delete CMS Page</h3>
            </div>
            <p className="mb-4" style={{ color: colors.textLight }}>
              Are you sure you want to delete the page "<strong>{deleteConfirm.page_name}</strong>"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-lg transition-colors" style={{ borderColor: colors.border, color: colors.textLight }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangeCMSPage;