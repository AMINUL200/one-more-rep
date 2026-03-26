import React, { useEffect, useState } from "react";

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
import { useApp } from "../../context/AppContext";
import FellowThinks from "../../component/landingpage/FellowThinks";

const LandingPage = () => {
  const {
    loading,
    bannerData,
    workData,
    choseData,
    goalData,
    categoryData,
    productData,
    premiumProduct,
    fellowData
  } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <PageLoader />;
  return (
    <>
      <PageHelmet title="Home - ONE REP MORE" />

      <div className="bg-[#0B0B0B] text-white pt-30">
        {/* ================= HERO ================= */}
        <HeroSection heroData={bannerData} />

        <ProductCategory categoryData={categoryData} />

        <ProductSection productData={premiumProduct} title="Premium Gym Products" />
        {/* ================= FEATURED PRODUCTS ================= */}
        {/* <FeatureProduct featureProduct={productData} /> */}
        <ProductSection productData={productData} title="Featured Products"/>

        {/* <HowItWorks workData={workData} /> */}
        <FellowThinks fellowData={fellowData}/>

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
