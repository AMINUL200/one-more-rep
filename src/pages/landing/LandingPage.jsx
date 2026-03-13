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
import PageHelmet from "../../component/common/PageHelmet";
import { api } from "../../utils/app";

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState([]);
  const [workData, setWorkData] = useState([]);
  const [choseData, setChoseData] = useState([]);
  const [goalData, setGoalData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);

  const fetchLandingData = async () => {
    try {
      const [bannerRes, workRes,choseRes, goalRes, categoryRes, productRes] = await Promise.all([
        api.get("/banners"),
        api.get("/how-it-works"),
        api.get("/why-choose-us"),
        api.get("/goals"),
        api.get("/category"),
        api.get("/products"),
        
      ]);
      setBannerData(bannerRes.data.data)
      setWorkData(workRes.data.data);
      setChoseData(choseRes.data.data);
      setGoalData(goalRes.data.data);
      setCategoryData(categoryRes.data.data);
      setProductData(productRes.data.data);
      
    } catch (error) {
      console.error("Landing API Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() =>{
    fetchLandingData();
  },[])

  if (loading) return <PageLoader />;
  return (
    <>
      <PageHelmet title="Home - ONE REP MORE" />

      <div className="bg-[#0B0B0B] text-white pt-30">
        {/* ================= HERO ================= */}
        <HeroSection heroData={bannerData}/>

        <ProductCategory categoryData={categoryData} />

        <ProductSection productData={productData} />
        {/* ================= FEATURED PRODUCTS ================= */}
        <FeatureProduct  featureProduct={productData} />

        <HowItWorks workData={workData} />

        <ShopByGoal goalData={goalData} />

        {/* ================= WHY CHOOSE US ================= */}
        <WhyChooseUs choseData={choseData} />

        {/* ================= TESTIMONIALS ================= */}
        {/* <Testimonials /> */}
      </div>
    </>
  );
};

export default LandingPage;
