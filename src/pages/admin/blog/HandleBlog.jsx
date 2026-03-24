// pages/admin/HandleBlog.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Power,
  Image as ImageIcon,
  Upload,
  Link2,
  Youtube,
  FileText,
  Calendar,
  Globe,
  Smartphone,
  AlignLeft,
  Type,
  Hash,
  ExternalLink,
} from "lucide-react";
import { api } from "../../../utils/app";
import { toast } from "react-toastify";
import CustomTextEditor from "../../../component/form/TextEditor";
// import toast from 'react-hot-toast';

const HandleBlog = () => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  console.log("url :: ", STORAGE_URL);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 10;

  // File previews
  const [webImagePreview, setWebImagePreview] = useState(null);
  const [mobileImagePreview, setMobileImagePreview] = useState(null);
  const [webImageFile, setWebImageFile] = useState(null);
  const [mobileImageFile, setMobileImageFile] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    title_slug: "",
    title_meta: "",
    short_desc: "",
    short_desc_meta: "",
    long_desc: "",
    long_desc_meta: "",
    image_alt: "",
    youtube_link: "",
    is_active: true,
  });

  const [formErrors, setFormErrors] = useState({});

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
  };

  // Handle title change to auto-generate slug
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: title,
      title_slug: generateSlug(title),
    }));
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/admin/blogs");

      if (response.data.status) {
        setBlogs(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError(error.message || "Failed to fetch blogs");
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.title_slug?.trim()) {
      errors.title_slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.title_slug)) {
      errors.title_slug =
        "Slug must contain only lowercase letters, numbers, and hyphens";
    }

    if (!formData.title_meta?.trim()) {
      errors.title_meta = "Meta title is required";
    }

    if (!formData.short_desc?.trim()) {
      errors.short_desc = "Short description is required";
    }

    if (!formData.short_desc_meta?.trim()) {
      errors.short_desc_meta = "Meta description is required";
    }

    if (!formData.long_desc?.trim()) {
      errors.long_desc = "Long description is required";
    }

    if (!formData.long_desc_meta?.trim()) {
      errors.long_desc_meta = "Meta long description is required";
    }

    if (!formData.image_alt?.trim()) {
      errors.image_alt = "Image alt text is required";
    }

    // Validate images for new blog or when images are changed
    if (!editingBlog) {
      if (!webImageFile) {
        errors.web_image = "Web image is required";
      }
      if (!mobileImageFile) {
        errors.mobile_image = "Mobile image is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  const handleWebImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

      setWebImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setWebImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (formErrors.web_image) {
        setFormErrors((prev) => ({ ...prev, web_image: "" }));
      }
    }
  };

  const handleMobileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

      setMobileImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMobileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (formErrors.mobile_image) {
        setFormErrors((prev) => ({ ...prev, mobile_image: "" }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      title_slug: "",
      title_meta: "",
      short_desc: "",
      short_desc_meta: "",
      long_desc: "",
      long_desc_meta: "",
      image_alt: "",
      youtube_link: "",
      is_active: true,
    });
    setWebImageFile(null);
    setMobileImageFile(null);
    setWebImagePreview(null);
    setMobileImagePreview(null);
    setFormErrors({});
    setEditingBlog(null);
    setShowForm(false);
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      title_slug: blog.title_slug || "",
      title_meta: blog.title_meta || "",
      short_desc: blog.short_desc || "",
      short_desc_meta: blog.short_desc_meta || "",
      long_desc: blog.long_desc || "",
      long_desc_meta: blog.long_desc_meta || "",
      image_alt: blog.image_alt || "",
      youtube_link: blog.youtube_link || "",
      is_active: blog.is_active,
    });

    if (blog.web_image) {
      setWebImagePreview(`${STORAGE_URL}/${blog.web_image}`);
    }
    if (blog.mobile_image) {
      setMobileImagePreview(`${STORAGE_URL}/${blog.mobile_image}`);
    }

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "is_active") {
          formDataToSend.append(key, formData[key] ? 1 : 0); // OR true/false depending backend
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append images if changed
      if (webImageFile) {
        formDataToSend.append("web_image", webImageFile);
      }
      if (mobileImageFile) {
        formDataToSend.append("mobile_image", mobileImageFile);
      }

      let response;
      if (editingBlog) {
        // Update existing blog
        response = await api.post(
          `/admin/blogs/${editingBlog.id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        toast.success("Blog updated successfully");
      } else {
        // Create new blog
        response = await api.post("/admin/blogs", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Blog created successfully");
      }

      if (response.data.status) {
        setSuccess(
          editingBlog
            ? "Blog updated successfully"
            : "Blog created successfully",
        );
        await fetchBlogs();
        resetForm();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.data.message || "Failed to save blog");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "Failed to save blog";

      // Handle validation errors
      if (error.response?.data?.errors) {
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach((key) => {
          backendErrors[key] = error.response.data.errors[key][0];
        });
        setFormErrors(backendErrors);
      } else {
        setError(errorMsg);
      }

      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    try {
      const response = await api.delete(`/admin/blogs/${id}`);

      if (response.data.status) {
        toast.success("Blog deleted successfully");
        await fetchBlogs();
        setDeleteConfirm(null);
      } else {
        throw new Error(response.data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(error.message || "Failed to delete blog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (blog) => {
    try {
      const response = await api.post(`/admin/blogs/${blog.id}/toggle-status`);

      if (response.data.status) {
        toast.success(
          `Blog ${blog.is_active ? "deactivated" : "activated"} successfully`,
        );
        await fetchBlogs();
      } else {
        throw new Error(response.data.message || "Failed to toggle status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  // Filter blogs based on search and status
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.title_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.short_desc &&
        blog.short_desc.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && blog.is_active) ||
      (filterStatus === "inactive" && !blog.is_active);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#2563EB]" />
                Blog Management
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Create and manage blog posts
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={fetchBlogs}
                className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-[#64748B]" />
              </button>

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Blog</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-[#DCFCE7] border border-[#22C55E]/20 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-[#15803D] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[#15803D]">{success}</p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="text-[#15803D] hover:text-[#0F6B3D]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-[#FEE2E2] border border-[#EF4444]/20 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-[#B91C1C] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-[#B91C1C]">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-[#B91C1C] hover:text-[#991B1B]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Blog Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                {editingBlog ? "Edit Blog" : "Add New Blog"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-md font-semibold text-[#0F172A] mb-4 pb-2 border-b border-[#E2E8F0]">
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Title <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleTitleChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.title
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="Enter blog title"
                      />
                      {formErrors.title && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.title}
                        </p>
                      )}
                    </div>

                    {/* Slug */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Slug <span className="text-[#EF4444]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="title_slug"
                          value={formData.title_slug}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border ${
                            formErrors.title_slug
                              ? "border-[#EF4444]"
                              : "border-[#CBD5E1]"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                          placeholder="url-friendly-slug"
                        />
                        <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      </div>
                      {formErrors.title_slug && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.title_slug}
                        </p>
                      )}
                    </div>

                    {/* Meta Title */}
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Meta Title <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        name="title_meta"
                        value={formData.title_meta}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.title_meta
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="SEO meta title"
                      />
                      {formErrors.title_meta && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.title_meta}
                        </p>
                      )}
                    </div>

                    {/* Image Alt */}
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Image Alt Text <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        name="image_alt"
                        value={formData.image_alt}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${
                          formErrors.image_alt
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="Alt text for images"
                      />
                      {formErrors.image_alt && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.image_alt}
                        </p>
                      )}
                    </div>

                    {/* YouTube Link */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        YouTube Video Link
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          name="youtube_link"
                          value={formData.youtube_link}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] pl-10"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <h3 className="text-md font-semibold text-[#0F172A] mb-4 pb-2 border-b border-[#E2E8F0]">
                    Content
                  </h3>

                  <div className="space-y-4">
                    {/* Short Description */}
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Short Description{" "}
                        <span className="text-[#EF4444]">*</span>
                      </label>
                      <textarea
                        name="short_desc"
                        value={formData.short_desc}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-2 border ${
                          formErrors.short_desc
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="Brief description of the blog"
                      />
                      {formErrors.short_desc && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.short_desc}
                        </p>
                      )}
                    </div>

                    {/* Short Description Meta */}
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Short Description Meta{" "}
                        <span className="text-[#EF4444]">*</span>
                      </label>
                      <textarea
                        name="short_desc_meta"
                        value={formData.short_desc_meta}
                        onChange={handleInputChange}
                        rows="2"
                        className={`w-full px-4 py-2 border ${
                          formErrors.short_desc_meta
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="SEO meta description"
                      />
                      {formErrors.short_desc_meta && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.short_desc_meta}
                        </p>
                      )}
                    </div>

                    {/* Long Description */}
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Long Description{" "}
                        <span className="text-[#EF4444]">*</span>
                      </label>
                      <CustomTextEditor
                        value={formData.long_desc}
                        onChange={(content) => {
                          setFormData((prev) => ({
                            ...prev,
                            long_desc: content,
                          }));

                          if (formErrors.long_desc) {
                            setFormErrors((prev) => ({
                              ...prev,
                              long_desc: "",
                            }));
                          }
                        }}
                        placeholder="Write full blog content..."
                      />
                      {formErrors.long_desc && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.long_desc}
                        </p>
                      )}
                    </div>

                    {/* Long Description Meta */}
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Long Description Meta{" "}
                        <span className="text-[#EF4444]">*</span>
                      </label>
                      <textarea
                        name="long_desc_meta"
                        value={formData.long_desc_meta}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-2 border ${
                          formErrors.long_desc_meta
                            ? "border-[#EF4444]"
                            : "border-[#CBD5E1]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]`}
                        placeholder="SEO meta description for long content"
                      />
                      {formErrors.long_desc_meta && (
                        <p className="text-xs text-[#EF4444] mt-1">
                          {formErrors.long_desc_meta}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-md font-semibold text-[#0F172A] mb-4 pb-2 border-b border-[#E2E8F0]">
                    Images
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Web Image */}
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Web Image (Desktop){" "}
                        <span className="text-[#EF4444]">*</span>
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleWebImageChange}
                          className="hidden"
                          id="web-image-upload"
                        />

                        {webImagePreview && (
                          <div className="relative w-full h-48 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] overflow-hidden">
                            <img
                              src={webImagePreview}
                              alt="Web Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setWebImagePreview(null);
                                setWebImageFile(null);
                              }}
                              className="absolute top-2 right-2 p-1 bg-[#EF4444] text-white rounded-full hover:bg-[#DC2626] transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <label
                          htmlFor="web-image-upload"
                          className="inline-flex items-center px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {webImagePreview ? "Change Image" : "Upload Image"}
                        </label>
                        <p className="text-xs text-[#64748B]">
                          Recommended: 1200x630px, Max size: 2MB
                        </p>
                        {formErrors.web_image && (
                          <p className="text-xs text-[#EF4444]">
                            {formErrors.web_image}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mobile Image */}
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-1">
                        Mobile Image <span className="text-[#EF4444]">*</span>
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMobileImageChange}
                          className="hidden"
                          id="mobile-image-upload"
                        />

                        {mobileImagePreview && (
                          <div className="relative w-full h-48 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] overflow-hidden">
                            <img
                              src={mobileImagePreview}
                              alt="Mobile Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setMobileImagePreview(null);
                                setMobileImageFile(null);
                              }}
                              className="absolute top-2 right-2 p-1 bg-[#EF4444] text-white rounded-full hover:bg-[#DC2626] transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <label
                          htmlFor="mobile-image-upload"
                          className="inline-flex items-center px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {mobileImagePreview ? "Change Image" : "Upload Image"}
                        </label>
                        <p className="text-xs text-[#64748B]">
                          Recommended: 600x800px, Max size: 2MB
                        </p>
                        {formErrors.mobile_image && (
                          <p className="text-xs text-[#EF4444]">
                            {formErrors.mobile_image}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-6 pt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#2563EB] rounded border-[#CBD5E1] focus:ring-[#2563EB]"
                    />
                    <span className="text-sm text-[#334155]">
                      Active (published)
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingBlog ? "Update" : "Save"} Blog</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Blogs Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Short Desc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedBlogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-[#64748B]"
                    >
                      {searchTerm || filterStatus !== "all"
                        ? "No blogs found matching your filters"
                        : 'No blogs found. Click "Add New Blog" to create one.'}
                    </td>
                  </tr>
                ) : (
                  paginatedBlogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {blog.web_image_url ? (
                            <img
                              src={`${STORAGE_URL}/${blog.web_image}`}
                              alt={blog.image_alt}
                              className="w-10 h-10 rounded-lg object-cover border border-[#E2E8F0]"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-[#64748B]" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">
                            {blog.title}
                          </p>
                          <p className="text-xs text-[#64748B] mt-1 line-clamp-1">
                            {blog.short_desc}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-[#F1F5F9] px-2 py-1 rounded text-[#334155]">
                          {blog.title_slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#64748B] line-clamp-2 max-w-xs">
                          {blog.short_desc}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(blog)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            blog.is_active
                              ? "bg-[#22C55E] text-white hover:bg-[#16A34A]"
                              : "bg-[#EF4444] text-white hover:bg-[#DC2626]"
                          }`}
                        >
                          <Power className="w-3 h-3 mr-1" />
                          {blog.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-xs text-[#64748B]">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(blog.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              window.open(`/blog/${blog.title_slug}`, "_blank")
                            }
                            className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="View Blog"
                          >
                            <ExternalLink className="w-4 h-4 text-[#64748B]" />
                          </button>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-[#64748B]" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(blog)}
                            className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-[#EF4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between flex-col sm:flex-row space-y-3 sm:space-y-0">
              <p className="text-sm text-[#64748B]">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredBlogs.length)} of{" "}
                {filteredBlogs.length} entries
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                </button>
                <span className="text-sm text-[#64748B]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-[#CBD5E1] rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-[#64748B]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-[#0F172A]">
                About Blog Management
              </h4>
              <p className="text-xs text-[#64748B] mt-1">
                Create and manage blog posts for your website. Each blog post
                includes SEO metadata, images for web and mobile, and optional
                YouTube video links. Slugs are automatically generated from
                titles but can be customized.
              </p>
              <p className="text-xs text-[#64748B] mt-2">
                <span className="font-medium">Total Blogs:</span> {blogs.length}{" "}
                |<span className="font-medium ml-2">Active:</span>{" "}
                {blogs.filter((b) => b.is_active).length} |
                <span className="font-medium ml-2">Inactive:</span>{" "}
                {blogs.filter((b) => !b.is_active).length}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#0F172A]">
                Confirm Delete
              </h3>
            </div>
            <div className="p-6">
              <p className="text-[#334155]">
                Are you sure you want to delete the blog "{deleteConfirm.title}
                "? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#334155] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={submitting}
                className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Blog</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleBlog;
