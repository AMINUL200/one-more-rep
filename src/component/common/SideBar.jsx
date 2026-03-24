import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  ChevronRight,
  Home,
  Briefcase,
  Package,
  DollarSign,
  BookOpen,
  Mail,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const SideBar = ({ toggleMenu, isOpen, categoryData }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

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

  /* ================= SIDEBAR LINKS WITH REAL CATEGORY DATA ================= */
  const sidebarLinks = [
    {
      id: "home",
      label: "Home",
      path: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "products",
      label: "Products",
      icon: <Package className="w-5 h-5" />,
      dropdown: categoryData && categoryData.length > 0 
        ? categoryData.map((category) => ({
            id: category.id,
            label: category.name,
            path: `/products/${category.slug}`,
            icon: getCategoryIcon(category.name),
            image: category.image,
          }))
        : [], // Empty array if no categories
    },
    {
      id: "contact",
      label: "Contact Us",
      path: "/contact",
      icon: <Mail className="w-5 h-5" />,
    },
  ];

  // dummy auth (unchanged)
  const isAuthenticated = false;
  const userData = { user_type: 2 };

  useEffect(() => {
    if (isOpen) toggleMenu();
  }, [location.pathname]);

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavClick = (path) => {
    if (path) {
      navigate(path);
      setOpenDropdowns({});
    }
  };

  const handleLogout = () => {
    navigate("/");
    toggleMenu();
  };

  const isActivePath = (path) => location.pathname === path;

  const renderDropdownItem = (item, level = 1) => {
    const hasSub = item.dropdown?.length;
    const key = `${item.id}-${level}`;
    const open = openDropdowns[key];
    const active = item.path && isActivePath(item.path);

    return (
      <div key={item.id}>
        <div
          onClick={() =>
            hasSub ? toggleDropdown(key) : handleNavClick(item.path)
          }
          className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition ${
            level > 1 ? "pl-10" : "pl-6"
          } ${
            active
              ? "bg-brand text-primary font-semibold"
              : open
              ? "bg-primary-light text-brand"
              : "text-muted hover:bg-card hover:text-brand"
          }`}
        >
          <div className="flex items-center gap-2">
            {item.icon && (
              <span className="text-base">{item.icon}</span>
            )}
            <span>{item.label}</span>
          </div>
          {hasSub && (
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                open ? "rotate-90" : ""
              }`}
            />
          )}
        </div>

        {hasSub && (
          <div
            className={`overflow-hidden transition-all ${
              open ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="border-l border-theme ml-4">
              {item.dropdown.map((sub) => renderDropdownItem(sub, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNavItem = (item) => {
    const open = openDropdowns[item.id];
    const active = item.path && isActivePath(item.path);

    return (
      <div key={item.id}>
        <div
          onClick={() =>
            item.dropdown ? toggleDropdown(item.id) : handleNavClick(item.path)
          }
          className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg cursor-pointer transition ${
            active
              ? "bg-brand text-primary font-semibold"
              : open
              ? "bg-primary-light text-brand"
              : "text-muted hover:bg-card hover:text-brand"
          }`}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span>{item.label}</span>
          </div>
          {item.dropdown && item.dropdown.length > 0 && (
            <ChevronRight
              className={`w-5 h-5 transition-transform ${
                open ? "rotate-90" : ""
              }`}
            />
          )}
        </div>

        {item.dropdown && item.dropdown.length > 0 && (
          <div
            className={`overflow-hidden transition-all ${
              open ? "max-h-[800px]" : "max-h-0"
            }`}
          >
            {item.dropdown.map((d) => renderDropdownItem(d))}
          </div>
        )}

        {/* Show message if products dropdown is empty */}
        {item.id === "products" && item.dropdown && item.dropdown.length === 0 && open && (
          <div className="px-4 py-3 ml-8 text-sm text-muted italic">
            No categories available
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-overlay z-40 transition ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={toggleMenu}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-main z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme bg-card">
          <h2 className="text-xl font-bold">
            <span className="text-primary">ONE </span>
            <span className="text-brand">REP MORE</span>
          </h2>
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-border transition"
          >
            <X className="text-primary" size={20} />
          </button>
        </div>

        {/* Category Count Badge (if needed) */}
        {categoryData && categoryData.length > 0 && (
          <div className="px-6 py-2 border-b border-theme bg-main">
            <span className="text-xs text-muted">
              {categoryData.length} Categories Available
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 max-h-[calc(100vh-180px)] custom-scrollbar">
          {sidebarLinks.map(renderNavItem)}
        </nav>

        {/* Auth Section */}
        {!isAuthenticated ? (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-theme bg-card">
            <button
              onClick={() => {
                navigate("/login");
                toggleMenu();
              }}
              className="w-full btn-primary py-2 px-4 rounded-lg font-semibold"
            >
              Login / Sign Up
            </button>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-theme bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-primary bg-brand"
              >
                U
              </div>
              <div>
                <p className="text-primary font-medium">User Name</p>
                <p className="text-xs text-muted">user@example.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-error hover:bg-error/20 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Custom Scrollbar Styles - Now using CSS variables */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--bg-border);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary-hover);
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--color-primary) var(--bg-border);
        }
      `}</style>
    </>
  );
};

export default SideBar;