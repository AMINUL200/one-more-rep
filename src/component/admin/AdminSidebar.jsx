import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  Users,
  Settings,
  Package,
  BarChart,
  ShoppingCart,
  FileText,
  ChevronDown,
  Shield,
  Database,
  Palette,
  Mail,
  UserCog,
  Tag,
  TrendingUp,
  DollarSign,
  Clock,
  User2,
  Receipt,
  Truck,
  CreditCard,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});
  const { user } = useAuth();

  // Get user role
  const userRole = user?.role || "admin";

  console.log("User Role:", userRole);

  // ==================== COMMON MENU ITEMS (visible to all) ====================
  const commonMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/admin",
    },
  ];

  // ==================== ADMIN ONLY MENU ITEMS ====================
  const adminOnlyMenuItems = [
    {
      id: "products",
      label: "Products",
      icon: <Package className="w-5 h-5" />,
      children: [
        {
          id: "products",
          label: "Products List",
          icon: <Database className="w-4 h-4" />,
          path: "/admin/products",
        },
        {
          id: "products-category",
          label: "Products Category",
          icon: <Package className="w-4 h-4" />,
          path: "/admin/products-category",
        },
        {
          id: "products-sub-category",
          label: "Product Sub Categories",
          icon: <Tag className="w-4 h-4" />,
          path: "/admin/products-sub-category",
        },
      ],
    },
    {
      id: "payment",
      label: "Payment Setup",
      icon: <CreditCard className="w-5 h-5" />,
      path: "/admin/payment-setup",
    },
    {
      id: "faqs",
      label: "FAQS",
      icon: <HelpCircle className="w-5 h-5" />,
      path: "/admin/contact/faqs",
    },
    {
      id: "contact",
      label: "Contact",
      icon: <Mail className="w-5 h-5" />,
      path: "/admin/contact",
    },
    {
      id: "landing-page",
      label: "Landing Page",
      icon: <Settings className="w-5 h-5" />,
      children: [
        {
          id: "hero-section",
          label: "Hero Section",
          icon: <Settings className="w-4 h-4" />,
          path: "/admin/landing-page/hero-section",
        },
        {
          id: "how-it-works",
          label: "How It Works",
          icon: <Settings className="w-4 h-4" />,
          path: "/admin/landing-page/how-it-works",
        },
        {
          id: "why-chose-us",
          label: "Why Choose Us",
          icon: <Settings className="w-4 h-4" />,
          path: "/admin/landing-page/why-chose-us",
        },
        {
          id: "your-goals-section",
          label: "Your Goals Section",
          icon: <Settings className="w-4 h-4" />,
          path: "/admin/landing-page/your-goals-section",
        },
        {
          id: "your-goals",
          label: "Your Goals",
          icon: <Settings className="w-4 h-4" />,
          path: "/admin/landing-page/your-goals",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      children: [
        {
          id: "site-settings",
          label: "Site Settings",
          icon: <Settings className="w-4 h-4" />,
          path: "/admin/site-settings",
        },
        {
          id: "seo-settings",
          label: "SEO Settings",
          icon: <Palette className="w-4 h-4" />,
          path: "/admin/seo-settings",
        },
      ],
    },
    {
      id: "order-track",
      label: "Order Tracking",
      icon: <Truck className="w-4 h-4" />,
      path: "/admin/order-track",
    },
    {
      id: "manage-blogs",
      label: "Manage Blogs",
      icon: <FileText className="w-5 h-5" />,
      path: "/admin/mange-blogs",
    },
    {
      id: "manage-account",
      label: "Manage Accounts",
      icon: <UserCog className="w-5 h-5" />,
      path: "/admin/mange-account",
    },
    {
      id: "manage-cms",
      label: "Manage CMS",
      icon: <UserCog className="w-5 h-5" />,
      path: "/admin/mange-cms",
    },
    {
      id: "manage-about",
      label: "Manage About",
      icon: <UserCog className="w-5 h-5" />,
      path: "/admin/mange-about",
    },
    {
      id: "manage-fellows",
      label: "Manage Fellows",
      icon: <UserCog className="w-5 h-5" />,
      path: "/admin/mange-fellows",
    },
  ];

  // ==================== SALES ONLY MENU ITEMS ====================
  const salesOnlyMenuItems = [
    {
      id: "sales-leads",
      label: "Sales Leads",
      icon: <TrendingUp className="w-5 h-5" />,
      path: "/admin/sales-leads",
    },
  ];

  // ==================== ACCOUNTS ONLY MENU ITEMS ====================
  const accountsOnlyMenuItems = [
    // {
    //   id: "financial-dashboard",
    //   label: "Financial Dashboard",
    //   icon: <DollarSign className="w-5 h-5" />,
    //   path: "/admin/financial-dashboard",
    // },
    {
      id: "order-track",
      label: "Order Tracking",
      icon: <Truck className="w-4 h-4" />,
      path: "/admin/account-order-track",
    },
  ];

  // Function to merge menu items based on role
  const getMenuItems = () => {
    // Start with common menu items for all roles
    let items = [...commonMenuItems];

    // Add role-specific menu items
    if (userRole === "admin") {
      items = [...items, ...adminOnlyMenuItems];
    } else if (userRole === "sales") {
      items = [...items, ...salesOnlyMenuItems];
    } else if (userRole === "accounts") {
      items = [...items, ...accountsOnlyMenuItems];
    }

    // Merge children for products and orders
    const mergedItems = [];
    const itemsMap = new Map();

    items.forEach((item) => {
      if (itemsMap.has(item.id)) {
        // If item already exists, merge children
        const existingItem = itemsMap.get(item.id);
        if (item.children && existingItem.children) {
          existingItem.children = [...existingItem.children, ...item.children];
        } else if (item.children) {
          existingItem.children = item.children;
        }
      } else {
        itemsMap.set(item.id, { ...item });
      }
    });

    return Array.from(itemsMap.values());
  };

  const menuItems = getMenuItems();

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isActive = (path) => location.pathname === path;

  const isParentActive = (children) => {
    return children?.some((child) => location.pathname === child.path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Get role display name and badge color
  const getRoleInfo = () => {
    switch (userRole) {
      case "admin":
        return {
          name: "Administrator",
          color: "from-purple-500 to-indigo-600",
          badge: "bg-purple-500/20 text-purple-400",
          icon: <Shield className="w-5 h-5 text-white" />,
        };
      case "sales":
        return {
          name: "Sales Manager",
          color: "from-green-500 to-emerald-600",
          badge: "bg-green-500/20 text-green-400",
          icon: <TrendingUp className="w-5 h-5 text-white" />,
        };
      case "accounts":
        return {
          name: "Accounts Manager",
          color: "from-blue-500 to-cyan-600",
          badge: "bg-blue-500/20 text-blue-400",
          icon: <DollarSign className="w-5 h-5 text-white" />,
        };
      default:
        return {
          name: "Administrator",
          color: "from-purple-500 to-indigo-600",
          badge: "bg-purple-500/20 text-purple-400",
          icon: <Shield className="w-5 h-5 text-white" />,
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 
          bg-gradient-to-b from-slate-900 to-slate-800 
          shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-50 bg-slate-900 flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${roleInfo.color} rounded-xl flex items-center justify-center shadow-lg`}
            >
              {roleInfo.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Admin Panel</h2>
              <p
                className={`text-xs ${roleInfo.badge} px-2 py-0.5 rounded-full inline-block mt-1`}
              >
                {roleInfo.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors lg:hidden text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* Parent Item */}
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isParentActive(item.children)
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`${
                          isParentActive(item.children)
                            ? "text-white"
                            : "text-slate-400 group-hover:text-white"
                        } transition-colors`}
                      >
                        {item.icon}
                      </div>
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <div
                      className={`transition-transform duration-200 ${
                        openDropdowns[item.id] ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Dropdown Children */}
                  {item.children && item.children.length > 0 && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openDropdowns[item.id]
                          ? "max-h-96 opacity-100 mt-1"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-4 pl-4 border-l-2 border-slate-700/50 space-y-1 py-1">
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleNavigation(child.path)}
                            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                              isActive(child.path)
                                ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-400"
                                : "text-slate-400 hover:bg-slate-700/30 hover:text-slate-200"
                            }`}
                          >
                            <div
                              className={`${
                                isActive(child.path)
                                  ? "text-blue-400"
                                  : "text-slate-500 group-hover:text-slate-300"
                              } transition-colors`}
                            >
                              {child.icon}
                            </div>
                            <span className="font-medium text-sm">
                              {child.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <div
                    className={`${
                      isActive(item.path)
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    } transition-colors`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
