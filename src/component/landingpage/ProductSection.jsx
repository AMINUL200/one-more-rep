import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Shirt,
  Utensils,
  Weight,
  HeartPulse,
  ArrowRight,
  Star,
  ShoppingBag,
  Truck,
  Shield,
  ChevronRight,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductSection = () => {
  // Categories with icons and colors
  const navigate = useNavigate();

  const categories = [
    {
      id: "all",
      name: "All Products",
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "from-[#E10600] to-[#FF4D4D]",
    },
    {
      id: "equipment",
      name: "Equipment",
      icon: <Dumbbell className="w-5 h-5" />,
      color: "from-[#22C55E] to-[#4ADE80]",
    },
    {
      id: "wear",
      name: "Gym Wear",
      icon: <Shirt className="w-5 h-5" />,
      color: "from-[#8B5CF6] to-[#A78BFA]",
    },
    {
      id: "supplements",
      name: "Supplements",
      icon: <Utensils className="w-5 h-5" />,
      color: "from-[#FACC15] to-[#FDE047]",
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: <Weight className="w-5 h-5" />,
      color: "from-[#3B82F6] to-[#60A5FA]",
    },
    {
      id: "cardio",
      name: "Cardio",
      icon: <HeartPulse className="w-5 h-5" />,
      color: "from-[#EF4444] to-[#F87171]",
    },
  ];

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Professional Power Rack",
      category: "equipment",
      price: 899.99,
      originalPrice: 1099.99,
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Commercial grade power rack with pull-up bar",
      features: ["1000lb Capacity", "Safety Bars", "Adjustable"],
      badge: "BEST SELLER",
    },
    {
      id: 2,
      name: "Premium Protein Powder",
      category: "supplements",
      price: 49.99,
      originalPrice: 59.99,
      rating: 4.9,
      reviews: 256,
      image:
        "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Whey protein isolate, 5lb container",
      features: ["30g Protein", "Low Sugar", "Fast Absorption"],
      badge: "20% OFF",
    },
    {
      id: 3,
      name: "Performance Training Shoes",
      category: "wear",
      price: 129.99,
      originalPrice: 149.99,
      rating: 4.7,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "High-performance weightlifting shoes",
      features: ["Stable Base", "Breathable", "Durable"],
      badge: "NEW",
    },
    {
      id: 4,
      name: "Adjustable Dumbbell Set",
      category: "equipment",
      price: 349.99,
      originalPrice: 449.99,
      rating: 4.6,
      reviews: 187,
      image:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Quick-select adjustable dumbbells 5-50lb",
      features: ["Space Saving", "Quick Change", "Durable"],
      badge: "SALE",
    },
    {
      id: 5,
      name: "Compression Training Tights",
      category: "wear",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.5,
      reviews: 67,
      image:
        "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "High-performance compression tights",
      features: ["Moisture Wicking", "4-Way Stretch", "Breathable"],
      badge: "LIMITED",
    },
    {
      id: 6,
      name: "Premium Treadmill",
      category: "cardio",
      price: 1299.99,
      originalPrice: 1599.99,
      rating: 4.9,
      reviews: 312,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Commercial treadmill with incline & programs",
      features: ["12% Incline", "15 Programs", "Heart Rate Monitor"],
      badge: "PREMIUM",
    },
    {
      id: 7,
      name: "BCAA Energy Supplement",
      category: "supplements",
      price: 29.99,
      originalPrice: 39.99,
      rating: 4.4,
      reviews: 98,
      image:
        "https://images.unsplash.com/photo-1594736797933-d0a1500a6b78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Electrolyte powder with BCAA & caffeine",
      features: ["Zero Sugar", "Electrolytes", "Energy Boost"],
      badge: "NEW",
    },
    {
      id: 8,
      name: "Yoga Mat Premium",
      category: "accessories",
      price: 39.99,
      originalPrice: 49.99,
      rating: 4.3,
      reviews: 145,
      image:
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Eco-friendly 6mm thick yoga mat",
      features: ["Non-Slip", "Eco Material", "Carry Strap"],
      badge: "ECO",
    },
    {
      id: 9,
      name: "Weightlifting Belt",
      category: "accessories",
      price: 49.99,
      originalPrice: 64.99,
      rating: 4.7,
      reviews: 203,
      image:
        "https://images.unsplash.com/photo-1526402973497-0c8c1682d1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Leather weightlifting belt with prong buckle",
      features: ["Genuine Leather", "4-inch Width", "Lifetime Warranty"],
      badge: "PRO",
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(
    products.slice(0, 3)
  );
  const [showAll, setShowAll] = useState(false);

  // Filter products based on category
  useEffect(() => {
    if (activeCategory === "all") {
      const initialProducts = showAll ? products : products.slice(0, 3);
      setFilteredProducts(initialProducts);
    } else {
      const filtered = products.filter(
        (product) => product.category === activeCategory
      );
      const limitedFiltered = showAll ? filtered : filtered.slice(0, 3);
      setFilteredProducts(limitedFiltered);
    }
  }, [activeCategory, showAll]);

  // Benefits data
  const benefits = [
    { icon: <Truck className="w-6 h-6" />, text: "Free Shipping Over $99" },
    { icon: <Shield className="w-6 h-6" />, text: "2 Year Warranty" },
    { icon: <Star className="w-6 h-6" />, text: "Premium Quality" },
  ];

  return (
    <div className="bg-[#0B0B0B] py-16 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-white">Premium </span>
            <span className="text-[#E10600]">Gym Products</span>
          </h2>
          <p className="text-[#B3B3B3] text-lg md:text-xl max-w-3xl mx-auto">
            Discover professional-grade equipment, supplements, and apparel
            designed for serious athletes
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setShowAll(false);
                }}
                className={`group flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} border-transparent text-white shadow-lg scale-105`
                    : "bg-[#141414] border-[#262626] text-[#B3B3B3] hover:border-[#E10600] hover:text-white"
                }`}
              >
                <div
                  className={`${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-current"
                  }`}
                >
                  {category.icon}
                </div>
                <span className="font-medium whitespace-nowrap">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden hover:border-[#E10600] hover:transform hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#E10600] text-white text-sm font-semibold rounded-full">
                        {product.badge}
                      </span>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    {/* Product Name & Rating */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E10600] transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? "text-[#FACC15] fill-[#FACC15]"
                                  : "text-[#262626]"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[#B3B3B3] text-sm">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[#B3B3B3] text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#0B0B0B] border border-[#262626] text-[#B3B3B3] text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-white">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[#B3B3B3] line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.originalPrice > product.price && (
                          <div className="mt-1">
                            <span className="text-[#22C55E] text-sm font-semibold">
                              Save $
                              {(product.originalPrice - product.price).toFixed(
                                2
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {/* VIEW BUTTON */}
                      <button
                        onClick={() =>
                          navigate(`/product-details/${product.id}`)
                        }
                        className="
      flex-1 flex items-center justify-center gap-2
      px-5 py-3
      border-2 border-[#E10600]
      text-[#E10600]
      font-semibold
      rounded-lg
      transition-all duration-300
      hover:bg-[#E10600]
      hover:text-white
      hover:shadow-[0_0_20px_rgba(225,6,0,0.4)]
      active:scale-95
    "
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      {/* ADD TO CART BUTTON */}
                      <button
                        className="
      flex-1 flex items-center justify-center gap-2
      px-5 py-3
      bg-[#E10600]
      text-white
      font-semibold
      rounded-lg
      transition-all duration-300
      hover:bg-[#C10500]
      hover:shadow-[0_0_25px_rgba(225,6,0,0.6)]
      active:scale-95
    "
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Dumbbell className="w-16 h-16 text-[#262626] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  No Products Found
                </h3>
                <p className="text-[#B3B3B3]">
                  No products available in this category. Please check back
                  later.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View All Button */}
        {filteredProducts.length > 0 && !showAll && (
          <div className="text-center mb-16">
            <button
              onClick={() => setShowAll(true)}
              className="
      group inline-flex items-center gap-3
      px-8 py-4
      border-2 border-[#E10600]
      text-[#E10600]
      font-bold
      rounded-lg
      transition-all duration-300
      hover:bg-[#E10600]
      hover:text-white
      hover:shadow-[0_0_20px_rgba(225,6,0,0.5)]
      active:scale-95
      focus:outline-none
      focus:ring-2 focus:ring-[#E10600]/50
    "
            >
              View All{" "}
              {activeCategory === "all"
                ? "Products"
                : categories.find((c) => c.id === activeCategory)?.name}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
