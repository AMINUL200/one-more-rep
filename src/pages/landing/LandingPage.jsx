import React, { useEffect, useState } from "react";
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
import PageLoader from "../../component/common/PageLoader";
import ShopByGoal from "../../component/landingpage/ShopByGoal";
import HowItWorks from "../../component/landingpage/HowItWorks";

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 🔥 Simulate API call (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;
  return (
    <div className="bg-[#0B0B0B] text-white pt-30">
      {/* ================= HERO ================= */}
      <HeroSection />

      <ProductCategory />

      <ProductSection />
      {/* ================= FEATURED PRODUCTS ================= */}
      <FeatureProduct />

      <HowItWorks/>

      <ShopByGoal/>

      {/* ================= WHY CHOOSE US ================= */}
      <WhyChooseUs />

      {/* ================= TESTIMONIALS ================= */}
      {/* <Testimonials /> */}
    </div>
  );
};

export default LandingPage;
