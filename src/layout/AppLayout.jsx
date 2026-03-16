import React, { useState } from "react";
import SideBar from "../component/common/SideBar";
import { Outlet } from "react-router-dom";
import Footer from "../component/common/Footer";
import Navbar from "../component/common/Navbar";
import { useApp } from "../context/AppContext";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
   const {
    loading,
    categoryData,
    contactData
   
  } = useApp();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleMenu={toggleSidebar} categoryData={categoryData} contactData={contactData}/>
      <SideBar toggleMenu={toggleSidebar} isOpen={sidebarOpen} categoryData={categoryData} />
      <Outlet />
      <Footer categoryData={categoryData} contactData={contactData} />
    </div>
  );
};

export default AppLayout;