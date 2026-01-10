import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import {
  Dumbbell,
  HeartPulse,
  Trophy,
  ArrowRight,
  CheckCircle,
  Shield,
  Truck,
  Clock,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeInUp,
  premiumFadeUp,
  slideInLeft,
  slideInRight,
} from "../../animations/motionVariants";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const HeroSection = () => {
  const heroSlides = [
    {
      id: 1,
      title: "Transform Your Fitness Journey",
      subtitle: "Premium Gym Equipment",
      description:
        "Get professional-grade equipment delivered to your doorstep. Start building your dream gym today.",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Shop Now",
      highlight: "FREE Shipping Over $199",
    },
    {
      id: 2,
      title: "Cardio Machines Sale",
      subtitle: "Up to 40% Off",
      description:
        "Premium treadmills, bikes, and ellipticals at unbeatable prices. Limited time offer.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "View Deals",
      highlight: "2-Year Warranty Included",
    },
    {
      id: 3,
      title: "Strength & Power",
      subtitle: "Built for Results",
      description:
        "Racks, benches, and weights designed for serious training. Your home gym solution.",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
      buttonText: "Explore Strength",
      highlight: "30-Day Money Back Guarantee",
    },
  ];

  const benefits = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping",
      description: "Over $199",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "2-Year Warranty",
      description: "On all products",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Expert help",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Quality",
      description: "Commercial grade",
    },
  ];

  return (
    <div className="hero-section min-h-screen relative bg-[#0B0B0B] overflow-hidden">
      {/* Hero Slider */}
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={1000}
        loop={true}
        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}
        className="w-full h-screen py-2! md:h-[90vh] lg:h-[95vh]"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    {/* Badge */}
                    <motion.div
                      variants={premiumFadeUp}
                      initial="hidden"
                      animate="visible"
                      className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#E10600] rounded-lg"
                    >
                      <Dumbbell className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-semibold">
                        {slide.subtitle}
                      </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                      variants={slideInLeft}
                      initial="hidden"
                      animate="visible"
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                    >
                      {slide.title}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                      variants={premiumFadeUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 }}
                      className="text-[#B3B3B3] text-lg md:text-xl mb-8 max-w-xl"
                    >
                      {slide.description}
                    </motion.p>

                    {/* Highlight */}
                    <motion.div
                      variants={premiumFadeUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3 mb-10"
                    >
                      <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                      <span className="text-white font-medium">
                        {slide.highlight}
                      </span>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                      variants={premiumFadeUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.4 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#E10600] text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02]">
                        {slide.buttonText}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-lg hover:border-[#E10600] hover:bg-[#E10600]/10 transition-all duration-300">
                        View Products
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Arrows */}
        <button className="hero-prev absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#E10600] transition-all duration-300">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button className="hero-next absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#E10600] transition-all duration-300">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </Swiper>
    </div>
  );
};

export default HeroSection;
