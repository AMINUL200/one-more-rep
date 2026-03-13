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
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { premiumFadeUp, premiumItem } from "../../animations/motionVariants";

const ProductSection = ({ productData }) => {
  console.log("Product Data:: ", productData);
  const navigate = useNavigate();

  // Categories with icons and colors based on actual categories from product data
  const getCategoriesFromData = () => {
    if (!productData || productData.length === 0) return [];
    
    const uniqueCategories = [];
    const categoryMap = new Map();
    
    productData.forEach(product => {
      if (product.category && !categoryMap.has(product.category.id)) {
        categoryMap.set(product.category.id, {
          id: product.category.slug || `cat-${product.category.id}`,
          name: product.category.name,
          icon: getCategoryIcon(product.category.name),
          color: getCategoryColor(product.category.name),
        });
      }
    });
    
    // Add "All Products" at the beginning
    return [
      {
        id: "all",
        name: "All Products",
        icon: <ShoppingBag className="w-5 h-5" />,
        color: "from-[#E10600] to-[#FF4D4D]",
      },
      ...Array.from(categoryMap.values()),
    ];
  };

  // Get icon based on category name
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('equipment') || name.includes('machine')) return <Dumbbell className="w-5 h-5" />;
    if (name.includes('wear') || name.includes('clothing') || name.includes('shoe')) return <Shirt className="w-5 h-5" />;
    if (name.includes('supplement') || name.includes('protein')) return <Utensils className="w-5 h-5" />;
    if (name.includes('accessories')) return <Weight className="w-5 h-5" />;
    if (name.includes('cardio')) return <HeartPulse className="w-5 h-5" />;
    return <Dumbbell className="w-5 h-5" />;
  };

  // Get color based on category name
  const getCategoryColor = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('equipment') || name.includes('machine')) return "from-[#22C55E] to-[#4ADE80]";
    if (name.includes('wear') || name.includes('clothing')) return "from-[#8B5CF6] to-[#A78BFA]";
    if (name.includes('supplement')) return "from-[#FACC15] to-[#FDE047]";
    if (name.includes('accessories')) return "from-[#3B82F6] to-[#60A5FA]";
    if (name.includes('cardio')) return "from-[#EF4444] to-[#F87171]";
    return "from-[#E10600] to-[#FF4D4D]";
  };

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
    }
    
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    
    const storageUrl = import.meta.env.VITE_STORAGE_URL || '';
    return `${storageUrl}/${imagePath}`;
  };

  // Get product image (thumbnail first, then first image, then fallback)
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const thumbnail = product.images.find(img => img.is_thumbnail === 1);
      if (thumbnail) {
        return getImageUrl(thumbnail.image);
      }
      return getImageUrl(product.images[0].image);
    }
    return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
  };

  // Get badge based on product data
  const getProductBadge = (product) => {
    if (product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price)) {
      const discount = Math.round(((parseFloat(product.price) - parseFloat(product.sale_price)) / parseFloat(product.price)) * 100);
      return `${discount}% OFF`;
    }
    if (product.rating >= 4.5 && product.review_count > 5) {
      return "BEST SELLER";
    }
    if (product.stock < 5) {
      return "LOW STOCK";
    }
    return "FEATURED";
  };

  // Format price in rupees
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-IN');
  };

  const categories = getCategoriesFromData();

  // Map API products to component format
  const mapProducts = () => {
    if (!productData || productData.length === 0) return [];
    
    return productData.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category?.slug || `cat-${product.category?.id}` || "uncategorized",
      price: product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.price),
      originalPrice: parseFloat(product.price),
      rating: product.rating || 4.5,
      reviews: product.review_count || 0,
      image: getProductImage(product),
      description: product.description || "Premium quality gym equipment",
      features: product.features?.map(f => f.feature).slice(0, 3) || ["High Quality", "Durable", "Premium"],
      badge: getProductBadge(product),
      slug: product.slug,
      stock: product.stock,
    }));
  };

  const allProducts = mapProducts();

  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Filter products based on category
  useEffect(() => {
    if (!allProducts.length) return;
    
    if (activeCategory === "all") {
      const initialProducts = showAll ? allProducts : allProducts.slice(0, 3);
      setFilteredProducts(initialProducts);
    } else {
      const filtered = allProducts.filter(
        (product) => product.category === activeCategory
      );
      const limitedFiltered = showAll ? filtered : filtered.slice(0, 3);
      setFilteredProducts(limitedFiltered);
    }
  }, [activeCategory, showAll, allProducts]);

  // Benefits data
  const benefits = [
    { icon: <Truck className="w-6 h-6" />, text: "Free Shipping Over ₹999" },
    { icon: <Shield className="w-6 h-6" />, text: "2 Year Warranty" },
    { icon: <Star className="w-6 h-6" />, text: "Premium Quality" },
  ];

  // Don't render if no products
  if (!productData || productData.length === 0) {
    return (
      <div className="bg-[#0B0B0B] py-16 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#B3B3B3]">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0B] py-16 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            variants={premiumFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-5xl font-bold mb-4"
          >
            <span className="text-white">Premium </span>
            <span className="text-[#E10600]">Gym Products</span>
          </motion.h2>

          <motion.p
            variants={premiumFadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
            className="text-[#B3B3B3] text-lg md:text-xl max-w-3xl mx-auto"
          >
            Discover professional-grade equipment, supplements, and apparel
            designed for serious athletes
          </motion.p>
        </div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                  onClick={() => {
                    setActiveCategory(category.id);
                    setShowAll(false);
                  }}
                  className={`group flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-300 cursor-pointer ${
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
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-12">
          {filteredProducts.length > 0 ? (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    variants={premiumItem}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{
                      y: -10,
                      scale: 1.03,
                    }}
                    className="group bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden hover:border-[#E10600] hover:transform hover:scale-[1.02] transition-all duration-300"
                  >
                    {/* Product Image */}
                    <motion.div
                      whileHover={{ scale: 1.12 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="relative h-64 overflow-hidden"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
                        }}
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
                          {product.category}
                        </span>
                      </div>

                      {/* Stock Indicator */}
                      {product.stock < 5 && (
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-yellow-500/90 text-black text-xs font-semibold rounded-full">
                            Only {product.stock} left
                          </span>
                        </div>
                      )}
                    </motion.div>

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
                            {product.rating.toFixed(1)} ({product.reviews} {product.reviews === 1 ? 'review' : 'reviews'})
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

                      {/* Price in Rupees */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-baseline gap-2">
                            <div className="flex items-center">
                              <IndianRupee className="w-5 h-5 text-white" />
                              <span className="text-2xl font-bold text-white ml-1">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                            {product.originalPrice  && (
                              <div className="flex items-center">
                                <IndianRupee className="w-4 h-4 text-[#B3B3B3]" />
                                <span className="text-[#B3B3B3] line-through ml-1">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              </div>
                            )}
                          </div>
                          {product.originalPrice && (
                            <div className="mt-1">
                              <span className="text-[#22C55E] text-sm font-semibold">
                                Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        {/* VIEW BUTTON */}
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() =>
                            navigate(`/product-details/${product.slug || product.id}`)
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
                        </motion.button>

                        {/* ADD TO CART BUTTON */}
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
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
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
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
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
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
                : categories.find((c) => c.id === activeCategory)?.name || "Products"}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;