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

const Navbar = ({ toggleMenu, categoryData, contactData }) => {
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
    { id: "contact", label: "Contact Us", path: "/contact" },
    { id: "about", label: "About Us", path: "/about" },
    { id: "blogs", label: "Blogs", path: "/blogs" },
  ];

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

  const formatPhone = (phone) => {
    return phone || "+91 98765 43210";
  };

  const getSocialIcon = (platform, url) => {
    if (!url) return null;

    switch (platform) {
      case "facebook":
        return (
          <Facebook
            key="fb"
            size={14}
            className="link"
            onClick={() => window.open(url, "_blank")}
          />
        );
      case "twitter":
        return (
          <Twitter
            key="tw"
            size={14}
            className="link"
            onClick={() => window.open(url, "_blank")}
          />
        );
      case "linkedin":
        return (
          <Linkedin
            key="li"
            size={14}
            className="link"
            onClick={() => window.open(url, "_blank")}
          />
        );
      case "instagram":
        return (
          <Instagram
            key="ig"
            size={14}
            className="link"
            onClick={() => window.open(url, "_blank")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* ================= TOP INFO BAR ================= */}
      {!scrolled && (
        <div
          className="text-xs md:text-sm py-2 px-6 md:px-10 flex justify-between items-center section-cta bg-primary"
          style={{
            borderBottom: "1px solid var(--bg-border)",
          }}
        >
          <div className="flex gap-4 items-center">
            <span className="flex gap-1 items-center text-primary">
              <Phone size={12} />
              {formatPhone(contactData?.phone)}
            </span>

            <span className="hidden md:flex gap-1 items-center text-primary">
              <Mail size={12} />
              {contactData?.email || "info@gymstore.com"}
            </span>

            {contactData?.landline && (
              <span className="hidden lg:flex gap-1 items-center text-primary">
                <Phone size={12} />
                {contactData.landline}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {contactData?.facebook &&
                getSocialIcon("facebook", contactData.facebook)}
              {contactData?.twitter &&
                getSocialIcon("twitter", contactData.twitter)}
              {contactData?.linkedin &&
                getSocialIcon("linkedin", contactData.linkedin)}
              {contactData?.instagram &&
                getSocialIcon("instagram", contactData.instagram)}
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-primary hover:text-brand transition-colors"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN NAVBAR ================= */}
      <div
        className={`flex justify-between items-center px-6 md:px-6 transition-all bg-main ${
          scrolled ? "py-1 shadow-custom" : "py-3"
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
                className="h-22 w-auto object-contain rounded-full p-1 bg-card"
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
            <h1 className="text-lg font-black text-primary">
              {contactData?.site_name?.split(" ").map((word, index) => (
                <span key={index} className={index === 0 ? "" : "text-brand"}>
                  {word}{" "}
                </span>
              ))}
            </h1>
            <span className="text-[10px] md:text-xs text-muted tracking-widest">
              FITNESS STORE
            </span>
          </div>
        </div>

        {/* CENTER: NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
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
                    className={`nav-link flex items-center gap-1 text-sm font-semibold tracking-wide transition px-2 py-1 ${
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

                  {productDropdownOpen &&
                    categoryData &&
                    categoryData.length > 0 && (
                      <div
                        ref={productDropdownRef}
                        className="absolute top-full left-0 mt-2 rounded-lg shadow-xl animate-fadeIn bg-card border-theme"
                        style={{
                          minWidth: "265px",
                          maxHeight: "400px",
                          overflowY: "auto",
                          zIndex: 100,
                        }}
                      >
                        <div className="p-4">
                          <h4 className="text-primary font-semibold mb-3 text-sm flex items-center justify-between">
                            <span>Shop by Category</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-muted">
                              {categoryData.length} items
                            </span>
                          </h4>

                          <div className="space-y-1">
                            {categoryData.map((category) => (
                              <button
                                key={category.id}
                                onClick={() =>
                                  handleProductItemClick(category.slug)
                                }
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-all duration-200 hover:bg-white/10 group ${
                                  location.pathname ===
                                  `/products/${category.slug}`
                                    ? "text-brand bg-white/10"
                                    : "text-muted hover:text-primary"
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
                                    className="text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                                  />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  {productDropdownOpen &&
                    (!categoryData || categoryData.length === 0) && (
                      <div
                        ref={productDropdownRef}
                        className="absolute top-full left-0 mt-2 rounded-lg shadow-xl animate-fadeIn p-4 bg-card border-theme"
                        style={{
                          minWidth: "200px",
                          zIndex: 100,
                        }}
                      >
                        <p className="text-sm text-muted text-center">
                          No categories available
                        </p>
                      </div>
                    )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`nav-link relative text-sm font-semibold tracking-wide transition ${
                  active ? "text-brand active" : "text-primary"
                }`}
              >
                {item.label}
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
            <ShoppingCart size={22} className="text-primary" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center text-primary shadow-primary"
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
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-primary bg-brand btn-primary">
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
                  className="absolute right-0 mt-3 w-60 rounded-lg shadow-xl animate-fadeIn bg-card border-theme"
                  style={{ zIndex: 100 }}
                >
                  <div className="p-4 border-b border-theme">
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
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm btn-primary  transition text-error"
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
              className="btn-primary px-4 py-2 rounded-lg font-semibold"
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
      `}</style>
    </header>
  );
};

export default Navbar;
