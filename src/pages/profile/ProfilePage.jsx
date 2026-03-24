import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Edit,
  Save,
  LogOut,
  Settings,
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";
import PageHelmet from "../../component/common/PageHelmet";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/app";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get("/user/profile");
        
        if (response.data?.status) {
          const data = response.data.data;
          setProfileData(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        } else {
          toast.error("Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    setUpdateLoading(true);
    try {
      const response = await api.post("/user/profile/update", formData);
      
      if (response.data?.status) {
        toast.success("Profile updated successfully");
        setProfileData({ ...profileData, ...formData });
        setIsEditing(false);
      } else {
        toast.error(response.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          Object.values(errors).forEach(msg => {
            toast.error(msg[0]);
          });
        } else {
          toast.error("Please check your form data");
        }
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profileData?.name || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <PageLoader />;

  return (
    <>
      <PageHelmet title="My Profile - ONE REP MORE" />
      <div className="min-h-screen py-8 px-4 md:px-8 pt-30 md:pt-40 bg-main">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
              My Profile
            </h1>
            <p className="text-lg text-muted">
              Manage your account information
            </p>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl overflow-hidden bg-card border border-theme">
            {/* Profile Header */}
            <div className="h-32 relative bg-gradient-primary">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full border-4 flex items-center justify-center bg-main z-10!"
                    // style={{ 
                    //   borderColor: 'var(--bg-card)',
                    // }}
                  >
                    <span className="text-3xl font-bold text-primary">
                      {profileData?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 pb-8 px-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-1 text-primary">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full text-center bg-transparent border-b pb-1 focus:outline-none"
                      style={{
                        color: 'var(--text-primary)',
                        borderColor: 'var(--color-primary)',
                      }}
                      placeholder="Your name"
                    />
                  ) : (
                    profileData?.name
                  )}
                </h2>
                <p className="text-sm text-muted">
                  {profileData?.role === "admin" ? "Administrator" : "Member"}
                </p>
              </div>

              {/* Personal Information */}
              <div className="max-w-2xl mx-auto space-y-6 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={16} className="text-muted" />
                    <label className="text-sm font-medium text-muted">
                      Email Address
                    </label>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all bg-main border-theme text-primary"
                      style={{
                        border: '1px solid var(--bg-border)',
                      }}
                      placeholder="Your email"
                    />
                  ) : (
                    <p className="text-lg font-medium px-4 text-primary">
                      {profileData?.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={16} className="text-muted" />
                    <label className="text-sm font-medium text-muted">
                      Phone Number
                    </label>
                  </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all bg-main border-theme text-primary"
                      style={{
                        border: '1px solid var(--bg-border)',
                      }}
                      placeholder="Your phone number"
                    />
                  ) : (
                    <p className="text-lg font-medium px-4 text-primary">
                      {profileData?.phone || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={updateLoading}
                      className="flex-1 py-3 rounded-lg font-semibold text-primary transition-all hover:shadow-primary-hover disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-primary"
                    >
                      <div className="flex items-center justify-center gap-2">
                        {updateLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Changes
                          </>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={updateLoading}
                      className="flex-1 py-3 rounded-lg font-semibold transition-all hover:bg-white/5 disabled:opacity-50 text-primary border border-theme"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-3 rounded-lg font-semibold transition-all hover:bg-white/5 flex items-center justify-center gap-2 text-primary border border-theme"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 py-3 rounded-lg font-semibold transition-all hover:bg-red-600/10 flex items-center justify-center gap-2 text-brand border border-theme"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                )}
              </div>

              {/* Member Info */}
              <div className="mt-8 pt-6 border-t text-center border-theme">
                <p className="text-sm text-muted">
                  Member ID: #{profileData?.id}
                </p>
                <p className="text-sm text-muted">
                  Account type: {profileData?.role === "admin" ? "Administrator" : "Standard Member"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;