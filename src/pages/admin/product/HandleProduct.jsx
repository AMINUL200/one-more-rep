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
  DollarSign,
  Package,
  FileText,
  Truck,
  RotateCcw,
  Image as ImageIcon,
  Star,
  MoveUp,
  MoveDown,
  Upload,
  MessageSquare,
  User,
  ThumbsUp,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../../utils/app";
import CustomTextEditor from "../../../component/form/TextEditor";

const HandleProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [imageFormData, setImageFormData] = useState({
    image: null,
    image_alt: "",
    is_thumbnail: false,
    sort_order: 0,
  });
  const [reviewFormData, setReviewFormData] = useState({
    customer_name: "",
    rating: 5,
    review: "",
    status: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deleteReviewConfirm, setDeleteReviewConfirm] = useState(null);

  const [formData, setFormData] = useState({
    category_id: "",
    subcategory_id: "",
    name: "",
    name_meta: "",
    price: "",
    sale_price: "",
    stock: "",
    description: "",
    description_meta: "",
    shipping_policy: "",
    shipping_policy_meta: "",
    return_policy: "",
    return_policy_meta: "",
    status: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteImageConfirm, setDeleteImageConfirm] = useState(null);

  // Feature state:
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [productFeatures, setProductFeatures] = useState([]);
  const [loadingFeatures, setLoadingFeatures] = useState(false);
  const [featureFormData, setFeatureFormData] = useState({
    feature: "",
    feature_meta: "",
  });
  const [submittingFeature, setSubmittingFeature] = useState(false);
  const [deleteFeatureConfirm, setDeleteFeatureConfirm] = useState(null);
  const [featureDeleteLoading, setFeatureDeleteLoading] = useState(false);

  // specifications state:
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [productSpecifications, setProductSpecifications] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);

  const [specFormData, setSpecFormData] = useState({
    spec_key: "",
    spec_key_meta: "",
    spec_value: "",
    spec_value_meta: "",
  });

  const [submittingSpec, setSubmittingSpec] = useState(false);
  const [deleteSpecConfirm, setDeleteSpecConfirm] = useState(null);
  const [specDeleteLoading, setSpecDeleteLoading] = useState(false);

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

  // Fetch subcategories for dropdown
  const fetchSubcategories = async () => {
    try {
      const response = await api.get("/admin/subcategories");
      if (response.data?.status) {
        setSubcategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to load subcategories");
    }
  };

  // Fetch products
  const fetchProducts = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await api.get("/admin/products", {
        params: { page, search },
      });

      if (response.data?.status) {
        setProducts(response.data.data);
        if (response.data.meta) {
          setTotalPages(response.data.meta.last_page);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch product images
  const fetchProductImages = async (productId) => {
    setLoadingImages(true);
    try {
      const response = await api.get(
        `/admin/product-images/product/${productId}`,
      );
      if (response.data?.status) {
        setProductImages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product images:", error);
      toast.error("Failed to load product images");
    } finally {
      setLoadingImages(false);
    }
  };

  // Fetch product reviews
  const fetchProductReviews = async (productId) => {
    setLoadingReviews(true);
    try {
      const response = await api.get(
        `/admin/product-reviews/product/${productId}`,
      );
      if (response.data?.status) {
        setProductReviews(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      toast.error("Failed to load product reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchProductFeatures = async (productId) => {
    setLoadingFeatures(true);

    try {
      const response = await api.get(
        `/admin/product-features/product/${productId}`,
      );

      if (response.data?.status) {
        setProductFeatures(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
      toast.error("Failed to load product features");
    } finally {
      setLoadingFeatures(false);
    }
  };

  const fetchProductSpecifications = async (productId) => {
    setLoadingSpecs(true);

    try {
      const response = await api.get(
        `/admin/product-specifications/product/${productId}`,
      );

      if (response.data?.status) {
        setProductSpecifications(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load specifications");
    } finally {
      setLoadingSpecs(false);
    }
  };

  const handleSpecInputChange = (e) => {
    const { name, value } = e.target;

    setSpecFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecSubmit = async (e) => {
    e.preventDefault();

    if (!specFormData.spec_key || !specFormData.spec_value) {
      toast.error("Specification key and value required");
      return;
    }

    setSubmittingSpec(true);

    try {
      const response = await api.post("/admin/product-specifications", {
        product_id: selectedProduct.id,
        spec_key: specFormData.spec_key,
        spec_key_meta: specFormData.spec_key_meta,
        spec_value: specFormData.spec_value,
        spec_value_meta: specFormData.spec_value_meta,
      });

      if (response.data?.status) {
        toast.success("Specification added");

        setSpecFormData({
          spec_key: "",
          spec_key_meta: "",
          spec_value: "",
          spec_value_meta: "",
        });

        fetchProductSpecifications(selectedProduct.id);
      }
    } catch (error) {
      toast.error("Failed to add specification");
    } finally {
      setSubmittingSpec(false);
    }
  };
  const handleSpecDelete = async (id) => {
    setSpecDeleteLoading(true);

    try {
      const response = await api.delete(`/admin/product-specifications/${id}`);

      if (response.data?.status) {
        toast.success("Specification deleted");

        setDeleteSpecConfirm(null);

        fetchProductSpecifications(selectedProduct.id);
      }
    } catch (error) {
      toast.error("Failed to delete specification");
    } finally {
      setSpecDeleteLoading(false);
    }
  };
  const handleFeatureInputChange = (e) => {
    const { name, value } = e.target;

    setFeatureFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureSubmit = async (e) => {
    e.preventDefault();

    if (!featureFormData.feature.trim()) {
      toast.error("Feature is required");
      return;
    }

    setSubmittingFeature(true);

    try {
      const response = await api.post("/admin/product-features", {
        product_id: selectedProduct.id,
        feature: featureFormData.feature,
        feature_meta: featureFormData.feature_meta,
      });

      if (response.data?.status) {
        toast.success("Feature added successfully");

        setFeatureFormData({
          feature: "",
          feature_meta: "",
        });

        fetchProductFeatures(selectedProduct.id);
      }
    } catch (error) {
      toast.error("Failed to add feature");
    } finally {
      setSubmittingFeature(false);
    }
  };

  const handleFeatureDelete = async (id) => {
    setFeatureDeleteLoading(true);
    try {
      const response = await api.delete(`/admin/product-features/${id}`);

      if (response.data?.status) {
        toast.success("Feature deleted");

        setDeleteFeatureConfirm(null);

        fetchProductFeatures(selectedProduct.id);
      }
    } catch (error) {
      toast.error("Failed to delete feature");
    } finally {
      setFeatureDeleteLoading(false);
    }
  };

  // Filter subcategories based on selected category
  useEffect(() => {
    if (formData.category_id) {
      const filtered = subcategories.filter(
        (sub) => sub.category_id === parseInt(formData.category_id),
      );
      setFilteredSubcategories(filtered);

      // Reset subcategory if current selection not in filtered list
      if (
        formData.subcategory_id &&
        !filtered.some((s) => s.id === parseInt(formData.subcategory_id))
      ) {
        setFormData((prev) => ({ ...prev, subcategory_id: "" }));
      }
    } else {
      setFilteredSubcategories([]);
      setFormData((prev) => ({ ...prev, subcategory_id: "" }));
    }
  }, [formData.category_id, subcategories]);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchProducts(currentPage, searchTerm);
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setCurrentPage(1);
        fetchProducts(1, searchTerm);
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

  // Handle review form input change
  const handleReviewInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image input change
  const handleImageInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];

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

      setImageFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.category_id) {
      errors.category_id = "Please select a category";
    }
    // if (!formData.subcategory_id) {
    //   errors.subcategory_id = "Please select a subcategory";
    // }
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Product name must be at least 3 characters";
    }
    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = "Please enter a valid price";
    }
    if (
      formData.sale_price &&
      (isNaN(formData.sale_price) || parseFloat(formData.sale_price) < 0)
    ) {
      errors.sale_price = "Please enter a valid sale price";
    }
    if (!formData.stock) {
      errors.stock = "Stock is required";
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.stock = "Please enter a valid stock quantity";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate review form
  const validateReviewForm = () => {
    const errors = {};

    if (!reviewFormData.customer_name.trim()) {
      errors.customer_name = "Customer name is required";
    }
    if (
      !reviewFormData.rating ||
      reviewFormData.rating < 1 ||
      reviewFormData.rating > 5
    ) {
      errors.rating = "Please select a valid rating";
    }
    if (!reviewFormData.review.trim()) {
      errors.review = "Review is required";
    } else if (reviewFormData.review.trim().length < 10) {
      errors.review = "Review must be at least 10 characters";
    }

    return Object.keys(errors).length === 0;
  };

  // Handle form submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    // Convert numeric fields to numbers
    const submitData = {
      ...formData,
      category_id: parseInt(formData.category_id),
      subcategory_id: parseInt(formData.subcategory_id),
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      stock: parseInt(formData.stock),
    };

    try {
      if (editingProduct) {
        // Edit product
        const response = await api.put(
          `/admin/products/${editingProduct.id}`,
          submitData,
        );
        if (response.data?.status) {
          toast.success("Product updated successfully");
          setShowModal(false);
          fetchProducts(currentPage, searchTerm);
        }
      } else {
        // Add product
        const response = await api.post("/admin/products", submitData);
        if (response.data?.status) {
          toast.success("Product added successfully");
          setShowModal(false);
          fetchProducts(1, searchTerm);
          setCurrentPage(1);
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle review submit (Add/Edit)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!validateReviewForm()) return;

    setSubmittingReview(true);

    const submitData = {
      product_id: selectedProduct.id,
      customer_name: reviewFormData.customer_name,
      rating: parseInt(reviewFormData.rating),
      review: reviewFormData.review,
      status: reviewFormData.status ? 1 : 0,
    };

    try {
      if (editingReview) {
        // Edit review
        const response = await api.put(
          `/admin/product-reviews/${editingReview.id}`,
          submitData,
        );
        if (response.data?.status) {
          toast.success("Review updated successfully");
          setEditingReview(null);
          fetchProductReviews(selectedProduct.id);
          // Reset form
          setReviewFormData({
            customer_name: "",
            rating: 5,
            review: "",
            status: true,
          });
        }
      } else {
        // Add review
        const response = await api.post("/admin/product-reviews", submitData);
        if (response.data?.status) {
          toast.success("Review added successfully");
          fetchProductReviews(selectedProduct.id);
          // Reset form
          setReviewFormData({
            customer_name: "",
            rating: 5,
            review: "",
            status: true,
          });
        }
      }
    } catch (error) {
      console.error("Error saving review:", error);
      toast.error(error.response?.data?.message || "Failed to save review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!imageFormData.image) {
      toast.error("Please select an image");
      return;
    }

    setUploadingImage(true);

    const formData = new FormData();
    formData.append("product_id", selectedProduct.id);
    formData.append("image", imageFormData.image);
    formData.append("image_alt", imageFormData.image_alt || "");
    formData.append("is_thumbnail", imageFormData.is_thumbnail ? 1 : 0);
    formData.append("sort_order", imageFormData.sort_order || 0);

    try {
      const response = await api.post("/admin/product-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.status) {
        toast.success("Image uploaded successfully");
        // Reset form
        setImageFormData({
          image: null,
          image_alt: "",
          is_thumbnail: false,
          sort_order: 0,
        });
        setImagePreview(null);
        // Refresh images
        fetchProductImages(selectedProduct.id);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle image delete
  const handleImageDelete = async (imageId) => {
    try {
      const response = await api.delete(`/admin/product-images/${imageId}`);
      if (response.data?.status) {
        toast.success("Image deleted successfully");
        setDeleteImageConfirm(null);
        fetchProductImages(selectedProduct.id);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(error.response?.data?.message || "Failed to delete image");
    }
  };

  // Handle review delete
  const handleReviewDelete = async (reviewId) => {
    try {
      const response = await api.delete(`/admin/product-reviews/${reviewId}`);
      if (response.data?.status) {
        toast.success("Review deleted successfully");
        setDeleteReviewConfirm(null);
        fetchProductReviews(selectedProduct.id);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  // Handle review status toggle
  const handleReviewStatusToggle = async (review) => {
    try {
      const response = await api.patch(
        `/admin/product-reviews/${review.id}/status`,
        {
          status: !(review.status === 1 || review.status === true),
        },
      );
      if (response.data?.status) {
        toast.success("Review status updated successfully");
        fetchProductReviews(selectedProduct.id);
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      toast.error("Failed to update review status");
    }
  };

  // Handle set thumbnail
  const handleSetThumbnail = async (imageId) => {
    try {
      const response = await api.patch(
        `/admin/product-images/${imageId}/set-thumbnail`,
      );
      if (response.data?.status) {
        toast.success("Thumbnail updated successfully");
        fetchProductImages(selectedProduct.id);
      }
    } catch (error) {
      console.error("Error setting thumbnail:", error);
      toast.error("Failed to set thumbnail");
    }
  };

  // Handle sort order update
  const handleSortOrder = async (imageId, newOrder) => {
    try {
      const response = await api.patch(
        `/admin/product-images/${imageId}/sort-order`,
        {
          sort_order: newOrder,
        },
      );
      if (response.data?.status) {
        toast.success("Sort order updated");
        fetchProductImages(selectedProduct.id);
      }
    } catch (error) {
      console.error("Error updating sort order:", error);
      toast.error("Failed to update sort order");
    }
  };

  // Handle edit click
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      category_id: product.category_id,
      subcategory_id: product.subcategory_id,
      name: product.name,
      name_meta: product.name_meta || "",
      price: product.price,
      sale_price: product.sale_price || "",
      stock: product.stock,
      description: product.description || "",
      description_meta: product.description_meta || "",
      shipping_policy: product.shipping_policy || "",
      shipping_policy_meta: product.shipping_policy_meta || "",
      return_policy: product.return_policy || "",
      return_policy_meta: product.return_policy_meta || "",
      status: product.status === 1 || product.status === true,
    });
    setShowModal(true);
  };

  // Handle add click
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      category_id: "",
      subcategory_id: "",
      name: "",
      name_meta: "",
      price: "",
      sale_price: "",
      stock: "",
      description: "",
      description_meta: "",
      shipping_policy: "",
      shipping_policy_meta: "",
      return_policy: "",
      return_policy_meta: "",
      status: true,
    });
    setFormErrors({});
    setShowModal(true);
  };

  // Handle manage images click
  const handleManageImages = (product) => {
    setSelectedProduct(product);
    fetchProductImages(product.id);
    setShowImageModal(true);
  };

  // Handle manage reviews click
  const handleManageReviews = (product) => {
    setSelectedProduct(product);
    fetchProductReviews(product.id);
    setEditingReview(null);
    setReviewFormData({
      customer_name: "",
      rating: 5,
      review: "",
      status: true,
    });
    setShowReviewModal(true);
  };

  // Handle edit review click
  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewFormData({
      customer_name: review.customer_name,
      rating: review.rating,
      review: review.review,
      status: review.status === 1 || review.status === true,
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/admin/products/${id}`);
      if (response.data?.status) {
        toast.success("Product deleted successfully");
        setDeleteConfirm(null);
        fetchProducts(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (product) => {
    try {
      const response = await api.patch(`/admin/products/${product.id}/status`, {
        status: !(product.status === 1 || product.status === true),
      });
      if (response.data?.status) {
        toast.success("Status updated successfully");
        fetchProducts(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get image URL
  const getImageUrl = (imagePath) => {
    return `${API_URL}/${imagePath}`;
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? "fill-current" : ""}
            style={{ color: star <= rating ? colors.warning : colors.muted }}
          />
        ))}
      </div>
    );
  };

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subcategory?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
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
            Products
          </h1>
          <p className="text-sm mt-1" style={{ color: colors.textLight }}>
            Manage your products
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
          <span>Add Product</span>
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
            placeholder="Search products, categories or subcategories..."
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

      {/* Products Table */}
      <div
        className="rounded-lg overflow-hidden shadow-sm"
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
          <table className="w-full min-w-[700px]">
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
                  Product
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
                  Subcategory
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Price
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Sale Price
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Stock
                </th>

                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Images
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.textLight }}
                >
                  Reviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Specifications
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
              {loading ? (
                <tr>
                  <td colSpan="12" className="px-6 py-10 text-center">
                    <Loader
                      className="animate-spin mx-auto"
                      size={30}
                      style={{ color: colors.primary }}
                    />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="12"
                    className="px-6 py-10 text-center"
                    style={{ color: colors.textLight }}
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    style={{ borderBottom: `1px solid ${colors.border}` }}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      style={{ color: colors.textLight }}
                    >
                      #{product.id}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="font-medium"
                        style={{ color: colors.text }}
                      >
                        {product.name}
                      </div>
                      {product.name_meta && (
                        <div
                          className="text-xs mt-1"
                          style={{ color: colors.textLight }}
                        >
                          {product.name_meta}
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
                        {product.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${colors.success}10`,
                          color: colors.success,
                        }}
                      >
                        {product.subcategory?.name || "N/A"}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap font-medium"
                      style={{ color: colors.text }}
                    >
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.sale_price ? (
                        <span
                          className="font-medium"
                          style={{ color: colors.success }}
                        >
                          {formatPrice(product.sale_price)}
                        </span>
                      ) : (
                        <span style={{ color: colors.textLight }}>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 10
                            ? "bg-green-100 text-green-700"
                            : product.stock > 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleManageImages(product)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg transition-all"
                        style={{
                          backgroundColor: `${colors.primary}10`,
                          color: colors.primary,
                        }}
                      >
                        <ImageIcon size={14} />
                        <span className="text-xs">Manage</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleManageReviews(product)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg transition-all"
                        style={{
                          backgroundColor: `${colors.success}10`,
                          color: colors.success,
                        }}
                      >
                        <MessageSquare size={14} />
                        <span className="text-xs">Reviews</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          fetchProductFeatures(product.id);
                          setShowFeatureModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg"
                        style={{
                          backgroundColor: `${colors.warning}10`,
                          color: colors.warning,
                        }}
                      >
                        <ThumbsUp size={14} />
                        <span className="text-xs">Features</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          fetchProductSpecifications(product.id);
                          setShowSpecModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg"
                        style={{
                          backgroundColor: `${colors.primary}10`,
                          color: colors.primary,
                        }}
                      >
                        <FileText size={14} />
                        <span className="text-xs">Specs</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(product)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          product.status === 1 || product.status === true
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {product.status === 1 || product.status === true
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEdit(product)}
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
                        onClick={() => setDeleteConfirm(product)}
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

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="rounded-lg w-full max-w-4xl p-6 relative shadow-xl max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
            }}
          >
            {/* Modal Header */}
            <div
              className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2"
              style={{ backgroundColor: colors.background }}
            >
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-all"
              >
                <X size={20} style={{ color: colors.textLight }} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category and Subcategory Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category Dropdown */}
                <div>
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
                    <p
                      className="mt-1 text-sm"
                      style={{ color: colors.danger }}
                    >
                      {formErrors.category_id}
                    </p>
                  )}
                </div>

                {/* Subcategory Dropdown */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Subcategory *
                  </label>
                  <select
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={handleInputChange}
                    disabled={!formData.category_id}
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.subcategory_id ? colors.danger : colors.border}`,
                      color: colors.text,
                      opacity: !formData.category_id ? 0.6 : 1,
                    }}
                  >
                    <option value="">Select a subcategory</option>
                    {filteredSubcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.subcategory_id && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: colors.danger }}
                    >
                      {formErrors.subcategory_id}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Product Name *
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
                  placeholder="Enter product name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Meta Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
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
              </div>

              {/* Price and Stock Row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.muted }}
                    />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.price ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {formErrors.price && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: colors.danger }}
                    >
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Sale Price (₹)
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.muted }}
                    />
                    <input
                      type="number"
                      name="sale_price"
                      value={formData.sale_price}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.sale_price ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {formErrors.sale_price && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: colors.danger }}
                    >
                      {formErrors.sale_price}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Stock *
                  </label>
                  <div className="relative">
                    <Package
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.muted }}
                    />
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${formErrors.stock ? colors.danger : colors.border}`,
                        color: colors.text,
                      }}
                      placeholder="0"
                      min="0"
                      step="1"
                    />
                  </div>
                  {formErrors.stock && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: colors.danger }}
                    >
                      {formErrors.stock}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Description *
                </label>
                <div className="relative">
                  <FileText
                    size={16}
                    className="absolute left-3 top-3"
                    style={{ color: colors.muted }}
                  />

                  <CustomTextEditor
                    value={formData.description}
                    height={300}
                    placeholder="Enter product description..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${formErrors.description ? colors.danger : colors.border}`,
                      color: colors.text,
                    }}
                    onChange={(content) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: content,
                      }))
                    }
                  />
                </div>
                {formErrors.description && (
                  <p className="mt-1 text-sm" style={{ color: colors.danger }}>
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Meta Description */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Meta Description (SEO)
                </label>
                <textarea
                  name="description_meta"
                  value={formData.description_meta}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="Enter meta description for SEO"
                />
              </div>

              {/* Shipping Policy */}
              <div>
                <label
                  className="block text-sm font-medium mb-2 flex items-center gap-2"
                  style={{ color: colors.text }}
                >
                  <Truck size={16} /> Shipping Policy
                </label>

                <CustomTextEditor
                  value={formData.shipping_policy}
                  height={250}
                  placeholder="Enter shipping policy..."
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  onChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      shipping_policy: content,
                    }))
                  }
                />
              </div>

              {/* Shipping Policy Meta */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Shipping Policy Meta
                </label>
                <input
                  type="text"
                  name="shipping_policy_meta"
                  value={formData.shipping_policy_meta}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="Enter shipping policy meta"
                />
              </div>

              {/* Return Policy */}
              <div>
                <label
                  className="block text-sm font-medium mb-2 flex items-center gap-2"
                  style={{ color: colors.text }}
                >
                  <RotateCcw size={16} /> Return Policy
                </label>

                <CustomTextEditor
                  value={formData.return_policy}
                  height={250}
                  placeholder="Enter return policy..."
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  onChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      return_policy: content,
                    }))
                  }
                />
              </div>

              {/* Return Policy Meta */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  Return Policy Meta
                </label>
                <input
                  type="text"
                  name="return_policy_meta"
                  value={formData.return_policy_meta}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                  }}
                  placeholder="Enter return policy meta"
                />
              </div>

              {/* Status Checkbox */}
              <div>
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
                  Enable to make this product visible to users
                </p>
              </div>

              {/* Modal Footer */}
              <div
                className="flex justify-end gap-3 pt-4 border-t"
                style={{ borderColor: colors.border }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                    <span>{editingProduct ? "Update" : "Save"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Management Modal */}
      {showImageModal && selectedProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="rounded-lg w-full max-w-4xl p-6 relative shadow-xl max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
            }}
          >
            {/* Modal Header */}
            <div
              className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2"
              style={{ backgroundColor: colors.background }}
            >
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  Manage Images - {selectedProduct.name}
                </h2>
                <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                  Add, remove and manage product images
                </p>
              </div>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedProduct(null);
                  setProductImages([]);
                  setImagePreview(null);
                  setImageFormData({
                    image: null,
                    image_alt: "",
                    is_thumbnail: false,
                    sort_order: 0,
                  });
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition-all"
              >
                <X size={20} style={{ color: colors.textLight }} />
              </button>
            </div>

            {/* Image Upload Form */}
            <div
              className="mb-8 p-4 rounded-lg"
              style={{ backgroundColor: colors.cardBg }}
            >
              <h3 className="font-medium mb-4" style={{ color: colors.text }}>
                Upload New Image
              </h3>
              <form onSubmit={handleImageUpload} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {/* Image Preview */}
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-opacity-100 transition-all mb-4"
                      style={{
                        borderColor: colors.border,
                        minHeight: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={() =>
                        document.getElementById("image-upload").click()
                      }
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-32 mx-auto object-contain"
                        />
                      ) : (
                        <div>
                          <Upload
                            size={32}
                            className="mx-auto mb-2"
                            style={{ color: colors.muted }}
                          />
                          <p style={{ color: colors.textLight }}>
                            Click to select image
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
                      id="image-upload"
                      name="image"
                      accept="image/*"
                      onChange={handleImageInputChange}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-4">
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
                        value={imageFormData.image_alt}
                        onChange={handleImageInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                        placeholder="Enter image alt text"
                      />
                    </div>

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
                        value={imageFormData.sort_order}
                        onChange={handleImageInputChange}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                        placeholder="0"
                        min="0"
                        step="1"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_thumbnail"
                          checked={imageFormData.is_thumbnail}
                          onChange={handleImageInputChange}
                          className="w-4 h-4 rounded"
                          style={{
                            accentColor: colors.primary,
                          }}
                        />
                        <span style={{ color: colors.text }}>
                          Set as thumbnail
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingImage || !imageFormData.image}
                      className="w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#FFFFFF",
                        border: `1px solid ${colors.primary}`,
                      }}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          <span>Upload Image</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Image List */}
            <div>
              <h3 className="font-medium mb-4" style={{ color: colors.text }}>
                Product Images
              </h3>
              {loadingImages ? (
                <div className="text-center py-8">
                  <Loader
                    className="animate-spin mx-auto"
                    size={30}
                    style={{ color: colors.primary }}
                  />
                </div>
              ) : productImages.length === 0 ? (
                <div
                  className="text-center py-8"
                  style={{ color: colors.textLight }}
                >
                  No images uploaded yet
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {productImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative group rounded-lg overflow-hidden border"
                      style={{ borderColor: colors.border }}
                    >
                      <img
                        src={getImageUrl(image.image)}
                        alt={image.image_alt || selectedProduct.name}
                        className="w-full h-40 object-cover"
                      />

                      {/* Thumbnail Badge */}
                      {image.is_thumbnail === 1 && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                          <Star size={12} className="inline mr-1" />
                          Thumbnail
                        </div>
                      )}

                      {/* Image Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setDeleteImageConfirm(image)}
                          className="p-2 rounded-full bg-white hover:bg-gray-100 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} style={{ color: colors.danger }} />
                        </button>
                      </div>

                      {/* Sort Order Badge */}
                      <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-semibold bg-black bg-opacity-50 text-white">
                        Sort: {image.sort_order}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Management Modal */}
      {showReviewModal && selectedProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="rounded-lg w-full max-w-4xl p-6 relative shadow-xl max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
            }}
          >
            {/* Modal Header */}
            <div
              className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2"
              style={{ backgroundColor: colors.background }}
            >
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  Manage Reviews - {selectedProduct.name}
                </h2>
                <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                  Add and manage product reviews
                </p>
              </div>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedProduct(null);
                  setProductReviews([]);
                  setEditingReview(null);
                  setReviewFormData({
                    customer_name: "",
                    rating: 5,
                    review: "",
                    status: true,
                  });
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition-all"
              >
                <X size={20} style={{ color: colors.textLight }} />
              </button>
            </div>

            {/* Add/Edit Review Form */}
            <div
              className="mb-8 p-4 rounded-lg"
              style={{ backgroundColor: colors.cardBg }}
            >
              <h3 className="font-medium mb-4" style={{ color: colors.text }}>
                {editingReview ? "Edit Review" : "Add New Review"}
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Customer Name *
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: colors.muted }}
                      />
                      <input
                        type="text"
                        name="customer_name"
                        value={reviewFormData.customer_name}
                        onChange={handleReviewInputChange}
                        className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                        placeholder="Enter customer name"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Rating *
                    </label>
                    <select
                      name="rating"
                      value={reviewFormData.rating}
                      onChange={handleReviewInputChange}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                    >
                      <option value="5">5 Stars - Excellent</option>
                      <option value="4">4 Stars - Very Good</option>
                      <option value="3">3 Stars - Good</option>
                      <option value="2">2 Stars - Fair</option>
                      <option value="1">1 Star - Poor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Review *
                  </label>
                  <textarea
                    name="review"
                    value={reviewFormData.review}
                    onChange={handleReviewInputChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="Enter customer review"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="status"
                      checked={reviewFormData.status}
                      onChange={handleReviewInputChange}
                      className="w-4 h-4 rounded"
                      style={{
                        accentColor: colors.primary,
                      }}
                    />
                    <span style={{ color: colors.text }}>Active Status</span>
                  </label>
                  <p
                    className="text-xs mt-1"
                    style={{ color: colors.textLight }}
                  >
                    Enable to make this review visible to users
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  {editingReview && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReview(null);
                        setReviewFormData({
                          customer_name: "",
                          rating: 5,
                          review: "",
                          status: true,
                        });
                      }}
                      className="px-4 py-2 rounded-lg transition-all"
                      style={{
                        border: `1px solid ${colors.border}`,
                        color: colors.textLight,
                        backgroundColor: "transparent",
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#FFFFFF",
                      border: `1px solid ${colors.primary}`,
                    }}
                  >
                    {submittingReview ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>
                        {editingReview ? "Update Review" : "Add Review"}
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Reviews List */}
            <div>
              <h3 className="font-medium mb-4" style={{ color: colors.text }}>
                Product Reviews
              </h3>
              {loadingReviews ? (
                <div className="text-center py-8">
                  <Loader
                    className="animate-spin mx-auto"
                    size={30}
                    style={{ color: colors.primary }}
                  />
                </div>
              ) : productReviews.length === 0 ? (
                <div
                  className="text-center py-8"
                  style={{ color: colors.textLight }}
                >
                  No reviews yet
                </div>
              ) : (
                <div className="space-y-4">
                  {productReviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-lg border"
                      style={{ borderColor: colors.border }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span
                              className="font-medium"
                              style={{ color: colors.text }}
                            >
                              {review.customer_name}
                            </span>
                            {renderStars(review.rating)}
                          </div>
                          <p
                            className="text-sm"
                            style={{ color: colors.textLight }}
                          >
                            {review.review}
                          </p>
                          <p
                            className="text-xs mt-2"
                            style={{ color: colors.muted }}
                          >
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReviewStatusToggle(review)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              review.status === 1 || review.status === true
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {review.status === 1 || review.status === true
                              ? "Active"
                              : "Inactive"}
                          </button>
                          <button
                            onClick={() => handleEditReview(review)}
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                            title="Edit Review"
                          >
                            <Edit2
                              size={16}
                              style={{ color: colors.primary }}
                            />
                          </button>
                          <button
                            onClick={() => setDeleteReviewConfirm(review)}
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                            title="Delete Review"
                          >
                            <Trash2
                              size={16}
                              style={{ color: colors.danger }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Feature Management Modal */}
      {showFeatureModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Features - {selectedProduct.name}
              </h2>

              <button
                onClick={() => {
                  setShowFeatureModal(false);
                  setProductFeatures([]);
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Add Feature Form */}

            <form onSubmit={handleFeatureSubmit} className="mb-6 space-y-3">
              <input
                type="text"
                name="feature"
                value={featureFormData.feature}
                onChange={handleFeatureInputChange}
                placeholder="Enter feature"
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="text"
                name="feature_meta"
                value={featureFormData.feature_meta}
                onChange={handleFeatureInputChange}
                placeholder="Feature meta"
                className="w-full border px-3 py-2 rounded"
              />

              <button
                type="submit"
                disabled={submittingFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {submittingFeature ? "Saving..." : "Add Feature"}
              </button>
            </form>

            {/* Feature List */}

            {loadingFeatures ? (
              <div className="text-center py-6">
                <Loader className="animate-spin mx-auto" />
              </div>
            ) : productFeatures.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                No features added
              </div>
            ) : (
              <ul className="space-y-3">
                {productFeatures.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex justify-between items-center border p-3 rounded"
                  >
                    <div>
                      <p className="font-medium">{feature.feature}</p>

                      <p className="text-xs text-gray-500">
                        {feature.feature_meta}
                      </p>
                    </div>

                    <button
                      onClick={() => setDeleteFeatureConfirm(feature)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Specifications modal */}
      {showSpecModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Product Specifications
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedProduct.name}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowSpecModal(false);
                  setProductSpecifications([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Add Spec Form */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <Plus size={18} className="text-blue-600" />
                Add New Specification
              </h3>

              <form onSubmit={handleSpecSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specification Key <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="spec_key"
                      value={specFormData.spec_key}
                      onChange={handleSpecInputChange}
                      placeholder="e.g., Material, Weight, Color"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specification Value{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="spec_value"
                      value={specFormData.spec_value}
                      onChange={handleSpecInputChange}
                      placeholder="e.g., Stainless Steel, 2kg, Black"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key Meta (SEO)
                    </label>
                    <input
                      name="spec_key_meta"
                      value={specFormData.spec_key_meta}
                      onChange={handleSpecInputChange}
                      placeholder="Meta description for key"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Optional for SEO
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value Meta (SEO)
                    </label>
                    <input
                      name="spec_value_meta"
                      value={specFormData.spec_value_meta}
                      onChange={handleSpecInputChange}
                      placeholder="Meta description for value"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Optional for SEO
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submittingSpec}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingSpec ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        <span>Add Specification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Spec List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Existing Specifications
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Total: {productSpecifications.length}
                </span>
              </div>

              {loadingSpecs ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <Loader
                    className="animate-spin mx-auto mb-3"
                    size={30}
                    color="#3B82F6"
                  />
                  <p className="text-gray-500">Loading specifications...</p>
                </div>
              ) : productSpecifications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <Package size={40} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500 font-medium">
                    No specifications added yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add your first specification using the form above
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {productSpecifications.map((spec) => (
                    <div
                      key={spec.id}
                      className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              Key
                            </span>
                            <h4 className="font-semibold text-gray-800">
                              {spec.spec_key}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Value
                            </span>
                            <p className="text-gray-600">{spec.spec_value}</p>
                          </div>

                          {(spec.spec_key_meta || spec.spec_value_meta) && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              {spec.spec_key_meta && (
                                <p className="text-xs text-gray-400 mb-1">
                                  <span className="font-medium">Key Meta:</span>{" "}
                                  {spec.spec_key_meta}
                                </p>
                              )}
                              {spec.spec_value_meta && (
                                <p className="text-xs text-gray-400">
                                  <span className="font-medium">
                                    Value Meta:
                                  </span>{" "}
                                  {spec.spec_value_meta}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setDeleteSpecConfirm(spec)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full"
                          title="Delete specification"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Specification Confirmation Modal */}
      {deleteSpecConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Delete Specification
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this specification? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteSpecConfirm(null)}
                disabled={specDeleteLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                onClick={() => handleSpecDelete(deleteSpecConfirm.id)}
                disabled={specDeleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {specDeleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
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
              Are you sure you want to delete product "{deleteConfirm.name}"?
              This action cannot be undone.
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

      {/* Delete Image Confirmation Modal */}
      {deleteImageConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[60]"
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
              Confirm Delete Image
            </h3>
            <p className="mb-4" style={{ color: colors.textLight }}>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteImageConfirm(null)}
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
                onClick={() => {
                  handleImageDelete(deleteImageConfirm.id);
                }}
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

      {/* Delete Review Confirmation Modal */}
      {deleteReviewConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[60]"
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
              Confirm Delete Review
            </h3>
            <p className="mb-4" style={{ color: colors.textLight }}>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteReviewConfirm(null)}
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
                onClick={() => {
                  handleReviewDelete(deleteReviewConfirm.id);
                }}
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

      {/* Delete Feature confirmation Modal */}
      {deleteFeatureConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-2 text-gray-900">
              Confirm Delete
            </h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this feature? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteFeatureConfirm(null)}
                disabled={featureDeleteLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                onClick={() => handleFeatureDelete(deleteFeatureConfirm.id)}
                disabled={featureDeleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {featureDeleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Specifications  modal*/}
      {/* {deleteSpecConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg">
            <p>Delete this specification?</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setDeleteSpecConfirm(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => handleSpecDelete(deleteSpecConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default HandleProduct;
