import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Loader,
  Globe,
  Image as ImageIcon,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Link as LinkIcon,
  FileText,
  Tag,
  Type,
  AlignLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../../utils/app";

const HandleHeroSection = () => {
  const [heroList, setHeroList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    badge_text: "",
    title: "",
    description: "",
    image: null,
    image_alt: "",
    button1_text: "",
    button1_link: "",
    button2_text: "",
    button2_link: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: true,
    sort_order: 0,
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

  // Fetch hero list
  const fetchHeroList = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/banners");
      if (response.data?.status) {
        // Sort by sort_order
        const sortedData = response.data.data.sort(
          (a, b) => a.sort_order - b.sort_order,
        );
        setHeroList(sortedData);
      }
    } catch (error) {
      console.error("Error fetching hero sections:", error);
      toast.error("Failed to load hero sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroList();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
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
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setUploadingImage(false);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
  };

  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("data:") || path.startsWith("http")) return path;
    return `${API_URL}/${path}`;
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (formData.button1_text && !formData.button1_link) {
      errors.button1_link = "Link is required when button text is provided";
    }

    if (formData.button2_text && !formData.button2_link) {
      errors.button2_link = "Link is required when button text is provided";
    }

    if (
      formData.sort_order &&
      (isNaN(formData.sort_order) || formData.sort_order < 0)
    ) {
      errors.sort_order = "Please enter a valid sort order";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);

    const submitData = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        if (key === "image") {
          if (formData[key] instanceof File) {
            submitData.append("image", formData[key]);
          }
        } else if (key === "status") {
          submitData.append("status", formData.status ? "1" : "0");
        } else {
          submitData.append(key, formData[key]);
        }
      }
    });

    try {
      let response;

      if (editingHero) {
        // Update - use POST with _method PUT for file uploads
        // submitData.append('_method', 'PUT');
        response = await api.post(
          `/admin/banners/update/${editingHero.id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        // Create
        response = await api.post("/admin/banners", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data?.status) {
        toast.success(
          editingHero
            ? "Hero section updated successfully"
            : "Hero section added successfully",
        );
        setShowModal(false);
        setEditingHero(null);
        setImagePreview(null);
        setFormData({
          badge_text: "",
          title: "",
          description: "",
          image: null,
          image_alt: "",
          button1_text: "",
          button1_link: "",
          button2_text: "",
          button2_link: "",
          meta_title: "",
          meta_description: "",
          meta_keywords: "",
          status: true,
          sort_order: 0,
        });
        fetchHeroList();
      }
    } catch (error) {
      console.error("Error saving hero section:", error);

      // Handle validation errors
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
          error.response?.data?.message || "Failed to save hero section",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle edit click
  const handleEdit = (hero) => {
    setEditingHero(hero);

    // Set image preview if exists
    if (hero.image) {
      setImagePreview(getImageUrl(hero.image));
    } else {
      setImagePreview(null);
    }

    setFormData({
      badge_text: hero.badge_text || "",
      title: hero.title || "",
      description: hero.description || "",
      image: hero.image || null,
      image_alt: hero.image_alt || "",
      button1_text: hero.button1_text || "",
      button1_link: hero.button1_link || "",
      button2_text: hero.button2_text || "",
      button2_link: hero.button2_link || "",
      meta_title: hero.meta_title || "",
      meta_description: hero.meta_description || "",
      meta_keywords: hero.meta_keywords || "",
      status: hero.status === 1 || hero.status === true,
      sort_order: hero.sort_order || 0,
    });

    setFormErrors({});
    setShowModal(true);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle add click
  const handleAdd = () => {
    setEditingHero(null);
    setImagePreview(null);
    setFormData({
      badge_text: "",
      title: "",
      description: "",
      image: null,
      image_alt: "",
      button1_text: "",
      button1_link: "",
      button2_text: "",
      button2_link: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      status: true,
      sort_order: heroList.length + 1, // Auto-increment sort order
    });
    setFormErrors({});
    setShowModal(true);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/banners/delete/${id}`);
      if (response.data?.status) {
        toast.success("Hero section deleted successfully");
        setDeleteConfirm(null);
        fetchHeroList();
      }
    } catch (error) {
      console.error("Error deleting hero section:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete hero section",
      );
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (hero) => {
    try {
      const response = await api.patch(
        `/admin/hero-sections/${hero.id}/status`,
        {
          status: !(hero.status === 1 || hero.status === true) ? 1 : 0,
        },
      );
      if (response.data?.status) {
        toast.success("Status updated successfully");
        fetchHeroList();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Handle sort order change
  const handleSortOrder = async (id, newOrder) => {
    try {
      const response = await api.patch(
        `/admin/hero-sections/${id}/sort-order`,
        {
          sort_order: newOrder,
        },
      );
      if (response.data?.status) {
        toast.success("Sort order updated");
        fetchHeroList();
      }
    } catch (error) {
      console.error("Error updating sort order:", error);
      toast.error("Failed to update sort order");
    }
  };

  // Filter hero list based on search
  const filteredHeroList = heroList.filter(
    (hero) =>
      hero.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.badge_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <p style={{ color: colors.textLight }}>Loading hero sections...</p>
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
              Hero Sections
            </h1>
            <p className="mt-2 text-sm" style={{ color: colors.textLight }}>
              Manage hero banners for your website
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
            <span>Add New Hero Section</span>
          </button>
        </div>

        {/* Add/Edit Form - Shows at top when modal is open */}
        {showModal && (
          <div
            className="mb-8 bg-white rounded-xl shadow-lg border p-6"
            style={{ borderColor: colors.border }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  {editingHero ? "Edit Hero Section" : "Add New Hero Section"}
                </h2>
                <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                  {editingHero
                    ? `Editing: ${editingHero.title}`
                    : "Create a new hero banner"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingHero(null);
                  setImagePreview(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} style={{ color: colors.textLight }} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Badge Text */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2 flex items-center gap-2"
                      style={{ color: colors.text }}
                    >
                      <Tag size={16} style={{ color: colors.primary }} />
                      Badge Text
                    </label>
                    <input
                      type="text"
                      name="badge_text"
                      value={formData.badge_text}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.badge_text ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="e.g., Premium Gym Equipment"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2 flex items-center gap-2"
                      style={{ color: colors.text }}
                    >
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
                        color: colors.text,
                      }}
                      placeholder="Enter hero title"
                    />
                    {formErrors.title && (
                      <p
                        className="mt-1 text-xs"
                        style={{ color: colors.danger }}
                      >
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2 flex items-center gap-2"
                      style={{ color: colors.text }}
                    >
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
                        color: colors.text,
                      }}
                      placeholder="Enter hero description"
                    />
                    {formErrors.description && (
                      <p
                        className="mt-1 text-xs"
                        style={{ color: colors.danger }}
                      >
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2 flex items-center gap-2"
                      style={{ color: colors.text }}
                    >
                      <ImageIcon size={16} style={{ color: colors.primary }} />
                      Hero Image
                    </label>
                    <div className="relative">
                      <div
                        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-opacity-100 transition-all min-h-[150px] flex items-center justify-center"
                        style={{ borderColor: colors.border }}
                        onClick={() =>
                          document.getElementById("hero-image-upload").click()
                        }
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Hero Preview"
                            className="max-h-32 mx-auto object-contain"
                          />
                        ) : (
                          <div>
                            <Upload
                              size={32}
                              className="mx-auto mb-2"
                              style={{ color: colors.muted }}
                            />
                            <p
                              className="text-sm"
                              style={{ color: colors.textLight }}
                            >
                              Click to upload hero image
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
                        id="hero-image-upload"
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
                          <Loader
                            size={20}
                            className="animate-spin"
                            style={{ color: colors.primary }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Current Image Info (for edit mode) */}
                    {editingHero && editingHero.image && !imagePreview && (
                      <div
                        className="mt-2 p-2 border rounded-lg"
                        style={{ borderColor: colors.border }}
                      >
                        <p
                          className="text-xs font-medium mb-1"
                          style={{ color: colors.textLight }}
                        >
                          Current image:
                        </p>
                        <img
                          src={getImageUrl(editingHero.image)}
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
                      placeholder="Enter image alt text for SEO"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Button 1 */}
                  <div
                    className="p-4 border rounded-lg"
                    style={{ borderColor: colors.border }}
                  >
                    <h3
                      className="text-md font-medium mb-3 flex items-center gap-2"
                      style={{ color: colors.text }}
                    >
                      <LinkIcon size={16} style={{ color: colors.primary }} />
                      Primary Button
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="button1_text"
                        value={formData.button1_text}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                        placeholder="Button text (e.g., Shop Now)"
                      />
                      <input
                        type="text"
                        name="button1_link"
                        value={formData.button1_link}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${formErrors.button1_link ? colors.danger : colors.border}`,
                          color: colors.text,
                        }}
                        placeholder="Button link (e.g., /shop)"
                      />
                      {formErrors.button1_link && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: colors.danger }}
                        >
                          {formErrors.button1_link}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Button 2 */}
                  <div
                    className="p-4 border rounded-lg"
                    style={{ borderColor: colors.border }}
                  >
                    <h3
                      className="text-md font-medium mb-3 flex items-center gap-2"
                      style={{ color: colors.text }}
                    >
                      <LinkIcon size={16} style={{ color: colors.primary }} />
                      Secondary Button
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="button2_text"
                        value={formData.button2_text}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                        placeholder="Button text (e.g., View Products)"
                      />
                      <input
                        type="text"
                        name="button2_link"
                        value={formData.button2_link}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${formErrors.button2_link ? colors.danger : colors.border}`,
                          color: colors.text,
                        }}
                        placeholder="Button link (e.g., /products)"
                      />
                      {formErrors.button2_link && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: colors.danger }}
                        >
                          {formErrors.button2_link}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SEO Fields */}
                  <div
                    className="p-4 border rounded-lg"
                    style={{ borderColor: colors.border }}
                  >
                    <h3
                      className="text-md font-medium mb-3 flex items-center gap-2"
                      style={{ color: colors.text }}
                    >
                      <FileText size={16} style={{ color: colors.primary }} />
                      SEO Settings
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="meta_title"
                        value={formData.meta_title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                        placeholder="Meta title (SEO)"
                      />
                      <textarea
                        name="meta_description"
                        value={formData.meta_description}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                        placeholder="Meta description (SEO)"
                      />
                      <input
                        type="text"
                        name="meta_keywords"
                        value={formData.meta_keywords}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                        placeholder="Meta keywords (comma separated)"
                      />
                    </div>
                  </div>

                  {/* Status and Sort Order */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: colors.text }}
                      >
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
                          color: colors.text,
                        }}
                        min="0"
                        step="1"
                      />
                      {formErrors.sort_order && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: colors.danger }}
                        >
                          {formErrors.sort_order}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: colors.text }}
                      >
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
                            accentColor: colors.primary,
                          }}
                        />
                        <span style={{ color: colors.text }}>Active</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div
                className="flex justify-end gap-3 pt-4 border-t"
                style={{ borderColor: colors.border }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingHero(null);
                    setImagePreview(null);
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingHero ? "Update" : "Save"}</span>
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

        {/* Hero List Table */}
        <div
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
          style={{ borderColor: colors.border }}
        >
          <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead style={{ backgroundColor: colors.background }}>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Sort
                  </th>
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
                    Badge
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Title
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Description
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Buttons
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.textLight }}
                  >
                    Status
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
                {filteredHeroList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-10 text-center"
                      style={{ color: colors.textLight }}
                    >
                      No hero sections found
                    </td>
                  </tr>
                ) : (
                  filteredHeroList.map((hero) => (
                    <tr
                      key={hero.id}
                      style={{ borderBottom: `1px solid ${colors.border}` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleSortOrder(hero.id, hero.sort_order - 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            disabled={hero.sort_order === 1}
                          >
                            <ArrowUp
                              size={14}
                              style={{
                                color:
                                  hero.sort_order === 1
                                    ? colors.muted
                                    : colors.primary,
                              }}
                            />
                          </button>
                          <span
                            className="text-sm font-medium"
                            style={{ color: colors.text }}
                          >
                            {hero.sort_order}
                          </span>
                          <button
                            onClick={() =>
                              handleSortOrder(hero.id, hero.sort_order + 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            disabled={hero.sort_order === heroList.length}
                          >
                            <ArrowDown
                              size={14}
                              style={{
                                color:
                                  hero.sort_order === heroList.length
                                    ? colors.muted
                                    : colors.primary,
                              }}
                            />
                          </button>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        style={{ color: colors.textLight }}
                      >
                        #{hero.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hero.image ? (
                          <div className="w-10 h-10 rounded border overflow-hidden">
                            <img
                              src={getImageUrl(hero.image)}
                              alt={hero.image_alt || hero.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/40?text=Error";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                            <ImageIcon
                              size={16}
                              style={{ color: colors.muted }}
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hero.badge_text ? (
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: `${colors.primary}10`,
                              color: colors.primary,
                            }}
                          >
                            {hero.badge_text}
                          </span>
                        ) : (
                          <span style={{ color: colors.textLight }}>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="font-medium"
                          style={{ color: colors.text }}
                        >
                          {truncateText(hero.title, 30)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="text-sm"
                          style={{ color: colors.textLight }}
                        >
                          {truncateText(hero.description, 40)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {hero.button1_text || hero.button2_text ? (
                          <div className="space-y-1">
                            {hero.button1_text && (
                              <div className="text-xs">
                                <span className="font-medium">1:</span>{" "}
                                {hero.button1_text}
                              </div>
                            )}
                            {hero.button2_text && (
                              <div className="text-xs">
                                <span className="font-medium">2:</span>{" "}
                                {hero.button2_text}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: colors.textLight }}>-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(hero)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            hero.status === 1 || hero.status === true
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {hero.status === 1 || hero.status === true
                            ? "Active"
                            : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleEdit(hero)}
                          className="p-2 rounded-lg mr-2 transition-all hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit2 size={16} style={{ color: colors.primary }} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(hero)}
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
                <h3
                  className="text-lg font-bold"
                  style={{ color: colors.text }}
                >
                  Delete Hero Section
                </h3>
              </div>

              <p className="mb-4" style={{ color: colors.textLight }}>
                Are you sure you want to delete hero section "
                {deleteConfirm.title}"? This action cannot be undone.
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

export default HandleHeroSection;
