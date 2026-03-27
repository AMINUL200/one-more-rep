import React, { useState } from "react";
import SideBar from "../component/common/SideBar";
import { Outlet } from "react-router-dom";
import Footer from "../component/common/Footer";
import Navbar from "../component/common/Navbar";
import { useApp } from "../context/AppContext";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const { loading, categoryData, contactData, cmsData } = useApp();

  // WhatsApp click handler
  const handleWhatsAppClick = () => {
    const whatsappNumber = contactData?.whats_app?.replace(/[^0-9]/g, "") || "";
    if (whatsappNumber) {
      const message = encodeURIComponent(
        "Hi! I'm interested in your products. Can you help me?",
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        toggleMenu={toggleSidebar}
        categoryData={categoryData}
        contactData={contactData}
      />
      <SideBar
        toggleMenu={toggleSidebar}
        isOpen={sidebarOpen}
        categoryData={categoryData}
      />
      <Outlet />
      <Footer
        categoryData={categoryData}
        contactData={contactData}
        cmsData={cmsData}
      />

      {/* Floating WhatsApp Button */}
      {contactData?.whats_app && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5,
          }}
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Chat on WhatsApp"
        >
          {/* Pulsing Ring Effect */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />

          {/* Main Button */}
          <div
            className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isHovered ? "scale-110 shadow-2xl" : "scale-100 shadow-lg"
            }`}
            style={{
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              boxShadow: isHovered
                ? "0 10px 25px -5px rgba(37, 211, 102, 0.4)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* <MessageCircle
              size={28}
              className="text-white"
              style={{
                filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
              }}
            /> */}
            <img
              src="/image/whatsapp.avif"
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
              }}
            />
          </div>

          {/* Tooltip on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: -20 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 whitespace-nowrap"
              >
                <div className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
                  Chat with us on WhatsApp
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </div>
  );
};

export default AppLayout;
