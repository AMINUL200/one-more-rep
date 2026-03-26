import React, { useState, useEffect } from "react";
import {
  Info,
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
  Save,
  RefreshCw,
  Calendar,
  User,
  Globe,
  FileText,
  Tag,
  Heading,
  AlignLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import CustomTextEditor from "../../../component/form/TextEditor";
import { api } from "../../../utils/app";

const MangeAbout = () => {
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pageImagePreview, setPageImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPageImage, setUploadingPageImage] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [pageImageError, setPageImageError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPageOptions = [5, 10, 20, 50, 100];

  // Form state
  const [formData, setFormData] = useState({
    page_name: "",
    page_desc: "",
    page_image: null,
    heading: "",
    badge_text: "",
    heading_meta: "",
    description: "",
    desc_meta: "",
    image: null,
    image_alt: "",
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

  // Fetch about data
  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/about");
      if (response.data?.status) {
        setAboutData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      toast.error("Failed to load about page data");
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  useEffect(() => {
    // No filtering needed as there's only one about page entry
  }, [searchTerm, aboutData]);

  // Update pagination
  useEffect(() => {
    const total = Math.ceil(aboutData.length / itemsPerPage);
    setTotalPages(total);
    if (currentPage > total) {
      setCurrentPage(1);
    }
  }, [aboutData, itemsPerPage, currentPage]);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return aboutData.slice(startIndex, endIndex);
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

  // Validate image (max 2MB)
  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(false);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        reject("Image size must be less than 2MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        reject("Please select a valid image file");
        return;
      }

      resolve(true);
    });
  };

  // Handle page image change
  const handlePageImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPageImage(true);
    setPageImageError(null);

    try {
      await validateImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPageImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData((prev) => ({ ...prev, page_image: file }));
    } catch (error) {
      setPageImageError(error);
      toast.error(error);
    } finally {
      setUploadingPageImage(false);
    }
  };

  // Handle section image change
  const handleSectionImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setImageError(null);

    try {
      await validateImage(file);

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

  // Remove page image
  const handleRemovePageImage = () => {
    setPageImagePreview(null);
    setPageImageError(null);
    setFormData((prev) => ({ ...prev, page_image: null }));
  };

  // Remove section image
  const handleRemoveSectionImage = () => {
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    if (!formData.page_desc.trim()) {
      errors.page_desc = "Page description is required";
    }
    if (!formData.heading.trim()) {
      errors.heading = "Heading is required";
    }
    if (!formData.badge_text.trim()) {
      errors.badge_text = "Badge text is required";
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
      if (key === "page_image" && formData[key] instanceof File) {
        submitData.append("page_image", formData[key]);
      } else if (key === "image" && formData[key] instanceof File) {
        submitData.append("image", formData[key]);
      } else if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    try {
      let response;
      if (editingItem) {
        // submitData.append("_method", "PUT");
        response = await api.post(`/admin/about/${editingItem.id}`, submitData);
      } else {
        response = await api.post("/admin/about", submitData);
      }

      if (response.data?.status) {
        toast.success(
          editingItem
            ? "About page updated successfully"
            : "About page created successfully",
        );
        setShowForm(false);
        setEditingItem(null);
        resetForm();
        fetchAboutData();
      }
    } catch (error) {
      console.error("Error saving about page:", error);
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || {};
        const formattedErrors = {};
        Object.keys(validationErrors).forEach((key) => {
          formattedErrors[key] = validationErrors[key][0];
        });
        setFormErrors(formattedErrors);
        toast.error("Please check the form for errors");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to save about page",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      page_name: item.page_name || "",
      page_desc: item.page_desc || "",
      page_image: null,
      heading: item.heading || "",
      badge_text: item.badge_text || "",
      heading_meta: item.heading_meta || "",
      description: item.description || "",
      desc_meta: item.desc_meta || "",
      image: null,
      image_alt: item.image_alt || "",
    });

    if (item.page_image) {
      setPageImagePreview(getImageUrl(item.page_image));
    } else {
      setPageImagePreview(null);
    }

    if (item.image) {
      setImagePreview(getImageUrl(item.image));
    } else {
      setImagePreview(null);
    }

    setImageError(null);
    setPageImageError(null);
    setFormErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle add
  const handleAdd = () => {
    setEditingItem(null);
    resetForm();
    setFormErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      page_name: "",
      page_desc: "",
      page_image: null,
      heading: "",
      badge_text: "",
      heading_meta: "",
      description: "",
      desc_meta: "",
      image: null,
      image_alt: "",
    });
    setPageImagePreview(null);
    setImagePreview(null);
    setImageError(null);
    setPageImageError(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/about/${id}`);
      if (response.data?.status) {
        toast.success("About page deleted successfully");
        setDeleteConfirm(null);
        fetchAboutData();
      }
    } catch (error) {
      console.error("Error deleting about page:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete about page",
      );
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
          <p style={{ color: colors.textLight }}>Loading about page data...</p>
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
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ color: colors.text }}
            >
              About Page Management
            </h1>
            <p className="text-lg mt-2" style={{ color: colors.textLight }}>
              Manage the about page content
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
            Add New About Page
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div
            className="mb-8 rounded-xl shadow-sm border p-6"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  {editingItem ? "Edit About Page" : "Add New About Page"}
                </h2>
                <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                  {editingItem
                    ? "Update about page content"
                    : "Create a new about page"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} style={{ color: colors.textLight }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Page Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Page Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: colors.textLight }}
                  />
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
                    placeholder="e.g., About One Rep More"
                  />
                </div>
                {formErrors.page_name && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                    {formErrors.page_name}
                  </p>
                )}
              </div>

              {/* Page Description */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Page Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="page_desc"
                  value={formData.page_desc}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${formErrors.page_desc ? colors.danger : colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="Brief description of the about page"
                />
                {formErrors.page_desc && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                    {formErrors.page_desc}
                  </p>
                )}
              </div>

              {/* Page Image */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Page Image
                </label>
                <div className="relative">
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-opacity-100 transition-all min-h-[150px] flex items-center justify-center"
                    style={{
                      borderColor: pageImageError
                        ? colors.danger
                        : colors.border,
                    }}
                    onClick={() =>
                      document.getElementById("page-image-upload").click()
                    }
                  >
                    {pageImagePreview ? (
                      <img
                        src={pageImagePreview}
                        alt="Page Preview"
                        className="max-h-32 mx-auto object-contain"
                      />
                    ) : (
                      <div>
                        <Upload
                          size={32}
                          className="mx-auto mb-2"
                          style={{ color: colors.textLight }}
                        />
                        <p
                          className="text-sm"
                          style={{ color: colors.textLight }}
                        >
                          Click to upload page image
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.muted }}
                        >
                          Max size: 2MB
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    id="page-image-upload"
                    accept="image/*"
                    onChange={handlePageImageChange}
                    className="hidden"
                  />

                  {pageImagePreview && (
                    <button
                      type="button"
                      onClick={handleRemovePageImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {uploadingPageImage && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <Loader
                        size={20}
                        className="animate-spin"
                        style={{ color: colors.primary }}
                      />
                    </div>
                  )}
                </div>

                {pageImageError && (
                  <div
                    className="mt-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: `${colors.danger}10`,
                      border: `1px solid ${colors.danger}30`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        size={14}
                        style={{ color: colors.danger }}
                        className="mt-0.5"
                      />
                      <p className="text-xs" style={{ color: colors.danger }}>
                        {pageImageError}
                      </p>
                    </div>
                  </div>
                )}

                {editingItem && editingItem.page_image && !pageImagePreview && (
                  <div
                    className="mt-2 p-2 border rounded-lg"
                    style={{ borderColor: colors.border }}
                  >
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: colors.textLight }}
                    >
                      Current page image:
                    </p>
                    <img
                      src={getImageUrl(editingItem.page_image)}
                      alt="Current"
                      className="h-16 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Badge Text */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Badge Text <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: colors.textLight }}
                  />
                  <input
                    type="text"
                    name="badge_text"
                    value={formData.badge_text}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.badge_text ? colors.danger : colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="e.g., OUR STORY, ABOUT US"
                  />
                </div>
                {formErrors.badge_text && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                    {formErrors.badge_text}
                  </p>
                )}
              </div>

              {/* Heading */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Heading <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Heading
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: colors.textLight }}
                  />
                  <input
                    type="text"
                    name="heading"
                    value={formData.heading}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.heading ? colors.danger : colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="Main heading for the about section"
                  />
                </div>
                {formErrors.heading && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                    {formErrors.heading}
                  </p>
                )}
              </div>

              {/* Heading Meta */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Heading Meta (SEO)
                </label>
                <input
                  type="text"
                  name="heading_meta"
                  value={formData.heading_meta}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="SEO meta for heading"
                />
              </div>

              {/* Description (Rich Text) */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <CustomTextEditor
                  value={formData.description}
                  onChange={(content) =>
                    setFormData((prev) => ({ ...prev, description: content }))
                  }
                  height={300}
                  placeholder="Enter detailed description about your company..."
                />
                {formErrors.description && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Description Meta */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Description Meta (SEO)
                </label>
                <textarea
                  name="desc_meta"
                  value={formData.desc_meta}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="SEO meta description"
                />
              </div>

              {/* Section Image */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Section Image
                </label>
                <div className="relative">
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-opacity-100 transition-all min-h-[150px] flex items-center justify-center"
                    style={{
                      borderColor: imageError ? colors.danger : colors.border,
                    }}
                    onClick={() =>
                      document.getElementById("section-image-upload").click()
                    }
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Section Preview"
                        className="max-h-32 mx-auto object-contain"
                      />
                    ) : (
                      <div>
                        <Upload
                          size={32}
                          className="mx-auto mb-2"
                          style={{ color: colors.textLight }}
                        />
                        <p
                          className="text-sm"
                          style={{ color: colors.textLight }}
                        >
                          Click to upload section image
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.muted }}
                        >
                          Max size: 2MB
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    id="section-image-upload"
                    accept="image/*"
                    onChange={handleSectionImageChange}
                    className="hidden"
                  />

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveSectionImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <Loader
                        size={20}
                        className="animate-spin"
                        style={{ color: colors.primary }}
                      />
                    </div>
                  )}
                </div>

                {imageError && (
                  <div
                    className="mt-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: `${colors.danger}10`,
                      border: `1px solid ${colors.danger}30`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        size={14}
                        style={{ color: colors.danger }}
                        className="mt-0.5"
                      />
                      <p className="text-xs" style={{ color: colors.danger }}>
                        {imageError}
                      </p>
                    </div>
                  </div>
                )}

                {editingItem && editingItem.image && !imagePreview && (
                  <div
                    className="mt-2 p-2 border rounded-lg"
                    style={{ borderColor: colors.border }}
                  >
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: colors.textLight }}
                    >
                      Current section image:
                    </p>
                    <img
                      src={getImageUrl(editingItem.image)}
                      alt="Current"
                      className="h-16 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Image Alt Text */}
              <div>
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
                  placeholder="SEO friendly alt text for image"
                />
              </div>

              {/* Form Actions */}
              <div
                className="flex justify-end gap-3 pt-4 border-t"
                style={{ borderColor: colors.border }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg border transition-colors"
                  style={{
                    borderColor: colors.border,
                    color: colors.textLight,
                  }}
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
                      <span>{editingItem ? "Update" : "Create"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* About Page Table */}
        <div
          className="rounded-xl overflow-hidden shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ backgroundColor: `${colors.background}` }}>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: colors.textLight }}
                  >
                    ID
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: colors.textLight }}
                  >
                    Page Name
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: colors.textLight }}
                  >
                    Badge
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: colors.textLight }}
                  >
                    Heading
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: colors.textLight }}
                  >
                    Page Image
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: colors.textLight }}
                  >
                    Section Image
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold"
                    style={{ color: colors.textLight }}
                  >
                    Created
                  </th>
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold"
                    style={{ color: colors.textLight }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t"
                    style={{ borderColor: colors.border }}
                  >
                    <td className="px-6 py-4">
                      <span
                        className="font-mono text-sm"
                        style={{ color: colors.textLight }}
                      >
                        #{item.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="font-medium"
                        style={{ color: colors.text }}
                      >
                        {item.page_name}
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: colors.textLight }}
                      >
                        {truncateText(item.page_desc, 40)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${colors.primary}10`,
                          color: colors.primary,
                        }}
                      >
                        {item.badge_text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="font-medium"
                        style={{ color: colors.text }}
                      >
                        {truncateText(item.heading, 35)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.page_image ? (
                        <div className="w-10 h-10 rounded border overflow-hidden">
                          <img
                            src={getImageUrl(item.page_image)}
                            alt={item.image_alt || item.page_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <ImageIcon
                            size={16}
                            style={{ color: colors.textLight }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.image ? (
                        <div className="w-10 h-10 rounded border overflow-hidden">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.image_alt || item.page_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <ImageIcon
                            size={16}
                            style={{ color: colors.textLight }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm"
                        style={{ color: colors.textLight }}
                      >
                        {formatDate(item.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg mr-2 transition-colors hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit2 size={16} style={{ color: colors.primary }} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item)}
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
              <Info
                size={48}
                className="mx-auto mb-4"
                style={{ color: colors.textLight }}
              />
              <p style={{ color: colors.textLight }}>
                No about page data found
              </p>
            </div>
          )}

          {/* Pagination */}
          {aboutData.length > 0 && (
            <div
              className="px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: colors.textLight }}>
                  Show:
                </span>
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
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="text-sm" style={{ color: colors.textLight }}>
                  entries
                </span>
              </div>

              <div className="text-sm" style={{ color: colors.textLight }}>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, aboutData.length)} of{" "}
                {aboutData.length} entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                  style={{ borderColor: colors.border }}
                >
                  <ChevronLeft size={16} className="rotate-90" />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                  style={{ borderColor: colors.border }}
                >
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
                          currentPage === pageNum
                            ? "text-white"
                            : "hover:bg-gray-50"
                        }`}
                        style={{
                          backgroundColor:
                            currentPage === pageNum
                              ? colors.primary
                              : "transparent",
                          borderColor: colors.border,
                          color:
                            currentPage === pageNum
                              ? "#FFFFFF"
                              : colors.textLight,
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
                  className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                  style={{ borderColor: colors.border }}
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                  style={{ borderColor: colors.border }}
                >
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
              <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                Delete About Page
              </h3>
            </div>
            <p className="mb-4" style={{ color: colors.textLight }}>
              Are you sure you want to delete the about page "
              <strong>{deleteConfirm.page_name}</strong>"? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border rounded-lg transition-colors"
                style={{ borderColor: colors.border, color: colors.textLight }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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

export default MangeAbout;
