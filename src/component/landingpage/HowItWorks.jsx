import React, { useState } from "react";
import { Play, ShieldCheck, Dumbbell, Box, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { premiumFadeUp, premiumItem } from "../../animations/motionVariants";

const HowItWorks = ({ workData }) => {
  
  // Set initial active tab based on first item in workData
  const [activeTab, setActiveTab] = useState(workData?.[0]?.tab_name || "");
  const navigate = useNavigate();

  // Function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    let videoId = null;
    
    // Regular watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&]+)/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }
    
    // Short youtu.be URL: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/(?:youtu\.be\/)([^?]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }
    
    // Embed URL: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/(?:youtube\.com\/embed\/)([^?]+)/);
    if (embedMatch) {
      videoId = embedMatch[1];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // If no match found, return original URL (might already be embed)
    return url;
  };

  // If no data, show fallback UI
  if (!workData || workData.length === 0) {
    return (
      <section className="bg-[#0B0B0B] py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#B3B3B3]">No how it works data available</p>
        </div>
      </section>
    );
  }

  // Find active item data
  const activeItem = workData.find(item => item.tab_name === activeTab) || workData[0];

  // Create steps array from step1-step4
  const steps = [
    activeItem.step1,
    activeItem.step2,
    activeItem.step3,
    activeItem.step4,
  ].filter(step => step); // Filter out empty steps

  // Create features array from feature1-feature4
  const features = [
    activeItem.feature1,
    activeItem.feature2,
    activeItem.feature3,
    activeItem.feature4,
  ].filter(feature => feature); // Filter out empty features

  // Get embed URL
  const embedUrl = getYouTubeEmbedUrl(activeItem.youtube_url);

  return (
    <section className="bg-[#0B0B0B] py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-14">
          <motion.h2
            variants={premiumFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-5xl font-bold mb-4"
          >
            <span className="text-white">{workData[0]?.section_title || "How It "}</span>
            <span className="text-[#E10600]">Works</span>
          </motion.h2>

          <motion.p
            variants={premiumFadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
            className="text-[#B3B3B3] max-w-2xl mx-auto text-lg"
          >
            {workData[0]?.section_subtitle || "Learn how our gym equipment is designed to help you train smarter, safer, and stronger."}
          </motion.p>
        </div>

        {/* TABS */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {workData.map((item) => (
            <motion.button
              key={item.id}
              layout
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              onClick={() => setActiveTab(item.tab_name)}
              className={`px-6 py-3 rounded-xl border font-semibold transition-all
                ${
                  activeTab === item.tab_name
                    ? "bg-[#E10600] text-white border-transparent shadow-lg scale-105"
                    : "bg-[#141414] border-[#262626] text-[#B3B3B3] hover:border-[#E10600] hover:text-white"
                }
              `}
            >
              {item.tab_name}
            </motion.button>
          ))}
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* VIDEO */}
            {embedUrl && (
              <motion.div
                variants={premiumItem}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="relative rounded-2xl overflow-hidden border border-[#262626] bg-black"
              >
                <iframe
                  src={embedUrl}
                  title={activeItem.video_title || activeItem.tab_name}
                  className="w-full h-[320px] md:h-[400px]"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
                <div className="absolute top-4 left-4 bg-[#E10600] px-4 py-2 rounded-full text-white font-bold text-sm flex items-center gap-2">
                  <Play size={16} /> {activeItem.video_title || "Demo Video"}
                </div>
              </motion.div>
            )}

            {/* STEPS */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Using {activeItem.tab_name}
              </h3>

              {/* Steps List */}
              {steps.length > 0 && (
                <ul className="space-y-4 mb-8">
                  {steps.map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                      className="flex items-start gap-4 bg-[#141414] border border-[#262626] p-4 rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#E10600] text-white flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <p className="text-[#B3B3B3]">{step}</p>
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* FEATURES */}
              {features.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="flex items-center gap-3 bg-[#141414] border border-[#262626] p-4 rounded-xl"
                    >
                      <ShieldCheck className="text-[#E10600]" />
                      <span className="text-white text-sm font-medium">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* CTA */}
              {activeItem.button_text && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 220 }}
                  onClick={() => navigate(activeItem.button_link || "/products")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#E10600] hover:bg-red-700 text-white font-bold rounded-lg transition-all hover:shadow-[0_0_25px_rgba(225,6,0,0.5)]"
                >
                  {activeItem.button_text}
                  <ArrowRight />
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HowItWorks;