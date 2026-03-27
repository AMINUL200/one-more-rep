import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const FellowThinks = ({ fellowData }) => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [muted, setMuted] = useState({}); // Store mute state per video
  const videoRefs = useRef({});
  const youtubeRefs = useRef({});

  // Get video URL
  const getVideoUrl = (videoPath) => {
    if (!videoPath) return null;
    if (videoPath.startsWith("http")) return videoPath;
    const storageUrl = import.meta.env.VITE_STORAGE_URL || "";
    return `${storageUrl}/${videoPath}`;
  };

  // Handle video hover
  const handleVideoHover = (videoId, fellow) => {
    setHoveredVideo(videoId);
    
    if (fellow.video) {
      // For uploaded videos
      const videoElement = videoRefs.current[videoId];
      if (videoElement && playingVideo !== videoId) {
        // Pause all other videos
        Object.keys(videoRefs.current).forEach((key) => {
          if (videoRefs.current[key] && key !== videoId) {
            videoRefs.current[key].pause();
          }
        });
        videoElement.currentTime = 0;
        videoElement.play().catch((err) => {
          console.log("Video play failed:", err);
        });
        setPlayingVideo(videoId);
      }
    } else if (fellow.youtube_link) {
      // For YouTube videos - we need to reload iframe to unmute
      const iframe = youtubeRefs.current[videoId];
      if (iframe && !muted[videoId]) {
        // YouTube iframe will handle autoplay
      }
    }
  };

  // Handle video leave
  const handleVideoLeave = (videoId) => {
    setHoveredVideo(null);
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      videoElement.pause();
      setPlayingVideo(null);
    }
  };

  // Toggle mute for uploaded videos
  const toggleMute = (videoId, e) => {
    e.stopPropagation();
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      const newMutedState = !videoElement.muted;
      videoElement.muted = newMutedState;
      setMuted(prev => ({ ...prev, [videoId]: newMutedState }));
    }
  };

  // Toggle mute for YouTube videos
  const toggleYoutubeMute = (videoId, e) => {
    e.stopPropagation();
    const iframe = youtubeRefs.current[videoId];
    if (iframe && iframe.contentWindow) {
      const newMutedState = !muted[videoId];
      setMuted(prev => ({ ...prev, [videoId]: newMutedState }));
      
      // Post message to YouTube iframe to control mute
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: newMutedState ? 'mute' : 'unMute',
        }),
        '*'
      );
    }
  };

  // Get YouTube embed URL with mute state
  const getYouTubeEmbedUrl = (url, videoId, isHovered, isMuted) => {
    const youtubeId = getYouTubeId(url);
    if (!youtubeId) return null;
    
    const autoplay = isHovered ? 1 : 0;
    const mute = isMuted ? 1 : 0;
    
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay}&mute=${mute}&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`;
  };

  // Updated function to get YouTube ID from various URL formats
  const getYouTubeId = (url) => {
    if (!url) return null;
    
    // Regular expression for standard YouTube URLs
    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    let match = url.match(regExp);
    
    // If not found, try for YouTube shorts URL
    if (!match) {
      const shortsRegExp = /youtube\.com\/shorts\/([^&\n?#]+)/;
      match = url.match(shortsRegExp);
    }
    
    // If still not found, try for embed URL
    if (!match) {
      const embedRegExp = /youtube\.com\/embed\/([^&\n?#]+)/;
      match = url.match(embedRegExp);
    }
    
    return match ? match[1] : null;
  };

  // Check if button exists
  const hasButton = (fellow) => {
    return fellow.button_name && fellow.button_name.trim() !== "" && 
           fellow.button_url && fellow.button_url.trim() !== "";
  };

  if (!fellowData || fellowData.length === 0) {
    return null;
  }

  return (
    <section className="py-8 bg-main relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="text-primary">What Our </span>
            <span className="text-brand">Fellows Think</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Real stories from our community members who transformed their
            fitness journey with us
          </p>
        </div>

        {/* Video Carousel */}
        <div className="relative px-16">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next-fellow",
              prevEl: ".swiper-button-prev-fellow",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={800}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            className="pb-8"
          >
            {fellowData.map((fellow) => {
              const isVideoMuted = muted[fellow.id] !== undefined ? muted[fellow.id] : true;
              
              return (
                <SwiperSlide key={fellow.id}>
                  <div
                    className="group relative h-full"
                    onMouseEnter={() => handleVideoHover(fellow.id, fellow)}
                    onMouseLeave={() => handleVideoLeave(fellow.id)}
                  >
                    {/* Video Card */}
                    <div className="bg-card rounded-2xl overflow-hidden border-2 border-theme transition-all duration-300 group-hover:border-primary group-hover:shadow-primary relative h-full">
                      {/* Video Container - Fixed aspect ratio */}
                      <div className="relative bg-black aspect-[9/16] overflow-hidden cursor-pointer">
                        {/* Video Content */}
                        {fellow.video ? (
                          <video
                            ref={(el) => (videoRefs.current[fellow.id] = el)}
                            src={getVideoUrl(fellow.video)}
                            className="w-full h-full object-cover"
                            loop
                            muted={isVideoMuted}
                            playsInline
                          />
                        ) : fellow.youtube_link ? (
                          /* YouTube embed with dynamic mute control */
                          <iframe
                            ref={(el) => (youtubeRefs.current[fellow.id] = el)}
                            src={getYouTubeEmbedUrl(fellow.youtube_link, fellow.id, hoveredVideo === fellow.id, isVideoMuted)}
                            className="w-full h-full object-cover pointer-events-none"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                            title={fellow.video_title || "Fellow Video"}
                          />
                        ) : (
                          /* No media fallback */
                          <div className="flex items-center justify-center h-full text-white bg-gray-800">
                            No Video Available
                          </div>
                        )}

                        {/* Title Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 bg-black/70 text-primary text-xs font-bold rounded-full max-w-[150px] truncate">
                            {fellow.video_title || "Fellow Story"}
                          </span>
                        </div>

                        {/* Volume Control - Works for both uploaded and YouTube videos */}
                        {(fellow.video || fellow.youtube_link) && (
                          <div
                            className={`absolute top-4 right-4 z-10 transition-all duration-300 ${
                              hoveredVideo === fellow.id
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-90"
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                if (fellow.video) {
                                  toggleMute(fellow.id, e);
                                } else if (fellow.youtube_link) {
                                  toggleYoutubeMute(fellow.id, e);
                                }
                              }}
                              className="w-10 h-10 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-110"
                            >
                              {isVideoMuted ? (
                                <VolumeX size={18} className="text-primary" />
                              ) : (
                                <Volume2 size={18} className="text-primary" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Button - Absolute positioned at bottom, slides up on hover */}
                      {hasButton(fellow) && (
                        <div className="absolute bottom-0 left-0 right-0 overflow-hidden z-10">
                          <div
                            className={`p-4 transition-all duration-300 ease-out ${
                              hoveredVideo === fellow.id
                                ? "translate-y-0"
                                : "translate-y-full"
                            }`}
                          >
                            <Link
                              to={fellow.button_url}
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-primary text-primary font-bold rounded-lg transition-all duration-300 hover:shadow-primary-hover group"
                            >
                              {fellow.button_name}
                              <ExternalLink
                                size={16}
                                className="group-hover:translate-x-1 transition-transform"
                              />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Navigation Buttons */}
          {fellowData.length > 1 && (
            <>
              <button className="swiper-button-prev-fellow absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-primary hover:bg-primary-hover text-primary p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-primary">
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button className="swiper-button-next-fellow absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-primary hover:bg-primary-hover text-primary p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-primary">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Empty State if only 1 or 2 items */}
        {fellowData.length <= 2 && (
          <div className="text-center mt-8 text-muted">
            Swipe to see more stories
          </div>
        )}
      </div>

      <style jsx>{`
        .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
};

export default FellowThinks;