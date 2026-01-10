import React, { useState } from "react";
import { Play, ShieldCheck, Dumbbell, Box, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { premiumFadeUp, premiumItem } from "../../animations/motionVariants";

const PRODUCT_DATA = {
  dumbbells: {
    title: "Adjustable Dumbbells",
    video: "https://www.youtube.com/embed/2yjwXTZQDDI",
    steps: [
      "Choose required weight plates",
      "Lock plates securely",
      "Perform exercises safely",
      "Store compactly after workout",
    ],
  },
  barbells: {
    title: "Olympic Barbells",
    video: "https://www.youtube.com/embed/1oed-UmAxFs",
    steps: [
      "Load plates evenly",
      "Secure with collars",
      "Maintain proper grip",
      "Lift with correct posture",
    ],
  },
  cardio: {
    title: "Cardio Equipment",
    video: "https://www.youtube.com/embed/ml6cT4AZdqI",
    steps: [
      "Select workout program",
      "Adjust speed & incline",
      "Track heart rate",
      "Cool down safely",
    ],
  },
  accessories: {
    title: "Gym Accessories",
    video: "https://www.youtube.com/embed/UItWltVZZmE",
    steps: [
      "Select correct accessory",
      "Use as per exercise",
      "Improve form & safety",
      "Clean & store properly",
    ],
  },
};

const HowItWorks = () => {
  const [active, setActive] = useState("dumbbells");
  const navigate = useNavigate();
  const product = PRODUCT_DATA[active];

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
            <span className="text-white">How It </span>
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
            Learn how our gym equipment is designed to help you train smarter,
            safer, and stronger.
          </motion.p>
        </div>

        {/* TABS */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {Object.keys(PRODUCT_DATA).map((key) => (
            <motion.button
              key={key}
              layout
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              onClick={() => setActive(key)}
              className={`px-6 py-3 rounded-xl border font-semibold transition-all
      ${
        active === key
          ? "bg-[#E10600] text-white border-transparent shadow-lg scale-105"
          : "bg-[#141414] border-[#262626] text-[#B3B3B3] hover:border-[#E10600] hover:text-white"
      }
    `}
            >
              {PRODUCT_DATA[key].title}
            </motion.button>
          ))}
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* VIDEO */}
            <motion.div
              variants={premiumItem}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden border border-[#262626] bg-black"
            >
              <iframe
                src={product.video}
                title={product.title}
                className="w-full h-[320px] md:h-[400px]"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <div className="absolute top-4 left-4 bg-[#E10600] px-4 py-2 rounded-full text-white font-bold text-sm flex items-center gap-2">
                <Play size={16} /> Demo Video
              </div>
            </motion.div>

            {/* STEPS */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Using {product.title}
              </h3>

              <ul className="space-y-4 mb-8">
                {product.steps.map((step, i) => (
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

              {/* BENEFITS */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Beginner Friendly",
                  "Trainer Recommended",
                  "Safe & Durable",
                  "Space Saving Design",
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex items-center gap-3 bg-[#141414] border border-[#262626] p-4 rounded-xl"
                  >
                    <ShieldCheck className="text-[#E10600]" />
                    <span className="text-white text-sm font-medium">
                      {text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 220 }}
                onClick={() => navigate(`/products/${active}`)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#E10600] hover:bg-red-700 text-white font-bold rounded-lg transition-all hover:shadow-[0_0_25px_rgba(225,6,0,0.5)]"
              >
                View {product.title}
                <ArrowRight />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HowItWorks;
