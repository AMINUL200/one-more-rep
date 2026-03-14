import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Users,
  CreditCard,
  IndianRupee,
  Package,
  Settings,
  Mail,
  Clock,
  AlertCircle,
  TrendingUp,
  Loader,
} from "lucide-react";
import { api } from "../../../utils/app";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Card configurations - Easy to add or update
  const cardConfig = [
    {
      id: "total_orders",
      title: "Total Orders",
      icon: ShoppingBag,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      iconColor: "text-blue-600",
      format: (value) => value?.toLocaleString() || "0",
    },
    {
      id: "total_pending_orders",
      title: "Pending Orders",
      icon: Clock,
      color: "yellow",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      iconColor: "text-yellow-600",
      format: (value) => value?.toLocaleString() || "0",
    },
    {
      id: "total_customer",
      title: "Total Customers",
      icon: Users,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      iconColor: "text-green-600",
      format: (value) => value?.toLocaleString() || "0",
    },
    {
      id: "total_collection",
      title: "Total Collection",
      icon: IndianRupee,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      iconColor: "text-purple-600",
      format: (value) => `₹${parseFloat(value || 0).toLocaleString("en-IN")}`,
    },
    {
      id: "total_payments",
      title: "Total Payments",
      icon: CreditCard,
      color: "indigo",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-600",
      iconColor: "text-indigo-600",
      format: (value) => value?.toLocaleString() || "0",
    },
    {
      id: "total_contacts",
      title: "Total Contacts",
      icon: Mail,
      color: "orange",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      iconColor: "text-orange-600",
      format: (value) => value?.toLocaleString() || "0",
    },
  ];

  // Quick action cards for navigation
  const quickActions = [
    {
      id: "products",
      title: "Products",
      description: "Manage your products",
      icon: Package,
      link: "/admin/products",
      color: "blue",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      id: "orders",
      title: "Orders",
      description: "View and manage orders",
      icon: ShoppingBag,
      link: "/admin/order-track",
      color: "green",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      textColor: "text-green-600",
    },
    {
      id: "contact",
      title: "Contact",
      description: "Manage customer accounts",
      icon: Users,
      link: "/admin/contact",
      color: "purple",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure your store",
      icon: Settings,
      link: "/admin/site-settings",
      color: "gray",
      bgColor: "bg-gray-50",
      hoverColor: "hover:bg-gray-100",
      textColor: "text-gray-600",
    },
  ];

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/dashboard");
      if (response.data?.status) {
        setDashboardData(response.data.data);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Get value from dashboard data by id
  const getValue = (id) => {
    if (!dashboardData) return null;
    return dashboardData[id];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={40} style={{ color: "#2563eb" }} />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cardConfig.map((card) => {
          const value = getValue(card.id);
          const Icon = card.icon;
          
          return (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold mt-2 ${card.textColor}`}>
                    {card.format(value)}
                  </p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            
            return (
              <Link
                key={action.id}
                to={action.link}
                className={`${action.bgColor} ${action.hoverColor} p-6 rounded-xl border border-gray-200 transition-all hover:scale-105 hover:shadow-md`}
              >
                <div className={`${action.textColor} mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className={`font-semibold text-gray-900 mb-1`}>{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Additional Info Section - You can add more cards here easily */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 text-gray-600">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Last updated: {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          {/* You can add more recent activity items here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;