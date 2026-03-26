import { useRef } from "react";
import {
  Shield,
  Truck,
  Award,
  Headphones,
  Zap,
  TrendingUp,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import { cardItem, fadeUpPremium } from "../../animations/motionVariants";

// Map of icon names to Lucide components
const iconMap = {
  Shield: Shield,
  Truck: Truck,
  Award: Award,
  Headphones: Headphones,
  Zap: Zap,
  TrendingUp: TrendingUp,
};

const WhyChooseUs = ({ choseData }) => {

  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, {
    once: true,
    margin: "-100px",
  });

  // Sort data by short_order
  const sortedData = choseData?.sort((a, b) => a.short_order - b.short_order) || [];

  // Icon mapping based on title or short_order
  const getIconForItem = (item, index) => {
    // Map based on title keywords or use index to cycle through icons
    const title = item.title.toLowerCase();
    
    if (title.includes('quality') || title.includes('premium')) return Shield;
    if (title.includes('delivery') || title.includes('shipping')) return Truck;
    if (title.includes('price') || title.includes('guarantee')) return Award;
    if (title.includes('support') || title.includes('24/7')) return Headphones;
    if (title.includes('return') || title.includes('policy')) return Zap;
    if (title.includes('progress') || title.includes('fitness')) return TrendingUp;
    
    // Fallback: cycle through icons based on index
    const icons = [Shield, Truck, Award, Headphones, Zap, TrendingUp];
    return icons[index % icons.length];
  };

  if (!choseData || choseData.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-main to-card">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted">No data available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 bg-main relative overflow-hidden">
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
        <motion.div
          variants={fadeUpPremium}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="bg-primary-light text-brand px-4 py-2 rounded-full text-sm font-bold border border-primary/20">
              WHY US?
            </span>
          </div>

          <h2 className="text-5xl font-bold mb-6">
            <span className="text-primary">Why Choose </span>
            <span className="text-brand">One Rep More</span>
          </h2>

          <p className="text-muted text-lg max-w-3xl mx-auto">
            We're not just a gym equipment store — we're your fitness partner.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sortedData.map((item, index) => {
            const Icon = getIconForItem(item, index);
            return (
              <motion.div
                key={item.id}
                custom={index}
                variants={cardItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group relative bg-card border-2 border-theme rounded-2xl p-8 transition-all duration-500 hover:border-primary hover:shadow-primary-hover hover:-translate-y-2"
              >
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-primary">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl"></div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-primary text-2xl font-bold mb-3 group-hover:text-brand transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Stats Badge */}
                  <div className="inline-flex items-center gap-2 bg-main border border-theme px-4 py-2 rounded-lg group-hover:border-primary transition-colors duration-300">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-brand font-bold text-sm">
                      {item.badge || "Featured"}
                    </span>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          variants={fadeUpPremium}
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          className="bg-gradient-primary rounded-3xl p-12 shadow-primary-hover"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {isStatsInView && (
                  <CountUp start={0} end={10000} duration={2.5} separator="," />
                )}
                +
              </div>
              <div className="text-primary/80 font-medium">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {isStatsInView && (
                  <CountUp start={0} end={10000} duration={2.5} separator="," />
                )}
              </div>
              <div className="text-primary/80 font-medium">Premium Products</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {isStatsInView && <CountUp start={0} end={98} duration={2} />}%
              </div>
              <div className="text-primary/80 font-medium">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {isStatsInView && <CountUp start={0} end={24} duration={1.5} />}
                /7
              </div>
              <div className="text-primary/80 font-medium">Expert Support</div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;