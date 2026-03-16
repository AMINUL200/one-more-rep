import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  ShoppingCart,
  User,
  Sun,
  Moon,
  UserCircle,
  Package,
  LogOut,
  ChevronDown,
  ChevronRight,
  Instagram,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
// import { useCart } from "../../hooks/useCart";

const Navbar = ({ toggleMenu, categoryData , contactData}) => {
  //  console.log("Contact Data:: ", contactData)
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart(); 
  const navigate = useNavigate();
  const location = useLocation();
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);
  const productButtonRef = useRef(null);

  /* ================= BRAND COLORS ================= */
  const colors = {
    primary: "#E10600",
    background: "#0B0B0B",
    cardBg: "#141414",
    border: "#262626",
    text: "#FFFFFF",
    muted: "#B3B3B3",
    danger: "#DC2626",
  };

  /* ================= ICON MAPPING FOR CATEGORIES ================= */
  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || "";
    
    if (name.includes("barbell")) return "💪";
    if (name.includes("plate")) return "⚖️";
    if (name.includes("strength")) return "🏋️";
    if (name.includes("bench")) return "🛋️";
    if (name.includes("dumbbell")) return "🏋️‍♂️";
    if (name.includes("cardio")) return "🏃";
    if (name.includes("machine")) return "⚙️";
    if (name.includes("supplement") || name.includes("suppliment")) return "💊";
    if (name.includes("accessor")) return "🧤";
    
    return "🏋️"; // Default icon
  };

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= CLOSE DROPDOWNS ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close user dropdown if click outside
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }

      // Close product dropdown if click outside
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(e.target) &&
        productButtonRef.current &&
        !productButtonRef.current.contains(e.target)
      ) {
        setProductDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= CLOSE DROPDOWNS ON ROUTE CHANGE ================= */
  useEffect(() => {
    setUserDropdownOpen(false);
    setProductDropdownOpen(false);
  }, [location.pathname]);

  /* ================= NAV LINKS ================= */
  const navLinks = [
    { id: "home", label: "Home", path: "/" },
    {
      id: "products",
      label: "Products",
      hasDropdown: true,
    },
    { id: "contact", label: "Contact Us", path: "/contact" },
  ];

  /* ================= PRODUCTS DROPDOWN HANDLERS (CLICK BASED - NO REDIRECT) ================= */
  const handleProductClick = (e) => {
    e.preventDefault();
    // Just toggle the dropdown, no navigation
    setProductDropdownOpen(!productDropdownOpen);
  };

  const handleProductItemClick = (slug) => {
    navigate(`/products/${slug}`);
    setProductDropdownOpen(false);
  };

  /* ================= USER FUNCTIONS ================= */
  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/login");
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  // Get cart count
  const cartCount = getTotalItems();

  // Format phone number for display
  const formatPhone = (phone) => {
    return phone || "+91 98765 43210"; // Fallback if not available
  };

  // Get social media icon based on platform
  const getSocialIcon = (platform, url) => {
    if (!url) return null;
    
    switch(platform) {
      case 'facebook':
        return <Facebook key="fb" size={14} className="cursor-pointer opacity-90 hover:opacity-100" onClick={() => window.open(url, '_blank')} />;
      case 'twitter':
        return <Twitter key="tw" size={14} className="cursor-pointer opacity-90 hover:opacity-100" onClick={() => window.open(url, '_blank')} />;
      case 'linkedin':
        return <Linkedin key="li" size={14} className="cursor-pointer opacity-90 hover:opacity-100" onClick={() => window.open(url, '_blank')} />;
      case 'instagram':
        return <Instagram key="ig" size={14} className="cursor-pointer opacity-90 hover:opacity-100" onClick={() => window.open(url, '_blank')} />;
      default:
        return null;
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* ================= TOP INFO BAR ================= */}
      {!scrolled && (
        <div
          className="text-xs md:text-sm py-2 px-6 md:px-10 flex justify-between items-center"
          style={{
            background: "linear-gradient(90deg, #B30000, #E10600)",
            color: "#FFFFFF",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex gap-4 items-center">
            {/* Phone */}
            <span className="flex gap-1 items-center">
              <Phone size={12} /> 
              {formatPhone(contactData?.phone)}
            </span>
            
            {/* Email */}
            <span className="hidden md:flex gap-1 items-center">
              <Mail size={12} /> 
              {contactData?.email || "info@gymstore.com"}
            </span>

            {/* Landline (if available) */}
            {contactData?.landline && (
              <span className="hidden lg:flex gap-1 items-center">
                <Phone size={12} /> 
                {contactData.landline}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Social Media Icons */}
            <div className="flex items-center gap-2">
              {contactData?.facebook && getSocialIcon('facebook', contactData.facebook)}
              {contactData?.twitter && getSocialIcon('twitter', contactData.twitter)}
              {contactData?.linkedin && getSocialIcon('linkedin', contactData.linkedin)}
              {contactData?.instagram && getSocialIcon('instagram', contactData.instagram)}
            </div>

            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN NAVBAR ================= */}
      <div
        className={`flex justify-between items-center px-6 md:px-6 transition-all ${
          scrolled ? "py-2 shadow-lg" : "py-3"
        }`}
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {/* LEFT: LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            {contactData?.site_web_logo ? (
              <img
                src={`${STORAGE_URL}/${contactData.site_web_logo}`}
                alt={contactData?.site_name || "One Rep More"}
                className="h-20 w-auto object-contain rounded-full  p-2 bg-[#141414] transition-all duration-300 hover:border-[#FF0800] hover:shadow-[0_0_15px_rgba(225,6,0,0.4)]"
              />
            ) : (
              <img
                src="/image/gym_logo.png"
                alt="One Rep More"
                className="h-20 w-20 object-contain rounded-2xl p-2 bg-[#141414] transition-all duration-300 hover:border-[#FF0800] hover:shadow-[0_0_15px_rgba(225,6,0,0.4)]"
              />
            )}
          </div>
          {/* Site Name (optional display) */}
          {/* {contactData?.site_name && !scrolled && (
            <span className="hidden lg:block text-white font-bold text-lg">
              {contactData.site_name}
            </span>
          )} */}
        </div>

        {/* CENTER: NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.id === "products" && location.pathname.startsWith("/products/"));

            if (item.id === "products") {
              return (
                <div key={item.id} className="relative">
                  {/* Single button that toggles dropdown only - no navigation */}
                  <button
                    ref={productButtonRef}
                    onClick={handleProductClick}
                    className={`flex items-center gap-1 text-sm font-semibold tracking-wide transition px-2 py-1 ${
                      active || productDropdownOpen
                        ? "text-[#E10600]"
                        : "text-white hover:text-[#E10600]"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        productDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                    {(active || productDropdownOpen) && (
                      <span
                        className="absolute -bottom-1 left-0 w-full h-0.5"
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}
                  </button>

                  {/* PRODUCTS DROPDOWN MENU with REAL DATA */}
                  {productDropdownOpen && categoryData && categoryData.length > 0 && (
                    <div
                      ref={productDropdownRef}
                      className="absolute top-full left-0 mt-2 rounded-lg shadow-xl animate-fadeIn"
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                        minWidth: "260px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        zIndex: 100,
                      }}
                    >
                      <div className="p-4">
                        <h4 className="text-white font-semibold mb-3 text-sm flex items-center justify-between">
                          <span>Shop by Category</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-[#B3B3B3]">
                            {categoryData.length} items
                          </span>
                        </h4>
                        
                        <div className="space-y-1">
                          {categoryData.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => handleProductItemClick(category.slug)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-all duration-200 hover:bg-white/10 group ${
                                location.pathname === `/products/${category.slug}`
                                  ? "text-[#E10600] bg-white/10"
                                  : "text-[#B3B3B3] hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-base">
                                  {getCategoryIcon(category.name)}
                                </span>
                                <span>{category.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ChevronRight 
                                  size={14} 
                                  color={colors.muted}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity" 
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show message if no categories */}
                  {productDropdownOpen && (!categoryData || categoryData.length === 0) && (
                    <div
                      ref={productDropdownRef}
                      className="absolute top-full left-0 mt-2 rounded-lg shadow-xl animate-fadeIn p-4"
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                        minWidth: "200px",
                        zIndex: 100,
                      }}
                    >
                      <p className="text-sm text-[#B3B3B3] text-center">
                        No categories available
                      </p>
                    </div>
                  )}
                </div>
              );
            }

            // Regular nav link
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative text-sm font-semibold tracking-wide transition ${
                  active ? "text-[#E10600]" : "text-white hover:text-[#E10600]"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute -bottom-1 left-0 w-full h-0.5"
                    style={{ backgroundColor: colors.primary }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: ICONS */}
        <div className="flex items-center gap-5">
          {/* CART */}
          <button
            onClick={() => navigate("/cart")}
            className="relative"
            aria-label="Cart"
          >
            <ShoppingCart size={22} color={colors.text} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center text-white shadow-md"
                style={{
                  backgroundColor: colors.primary,
                  boxShadow: "0 0 10px rgba(225,6,0,0.6)",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* USER */}
          {isAuthenticated ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  {getInitials(user?.name)}
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                  color={colors.muted}
                />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-60 rounded-lg shadow-xl animate-fadeIn"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    zIndex: 100,
                  }}
                >
                  {/* USER INFO */}
                  <div
                    className="p-4 border-b"
                    style={{ borderColor: colors.border }}
                  >
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-xs" style={{ color: colors.muted }}>
                      {user?.email}
                    </p>
                  </div>

                  {/* MENU */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 text-white transition"
                    >
                      <UserCircle size={16} /> Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/orders");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 text-white transition"
                    >
                      <Package size={16} /> My Orders
                    </button>

                    <div
                      className="my-2 mx-4 h-px"
                      style={{ backgroundColor: colors.border }}
                    />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-600/20 transition"
                      style={{ color: colors.danger }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg font-semibold transition hover:scale-105 hover:shadow-lg text-white"
              style={{
                background: "linear-gradient(135deg, #E10600, #B30000)",
              }}
            >
              Login
            </button>
          )}

          {/* MOBILE MENU */}
          <button className="md:hidden" onClick={toggleMenu}>
            <Menu size={28} color={colors.text} />
          </button>
        </div>
      </div>

      {/* ADD CSS ANIMATION */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        /* Custom scrollbar for dropdown */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: ${colors.border};
          border-radius: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: ${colors.primary};
          border-radius: 4px;
        }
        
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: ${colors.primary} ${colors.border};
        }
      `}</style>
    </header>
  );
};

export default Navbar;