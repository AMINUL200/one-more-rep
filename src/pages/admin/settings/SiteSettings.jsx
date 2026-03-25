import React, { useState, useEffect } from "react";
import {
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Image as ImageIcon,
  Upload,
  X,
  Loader,
  Check,
  AlertCircle,
  ExternalLink,
  Map,
  Building,
  FileText,
  MessageCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../../utils/app";

const SiteSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    // General
    site_name: "",
    site_logo_alt: "",
    punch_line: "",
    is_active: true,

    // Contact
    phone: "",
    landline: "",
    email: "",
    fax: "",
    whats_app: "", // Added whatsapp field

    // Address
    street_address: "",
    city: "",
    state: "",
    country: "",
    zip: "",

    // Social Media
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    pinterest: "",

    // SEO
    sitemap_url: "",

    // Files
    site_web_logo: null,
    site_mobile_logo: null,
    site_favicon: null,
  });

  const [logoPreview, setLogoPreview] = useState({
    web: null,
    mobile: null,
    favicon: null,
  });

  const [uploading, setUploading] = useState({
    web: false,
    mobile: false,
    favicon: false,
  });

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

  // Tabs configuration
  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "address", label: "Address", icon: MapPin },
    { id: "social", label: "Social Media", icon: Facebook },
    { id: "seo", label: "SEO", icon: FileText },
  ];

  // Fetch settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/website-settings");
      if (response.data?.status && response.data?.data) {
        const data = response.data.data;
        console.log("Data ::", data);
        setSettings(data);
        setFormData({
          // General
          site_name: data.site_name || "",
          site_logo_alt: data.site_logo_alt || "",
          punch_line: data.punch_line || "",
          is_active: data.is_active || true,

          // Contact
          phone: data.phone || "",
          landline: data.landline || "",
          email: data.email || "",
          fax: data.fax || "",
          whats_app: data.whats_app || "", // Added whatsapp field

          // Address
          street_address: data.street_address || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          zip: data.zip || "",

          // Social Media
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
          pinterest: data.pinterest || "",

          // SEO
          sitemap_url: data.sitemap_url || "",

          // Files
          site_web_logo: null,
          site_mobile_logo: null,
          site_favicon: null,
        });

        // Set logo previews from existing URLs
        if (data.site_web_logo) {
          setLogoPreview((prev) => ({ ...prev, web: data.site_web_logo }));
        }
        if (data.site_mobile_logo) {
          setLogoPreview((prev) => ({
            ...prev,
            mobile: data.site_mobile_logo,
          }));
        }
        if (data.site_favicon) {
          setLogoPreview((prev) => ({ ...prev, favicon: data.site_favicon }));
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load website settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file upload
  const handleFileChange = async (e, type) => {
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

    setUploading((prev) => ({ ...prev, [type]: true }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview((prev) => ({ ...prev, [type]: reader.result }));
    };
    reader.readAsDataURL(file);

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [type === "web"
        ? "site_web_logo"
        : type === "mobile"
          ? "site_mobile_logo"
          : "site_favicon"]: file,
    }));

    setUploading((prev) => ({ ...prev, [type]: false }));
  };

  // Remove logo
  const handleRemoveLogo = (type) => {
    setLogoPreview((prev) => ({ ...prev, [type]: null }));
    setFormData((prev) => ({
      ...prev,
      [type === "web"
        ? "site_web_logo"
        : type === "mobile"
          ? "site_mobile_logo"
          : "site_favicon"]: null,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const submitData = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "is_active") {
        // Always send boolean value
        submitData.append("is_active", formData.is_active ? 1 : 0);
        return;
      }

      if (formData[key] !== null && formData[key] !== "") {
        if (key.includes("logo") || key.includes("favicon")) {
          if (formData[key] instanceof File) {
            submitData.append(key, formData[key]);
          }
        } else {
          submitData.append(key, formData[key]);
        }
      }
    });

    // 👇 DEBUG HERE
    console.log("----- FormData Debug -----");
    for (let pair of submitData.entries()) {
      console.log(pair[0], pair[1]);
    }
    console.log("----- End -----");

    try {
      const url = settings?.id
        ? `/admin/website-settings-update/${settings.id}`
        : `/admin/website-settings`;

      const response = await api.post(url, submitData);

      if (response.data?.status) {
        toast.success(
          settings?.id
            ? "Settings updated successfully"
            : "Settings saved successfully",
        );
        fetchSettings(); // Refresh data
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Get image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("data:") || path.startsWith("http")) return path;
    return `${import.meta.env.VITE_STORAGE_URL}/${path}`;
  };

  // Format phone number helper
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");
    // Format as needed (e.g., +91 XXXXX XXXXX)
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{5})(\d{5})/, "$1 $2");
    }
    return cleaned;
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
          <p style={{ color: colors.textLight }}>Loading settings...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
            Website Settings
          </h1>
          <p className="mt-2 text-sm" style={{ color: colors.textLight }}>
            Configure your website information and appearance
          </p>
        </div>

        {/* Main Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Section */}
          <div
            className="bg-white rounded-xl shadow-sm border p-6"
            style={{ borderColor: colors.border }}
          >
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: colors.text }}
            >
              <ImageIcon size={20} style={{ color: colors.primary }} />
              Website Logos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Web Logo */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Website Logo
                </label>
                <div className="relative group">
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-opacity-100 transition-all min-h-[120px] flex items-center justify-center"
                    style={{ borderColor: colors.border }}
                    onClick={() =>
                      document.getElementById("web-logo-upload").click()
                    }
                  >
                    {logoPreview.web ? (
                      <img
                        src={getImageUrl(logoPreview.web)}
                        alt="Web Logo Preview"
                        className="max-h-20 mx-auto object-contain"
                      />
                    ) : (
                      <div>
                        <Upload
                          size={24}
                          className="mx-auto mb-2"
                          style={{ color: colors.muted }}
                        />
                        <p
                          className="text-xs"
                          style={{ color: colors.textLight }}
                        >
                          Click to upload
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    id="web-logo-upload"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "web")}
                    className="hidden"
                  />

                  {logoPreview.web && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLogo("web")}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {uploading.web && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <Loader
                        size={20}
                        className="animate-spin"
                        style={{ color: colors.primary }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs mt-2" style={{ color: colors.textLight }}>
                  Recommended size: 200x50px
                </p>
              </div>

              {/* Mobile Logo */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Mobile Logo
                </label>
                <div className="relative group">
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-opacity-100 transition-all min-h-[120px] flex items-center justify-center"
                    style={{ borderColor: colors.border }}
                    onClick={() =>
                      document.getElementById("mobile-logo-upload").click()
                    }
                  >
                    {logoPreview.mobile ? (
                      <img
                        src={getImageUrl(logoPreview.mobile)}
                        alt="Mobile Logo Preview"
                        className="max-h-20 mx-auto object-contain"
                      />
                    ) : (
                      <div>
                        <Upload
                          size={24}
                          className="mx-auto mb-2"
                          style={{ color: colors.muted }}
                        />
                        <p
                          className="text-xs"
                          style={{ color: colors.textLight }}
                        >
                          Click to upload
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    id="mobile-logo-upload"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "mobile")}
                    className="hidden"
                  />

                  {logoPreview.mobile && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLogo("mobile")}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {uploading.mobile && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <Loader
                        size={20}
                        className="animate-spin"
                        style={{ color: colors.primary }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs mt-2" style={{ color: colors.textLight }}>
                  Recommended size: 150x40px
                </p>
              </div>

              {/* Favicon */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Favicon
                </label>
                <div className="relative group">
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-opacity-100 transition-all min-h-[120px] flex items-center justify-center"
                    style={{ borderColor: colors.border }}
                    onClick={() =>
                      document.getElementById("favicon-upload").click()
                    }
                  >
                    {logoPreview.favicon ? (
                      <img
                        src={getImageUrl(logoPreview.favicon)}
                        alt="Favicon Preview"
                        className="max-h-16 mx-auto object-contain"
                      />
                    ) : (
                      <div>
                        <ImageIcon
                          size={24}
                          className="mx-auto mb-2"
                          style={{ color: colors.muted }}
                        />
                        <p
                          className="text-xs"
                          style={{ color: colors.textLight }}
                        >
                          Click to upload
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    id="favicon-upload"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "favicon")}
                    className="hidden"
                  />

                  {logoPreview.favicon && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLogo("favicon")}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {uploading.favicon && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <Loader
                        size={20}
                        className="animate-spin"
                        style={{ color: colors.primary }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs mt-2" style={{ color: colors.textLight }}>
                  Recommended size: 32x32px
                </p>
              </div>
            </div>

            {/* Logo Alt Text */}
            <div className="mt-4">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Logo Alt Text
              </label>
              <input
                type="text"
                name="site_logo_alt"
                value={formData.site_logo_alt}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
                placeholder="Enter logo alt text for SEO"
              />
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b" style={{ borderColor: colors.border }}>
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 px-1 flex items-center gap-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div
            className="bg-white rounded-xl shadow-sm border p-6"
            style={{ borderColor: colors.border }}
          >
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Site Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="site_name"
                    value={formData.site_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="Enter your website name"
                    required
                  />
                </div>

                {/* Punch Line Field */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Punch Line / Tagline
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.muted }}
                    >
                      🏷️
                    </span>
                    <input
                      type="text"
                      name="punch_line"
                      value={formData.punch_line}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="e.g., Your Ultimate Fitness Destination"
                    />
                  </div>
                  <p
                    className="text-xs mt-1"
                    style={{ color: colors.textLight }}
                  >
                    A short catchy phrase that describes your brand (displayed
                    below your logo)
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded"
                      style={{
                        accentColor: colors.primary,
                      }}
                    />
                    <span style={{ color: colors.text }}>Website Active</span>
                  </label>
                  <p
                    className="text-xs mt-1"
                    style={{ color: colors.textLight }}
                  >
                    Enable/disable your website
                  </p>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.muted }}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Landline
                  </label>
                  <input
                    type="text"
                    name="landline"
                    value={formData.landline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="033-12345678"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.muted }}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="support@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Fax Number
                  </label>
                  <input
                    type="text"
                    name="fax"
                    value={formData.fax}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="033-87654321"
                  />
                </div>

                {/* WhatsApp Number Field */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2 flex items-center gap-2"
                    style={{ color: colors.text }}
                  >
                    <MessageCircle size={16} style={{ color: "#25D366" }} />
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <MessageCircle
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#25D366" }}
                    />
                    <input
                      type="tel"
                      name="whats_app"
                      value={formData.whats_app}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <p
                    className="text-xs mt-1"
                    style={{ color: colors.textLight }}
                  >
                    Enter WhatsApp number with country code for direct chat
                  </p>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Street Address
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-3"
                      style={{ color: colors.muted }}
                    />
                    <textarea
                      name="street_address"
                      value={formData.street_address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="Enter street address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="Kolkata"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="West Bengal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="India"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="700091"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === "social" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2 flex items-center gap-2"
                    style={{ color: colors.text }}
                  >
                    <Facebook size={16} style={{ color: "#1877F2" }} />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2 flex items-center gap-2"
                    style={{ color: colors.text }}
                  >
                    <Twitter size={16} style={{ color: "#1DA1F2" }} />
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2 flex items-center gap-2"
                    style={{ color: colors.text }}
                  >
                    <Linkedin size={16} style={{ color: "#0A66C2" }} />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2 flex items-center gap-2"
                    style={{ color: colors.text }}
                  >
                    <Instagram size={16} style={{ color: "#E4405F" }} />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2 flex items-center gap-2"
                    style={{ color: colors.text }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#BD081C">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.378l-.75 2.854c-.267 1.046-.998 2.35-1.491 3.149 1.12.346 2.306.535 3.54.535 6.607 0 11.986-5.373 11.986-11.987C23.97 5.38 18.627.013 12.017.013z" />
                    </svg>
                    Pinterest URL
                  </label>
                  <input
                    type="url"
                    name="pinterest"
                    value={formData.pinterest}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="https://pinterest.com/yourhandle"
                  />
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <div>
                <label
                  className="block text-sm font-medium mb-2 flex items-center gap-2"
                  style={{ color: colors.text }}
                >
                  <ExternalLink size={16} style={{ color: colors.primary }} />
                  Sitemap URL
                </label>
                <input
                  type="url"
                  name="sitemap_url"
                  value={formData.sitemap_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="https://yourwebsite.com/sitemap.xml"
                />
                <p className="text-xs mt-2" style={{ color: colors.textLight }}>
                  Enter your XML sitemap URL for search engines
                </p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteSettings;
