import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fadeInUp, premiumItem } from "../../animations/motionVariants";

const ProductCategory = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const categories = [
    {
      title: "Barbells",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      path: "/products/barbells",
    },
    {
      title: "Plates",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
      path: "/products/plates",
    },
    {
      title: "Dumbbells",
      image:
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
      path: "/products/dumbbells",
    },
    {
      title: "Strength",
      image:
        "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=600&q=80",
      path: "/products/strength",
    },
    {
      title: "Benches",
      image:
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=600&q=80",
      path: "/products/benches",
    },
    {
      title: "Cardio",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
      path: "/products/cardio",
    },
    {
      title: "Gym Wear",
      image: "/image/wear.webp",
      path: "/products/gym-wear",
    },
    {
      title: "Supplements",
      image: "/image/supplement.jpeg",
      path: "/products/supplements",
    },
    {
      title: "Accessories",
      image: "/image/accessories.webp",
      path: "/products/accessories",
    },
    {
      title: "Instrument",
      image: "/image/instrument.jpeg",
      path: "/products/accessories",
    },
  ];

  // 🔁 Duplicate for infinite loop
  const loopedCategories = [...categories, ...categories];

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    const slider = sliderRef.current;
    let scrollAmount = 0;

    const autoScroll = () => {
      if (!isDown.current) {
        slider.scrollLeft += 0.5;
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
    };

    const interval = setInterval(autoScroll, 16);
    return () => clearInterval(interval);
  }, []);

  /* ================= DRAG SCROLL ================= */
  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => (isDown.current = false);
  const handleMouseUp = () => (isDown.current = false);

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="bg-[#0B0B0B] py-16 overflow-hidden">
      <div className="max-w-full mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-12">
          <motion.h2
            variants={premiumItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl font-bold"
          >
            <span className="text-white">Shop by </span>
            <span className="text-[#E10600]">Category</span>
          </motion.h2>

          <motion.p
            variants={premiumItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-[#B3B3B3] mt-2"
          >
            Professional gym equipment & fitness essentials
          </motion.p>
        </div>

        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="
            flex gap-10 overflow-x-scroll scrollbar-hide
            cursor-grab active:cursor-grabbing select-none
          "
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {loopedCategories.map((cat, index) => (
            <div
              key={index}
              onClick={() => navigate(cat.path)}
              className="min-w-[150px] flex flex-col items-center group cursor-pointer"
            >
              {/* IMAGE */}
              <div
                className="
                  w-32 h-32 rounded-full overflow-hidden
                  border-2 border-[#262626]
                  bg-[#141414]
                  transition-all duration-300
                  group-hover:border-[#E10600]
                  group-hover:scale-105
                  group-hover:shadow-[0_0_25px_rgba(225,6,0,0.45)]
                "
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* TITLE */}
              <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-[#E10600] transition">
                {cat.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* SCROLLBAR HIDE */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ProductCategory;
