import React from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Weight,
  Home,
  Heart,
  Target,
  Dumbbell,
  Scale,
  Zap,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { premiumFadeUp, premiumItem } from "../../animations/motionVariants";

const ShopByGoal = ({ goalData }) => {
  
  // Map of icon names to Lucide components based on title keywords
  const getIconForGoal = (title) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('muscle') || titleLower.includes('build')) return TrendingUp;
    if (titleLower.includes('weight') || titleLower.includes('lose')) return Scale;
    if (titleLower.includes('home')) return Home;
    if (titleLower.includes('cardio') || titleLower.includes('endurance')) return Heart;
    if (titleLower.includes('beginner')) return UserCheck;
    if (titleLower.includes('strength') || titleLower.includes('power')) return Weight;
    
    // Default icons based on index or fallback
    const defaultIcons = [Dumbbell, Target, Zap, Scale, UserCheck, Weight];
    return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
  };

  // Get color based on goal title or index
  const getColorForGoal = (title, index) => {
    const colors = [
      "var(--color-primary)",  // Red
      "var(--color-success)",   // Green
      "#3B82F6",                // Blue
      "var(--color-warning)",   // Yellow
      "#8B5CF6",                // Purple
      "#F97316",                // Orange
    ];
    
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('muscle')) return colors[0];
    if (titleLower.includes('weight')) return colors[1];
    if (titleLower.includes('home')) return colors[2];
    if (titleLower.includes('cardio')) return colors[3];
    if (titleLower.includes('beginner')) return colors[4];
    if (titleLower.includes('strength')) return colors[5];
    
    return colors[index % colors.length];
  };

  // Get gradient based on color
  const getGradient = (color) => {
    const gradients = {
      "var(--color-primary)": "from-brand to-[#B30000]",
      "var(--color-success)": "from-success to-[#16A34A]",
      "#3B82F6": "from-[#3B82F6] to-[#2563EB]",
      "var(--color-warning)": "from-warning to-[#EAB308]",
      "#8B5CF6": "from-[#8B5CF6] to-[#7C3AED]",
      "#F97316": "from-[#F97316] to-[#EA580C]",
    };
    return gradients[color] || "from-brand to-[#B30000]";
  };

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop";
    
    // If it's already a full URL
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    
    // Assuming you have a storage URL from environment variables
    const storageUrl = import.meta.env.VITE_STORAGE_URL || '';
    return `${storageUrl}/${imagePath}`;
  };

  // Get section data (first item or default)
  const sectionData = goalData?.sections?.[0] || {
    badge_text: "Shop By Your Goals",
    title: "Achieve Your Fitness Goals",
    description: "People don't always think in products — they think in goals. Find the perfect equipment for your fitness journey."
  };

  // Sort goals by sort_order
  const sortedGoals = goalData?.goals?.sort((a, b) => a.sort_order - b.sort_order) || [];

  if (!goalData || !goalData.goals || goalData.goals.length === 0) {
    return (
      <section className="py-16 px-4 md:px-8 bg-main">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted">No goals data available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 px-4 md:px-8 bg-main">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            variants={premiumFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="inline-block mb-3"
          >
            <span
              className="bg-primary-light text-brand px-4 py-2 rounded-full text-sm font-bold border border-primary/20"
              // style={{
              //   backgroundColor: 'var(--color-primary-light)',
              //   color: 'var(--color-primary)',
              //   border: '1px solid var(--color-primary)',
              //   opacity: 0.3,
              // }}
            >
              {sectionData.badge_text || "Shop By Your Goals"}
            </span>
          </motion.div>

          <motion.h2
            variants={premiumFadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <span className="text-primary">{sectionData.title || "Achieve Your "}</span>
            <span className="text-brand"> Fitness Goals</span>
          </motion.h2>

          <motion.p
            variants={premiumFadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg max-w-2xl mx-auto text-muted"
          >
            {sectionData.description || "People don't always think in products — they think in goals. Find the perfect equipment for your fitness journey."}
          </motion.p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sortedGoals.map((goal, index) => {
            const Icon = getIconForGoal(goal.title);
            const goalColor = getColorForGoal(goal.title, index);
            const gradient = getGradient(goalColor);
            
            // Create products array from tags
            const products = [
              goal.tag1,
              goal.tag2,
              goal.tag3,
            ].filter(tag => tag); // Filter out null/empty tags

            return (
              <Link key={goal.id} to={`#`} className="group block">
                <motion.div
                  whileHover={{ y: -14, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 160, damping: 18 }}
                  className="h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl card"
                >
                  {/* Image with Gradient Overlay */}
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-48 overflow-hidden"
                  >
                    <img
                      src={getImageUrl(goal.image)}
                      alt={goal.image_alt || goal.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop";
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(to bottom, transparent 0%, ${goalColor}20 100%)`,
                      }}
                    />

                    {/* Goal Icon */}
                    <div className="absolute top-4 right-4">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 220 }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm"
                        style={{
                          backgroundColor: `${goalColor}20`,
                          border: `2px solid ${goalColor}30`,
                        }}
                      >
                        <Icon size={24} style={{ color: goalColor }} />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3
                          className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform text-primary"
                        >
                          {goal.title}
                        </h3>
                        <p className="text-sm text-muted">
                          {goal.description}
                        </p>
                      </div>

                      {/* Arrow Icon */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 -translate-x-2 transition-all duration-300"
                        style={{
                          backgroundColor: `${goalColor}20`,
                          border: `1px solid ${goalColor}30`,
                        }}
                      >
                        <ArrowRight size={18} style={{ color: goalColor }} />
                      </div>
                    </div>

                    {/* Product Tags */}
                    {products.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {products.slice(0, 3).map((product, idx) => (
                          <motion.span
                            key={idx}
                            whileHover={{ scale: 1.08 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="px-3 py-1 text-xs rounded-full transition-all group-hover:scale-105"
                            style={{
                              backgroundColor: `${goalColor}10`,
                              color: goalColor,
                              border: `1px solid ${goalColor}20`,
                            }}
                          >
                            {product}
                          </motion.span>
                        ))}
                        {products.length > 3 && (
                          <span
                            className="px-3 py-1 text-xs rounded-full bg-border text-muted"
                          >
                            +{products.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Gradient Border */}
                  <div
                    className="h-1 w-0 group-hover:w-full transition-all duration-500"
                    style={{
                      background: `linear-gradient(90deg, ${goalColor}, ${goalColor}80)`,
                    }}
                  />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopByGoal;