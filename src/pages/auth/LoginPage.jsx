import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowLeft, Dumbbell, Shield } from "lucide-react";
import CustomInput from "../../component/form/CustomInput";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { login, quickLogin, isAuthenticated, loading: authLoading } = useAuth();

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

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (validateForm()) {
      setIsLoading(true);

      try {
        const result = await login({
          email: formData.email,
          password: formData.password,
        });
        
        if (result.success) {
          navigate("/dashboard");
        }
      } catch (error) {
        setApiError(error.message || "Login failed. Please try again.");
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Quick login for development
  const handleQuickLogin = () => {
    setApiError("");
    quickLogin();
    navigate("/dashboard");
  };

  // Handle demo login
  const handleDemoLogin = async () => {
    setFormData({
      email: "demo@gymstore.com",
      password: "demo123",
    });
    
    setTimeout(() => {
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.click();
      }
    }, 100);
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.primary }}
          ></div>
          <p style={{ color: colors.muted }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: colors.primary }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: colors.primary }}
        ></div>
        
        {/* Gym equipment decorative elements */}
        <div className="absolute top-1/4 left-10 opacity-5">
          <Dumbbell size={60} style={{ color: colors.text }} />
        </div>
        <div className="absolute bottom-1/4 right-10 opacity-5">
          <Dumbbell size={80} style={{ color: colors.text }} />
        </div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center space-x-2 transition-colors group"
          style={{ color: colors.muted }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium group-hover:text-white">Back to Home</span>
        </button>

        {/* Login Card */}
        <div 
          className="rounded-2xl shadow-2xl p-8"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div 
                className="p-2 rounded-2xl shadow-lg"
                style={{ 
                  backgroundColor: colors.background,
                  border: `2px solid ${colors.border}`,
                }}
              >
                <img
                  src="/image/gym_logo.png"
                  alt="Gym Store"
                  className="h-16 w-16 object-contain rounded-full"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
              Welcome Back
            </h2>
            <p style={{ color: colors.muted }}>Sign in to continue to GymStore</p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div 
              className="mb-6 p-4 rounded-lg"
              style={{
                backgroundColor: `${colors.primary}15`,
                border: `1px solid ${colors.primary}50`,
              }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5" style={{ color: colors.primary }} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm" style={{ color: colors.primary }}>{apiError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                labelColor={colors.text}
                borderColor={errors.email ? colors.primary : colors.border}
                focusColor={colors.primary}
                placeholderColor={colors.muted}
                className="bg-transparent"
                style={{ color: colors.text }}
              />
              {errors.email && (
                <p className="mt-2 text-sm flex items-center" style={{ color: colors.primary }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: colors.primary }}
                  ></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <CustomInput
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                labelColor={colors.text}
                borderColor={errors.password ? colors.primary : colors.border}
                focusColor={colors.primary}
                placeholderColor={colors.muted}
                className="bg-transparent"
                style={{ color: colors.text }}
              />
              {errors.password && (
                <p className="mt-2 text-sm flex items-center" style={{ color: colors.primary }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: colors.primary }}
                  ></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-offset-0"
                  style={{
                    color: colors.primary,
                    borderColor: colors.border,
                    backgroundColor: colors.cardBg,
                  }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm cursor-pointer"
                  style={{ color: colors.muted }}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-semibold transition-colors hover:text-white"
                  style={{ color: colors.primary }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-lg shadow-lg text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
              }}
            >
              {isLoading ? (
                <>
                  <div 
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                  ></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo & Quick Login Buttons */}
          <div className="mt-4 space-y-3">
            {/* Demo Login Button */}
            <button
              onClick={handleDemoLogin}
              className="w-full py-2 px-4 rounded-lg shadow-sm font-medium transition-all duration-200 hover:bg-white/5"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.text,
                backgroundColor: colors.cardBg,
              }}
            >
              Try Demo Account
            </button>
            
            {/* Quick Login Button - Development Only */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={handleQuickLogin}
                className="w-full py-2 px-4 rounded-lg shadow-sm text-sm font-medium transition-all duration-200"
                style={{
                  border: `1px solid ${colors.success}30`,
                  color: colors.success,
                  backgroundColor: `${colors.success}10`,
                }}
              >
                🚀 Quick Login (Dev Only)
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div 
                  className="w-full border-t"
                  style={{ borderColor: colors.border }}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-2"
                  style={{ 
                    backgroundColor: colors.cardBg,
                    color: colors.muted 
                  }}
                >
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 rounded-lg shadow-sm text-sm font-medium transition-colors hover:bg-white/5"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.text,
                backgroundColor: colors.cardBg,
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.666-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.787-.94 1.324-2.245 1.171-3.54-1.133.052-2.518.754-3.338 1.701-.735.85-1.389 2.207-1.208 3.514 1.26.092 2.548-.638 3.375-1.675z" />
              </svg>
              <span className="ml-2">Apple</span>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 rounded-lg shadow-sm text-sm font-medium transition-colors hover:bg-white/5"
              style={{
                border: `1px solid ${colors.border}`,
                color: colors.text,
                backgroundColor: colors.cardBg,
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="ml-2">Google</span>
            </button>
          </div>

          {/* Security Note */}
          <div 
            className="mt-6 p-3 rounded-lg flex items-start gap-2"
            style={{
              backgroundColor: `${colors.success}10`,
              border: `1px solid ${colors.success}30`,
            }}
          >
            <Shield size={16} style={{ color: colors.success }} className="mt-0.5 flex-shrink-0" />
            <p className="text-xs" style={{ color: colors.success }}>
              Your login is secure and encrypted. We never share your personal information.
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: colors.muted }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold transition-colors hover:text-white"
                style={{ color: colors.primary }}
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;