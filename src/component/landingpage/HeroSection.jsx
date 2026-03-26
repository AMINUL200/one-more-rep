import React, { useRef, useState } from "react";
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
  Play,
  Pause,
  Volume2,
  Maximize,
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
import { Link } from "react-router-dom";

const HeroSection = ({ heroData }) => {
  const videoRefs = useRef({});
  const [playingVideos, setPlayingVideos] = useState({});

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

    // If it's already a full URL
    if (imagePath.startsWith("http") || imagePath.startsWith("https")) {
      return imagePath;
    }

    // Assuming you have a storage URL from environment variables
    const storageUrl = import.meta.env.VITE_STORAGE_URL || "";
    return `${storageUrl}/${imagePath}`;
  };

  // Get video URL
  const getVideoUrl = (videoPath) => {
    if (!videoPath) return null;

    if (videoPath.startsWith("http") || videoPath.startsWith("https")) {
      return videoPath;
    }

    const storageUrl = import.meta.env.VITE_STORAGE_URL || "";
    return `${storageUrl}/${videoPath}`;
  };

  // Get YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Handle video play/pause
  const toggleVideoPlay = (slideId) => {
    const videoElement = videoRefs.current[slideId];
    if (videoElement) {
      if (playingVideos[slideId]) {
        videoElement.pause();
        setPlayingVideos((prev) => ({ ...prev, [slideId]: false }));
      } else {
        videoElement.play();
        setPlayingVideos((prev) => ({ ...prev, [slideId]: true }));
      }
    }
  };

  // Render media based on banner type
  // Render media based on banner type
  const renderMedia = (slide) => {
    const { banner_type, image, video, youtube_url } = slide;

    if (banner_type === "youtube" && youtube_url) {
      const videoId = getYoutubeVideoId(youtube_url);
      if (videoId) {
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* YouTube Container */}
            <div className="absolute inset-0">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-black"></div>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&showinfo=0&rel=0&disablekb=1&iv_load_policy=3&autohide=1`}
                  title="YouTube video"
                  className="absolute top-1/2 left-1/2 
                 min-w-full min-h-full 
                 w-auto h-auto 
                 -translate-x-1/2 -translate-y-1/2 
                 pointer-events-none"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-black/60 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div> */}
          </div>
        );
      }
    }

    if (banner_type === "video" && video) {
      const videoUrl = getVideoUrl(video);
      if (videoUrl) {
        return (
          <div className="absolute inset-0">
            <video
              ref={(el) => (videoRefs.current[slide.id] = el)}
              src={videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            {/* Dark Overlay */}
            {/* <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div> */}

            {/* Video Controls - Optional */}
            <button
              onClick={() => toggleVideoPlay(slide.id)}
              className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-[#E10600] transition-all duration-300"
            >
              {playingVideos[slide.id] ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white" />
              )}
            </button>
          </div>
        );
      }
    }

    // Default to image
    return (
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${getImageUrl(image)})` }}
      >
        {/* Dark Overlay */}
        {/* <div className="absolute inset-0 bg-black/60"></div> */}
        {/* Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div> */}
      </div>
    );
  };

  return (
    <div className="hero-section min-h-screen relative bg-[#0B0B0B] overflow-hidden">
      {/* Hero Slider */}
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        // modules={[EffectFade, Navigation]}
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
        {heroData && heroData.length > 0 ? (
          heroData.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                {/* Media Content */}
                {renderMedia(slide)}

                {/* Content */}
                <div className="relative h-full flex items-center z-10">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                      {/* Badge */}
                      {slide.badge_text && (
                        <motion.div
                          variants={premiumFadeUp}
                          initial="hidden"
                          animate="visible"
                          className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#E10600] rounded-lg"
                        >
                          <Dumbbell className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-semibold">
                            {slide.badge_text}
                          </span>
                        </motion.div>
                      )}

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

                      {/* CTA Buttons */}
                      <motion.div
                        variants={premiumFadeUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        {slide.button1_text && (
                          <Link
                            to={slide.button1_link || "#"}
                            className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#E10600] text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            {slide.button1_text}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        )}

                        {slide.button2_text && (
                          <Link
                            to={slide.button2_link || "#"}
                            className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-lg hover:border-[#E10600] hover:bg-[#E10600]/10 transition-all duration-300"
                          >
                            {slide.button2_text}
                          </Link>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Banner Type Indicator - Optional */}
                {/* <div className="absolute bottom-4 left-4 z-20">
                  {slide.banner_type === "youtube" && (
                    <span className="px-2 py-1 bg-red-600/80 text-white text-xs rounded-full flex items-center gap-1">
                      <Play size={12} />
                      YouTube
                    </span>
                  )}
                  {slide.banner_type === "video" && (
                    <span className="px-2 py-1 bg-green-600/80 text-white text-xs rounded-full flex items-center gap-1">
                      <Play size={12} />
                      Video
                    </span>
                  )}
                  {slide.banner_type === "image" && (
                    <span className="px-2 py-1 bg-blue-600/80 text-white text-xs rounded-full flex items-center gap-1">
                      Image
                    </span>
                  )}
                </div> */}
              </div>
            </SwiperSlide>
          ))
        ) : (
          // Fallback if no data
          <SwiperSlide>
            <div className="relative h-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)`,
                }}
              >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
              </div>
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#E10600] rounded-lg">
                      <Dumbbell className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-semibold">
                        Premium Gym Equipment
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                      Transform Your Fitness Journey
                    </h1>
                    <p className="text-[#B3B3B3] text-lg md:text-xl mb-8 max-w-xl">
                      Get professional-grade equipment delivered to your
                      doorstep. Start building your dream gym today.
                    </p>
                    <div className="flex items-center gap-3 mb-10">
                      <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                      <span className="text-white font-medium">
                        FREE Shipping Over $199
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#E10600] text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02]">
                        Shop Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-lg hover:border-[#E10600] hover:bg-[#E10600]/10 transition-all duration-300">
                        View Products
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        )}

        {/* Navigation Arrows - Only show if there's more than one slide */}
        {heroData && heroData.length > 1 && (
          <>
            <button className="hero-prev absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#E10600] transition-all duration-300">
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

            <button className="hero-next absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-black/50 border border-white/20 rounded-full flex items-center justify-center hover:bg-[#E10600] transition-all duration-300">
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
          </>
        )}
      </Swiper>
    </div>
  );
};

export default HeroSection;
