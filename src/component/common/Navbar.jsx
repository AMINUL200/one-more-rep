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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ toggleMenu }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  const userDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);

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

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= NAV LINKS ================= */
  const navLinks = [
    { id: "home", label: "Home", path: "/" },
    { 
      id: "products", 
      label: "Products", 
      path: "/products/barbells",
      hasDropdown: true,
      children: [
        { label: "Barbells", path: "/products/barbells", icon: "💪" },
        { label: "Plates", path: "/products/plates", icon: "⚖️" },
        { label: "Strength Equipment", path: "/products/strength-equipment", icon: "🏋️" },
        { label: "Benches", path: "/products/benches", icon: "🛋️" },
        { label: "Dumbbells", path: "/products/dumbbells", icon: "🏋️‍♂️" },
        { label: "Cardio Equipment", path: "/products/cardio", icon: "🏃" },
      ]
    },
    { id: "about", label: "About", path: "/about" },
    { id: "contact", label: "Contact", path: "/contact" },
  ];

  /* ================= PRODUCTS DROPDOWN HANDLERS ================= */
  const handleProductMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setProductDropdownOpen(true);
  };

  const handleProductMouseLeave = () => {
    const timeout = setTimeout(() => {
      setProductDropdownOpen(false);
    }, 200);
    setDropdownTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    const timeout = setTimeout(() => {
      setProductDropdownOpen(false);
    }, 200);
    setDropdownTimeout(timeout);
  };

  const handleProductClick = (path) => {
    navigate(path);
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

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* ================= TOP INFO BAR ================= */}
      {!scrolled && (
        <div
          className="text-xs md:text-sm py-2 px-6 flex justify-between items-center"
          style={{
            background: "linear-gradient(90deg, #B30000, #E10600)",
            color: "#FFFFFF",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div className="flex gap-4 items-center">
            <span className="flex gap-1 items-center">
              <Phone size={12} /> +91 98765 43210
            </span>
            <span className="hidden md:flex gap-1 items-center">
              <Mail size={12} /> info@gymstore.com
            </span>
          </div>

          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Linkedin].map((Icon, i) => (
              <Icon
                key={i}
                size={14}
                className="cursor-pointer opacity-90 hover:opacity-100"
              />
            ))}
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN NAVBAR ================= */}
      <div
        className={`flex justify-between items-center px-6 md:px-12 transition-all ${
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
            <img
              src="/image/gym_logo.png"
              alt="One Rep More"
              className="h-20 w-20 object-contain rounded-full border-2 border-[#E10600] p-2 bg-[#141414] transition-all duration-300 hover:border-[#FF0800] hover:shadow-[0_0_15px_rgba(225,6,0,0.4)]"
            />
          </div>
        </div>

        {/* CENTER: NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => {
            const active = location.pathname === item.path || 
                          (item.hasDropdown && location.pathname.startsWith("/products/"));
            
            if (item.hasDropdown) {
              return (
                <div
                  key={item.id}
                  className="relative"
                  ref={productDropdownRef}
                  onMouseEnter={handleProductMouseEnter}
                  onMouseLeave={handleProductMouseLeave}
                >
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setProductDropdownOpen(!productDropdownOpen);
                    }}
                    className={`relative flex items-center gap-1 text-sm font-semibold tracking-wide transition ${
                      active 
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
                    {active && !productDropdownOpen && (
                      <span
                        className="absolute -bottom-1 left-0 w-full h-0.5"
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}
                  </button>

                  {/* PRODUCTS DROPDOWN MENU */}
                  {productDropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 rounded-lg shadow-xl animate-fadeIn"
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                        minWidth: "220px",
                      }}
                    >
                      <div className="p-4">
                        <h4 className="text-white font-semibold mb-3 text-sm">
                          Shop by Category
                        </h4>
                        <div className="space-y-1">
                          {item.children.map((child, index) => (
                            <button
                              key={index}
                              onClick={() => handleProductClick(child.path)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-white/5 ${
                                location.pathname === child.path
                                  ? "text-[#E10600] bg-white/10"
                                  : "text-[#B3B3B3] hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span>{child.label}</span>
                              </div>
                              <ChevronRight size={14} />
                            </button>
                          ))}
                        </div>
                        
                        {/* VIEW ALL BUTTON */}
                      
                      </div>
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
                className="flex items-center gap-2"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  {getInitials(user?.name)}
                </div>
                <ChevronDown
                  size={16}
                  className={`transition ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                  color={colors.muted}
                />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-60 rounded-lg shadow-xl"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
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
                      onClick={() => navigate("/profile")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 text-white"
                    >
                      <UserCircle size={16} /> Profile
                    </button>

                    <button
                      onClick={() => navigate("/orders")}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 text-white"
                    >
                      <Package size={16} /> My Orders
                    </button>

                    <div
                      className="my-2 mx-4 h-px"
                      style={{ backgroundColor: colors.border }}
                    />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-600/20"
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
              className="px-4 py-2 rounded-lg font-semibold transition hover:scale-105 text-white"
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
      `}</style>
    </header>
  );
};

export default Navbar;