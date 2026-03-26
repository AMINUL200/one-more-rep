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
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = ({ toggleMenu, categoryData, contactData }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  console.log("CateGory ::", categoryData)

  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);
  const productButtonRef = useRef(null);

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
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }

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
    { id: "about", label: "About Us", path: "/about" },
    { id: "blogs", label: "Blogs", path: "/blogs" },
    { id: "contact", label: "Contact Us", path: "/contact" },
  ];

  /* ================= TOP CONTACT LINKS ================= */
  const contactLinks = [
    {
      id: "phone",
      label: formatPhone(contactData?.phone),
      icon: Phone,
      path: `tel:${contactData?.phone}`,
    },
    {
      id: "email",
      label: contactData?.email || "info@gymstore.com",
      icon: Mail,
      path: `mailto:${contactData?.email}`,
    },
  ];

  function formatPhone(phone) {
    return phone || "+91 98765 43210";
  }

  /* ================= PRODUCTS DROPDOWN HANDLERS ================= */
  const handleProductClick = (e) => {
    e.preventDefault();
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

  const cartCount = getTotalItems();

  // WhatsApp click handler
  const handleWhatsAppClick = () => {
    const phoneNumber =
      contactData?.whats_app?.replace(/[^0-9]/g, "") || "919876543210";
    const message = encodeURIComponent(
      "Hi! I'm interested in your products. Can you help me?",
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* ================= MAIN NAVBAR ================= */}
      <div
        className={`flex justify-between items-center px-6 md:px-10 transition-all bg-main ${
          scrolled ? "py-1 shadow-custom" : "py-1"
        }`}
        style={{
          borderBottom: "1px solid var(--bg-border)",
        }}
      >
        {/* LEFT: LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          {/* Logo Image */}
          <div className="relative">
            {contactData?.site_web_logo ? (
              <img
                src={`${STORAGE_URL}/${contactData.site_web_logo}`}
                alt={contactData?.site_name || "One Rep More"}
                className="h-30 w-auto object-contain rounded-full bg-card"
              />
            ) : (
              <img
                src="/image/gym_logo.png"
                alt="One Rep More"
                className="h-14 w-14 object-contain rounded-full p-1 bg-card"
              />
            )}
          </div>

          {/* Brand Text */}
          <div className="flex flex-col leading-tight">
            <h1 className="text-xl md:text-2xl font-black text-primary">
              {contactData?.site_name?.split(" ").map((word, index) => (
                <span key={index} className={index === 0 ? "" : "text-brand"}>
                  {word}{" "}
                </span>
              ))}
            </h1>
            <span className="text-[10px] md:text-xs text-muted tracking-widest">
              {contactData?.punch_line || "Your Ultimate Fitness Destination"}
            </span>
          </div>
        </div>

        {/* CENTER: NAV LINKS */}
        <nav className="hidden md:flex flex-col items-center gap-2">
          {/* 🔼 TOP: CONTACT INFO */}
          <div className="flex items-center gap-6 text-xs">
            {contactLinks.map((link) => (
              <a
                key={link.id}
                href={link.path}
                className="flex items-center gap-2 text-muted hover:text-brand transition-colors"
              >
                <link.icon size={12} className="text-brand" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* 🔽 BOTTOM: NAV LINKS */}
          <div className="flex items-center gap-8">
            {navLinks.map((item) => {
              const active =
                location.pathname === item.path ||
                (item.id === "products" &&
                  location.pathname.startsWith("/products/"));

              if (item.id === "products") {
                return (
                  <div key={item.id} className="relative">
                    <button
                      ref={productButtonRef}
                      onClick={handleProductClick}
                      className={`nav-link flex items-center gap-1 text-xl md:text-2xl font-semibold tracking-wide transition px-2 py-1 ${
                        active || productDropdownOpen
                          ? "text-brand active"
                          : "text-primary"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          productDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown with Categories */}
                    {productDropdownOpen && (
                      <div
                        ref={productDropdownRef}
                        className="absolute top-full left-0 mt-2 rounded-lg shadow-xl animate-fadeIn bg-card border border-border"
                        style={{
                          minWidth: "265px",
                          maxHeight: "400px",
                          overflowY: "auto",
                          zIndex: 100,
                        }}
                      >
                        {categoryData && categoryData.length > 0 ? (
                          <div className="py-2">
                            {/* View All Products Option */}
                            {/* <button
                              onClick={() => {
                                navigate("/products");
                                setProductDropdownOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors text-primary font-semibold border-b border-border"
                            >
                              <span className="text-brand">📦</span>
                              View All Products
                            </button> */}

                            {/* Categories List */}
                            {categoryData.map((category) => (
                              <button
                                key={category.id || category.slug}
                                onClick={() => handleProductItemClick(category.slug)}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/10 transition-colors text-primary group"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">
                                    {getCategoryIcon(category.name)}
                                  </span>
                                  <span>{category.name}</span>
                                </div>
                                <ChevronRight
                                  size={14}
                                  className="text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center text-muted">
                            <p>No categories available</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`nav-link relative  tracking-wide transition text-xl md:text-2xl ${
                    active ? "text-brand active" : "text-primary"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* RIGHT: ICONS */}
        <div className="flex items-center gap-5">
          {/* WHATSAPP ICON */}
          <button
            onClick={handleWhatsAppClick}
            className="relative group"
            aria-label="WhatsApp"
          >
            <MessageCircle
              size={22}
              className="text-primary hover:text-green-500 transition-colors"
              style={{ color: "#25D366" }}
            />
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              WhatsApp
            </span>
          </button>

          {/* CART */}
          <button
            onClick={() => navigate("/cart")}
            className="relative"
            aria-label="Cart"
          >
            <ShoppingCart size={22} className="text-primary" />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center text-white"
                style={{
                  backgroundColor: "var(--color-primary)",
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
                className="flex items-center gap-2 hover-lift"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white bg-brand btn-primary">
                  {getInitials(user?.name)}
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 text-muted ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-60 rounded-lg shadow-xl animate-fadeIn bg-card border border-border"
                  style={{ zIndex: 100 }}
                >
                  <div className="p-4 border-b border-border">
                    <p className="font-medium text-primary">{user?.name}</p>
                    <p className="text-xs text-muted">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 text-primary transition"
                    >
                      <UserCircle size={16} className="text-muted" /> Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/orders");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 text-primary transition"
                    >
                      <Package size={16} className="text-muted" /> My Orders
                    </button>

                    <div className="my-2 mx-4 h-px bg-border" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 transition text-red-500"
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
              className="btn-primary px-4 py-2 rounded-lg font-semibold text-white"
            >
              Login
            </button>
          )}

          {/* MOBILE MENU */}
          <button className="md:hidden" onClick={toggleMenu} aria-label="Menu">
            <Menu size={28} className="text-primary" />
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

        /* Custom scrollbar for dropdown using CSS variables */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: var(--bg-border);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 4px;
        }

        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: var(--color-primary) var(--bg-border);
        }

        /* Hover effect for nav links */
        .nav-link {
          position: relative;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-primary);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link.active::after {
          width: 100%;
        }
      `}</style>
    </header>
  );
};

export default Navbar;