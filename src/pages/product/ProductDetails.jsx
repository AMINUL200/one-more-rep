import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  Maximize,
  ChevronRight,
  CheckCircle,
  Package,
  Clock,
  MapPin,
  MessageCircle,
  ThumbsUp,
  User,
  IndianRupee,
  Zap,
  Award,
  Crown,
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageHelmet from "../../component/common/PageHelmet";
import { api } from "../../utils/app";
import { toast } from "react-toastify";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";

const ProductDetails = () => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const { category, subcategory, PSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [selectedMedia, setSelectedMedia] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const videoRef = useRef(null);

  // New state for variant selection
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [availableVariants, setAvailableVariants] = useState([]);

  // Fetch product data based on slug
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${PSlug}`);
        
        if (response.data?.status) {
          const product = response.data.data;
          setProductData(product);
          
          // Set available variants from product data
          if (product.variants && product.variants.length > 0) {
            setAvailableVariants(product.variants);
            // Set first variant as default selected if variants exist
            setSelectedVariant(product.variants[0]);
          }
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (PSlug) {
      fetchProductDetails();
    }
  }, [PSlug]);

  // Get image URL
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return "";
    
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    
    const storageUrl = import.meta.env.VITE_STORAGE_URL || '';
    return `${storageUrl}/${imagePath}`;
  }, []);

  // Prepare media array from product images
  const media = useMemo(() => {
    if (!productData) return [];
    
    const mediaArray = [];
    
    if (productData.images && productData.images.length > 0) {
      const sortedImages = [...productData.images].sort((a, b) => a.sort_order - b.sort_order);
      
      sortedImages.forEach(img => {
        mediaArray.push({
          type: "image",
          src: getImageUrl(img.image),
          thumbnail: getImageUrl(img.image),
          alt: img.image_alt || productData.name,
        });
      });
    } else {
      mediaArray.push({
        type: "image",
        src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80",
        thumbnail: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=150&fit=crop",
        alt: productData.name,
      });
    }
    
    return mediaArray;
  }, [productData, getImageUrl]);

  // Format price in rupees
  const formatPrice = useCallback((price) => {
    return parseFloat(price).toLocaleString('en-IN');
  }, []);

  // Get current price based on selected variant or product
  const currentPrice = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.sale_price || selectedVariant.price;
    }
    return productData?.sale_price || productData?.price;
  }, [selectedVariant, productData]);

  // Get original price based on selected variant or product
  const originalPrice = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return productData?.price;
  }, [selectedVariant, productData]);

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (!productData) return 0;
    const price = parseFloat(originalPrice);
    const salePrice = parseFloat(currentPrice);
    if (salePrice < price) {
      return Math.round(((price - salePrice) / price) * 100);
    }
    return 0;
  }, [productData, originalPrice, currentPrice]);

  // Get current stock based on selected variant or product
  const currentStock = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.stock;
    }
    return productData?.stock;
  }, [selectedVariant, productData]);

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setQty(1); // Reset quantity when variant changes
  };

  // Prepare specifications from product.specifications
  const productSpecs = useMemo(() => {
    if (!productData) return [];
    
    if (productData.specifications && productData.specifications.length > 0) {
      return productData.specifications.map(spec => ({
        label: spec.spec_key,
        value: spec.spec_value,
      }));
    }
    
    return [
      { label: "Weight Range", value: "5-50 kg" },
      { label: "Material", value: "Steel + Rubber" },
      { label: "Warranty", value: "2 Years" },
      { label: "Color", value: "Black & Red" },
      { label: "Dimensions", value: "45 × 15 × 15 cm" },
      { label: "Max Load", value: "50 kg per dumbbell" },
    ];
  }, [productData]);

  // Prepare features from product.features
  const features = useMemo(() => {
    if (!productData) return [];
    
    if (productData.features && productData.features.length > 0) {
      return productData.features.map(f => f.feature);
    }
    
    return [
      "Quick-adjust weight system (5-50 kg)",
      "Premium anti-slip rubber grips",
      "Durable steel construction with rust-resistant coating",
      "Compact design saves 80% space compared to traditional dumbbells",
      "Perfect for home workouts and commercial gyms",
      "Easy weight change mechanism with secure locking system",
      "Includes storage tray and user manual",
      "Suitable for beginners to professional athletes",
    ];
  }, [productData]);

  // Prepare reviews from product.reviews
  const reviews = useMemo(() => {
    if (!productData) return [];
    
    if (productData.reviews && productData.reviews.length > 0) {
      return productData.reviews.map(review => ({
        id: review.id,
        name: review.customer_name,
        rating: review.rating,
        date: new Date(review.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        comment: review.review,
      }));
    }
    
    return [];
  }, [productData]);

  // Technical specifications from product data
  const technicalSpecs = useMemo(() => {
    if (!productData) return [];
    
    return [
      { label: "Material", value: productData.specifications?.find(s => s.spec_key === "Material")?.spec_value || "High-grade Steel + Rubber" },
      { label: "Weight", value: `${productData.stock || 20} kg total` },
      { label: "Maximum Load", value: `${productData.stock * 2 || 50} kg` },
      { label: "Warranty", value: "2 Years Limited" },
      { label: "Manufacturer", value: "GymPro Equipment Co." },
      { label: "Country of Origin", value: "Made in India" },
      { label: "Certifications", value: "ISO 9001, CE Certified" },
    ];
  }, [productData]);

  const shippingInfo = useMemo(() => {
    return [
      {
        icon: Truck,
        title: "Free Shipping",
        description: productData?.shipping_policy ? "Free shipping across India" : "On orders above ₹2,000. Delivered in 3-7 business days.",
      },
      {
        icon: Package,
        title: "Easy Installation",
        description: "Comes with detailed manual. Professional installation available.",
      },
      {
        icon: RotateCcw,
        title: productData?.return_policy ? "Return Policy" : "30-Day Returns",
        description: productData?.return_policy ? "7 day return policy for unused products." : "Not satisfied? Return within 30 days for full refund.",
      },
      {
        icon: ShieldCheck,
        title: "2-Year Warranty",
        description: "Covers manufacturing defects and parts replacement.",
      },
    ];
  }, [productData]);

  // Function to render HTML content safely
  const renderHTML = (htmlContent) => {
    if (!htmlContent) return null;
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (currentStock < qty) {
      toast.error(`Only ${currentStock} items available in stock`);
      return;
    }

    const cartItem = {
      product_id: productData.id,
      qty: qty,
      variant_id: selectedVariant?.id,
      name: selectedVariant ? `${productData.name} - ${selectedVariant.variant_name}` : productData.name,
      price: currentPrice,
      original_price: originalPrice,
    };

    addToCart(cartItem);
    toast.success("Added to cart successfully!");
  };

  // Handle Buy Now
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    if (!productData) {
      toast.error("Product not available");
      return;
    }

    if (currentStock < qty) {
      toast.error(`Only ${currentStock} items available in stock`);
      return;
    }

    setBuyNowLoading(true);

    try {
      // Prepare order data for single product with variant support
      const orderData = {
        products: [
          {
            product_id: productData.id,
            qty: qty,
            ...(selectedVariant && { variant_id: selectedVariant.id })
          }
        ]
      };

      console.log("Buy Now Order Data:", orderData);

      const response = await api.post("/user/checkout", orderData);

      if (response.data?.status) {
        toast.success("Order placed successfully!");
        navigate(`/checkout/${response.data.data?.id}`);
      } else {
        toast.error(response.data?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Buy Now error:", error);
      
      if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          Object.values(errors).forEach(msg => {
            toast.error(msg[0]);
          });
        } else {
          toast.error("Please check your order details");
        }
      } else {
        toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
      }
    } finally {
      setBuyNowLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  
  if (!productData) {
    return (
      <div className="bg-main text-primary min-h-screen pt-40 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl">Product not found</h2>
        </div>
      </div>
    );
  }

  // Calculate average rating from review_summary
  const averageRating = productData.review_summary?.average_rating || productData.rating || 4.5;
  const totalReviews = productData.review_summary?.total_reviews || productData.review_count || 0;

  return (
    <>
      <PageHelmet title={`${productData.name} - ONE REP MORE`} />

      <div className="bg-main text-primary min-h-screen pt-40 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <span className="hover:text-primary cursor-pointer" onClick={() => navigate("/")}>Home</span>
            <ChevronRight size={14} />
            <span className="hover:text-primary cursor-pointer" onClick={() => navigate("/products")}>
              Products
            </span>
            <ChevronRight size={14} />
            {productData.category && (
              <>
                <span 
                  className="hover:text-primary cursor-pointer"
                  onClick={() => navigate(`/products/${productData.category.slug}`)}
                >
                  {productData.category.name}
                </span>
                <ChevronRight size={14} />
              </>
            )}
            <span className="text-primary">{productData.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT : MEDIA GALLERY */}
            <div>
              {/* Main Media Display */}
              <div className="bg-card border border-theme rounded-2xl overflow-hidden relative">
                {/* Badge Section - Premium and Tag Line */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {productData.premium_product === 1 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-primary text-primary shadow-primary">
                      <Crown size={16} />
                      <span className="text-xs font-bold uppercase">Premium</span>
                    </div>
                  )}
                  {productData.tag_line && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/20 border border-success/30 text-success">
                      <Award size={14} />
                      <span className="text-xs font-semibold">{productData.tag_line}</span>
                    </div>
                  )}
                </div>

                {media[selectedMedia]?.type === "image" ? (
                  <img
                    src={media[selectedMedia].src}
                    alt={media[selectedMedia].alt || productData.name}
                    className="w-full h-[480px] object-cover"
                  />
                ) : media[selectedMedia]?.type === "video" ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={media[selectedMedia].src}
                      className="w-full h-[480px] object-cover"
                      poster={media[selectedMedia].thumbnail}
                      onEnded={handleVideoEnd}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-primary">
                      <h3 className="text-lg font-bold">
                        {media[selectedMedia].title || "Product Demonstration"}
                      </h3>
                      <p className="text-sm text-muted">
                        How to use
                      </p>
                    </div>
                    <button
                      onClick={handleVideoPlay}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:bg-primary-hover transition-all group"
                    >
                      {isPlaying ? (
                        <Pause size={24} className="text-primary" />
                      ) : (
                        <Play size={24} className="text-primary ml-1" />
                      )}
                    </button>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 text-primary">
                        <Volume2 size={20} />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 text-primary">
                        <Maximize size={20} />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Thumbnail Gallery */}
              {media.length > 1 && (
                <div className="flex gap-4 mt-6">
                  {media.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedMedia(i)}
                      className={`flex flex-col items-center border rounded-xl overflow-hidden w-28 h-28 transition-all group relative
                        ${
                          selectedMedia === i
                            ? "border-brand"
                            : "border-theme hover:border-border"
                        }`}
                    >
                      <div className="relative w-full h-full">
                        <img
                          src={item.thumbnail}
                          className="w-full h-full object-cover"
                          alt={`Thumbnail ${i + 1}`}
                        />
                        {item.type === "video" && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play size={20} className="text-primary" />
                          </div>
                        )}
                      </div>
                      {item.type === "video" && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Play size={10} className="text-primary" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT : PRODUCT INFO */}
            <div>
              <p className="text-brand text-sm font-semibold mb-2 uppercase tracking-wider">
                {productData.category?.name || "Premium Equipment"}
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-primary">
                {productData.name}
                {productData.name_meta && (
                  <span className="block text-lg text-muted font-normal mt-2">
                    {productData.name_meta}
                  </span>
                )}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < averageRating
                          ? "text-warning fill-warning"
                          : "text-border"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold text-primary">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="h-6 w-px bg-theme" />
                <span className="text-muted hover:text-primary cursor-pointer">
                  {totalReviews} Reviews
                </span>
                <div className="h-6 w-px bg-theme" />
                <span className="text-success flex items-center gap-1">
                  <CheckCircle size={16} />
                  {currentStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <div>
                  <div className="flex items-center">
                    <IndianRupee className="w-8 h-8 text-brand" />
                    <span className="text-4xl font-bold text-brand ml-1">
                      {formatPrice(currentPrice)}
                    </span>
                  </div>
                  {originalPrice > currentPrice && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 text-muted" />
                        <span className="line-through text-muted ml-1">
                          {formatPrice(originalPrice)}
                        </span>
                      </div>
                      {discountPercentage > 0 && (
                        <span className="bg-primary text-primary px-3 py-1 text-sm font-bold rounded-full">
                          {discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Variant Selection */}
              {availableVariants.length > 0 && (
                <div className="mb-8">
                  <span className="font-semibold block mb-3 text-primary">Select Variant</span>
                  <div className="grid grid-cols-2 gap-3">
                    {availableVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantSelect(variant)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedVariant?.id === variant.id
                            ? "border-brand bg-primary-light"
                            : "border-theme hover:border-border bg-card"
                        }`}
                      >
                        <p className="font-semibold text-primary mb-1">{variant.variant_name}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-brand font-bold">
                              ₹{formatPrice(variant.sale_price || variant.price)}
                            </span>
                            {variant.sale_price && (
                              <span className="text-xs text-muted line-through ml-2">
                                ₹{formatPrice(variant.price)}
                              </span>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            variant.stock > 0 
                              ? "bg-success/10 text-success" 
                              : "bg-error/10 text-error"
                          }`}>
                            {variant.stock > 0 ? `${variant.stock} left` : "Out"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Specifications Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {productSpecs.slice(0, 6).map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-theme"
                  >
                    <span className="text-sm text-muted">{spec.label}</span>
                    <span className="font-semibold text-primary">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <span className="font-semibold block mb-3 text-primary">Quantity</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-theme rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-5 py-3 hover:bg-main transition-colors text-primary"
                      disabled={buyNowLoading}
                    >
                      -
                    </button>
                    <span className="px-5 py-3 font-bold min-w-[60px] text-center text-primary">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="px-5 py-3 hover:bg-main transition-colors text-primary"
                      disabled={buyNowLoading}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-muted text-sm">
                    Only {currentStock} left in stock
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 mb-10">
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={buyNowLoading || currentStock < qty}
                  className="flex-1 bg-primary hover:bg-primary-hover text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:shadow-primary-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buyNowLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Buy Now
                    </>
                  )}
                </button>
              </div>

              {/* Stock Warning */}
              {currentStock < qty && (
                <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20">
                  <p className="text-sm text-error">
                    Only {currentStock} items available. Please reduce quantity.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* TABBED CONTENT SECTION */}
          <div className="mt-16">
            {/* Tab Navigation */}
            <div className="flex border-b border-theme mb-8">
              {[
                { id: "details", label: "Product Details" },
                { id: "reviews", label: `Reviews (${totalReviews})` },
                { id: "shipping", label: "Shipping & Returns" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 font-semibold border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-brand text-primary"
                      : "border-transparent text-muted hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-card border border-theme rounded-2xl p-8">
              {/* Product Details Tab */}
              {activeTab === "details" && (
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    {productData.description ? (
                      renderHTML(productData.description)
                    ) : (
                      <ul className="space-y-4">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle size={14} className="text-primary" />
                            </div>
                            <span className="text-muted">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-primary">Technical Specifications</h3>
                    <div className="space-y-3">
                      {technicalSpecs.map((spec, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-theme">
                          <span className="text-muted">{spec.label}</span>
                          <span className="font-medium text-primary">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-primary">
                        Customer Reviews
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-primary">
                            {averageRating.toFixed(1)}
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < averageRating
                                    ? "text-warning fill-warning"
                                    : "text-border"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted mt-2">
                            Based on {totalReviews} Reviews
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-6 rounded-xl border border-theme"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center">
                                <User size={20} className="text-muted" />
                              </div>
                              <div>
                                <h4 className="font-bold text-primary">{review.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? "text-warning fill-warning"
                                            : "text-border"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping Tab */}
              {activeTab === "shipping" && (
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    {productData.shipping_policy ? (
                      renderHTML(productData.shipping_policy)
                    ) : (
                      <div className="space-y-6">
                        <div className="p-6 rounded-xl border border-theme">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary-light">
                              <Truck size={20} className="text-brand" />
                            </div>
                            <h4 className="text-xl font-bold text-primary">Delivery</h4>
                          </div>
                          <p className="text-muted">Free shipping across India within 5-7 days.</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {productData.return_policy ? (
                      renderHTML(productData.return_policy)
                    ) : (
                      <div className="space-y-6">
                        <div className="p-6 rounded-xl border border-theme">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary-light">
                              <RotateCcw size={20} className="text-brand" />
                            </div>
                            <h4 className="text-xl font-bold text-primary">Return Policy</h4>
                          </div>
                          <p className="text-muted">7 day return policy for unused products.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;