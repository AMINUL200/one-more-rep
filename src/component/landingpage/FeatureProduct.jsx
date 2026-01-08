import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  ShoppingCart,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

const FeatureProduct = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Pro Adjustable Dumbbell Set",
      price: 299.99,
      originalPrice: 399.99,
      image:
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80",
      badge: "BESTSELLER",
      rating: 4.8,
      reviews: 234,
    },
    {
      id: 2,
      name: "Olympic Barbell 20KG",
      price: 189.99,
      originalPrice: 249.99,
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80",
      badge: "NEW",
      rating: 4.9,
      reviews: 156,
    },
    {
      id: 3,
      name: "Premium Resistance Bands",
      price: 49.99,
      originalPrice: 79.99,
      image:
        "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80",
      badge: "SALE",
      rating: 4.7,
      reviews: 189,
    },
    {
      id: 4,
      name: "Heavy Duty Power Rack",
      price: 899.99,
      originalPrice: 1199.99,
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
      badge: "FEATURED",
      rating: 4.9,
      reviews: 312,
    },
    {
      id: 5,
      name: "Hex Dumbbell Set 5-50lb",
      price: 599.99,
      originalPrice: 799.99,
      image:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80",
      badge: "BESTSELLER",
      rating: 4.8,
      reviews: 267,
    },
    {
      id: 6,
      name: "Competition Kettlebell 24KG",
      price: 79.99,
      originalPrice: 109.99,
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80",
      badge: "NEW",
      rating: 4.6,
      reviews: 145,
    },
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "BESTSELLER":
        return "bg-[#E10600]";
      case "NEW":
        return "bg-[#22C55E]";
      case "SALE":
        return "bg-[#FACC15] text-[#0B0B0B]";
      case "FEATURED":
        return "bg-gradient-to-r from-[#E10600] to-[#FF0800]";
      default:
        return "bg-[#E10600]";
    }
  };

  return (
    <section className="py-16 bg-[#0B0B0B]">
      <div className="max-w-8xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-white">Featured </span>
            <span className="text-[#E10600]">Products</span>
          </h2>
          <p className="text-[#B3B3B3] text-lg max-w-2xl mx-auto">
            Premium gym equipment handpicked for serious athletes. Build
            strength, build legacy.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="relative px-4 md:px-16">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              el: ".swiper-pagination-custom",
              clickable: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={800}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="pb-16"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className={`bg-[#141414] rounded-2xl overflow-hidden border-2 transition-all duration-300 h-full ${
                      hoveredCard === product.id
                        ? "border-[#E10600] shadow-[0_0_30px_rgba(225,6,0,0.4)] transform -translate-y-2"
                        : "border-[#262626]"
                    }`}
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Badge */}
                      <div
                        className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(
                          product.badge
                        )}`}
                      >
                        {product.badge}
                      </div>

                      {/* Quick Actions */}
                      <div
                        className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                          hoveredCard === product.id
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                       
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-white text-xl font-bold mb-2 line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? "text-[#FACC15]"
                                  : "text-[#262626]"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[#B3B3B3] text-sm">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[#E10600] text-2xl font-bold">
                          ${product.price}
                        </span>
                        <span className="text-[#B3B3B3] text-lg line-through">
                          ${product.originalPrice}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <div className="flex gap-3">
                        {/* VIEW BUTTON */}
                        <button
                          className="
      flex-1 flex items-center justify-center gap-2
      py-3
      border-2 border-[#E10600]
      text-[#E10600]
      font-bold
      rounded-lg
      transition-all duration-300
      hover:bg-[#E10600]
      hover:text-white
      hover:shadow-[0_0_20px_rgba(225,6,0,0.4)]
      active:scale-95
    "
                          onClick={()=> navigate(`/products/${product.id}`)}
                        >
                          
                          <Eye className="w-5 h-5" />
                          View
                        </button>

                        {/* ADD TO CART BUTTON */}
                        <button
                          className="
      flex-1 flex items-center justify-center gap-2
      py-3
      bg-[#E10600]
      text-white
      font-bold
      rounded-lg
      transition-all duration-300
      hover:bg-[#FF0800]
      hover:shadow-[0_0_25px_rgba(225,6,0,0.6)]
      active:scale-95
    "
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#E10600] hover:bg-[#FF0800] text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(225,6,0,0.5)]">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#E10600] hover:bg-[#FF0800] text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(225,6,0,0.5)]">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Custom Pagination */}
          <div className="swiper-pagination-custom flex justify-center gap-2 mt-4"></div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 ">
          <button className="group px-8 py-4 border-2 border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white font-bold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(225,6,0,0.5)]">
            View All Products
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #262626;
          opacity: 1;
          transition: all 0.3s;
          border-radius: 4px;
        }

        .swiper-pagination-custom .swiper-pagination-bullet-active {
          width: 32px;
          background: #e10600;
        }

        .swiper-pagination-custom .swiper-pagination-bullet:hover {
          background: #b3b3b3;
        }
      `}</style>
    </section>
  );
};

export default FeatureProduct;
