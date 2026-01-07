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

const SideBar = ({ toggleMenu, isOpen }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

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
      dropdown: [
       
        { id: 1, label: "Barbells", path: "/products/barbells", icon: "💪" },
        { id: 2, label: "Plates", path: "/products/plates", icon: "⚖️" },
        {
          id: 3,
          label: "Strength Equipment",
          path: "/products/strength-equipment",
          icon: "🏋️",
        },
        { id: 4, label: "Benches", path: "/products/benches", icon: "🛋️" },
        { id: 5, label: "Dumbbells", path: "/products/dumbbells", icon: "🏋️‍♂️" },
        {
          id: 6,
          label: "Cardio Equipment",
          path: "/products/cardio",
          icon: "🏃",
        },
      ],
    },

    {
      id: "about",
      label: "About Us",
      path: "/about",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "contact",
      label: "Contact",
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
          <span>{item.label}</span>
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
          {item.dropdown && (
            <ChevronRight
              className={`w-5 h-5 transition-transform ${
                open ? "rotate-90" : ""
              }`}
            />
          )}
        </div>

        {item.dropdown && (
          <div
            className={`overflow-hidden transition-all ${
              open ? "max-h-[800px]" : "max-h-0"
            }`}
          >
            {item.dropdown.map((d) => renderDropdownItem(d))}
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
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#262626] bg-[#141414]">
          <h2 className="text-xl font-bold text-[#E10600]">ONE REP MORE</h2>
          <button onClick={toggleMenu}>
            <X className="text-white" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {sidebarLinks.map(renderNavItem)}
        </nav>

        {/* Auth */}
       
      </aside>
    </>
  );
};

export default SideBar;
