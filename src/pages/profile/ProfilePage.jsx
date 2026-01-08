import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  ShoppingBag,
  Package,
  CreditCard,
  Shield,
  LogOut,
  Dumbbell,
  TrendingUp,
  Award,
  Settings,
  Heart,
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);

  // 🔥 Simulate API call (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Fitness",
    email: "john.fitness@gymstore.com",
    phone: "+1 (555) 123-4567",
    location: "Miami, FL",
    joinDate: "January 15, 2024",
    avatar:
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop",
  });
  
  const [formData, setFormData] = useState({ ...userData });
  const [activeTab, setActiveTab] = useState("overview");
  
  // Color Schema
  const colors = {
    primary: "#E10600",
    background: "#0B0B0B",
    cardBg: "#141414",
    border: "#262626",
    text: "#FFFFFF",
    muted: "#B3B3B3",
    success: "#22C55E",
    warning: "#FACC15",
  };
  
  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: "12", change: "+2" },
    { icon: Package, label: "Active Orders", value: "3", change: "+1" },
    {
      icon: CreditCard,
      label: "Total Spent",
      value: "$4,850",
      change: "+$450",
    },
  ];
  
  const recentOrders = [
    {
      id: "#ORD-7894",
      date: "Today",
      items: "Adjustable Dumbbells",
      status: "Delivered",
      total: "$299.99",
    },
    {
      id: "#ORD-7893",
      date: "2 days ago",
      items: "Yoga Mat Pro",
      status: "Processing",
      total: "$89.99",
    },
    {
      id: "#ORD-7892",
      date: "1 week ago",
      items: "Resistance Bands Set",
      status: "Delivered",
      total: "$49.99",
    },
  ];
  
  const quickActions = [
    {
      icon: ShoppingBag,
      label: "My Orders",
      description: "View & track orders",
      count: 3,
    },
    { icon: Settings, label: "Settings", description: "Account preferences" },
  ];
  
  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  if (loading) return <PageLoader />;
  
  return (
    <div
      style={{ backgroundColor: colors.background }}
      className="min-h-screen py-8 px-4 md:px-8 pt-30 md:pt-40"
      >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            My Profile
          </h1>
          <p className="text-lg" style={{ color: colors.muted }}>
            Manage your account and track your fitness equipment orders
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* Profile Header */}
              <div
                className="h-32 relative"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                }}
              >
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-24 h-24 rounded-full border-4 object-cover"
                      style={{ borderColor: colors.cardBg }}
                    />
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#141414] border border-[#262626]">
                        <Edit size={14} style={{ color: colors.primary }} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-16 pb-6 px-6">
                <div className="text-center mb-6">
                  <h2
                    className="text-2xl font-bold mb-1"
                    style={{ color: colors.text }}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full text-center bg-transparent border-b pb-1 focus:outline-none"
                        style={{
                          color: colors.text,
                          borderColor: colors.primary,
                        }}
                      />
                    ) : (
                      userData.name
                    )}
                  </h2>
                  <p className="text-sm" style={{ color: colors.muted }}>
                    Premium Member
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="text-xl font-bold mb-1"
                        style={{ color: colors.text }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs" style={{ color: colors.muted }}>
                        {stat.label}
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: colors.success }}
                      >
                        {stat.change}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex-1 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Save size={16} />
                          Save
                        </div>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 py-2 rounded-lg font-semibold transition-all hover:bg-white/5"
                        style={{
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2 rounded-lg font-semibold transition-all hover:bg-white/5 flex items-center justify-center gap-2"
                      style={{
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <Edit size={16} />
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  className="w-full py-2 rounded-lg font-semibold transition-all hover:bg-red-600/10 flex items-center justify-center gap-2"
                  style={{
                    color: colors.primary,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs & Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div
              className="flex overflow-x-auto mb-6 pb-2"
              style={{ borderBottom: `1px solid ${colors.border}` }}
            >
              {["overview", "orders", "settings", "activity"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    color: activeTab === tab ? colors.primary : colors.muted,
                    borderColor:
                      activeTab === tab ? colors.primary : "transparent",
                  }}
                >
                  {tab === "overview" && "Overview"}
                  {tab === "orders" && "My Orders"}
                  {tab === "settings" && "Settings"}
                  {tab === "activity" && "Activity"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div>
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Quick Stats Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        className="group p-6 rounded-xl text-left transition-all hover:transform hover:-translate-y-1"
                        style={{
                          backgroundColor: colors.cardBg,
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                            style={{
                              backgroundColor: `${colors.primary}20`,
                              border: `1px solid ${colors.primary}30`,
                            }}
                          >
                            <action.icon
                              size={20}
                              style={{ color: colors.primary }}
                            />
                          </div>
                          {action.count && (
                            <span
                              className="px-2 py-1 rounded-full text-xs font-semibold"
                              style={{
                                backgroundColor: colors.primary,
                                color: colors.text,
                              }}
                            >
                              {action.count}
                            </span>
                          )}
                        </div>
                        <h3
                          className="text-lg font-semibold mb-1"
                          style={{ color: colors.text }}
                        >
                          {action.label}
                        </h3>
                        <p className="text-sm" style={{ color: colors.muted }}>
                          {action.description}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Personal Information */}
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <h3
                      className="text-xl font-semibold mb-6"
                      style={{ color: colors.text }}
                    >
                      Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        {
                          icon: Mail,
                          label: "Email",
                          value: "email",
                          editable: true,
                        },
                        {
                          icon: Phone,
                          label: "Phone",
                          value: "phone",
                          editable: true,
                        },
                        {
                          icon: MapPin,
                          label: "Location",
                          value: "location",
                          editable: true,
                        },
                        {
                          icon: Calendar,
                          label: "Member Since",
                          value: "joinDate",
                          editable: false,
                        },
                      ].map((field, index) => (
                        <div key={index}>
                          <div className="flex items-center gap-2 mb-2">
                            <field.icon
                              size={16}
                              style={{ color: colors.muted }}
                            />
                            <label
                              className="text-sm font-medium"
                              style={{ color: colors.muted }}
                            >
                              {field.label}
                            </label>
                          </div>
                          {isEditing && field.editable ? (
                            <input
                              type="text"
                              name={field.value}
                              value={formData[field.value]}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
                              style={{
                                backgroundColor: `${colors.background}`,
                                border: `1px solid ${colors.border}`,
                                color: colors.text,
                              }}
                            />
                          ) : (
                            <p
                              className="text-lg font-medium"
                              style={{ color: colors.text }}
                            >
                              {field.value === "email" && userData.email}
                              {field.value === "phone" && userData.phone}
                              {field.value === "location" && userData.location}
                              {field.value === "joinDate" && userData.joinDate}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fitness Goals */}
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: `linear-gradient(135deg, ${colors.cardBg} 0%, #1a1a1a 100%)`,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3
                          className="text-xl font-semibold mb-1"
                          style={{ color: colors.text }}
                        >
                          Fitness Goals
                        </h3>
                        <p className="text-sm" style={{ color: colors.muted }}>
                          Track your fitness journey
                        </p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${colors.primary}20`,
                          border: `1px solid ${colors.primary}30`,
                        }}
                      >
                        <Dumbbell size={20} style={{ color: colors.primary }} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { label: "Strength", progress: 75, icon: TrendingUp },
                        { label: "Cardio", progress: 45, icon: TrendingUp },
                        { label: "Flexibility", progress: 60, icon: Award },
                      ].map((goal, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span
                              className="text-sm font-medium"
                              style={{ color: colors.text }}
                            >
                              {goal.label}
                            </span>
                            <span
                              className="text-sm font-semibold"
                              style={{ color: colors.primary }}
                            >
                              {goal.progress}%
                            </span>
                          </div>
                          <div
                            className="h-2 rounded-full overflow-hidden"
                            style={{ backgroundColor: `${colors.primary}20` }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${goal.progress}%`,
                                background: `linear-gradient(90deg, ${colors.primary}, #B30000)`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    className="p-6 border-b"
                    style={{ borderColor: colors.border }}
                  >
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: colors.text }}
                    >
                      Recent Orders
                    </h3>
                  </div>

                  <div
                    className="divide-y"
                    style={{ borderColor: colors.border }}
                  >
                    {recentOrders.map((order, index) => (
                      <div
                        key={index}
                        className="p-6 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span
                                className="font-semibold"
                                style={{ color: colors.text }}
                              >
                                {order.id}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  order.status === "Delivered"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p
                              className="text-sm mb-1"
                              style={{ color: colors.muted }}
                            >
                              {order.items}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: colors.muted }}
                            >
                              {order.date}
                            </p>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p
                                className="text-lg font-bold"
                                style={{ color: colors.text }}
                              >
                                {order.total}
                              </p>
                              <button
                                className="text-sm font-semibold mt-2 transition-colors hover:text-white"
                                style={{ color: colors.primary }}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className="p-6 text-center border-t"
                    style={{ borderColor: colors.border }}
                  >
                    <button
                      className="px-6 py-3 rounded-lg font-semibold transition-all hover:bg-white/5"
                      style={{
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      View All Orders
                    </button>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <h3
                      className="text-xl font-semibold mb-6"
                      style={{ color: colors.text }}
                    >
                      Account Settings
                    </h3>

                    <div className="space-y-4">
                      {[
                        {
                          label: "Email Notifications",
                          description: "Receive updates about your orders",
                        },
                        {
                          label: "Promotional Emails",
                          description: "Get exclusive offers and discounts",
                        },
                        {
                          label: "Security Alerts",
                          description: "Be notified about account activity",
                        },
                      ].map((setting, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-3"
                        >
                          <div>
                            <p
                              className="font-medium"
                              style={{ color: colors.text }}
                            >
                              {setting.label}
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: colors.muted }}
                            >
                              {setting.description}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E10600]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-6"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <h3
                      className="text-xl font-semibold mb-4"
                      style={{ color: colors.text }}
                    >
                      Change Password
                    </h3>

                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: `${colors.background}`,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: `${colors.background}`,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                        style={{
                          backgroundColor: `${colors.background}`,
                          border: `1px solid ${colors.border}`,
                          color: colors.text,
                        }}
                      />

                      <button
                        className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg mt-4"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                        }}
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
