import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";
import { useParams, useNavigate } from "react-router-dom";
import PageHelmet from "../../component/common/PageHelmet";
import { api } from "../../utils/app";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const { category, subcategory, PSlug } = useParams();
  const navigate = useNavigate();

  const [selectedMedia, setSelectedMedia] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const videoRef = useRef(null);

  // Fetch product data based on slug
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Use PSlug from params to fetch product
        const response = await api.get(`/products/${PSlug}`);
        
        if (response.data?.status) {
          setProductData(response.data.data);
        } else {
          toast.error("Product not found");
          // navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details");
        // navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    if (PSlug) {
      fetchProductDetails();
    }
  }, [PSlug]);

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    
    const storageUrl = import.meta.env.VITE_STORAGE_URL || '';
    return `${storageUrl}/${imagePath}`;
  };

  // Prepare media array from product images
  const getMediaFromProduct = () => {
    if (!productData) return [];
    
    const media = [];
    
    // Add images from product.images
    if (productData.images && productData.images.length > 0) {
      // Sort by sort_order
      const sortedImages = [...productData.images].sort((a, b) => a.sort_order - b.sort_order);
      
      sortedImages.forEach(img => {
        media.push({
          type: "image",
          src: getImageUrl(img.image),
          thumbnail: getImageUrl(img.image),
          alt: img.image_alt || productData.name,
        });
      });
    } else {
      // Fallback image
      media.push({
        type: "image",
        src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80",
        thumbnail: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=150&fit=crop",
        alt: productData.name,
      });
    }
    
    return media;
  };

  // Format price in rupees
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-IN');
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!productData) return 0;
    const price = parseFloat(productData.price);
    const salePrice = productData.sale_price ? parseFloat(productData.sale_price) : price;
    if (salePrice < price) {
      return Math.round(((price - salePrice) / price) * 100);
    }
    return 0;
  };

  const media = getMediaFromProduct();

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

  // Prepare specifications from product.specifications
  const getProductSpecs = () => {
    if (!productData) return [];
    
    if (productData.specifications && productData.specifications.length > 0) {
      return productData.specifications.map(spec => ({
        label: spec.spec_key,
        value: spec.spec_value,
      }));
    }
    
    // Fallback specs
    return [
      { label: "Weight Range", value: "5-50 kg" },
      { label: "Material", value: "Steel + Rubber" },
      { label: "Warranty", value: "2 Years" },
      { label: "Color", value: "Black & Red" },
      { label: "Dimensions", value: "45 × 15 × 15 cm" },
      { label: "Max Load", value: "50 kg per dumbbell" },
    ];
  };

  // Prepare features from product.features
  const getProductFeatures = () => {
    if (!productData) return [];
    
    if (productData.features && productData.features.length > 0) {
      return productData.features.map(f => f.feature);
    }
    
    // Fallback features
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
  };

  // Prepare reviews from product.reviews
  const getProductReviews = () => {
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
        verified: true,
        helpful: Math.floor(Math.random() * 20) + 5, // Random helpful count
      }));
    }
    
    return [];
  };

  const productSpecs = getProductSpecs();
  const features = getProductFeatures();
  const reviews = getProductReviews();
  const discountPercentage = getDiscountPercentage();

  // Technical specifications from product data
  const technicalSpecs = productData ? [
    { label: "Material", value: productData.specifications?.find(s => s.spec_key === "Material")?.spec_value || "High-grade Steel + Rubber" },
    { label: "Weight", value: `${productData.stock || 20} kg total` },
    { label: "Maximum Load", value: `${productData.stock * 2 || 50} kg` },
    { label: "Warranty", value: "2 Years Limited" },
    { label: "Manufacturer", value: "GymPro Equipment Co." },
    { label: "Country of Origin", value: "Made in India" },
    { label: "Certifications", value: "ISO 9001, CE Certified" },
  ] : [];

  const shippingInfo = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: productData?.shipping_policy || "On orders above ₹2,000. Delivered in 3-7 business days.",
    },
    {
      icon: Package,
      title: "Easy Installation",
      description: "Comes with detailed manual. Professional installation available.",
    },
    {
      icon: RotateCcw,
      title: productData?.return_policy ? "Return Policy" : "30-Day Returns",
      description: productData?.return_policy || "Not satisfied? Return within 30 days for full refund.",
    },
    {
      icon: ShieldCheck,
      title: "2-Year Warranty",
      description: "Covers manufacturing defects and parts replacement.",
    },
  ];

  if (loading) return <PageLoader />;
  
  if (!productData) {
    return (
      <div className="bg-[#0B0B0B] text-white min-h-screen pt-40 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl">Product not found</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHelmet title={`${productData.name} - ONE REP MORE`} />

      <div className="bg-[#0B0B0B] text-white min-h-screen pt-40 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#B3B3B3] mb-8">
            <span className="hover:text-white cursor-pointer" onClick={() => navigate("/")}>Home</span>
            <ChevronRight size={14} />
            <span className="hover:text-white cursor-pointer" onClick={() => navigate("/products")}>
              Products
            </span>
            <ChevronRight size={14} />
            {productData.category && (
              <>
                <span 
                  className="hover:text-white cursor-pointer"
                  onClick={() => navigate(`/products/${productData.category.slug}`)}
                >
                  {productData.category.name}
                </span>
                <ChevronRight size={14} />
              </>
            )}
            <span className="text-white">{productData.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* ================= LEFT : MEDIA GALLERY ================= */}
            <div>
              {/* Main Media Display */}
              <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden relative">
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
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold">
                        {media[selectedMedia].title || "Product Demonstration"}
                      </h3>
                      <p className="text-sm text-[#B3B3B3]">
                        How to use
                      </p>
                    </div>
                    <button
                      onClick={handleVideoPlay}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#E10600] flex items-center justify-center hover:bg-[#C10500] transition-all group"
                    >
                      {isPlaying ? (
                        <Pause size={24} />
                      ) : (
                        <Play size={24} className="ml-1" />
                      )}
                    </button>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70">
                        <Volume2 size={20} />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70">
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
                            ? "border-[#E10600]"
                            : "border-[#262626] hover:border-[#404040]"
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
                            <Play size={20} className="text-white" />
                          </div>
                        )}
                      </div>
                      {item.type === "video" && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#E10600] flex items-center justify-center">
                          <Play size={10} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ================= RIGHT : PRODUCT INFO ================= */}
            <div>
              <p className="text-[#E10600] text-sm font-semibold mb-2 uppercase tracking-wider">
                {productData.category?.name || "Premium Equipment"}
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                {productData.name}
                {productData.name_meta && (
                  <span className="block text-lg text-[#B3B3B3] font-normal mt-2">
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
                        i < (productData.rating || 0)
                          ? "text-[#FACC15] fill-[#FACC15]"
                          : "text-[#262626]"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-bold text-white">
                    {productData.rating?.toFixed(1) || "4.8"}
                  </span>
                </div>
                <div className="h-6 w-px bg-[#262626]" />
                <span className="text-[#B3B3B3] hover:text-white cursor-pointer">
                  {productData.review_count || 0} Reviews
                </span>
                <div className="h-6 w-px bg-[#262626]" />
                <span className="text-[#22C55E] flex items-center gap-1">
                  <CheckCircle size={16} />
                  {productData.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <div>
                  <div className="flex items-center">
                    <IndianRupee className="w-8 h-8 text-[#E10600]" />
                    <span className="text-4xl font-bold text-[#E10600] ml-1">
                      {formatPrice(productData.sale_price || productData.price)}
                    </span>
                  </div>
                  {productData.sale_price && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 text-[#B3B3B3]" />
                        <span className="line-through text-[#B3B3B3] ml-1">
                          {formatPrice(productData.price)}
                        </span>
                      </div>
                      {discountPercentage > 0 && (
                        <span className="bg-[#E10600] text-white px-3 py-1 text-sm font-bold rounded-full">
                          {discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Specifications Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {productSpecs.slice(0, 6).map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#141414] border border-[#262626]"
                  >
                    <span className="text-sm text-[#B3B3B3]">{spec.label}</span>
                    <span className="font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <span className="font-semibold block mb-3">Quantity</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#262626] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-5 py-3 hover:bg-[#0B0B0B] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-5 py-3 font-bold min-w-[60px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="px-5 py-3 hover:bg-[#0B0B0B] transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[#B3B3B3] text-sm">
                    Only {productData.stock} left in stock
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 mb-10">
                <button className="flex-1 bg-[#E10600] hover:bg-[#C10500] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:shadow-[#E10600]/30 active:scale-[0.98]">
                  <ShoppingCart size={20} /> Add to Cart
                </button>

                <button className="w-16 h-16 border-2 border-[#262626] rounded-xl flex items-center justify-center hover:border-[#E10600] hover:bg-[#E10600]/10 transition-all group">
                  <Heart
                    size={20}
                    className={`${
                      isFavorite ? "fill-[#E10600] text-[#E10600]" : ""
                    }`}
                    onClick={() => setIsFavorite(!isFavorite)}
                  />
                </button>
              </div>

              {/* Trust Icons */}
              <div className="grid grid-cols-2 gap-6">
                {shippingInfo.slice(0, 2).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#141414] border border-[#262626]"
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#E10600]/10 border border-[#E10600]/20">
                      <item.icon size={20} className="text-[#E10600]" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-[#B3B3B3]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= TABBED CONTENT SECTION ================= */}
          <div className="mt-16">
            {/* Tab Navigation */}
            <div className="flex border-b border-[#262626] mb-8">
              {[
                { id: "details", label: "Product Details" },
                { id: "reviews", label: `Reviews (${productData.review_count || 0})` },
                { id: "shipping", label: "Shipping & Returns" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 font-semibold border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-[#E10600] text-white"
                      : "border-transparent text-[#B3B3B3] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8">
              {/* Product Details Tab */}
              {activeTab === "details" && (
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">
                      Features & Benefits
                    </h3>
                    <ul className="space-y-4">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#E10600] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle size={14} />
                          </div>
                          <span className="text-[#B3B3B3]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-6">
                      Technical Specifications
                    </h3>
                    <div className="space-y-4">
                      {technicalSpecs.map((spec, index) => (
                        <div
                          key={index}
                          className="flex justify-between py-3 border-b border-[#262626]"
                        >
                          <span className="text-[#B3B3B3]">{spec.label}</span>
                          <span className="font-semibold">{spec.value}</span>
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
                      <h3 className="text-2xl font-bold mb-2">
                        Customer Reviews
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-5xl font-bold">
                            {productData.rating?.toFixed(1) || "4.8"}
                          </div>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (productData.rating || 0)
                                    ? "text-[#FACC15] fill-[#FACC15]"
                                    : "text-[#262626]"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-[#B3B3B3] mt-2">
                            Based on {productData.review_count || 0} reviews
                          </p>
                        </div>
                      </div>
                    </div>
                    <button className="px-6 py-3 rounded-lg font-semibold border-2 border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white transition-colors">
                      Write a Review
                    </button>
                  </div>

                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-6 rounded-xl border border-[#262626]"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-[#262626] flex items-center justify-center">
                                <User size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold">{review.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? "text-[#FACC15] fill-[#FACC15]"
                                            : "text-[#262626]"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-[#B3B3B3]">
                                    {review.date}
                                  </span>
                                  {review.verified && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-[#22C55E]/20 text-[#22C55E]">
                                      Verified Purchase
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button className="flex items-center gap-2 text-sm text-[#B3B3B3] hover:text-white">
                              <ThumbsUp size={16} />
                              Helpful ({review.helpful})
                            </button>
                          </div>
                          <p className="text-[#B3B3B3]">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-[#B3B3B3]">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping Tab */}
              {activeTab === "shipping" && (
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">
                      Shipping Information
                    </h3>
                    <div className="space-y-6">
                      <div className="p-6 rounded-xl border border-[#262626]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#E10600]/10">
                            <Truck size={20} className="text-[#E10600]" />
                          </div>
                          <h4 className="text-xl font-bold">Delivery</h4>
                        </div>
                        <p className="text-[#B3B3B3]">{productData.shipping_policy || "Free shipping across India within 5-7 days."}</p>
                      </div>

                      <div className="p-6 rounded-xl border border-[#262626]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#E10600]/10">
                            <RotateCcw size={20} className="text-[#E10600]" />
                          </div>
                          <h4 className="text-xl font-bold">Return Policy</h4>
                        </div>
                        <p className="text-[#B3B3B3]">{productData.return_policy || "7 day return policy for unused products."}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-6">
                      Warranty & Support
                    </h3>
                    <div className="space-y-6">
                      <div className="p-6 rounded-xl border border-[#262626]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#E10600]/10">
                            <ShieldCheck size={20} className="text-[#E10600]" />
                          </div>
                          <h4 className="text-xl font-bold">Warranty</h4>
                        </div>
                        <p className="text-[#B3B3B3]">2-Year Warranty covering manufacturing defects and parts replacement.</p>
                      </div>

                      <div className="p-6 rounded-xl border border-[#262626]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#E10600]/10">
                            <MessageCircle size={20} className="text-[#E10600]" />
                          </div>
                          <h4 className="text-xl font-bold">Need Help?</h4>
                        </div>
                        <p className="text-[#B3B3B3]">Contact our customer support for any queries about shipping, returns, or product assistance.</p>
                      </div>
                    </div>
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