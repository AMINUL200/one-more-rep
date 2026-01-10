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

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: Shield,
      title: "Premium Quality",
      description:
        "100% authentic gym equipment from trusted brands. Every product is quality-tested and certified.",
      stats: "5000+ Reviews",
    },
    {
      id: 2,
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Free shipping on orders over $100. Get your equipment delivered to your doorstep within 3-5 days.",
      stats: "2-3 Days",
    },
    {
      id: 3,
      icon: Award,
      title: "Best Price Guarantee",
      description:
        "Competitive prices with exclusive deals. We match any lower price you find elsewhere.",
      stats: "Save Up to 40%",
    },
    {
      id: 4,
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Expert fitness advisors ready to help. Get personalized recommendations and instant support.",
      stats: "Always Available",
    },
    {
      id: 5,
      icon: Zap,
      title: "Easy Returns",
      description:
        "30-day hassle-free returns. Not satisfied? Send it back with no questions asked.",
      stats: "30-Day Policy",
    },
    {
      id: 6,
      icon: TrendingUp,
      title: "Fitness Progress",
      description:
        "Free workout plans and nutrition guides with every purchase. Track your progress with our app.",
      stats: "Free Resources",
    },
  ];

  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <section className="py-20 bg-gradient-to-b from-[#0B0B0B] to-[#141414] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #E10600 1px, transparent 1px)`,
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
            <span className="bg-[#E10600]/10 text-[#E10600] px-4 py-2 rounded-full text-sm font-bold border border-[#E10600]/20">
              WHY US?
            </span>
          </div>

          <h2 className="text-5xl font-bold mb-6">
            <span className="text-white">Why Choose </span>
            <span className="text-[#E10600]">One Rep More</span>
          </h2>

          <p className="text-[#B3B3B3] text-lg max-w-3xl mx-auto">
            We're not just a gym equipment store — we're your fitness partner.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                custom={index}
                variants={cardItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group relative bg-[#141414] border-2 border-[#262626] rounded-2xl p-8 transition-all duration-500 hover:border-[#E10600] hover:shadow-[0_0_40px_rgba(225,6,0,0.3)] hover:-translate-y-2"
              >
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E10600] to-[#FF0800] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_0_20px_rgba(225,6,0,0.4)]">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-[#E10600] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl"></div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-white text-2xl font-bold mb-3 group-hover:text-[#E10600] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-[#B3B3B3] leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Stats Badge */}
                  <div className="inline-flex items-center gap-2 bg-[#0B0B0B] border border-[#262626] px-4 py-2 rounded-lg group-hover:border-[#E10600] transition-colors duration-300">
                    <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></div>
                    <span className="text-[#E10600] font-bold text-sm">
                      {feature.stats}
                    </span>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#E10600]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
          className="bg-gradient-to-r from-[#E10600] to-[#FF0800] rounded-3xl p-12 shadow-[0_0_60px_rgba(225,6,0,0.4)]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {isStatsInView && (
                  <CountUp start={0} end={10000} duration={2.5} separator="," />
                )}
                +
              </div>
              <div className="text-white/80 font-medium">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {isStatsInView && (
                  <CountUp start={0} end={10000} duration={2.5} separator="," />
                )}
              </div>
              <div className="text-white/80 font-medium">Premium Products</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {isStatsInView && <CountUp start={0} end={98} duration={2} />}%
              </div>
              <div className="text-white/80 font-medium">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {isStatsInView && <CountUp start={0} end={24} duration={1.5} />}
                /7
              </div>
              <div className="text-white/80 font-medium">Expert Support</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={fadeUpPremium}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Fitness Journey?
          </h3>
          <p className="text-[#B3B3B3] mb-8 text-lg">
            Join thousands of athletes who trust One Rep More for their training
            needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 220 }}
              className="px-8 py-4 bg-[#E10600] hover:bg-[#FF0800] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(225,6,0,0.6)] hover:scale-105"
            >
              Shop Now
            </motion.button>
            <button className="px-8 py-4 border-2 border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white font-bold rounded-lg transition-all duration-300">
              Contact Us
            </button>
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
