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

  // console.log("Sidebar Category Data:", categoryData);

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
              ? "bg-[#E10600] text-white font-semibold"
              : open
              ? "bg-[#E10600]/10 text-[#E10600]"
              : "text-[#B3B3B3] hover:bg-[#141414] hover:text-[#E10600]"
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
            <div className="border-l border-[#262626] ml-4">
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
              ? "bg-[#E10600] text-white font-semibold"
              : open
              ? "bg-[#E10600]/10 text-[#E10600]"
              : "text-[#B3B3B3] hover:bg-[#141414] hover:text-[#E10600]"
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
          <div className="px-4 py-3 ml-8 text-sm text-[#B3B3B3] italic">
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
        className={`fixed inset-0 bg-black/60 z-40 transition ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={toggleMenu}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-[#0B0B0B] z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#262626] bg-[#141414]">
          <h2 className="text-xl font-bold">
            <span className="text-white">ONE </span>
            <span className="text-[#E10600]">REP MORE</span>
          </h2>
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-[#262626] transition"
          >
            <X className="text-white" size={20} />
          </button>
        </div>

        {/* Category Count Badge (if needed) */}
        {categoryData && categoryData.length > 0 && (
          <div className="px-6 py-2 border-b border-[#262626] bg-[#0B0B0B]">
            <span className="text-xs text-[#B3B3B3]">
              {categoryData.length} Categories Available
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 max-h-[calc(100vh-180px)]">
          {sidebarLinks.map(renderNavItem)}
        </nav>

        {/* Auth Section */}
        {!isAuthenticated ? (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#262626] bg-[#141414]">
            <button
              onClick={() => {
                navigate("/login");
                toggleMenu();
              }}
              className="w-full py-2 px-4 rounded-lg font-semibold transition hover:scale-105 text-white"
              style={{
                background: "linear-gradient(135deg, #E10600, #B30000)",
              }}
            >
              Login / Sign Up
            </button>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#262626] bg-[#141414]">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: "#E10600" }}
              >
                U
              </div>
              <div>
                <p className="text-white font-medium">User Name</p>
                <p className="text-xs text-[#B3B3B3]">user@example.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-[#DC2626] hover:bg-red-600/20 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #262626;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #E10600;
          border-radius: 4px;
        }
        
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #E10600 #262626;
        }
      `}</style>
    </>
  );
};

export default SideBar;