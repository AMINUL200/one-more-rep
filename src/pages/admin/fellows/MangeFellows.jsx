import React, { useState, useEffect } from "react";
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Loader,
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
  Link2,
  Youtube,
  Play,
  Pause,
  Volume2,
  Maximize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../../utils/app";

const MangeFellows = () => {
  const [fellowsData, setFellowsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPageOptions = [5, 10, 20, 50, 100];

  // Form state
  const [formData, setFormData] = useState({
    video_title: "",
    video: null,
    youtube_link: "",
    button_name: "",
    button_url: "",
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

  // Fetch fellows data
  useEffect(() => {
    fetchFellowsData();
  }, []);

  const fetchFellowsData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/short-videos");
      if (response.data?.status) {
        // If response is a single object, wrap it in an array
        const data = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];
        setFellowsData(data);
      }
    } catch (error) {
      console.error("Error fetching fellows data:", error);
      toast.error("Failed to load fellows data");
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  useEffect(() => {
    // Filter based on search term
  }, [searchTerm, fellowsData]);

  // Update pagination
  useEffect(() => {
    const total = Math.ceil(fellowsData.length / itemsPerPage);
    setTotalPages(total);
    if (currentPage > total) {
      setCurrentPage(1);
    }
  }, [fellowsData, itemsPerPage, currentPage]);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return fellowsData.slice(startIndex, endIndex);
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

  // Validate video (max 50MB)
  const validateVideo = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(false);
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        reject("Video size must be less than 50MB");
        return;
      }

      if (!file.type.startsWith("video/")) {
        reject("Please select a valid video file (MP4, WebM, etc.)");
        return;
      }

      resolve(true);
    });
  };

  // Handle video change
  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingVideo(true);
    setVideoError(null);

    try {
      await validateVideo(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);

      setFormData((prev) => ({ ...prev, video: file }));
    } catch (error) {
      setVideoError(error);
      toast.error(error);
    } finally {
      setUploadingVideo(false);
    }
  };

  // Remove video
  const handleRemoveVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setVideoError(null);
    setFormData((prev) => ({ ...prev, video: null }));
  };

  // Get video URL
  const getVideoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("blob:") || path.startsWith("http")) return path;
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

    if (!formData.video_title.trim()) {
      errors.video_title = "Video title is required";
    }
    if (!formData.video && !editingItem?.video) {
      errors.video = "Video file is required";
    }
    if (!formData.youtube_link.trim()) {
      errors.youtube_link = "YouTube link is required";
    } else if (!isValidUrl(formData.youtube_link)) {
      errors.youtube_link = "Please enter a valid URL";
    }
    if (!formData.button_name.trim()) {
      errors.button_name = "Button name is required";
    }
    if (!formData.button_url.trim()) {
      errors.button_url = "Button URL is required";
    } else if (!isValidUrl(formData.button_url)) {
      errors.button_url = "Please enter a valid URL";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
      } else if (key === "video" && formData[key] instanceof File) {
        submitData.append("video", formData[key]);
      } else if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    try {
      let response;
      if (editingItem) {
        // submitData.append("_method", "PUT");
        response = await api.post(`/admin/short-videos/${editingItem.id}`, submitData);
      } else {
        response = await api.post("/admin/short-videos", submitData);
      }

      if (response.data?.status) {
        toast.success(
          editingItem
            ? "Fellow updated successfully"
            : "Fellow created successfully"
        );
        setShowForm(false);
        setEditingItem(null);
        resetForm();
        fetchFellowsData();
      }
    } catch (error) {
      console.error("Error saving fellow:", error);
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || {};
        const formattedErrors = {};
        Object.keys(validationErrors).forEach((key) => {
          formattedErrors[key] = validationErrors[key][0];
        });
        setFormErrors(formattedErrors);
        toast.error("Please check the form for errors");
      } else {
        toast.error(error.response?.data?.message || "Failed to save fellow");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      video_title: item.video_title || "",
      video: null,
      youtube_link: item.youtube_link || "",
      button_name: item.button_name || "",
      button_url: item.button_url || "",
      status: item.status === "1" || item.status === 1,
    });
    
    if (item.video) {
      setVideoPreview(getVideoUrl(item.video));
    } else {
      setVideoPreview(null);
    }
    
    setVideoError(null);
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
    if (videoPreview && !editingItem) {
      URL.revokeObjectURL(videoPreview);
    }
    setFormData({
      video_title: "",
      video: null,
      youtube_link: "",
      button_name: "",
      button_url: "",
      status: true,
    });
    setVideoPreview(null);
    setVideoError(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/short-videos/${id}`);
      if (response.data?.status) {
        toast.success("Fellow deleted successfully");
        setDeleteConfirm(null);
        fetchFellowsData();
      }
    } catch (error) {
      console.error("Error deleting fellow:", error);
      toast.error(error.response?.data?.message || "Failed to delete fellow");
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (item) => {
    try {
      const newStatus = item.status === "1" || item.status === 1 ? "0" : "1";
      const response = await api.patch(`/admin/short-videos/${item.id}/status`, {
        status: newStatus,
      });
      if (response.data?.status) {
        toast.success("Status updated successfully");
        fetchFellowsData();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Handle video preview modal
  const handlePreviewVideo = (videoPath) => {
    setSelectedVideo(getVideoUrl(videoPath));
    setShowVideoModal(true);
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
          <p style={{ color: colors.textLight }}>Loading fellows data...</p>
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
              Fellows Management
            </h1>
            <p className="text-lg mt-2" style={{ color: colors.textLight }}>
              Manage short videos and fellows content
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
            Add New Fellow
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 rounded-xl shadow-sm border p-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                  {editingItem ? "Edit Fellow" : "Add New Fellow"}
                </h2>
                <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                  {editingItem ? "Update fellow content" : "Create a new fellow video"}
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
              {/* Video Title */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Video Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textLight }} />
                  <input
                    type="text"
                    name="video_title"
                    value={formData.video_title}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.video_title ? colors.danger : colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="Enter video title"
                  />
                </div>
                {formErrors.video_title && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.video_title}</p>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Video File <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-opacity-100 transition-all min-h-[200px] flex items-center justify-center"
                    style={{ borderColor: videoError ? colors.danger : colors.border }}
                    onClick={() => document.getElementById("video-upload").click()}
                  >
                    {videoPreview ? (
                      <div className="relative w-full">
                        <video
                          src={videoPreview}
                          className="max-h-32 mx-auto rounded"
                          controls
                          preload="metadata"
                        />
                        <p className="text-xs mt-2" style={{ color: colors.textLight }}>Video ready for upload</p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={32} className="mx-auto mb-2" style={{ color: colors.textLight }} />
                        <p className="text-sm" style={{ color: colors.textLight }}>Click to upload video</p>
                        <p className="text-xs mt-1" style={{ color: colors.muted }}>Max size: 50MB • MP4, WebM, MOV</p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />

                  {videoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {uploadingVideo && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <Loader size={20} className="animate-spin" style={{ color: colors.primary }} />
                    </div>
                  )}
                </div>

                {videoError && (
                  <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: `${colors.danger}10`, border: `1px solid ${colors.danger}30` }}>
                    <div className="flex items-start gap-2">
                      <AlertCircle size={14} style={{ color: colors.danger }} className="mt-0.5" />
                      <p className="text-xs" style={{ color: colors.danger }}>{videoError}</p>
                    </div>
                  </div>
                )}

                {editingItem && editingItem.video && !videoPreview && (
                  <div className="mt-2 p-2 border rounded-lg" style={{ borderColor: colors.border }}>
                    <p className="text-xs font-medium mb-1" style={{ color: colors.textLight }}>Current video:</p>
                    <button
                      type="button"
                      onClick={() => handlePreviewVideo(editingItem.video)}
                      className="flex items-center gap-2 text-sm hover:underline"
                      style={{ color: colors.primary }}
                    >
                      <Play size={14} />
                      Preview Current Video
                    </button>
                  </div>
                )}

                {formErrors.video && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.video}</p>
                )}
              </div>

              {/* YouTube Link */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  YouTube Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Youtube size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textLight }} />
                  <input
                    type="url"
                    name="youtube_link"
                    value={formData.youtube_link}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.youtube_link ? colors.danger : colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                {formErrors.youtube_link && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.youtube_link}</p>
                )}
              </div>

              {/* Button Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Button Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="button_name"
                  value={formData.button_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${formErrors.button_name ? colors.danger : colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="e.g., Learn More, Watch Now"
                />
                {formErrors.button_name && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.button_name}</p>
                )}
              </div>

              {/* Button URL */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Button URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link2 size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textLight }} />
                  <input
                    type="url"
                    name="button_url"
                    value={formData.button_url}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.button_url ? colors.danger : colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="https://example.com"
                  />
                </div>
                {formErrors.button_url && (
                  <p className="mt-1 text-xs" style={{ color: colors.danger }}>{formErrors.button_url}</p>
                )}
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
                  Enable to make this video visible on the website
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
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
                      <span>{editingItem ? "Update" : "Create"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Fellows Table */}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Video Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Video</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>YouTube Link</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Button</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: colors.textLight }}>Created</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: colors.textLight }}>Actions</th>
                  </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item.id} className="border-t" style={{ borderColor: colors.border }}>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm" style={{ color: colors.textLight }}>#{item.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium" style={{ color: colors.text }}>{item.video_title}</div>
                    </td>
                    <td className="px-6 py-4">
                      {item.video ? (
                        <button
                          onClick={() => handlePreviewVideo(item.video)}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg transition-colors hover:bg-gray-100"
                          style={{ color: colors.primary }}
                        >
                          <Play size={14} />
                          <span className="text-sm">Preview</span>
                        </button>
                      ) : (
                        <span style={{ color: colors.textLight }}>No video</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={item.youtube_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm hover:underline"
                        style={{ color: colors.primary }}
                      >
                        <Youtube size={14} />
                        View
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium" style={{ color: colors.text }}>{item.button_name}</span>
                        <div className="text-xs mt-1" style={{ color: colors.textLight }}>{truncateText(item.button_url, 30)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusToggle(item)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          item.status === "1" || item.status === 1
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {item.status === "1" || item.status === 1 ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: colors.textLight }}>{formatDate(item.created_at)}</div>
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
              <Video size={48} className="mx-auto mb-4" style={{ color: colors.textLight }} />
              <p style={{ color: colors.textLight }}>No fellows data found</p>
            </div>
          )}

          {/* Pagination */}
          {fellowsData.length > 0 && (
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, fellowsData.length)} of {fellowsData.length} entries
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

      {/* Video Preview Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80" onClick={() => setShowVideoModal(false)}>
          <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full rounded-lg shadow-2xl"
              controlsList="nodownload"
            >
              Your browser does not support the video tag.
            </video>
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
              <h3 className="text-lg font-bold" style={{ color: colors.text }}>Delete Fellow</h3>
            </div>
            <p className="mb-4" style={{ color: colors.textLight }}>
              Are you sure you want to delete the video "<strong>{deleteConfirm.video_title}</strong>"? This action cannot be undone.
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

export default MangeFellows;