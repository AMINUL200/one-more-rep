import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Dumbbell,
  Pill,
  Shirt,
  Package,
  ShieldCheck,
  Truck,
  Lock,
  Star,
} from "lucide-react";
import HeroSection from "../../component/landingpage/HeroSection";
import ProductSection from "../../component/landingpage/ProductSection";
import FeatureProduct from "../../component/landingpage/FeatureProduct";
import WhyChooseUs from "../../component/landingpage/WhyChooseUs";
import Testimonials from "../../component/landingpage/Testimonials";
import ProductCategory from "../../component/landingpage/ProductCategory";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0B0B0B] text-white pt-30">
      {/* ================= HERO ================= */}
      <HeroSection />

      <ProductCategory />

      <ProductSection />
      {/* ================= FEATURED PRODUCTS ================= */}
      <FeatureProduct />

      {/* ================= WHY CHOOSE US ================= */}
      <WhyChooseUs />

      {/* ================= TESTIMONIALS ================= */}
      <Testimonials />
    </div>
  );
};

export default LandingPage;


