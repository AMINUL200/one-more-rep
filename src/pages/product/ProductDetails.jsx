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
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";

const ProductDetails = () => {
  const [loading, setLoading] = useState(true);

  // 🔥 Simulate API call (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const [selectedMedia, setSelectedMedia] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const videoRef = useRef(null);
  
  // Media array with images and video
  const media = [
    {
      type: "image",
      src: "/image/dumbset.webp",
      thumbnail: "/image/dumbset.webp",
    },
    {
      type: "image",
      src: "/image/dumset2.webp",
      thumbnail: "/image/dumset2.webp",
    },
    {
      type: "video",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail:
      "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=200&h=150&fit=crop",
      title: "How to Use - Adjustable Dumbbells",
    },
  ];
  
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
  
  const productSpecs = [
    { label: "Weight Range", value: "5-50 kg" },
    { label: "Material", value: "Steel + Rubber" },
    { label: "Warranty", value: "2 Years" },
    { label: "Color", value: "Black & Red" },
    { label: "Dimensions", value: "45 × 15 × 15 cm" },
    { label: "Max Load", value: "50 kg per dumbbell" },
  ];
  
  const reviews = [
    {
      id: 1,
      name: "Alex Johnson",
      rating: 5,
      date: "2 days ago",
      comment:
      "Excellent quality! Perfect for home workouts. The adjustable feature saves so much space.",
      verified: true,
      helpful: 24,
    },
    {
      id: 2,
      name: "Sarah Miller",
      rating: 4,
      date: "1 week ago",
      comment:
      "Great product, but delivery took longer than expected. The quality is top-notch though.",
      verified: true,
      helpful: 12,
    },
    {
      id: 3,
      name: "Mike Chen",
      rating: 5,
      date: "2 weeks ago",
      comment:
      "Best investment for my home gym. Smooth weight adjustment system.",
      verified: false,
      helpful: 8,
    },
  ];
  
  const shippingInfo = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders above ₹2,000. Delivered in 3-7 business days.",
    },
    {
      icon: Package,
      title: "Easy Installation",
      description:
      "Comes with detailed manual. Professional installation available.",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Not satisfied? Return within 30 days for full refund.",
    },
    {
      icon: ShieldCheck,
      title: "2-Year Warranty",
      description: "Covers manufacturing defects and parts replacement.",
    },
  ];
  
  if (loading) return <PageLoader />;
  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen pt-40 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#B3B3B3] mb-8">
          <span className="hover:text-white cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-white cursor-pointer">
            Strength Equipment
          </span>
          <ChevronRight size={14} />
          <span className="text-white">Adjustable Dumbbells</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ================= LEFT : MEDIA GALLERY ================= */}
          <div>
            {/* Main Media Display */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden relative">
              {media[selectedMedia].type === "image" ? (
                <img
                  src={media[selectedMedia].src}
                  alt="Product"
                  className="w-full h-[480px] object-cover"
                />
              ) : (
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
                      {media[selectedMedia].title}
                    </h3>
                    <p className="text-sm text-[#B3B3B3]">
                      Product Demonstration
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
              )}
            </div>

            {/* Thumbnail Gallery */}
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
                  {item.type === "video" && (
                    <p className="text-xs text-[#B3B3B3] mt-1 px-2 truncate w-full">
                      How to Use
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT : PRODUCT INFO ================= */}
          <div>
            <p className="text-[#E10600] text-sm font-semibold mb-2 uppercase tracking-wider">
              Premium Strength Equipment
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Adjustable Dumbbell Set
              <span className="block text-lg text-[#B3B3B3] font-normal mt-2">
                Professional Grade • Quick Weight Change
              </span>
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-[#FACC15] fill-[#FACC15]"
                  />
                ))}
                <span className="ml-2 text-lg font-bold text-white">4.8</span>
              </div>
              <div className="h-6 w-px bg-[#262626]" />
              <span className="text-[#B3B3B3] hover:text-white cursor-pointer">
                214 Reviews
              </span>
              <div className="h-6 w-px bg-[#262626]" />
              <span className="text-[#22C55E] flex items-center gap-1">
                <CheckCircle size={16} />
                500+ Sold
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <div>
                <span className="text-4xl font-bold text-[#E10600]">
                  ₹12,999
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="line-through text-[#B3B3B3]">₹15,999</span>
                  <span className="bg-[#E10600] text-white px-3 py-1 text-sm font-bold rounded-full">
                    18% OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Product Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {productSpecs.map((spec, index) => (
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
                  Only 12 left in stock
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
                    <p className="text-sm text-[#B3B3B3]">{item.description}</p>
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
              { id: "reviews", label: "Reviews (214)" },
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
                    {[
                      "Quick-adjust weight system (5-50 kg)",
                      "Premium anti-slip rubber grips",
                      "Durable steel construction with rust-resistant coating",
                      "Compact design saves 80% space compared to traditional dumbbells",
                      "Perfect for home workouts and commercial gyms",
                      "Easy weight change mechanism with secure locking system",
                      "Includes storage tray and user manual",
                      "Suitable for beginners to professional athletes",
                    ].map((feature, index) => (
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
                    {[
                      { label: "Material", value: "High-grade Steel + Rubber" },
                      { label: "Weight Increments", value: "2.5 kg steps" },
                      { label: "Maximum Load", value: "50 kg per dumbbell" },
                      { label: "Dimensions (L×W×H)", value: "45 × 15 × 15 cm" },
                      { label: "Warranty", value: "2 Years Limited" },
                      { label: "Manufacturer", value: "GymPro Equipment Co." },
                      { label: "Country of Origin", value: "Made in India" },
                      {
                        label: "Certifications",
                        value: "ISO 9001, CE Certified",
                      },
                    ].map((spec, index) => (
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
                        <div className="text-5xl font-bold">4.8</div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-[#FACC15] fill-[#FACC15]"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-[#B3B3B3] mt-2">
                          Based on 214 reviews
                        </p>
                      </div>
                      <div className="flex-1 max-w-md">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div
                            key={rating}
                            className="flex items-center gap-3 mb-2"
                          >
                            <span className="text-sm w-8">{rating} ★</span>
                            <div className="flex-1 h-2 bg-[#262626] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#FACC15] rounded-full"
                                style={{ width: `${rating * 20}%` }}
                              />
                            </div>
                            <span className="text-sm text-[#B3B3B3]">68%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className="px-6 py-3 rounded-lg font-semibold border-2 border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white transition-colors">
                    Write a Review
                  </button>
                </div>

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
                    {[
                      {
                        icon: Truck,
                        title: "Delivery Time",
                        items: [
                          "Metro Cities: 2-3 days",
                          "Other Cities: 5-7 days",
                          "Remote Areas: 7-10 days",
                        ],
                      },
                      {
                        icon: Package,
                        title: "Installation",
                        items: [
                          "Basic assembly required",
                          "Tools included",
                          "Video guide available",
                          "Professional installation: ₹499",
                        ],
                      },
                      {
                        icon: MapPin,
                        title: "Delivery Areas",
                        items: [
                          "All across India",
                          "Free shipping on orders above ₹2,000",
                          "Cash on Delivery available",
                        ],
                      },
                    ].map((section, index) => (
                      <div
                        key={index}
                        className="p-6 rounded-xl border border-[#262626]"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#E10600]/10">
                            <section.icon
                              size={20}
                              className="text-[#E10600]"
                            />
                          </div>
                          <h4 className="text-xl font-bold">{section.title}</h4>
                        </div>
                        <ul className="space-y-3">
                          {section.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-[#B3B3B3]"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#E10600]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Return & Warranty Policy
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        icon: RotateCcw,
                        title: "30-Day Return Policy",
                        description:
                          "Return within 30 days for any reason. Items must be in original condition with all packaging.",
                      },
                      {
                        icon: ShieldCheck,
                        title: "2-Year Warranty",
                        description:
                          "Covers manufacturing defects. Includes free parts replacement. Warranty registration required within 30 days of purchase.",
                      },
                      {
                        icon: Clock,
                        title: "Support Hours",
                        description:
                          "Monday to Saturday: 9 AM - 8 PM. Sunday: 10 AM - 6 PM. Email support: support@gymstore.com",
                      },
                      {
                        icon: MessageCircle,
                        title: "Need Help?",
                        description:
                          "Contact our customer support for any queries about shipping, returns, or product assistance.",
                      },
                    ].map((policy, index) => (
                      <div
                        key={index}
                        className="p-6 rounded-xl border border-[#262626]"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <policy.icon size={20} className="text-[#E10600]" />
                          <h4 className="text-lg font-bold">{policy.title}</h4>
                        </div>
                        <p className="text-[#B3B3B3]">{policy.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
