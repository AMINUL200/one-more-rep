import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowLeft, Dumbbell, Shield } from "lucide-react";
import CustomInput from "../../component/form/CustomInput";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/app";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const redirectTo = location.state?.from || "/";

  console.log(redirectTo);

  const { login, isAuthenticated, loading: authLoading } = useAuth();

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
        const result = await api.post("/login", formData);
        login(result.data.user, result.data.token);

        if (result.data.success) {
          if (result.data.user.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate(redirectTo, { replace: true });
          }
        }
      } catch (error) {
        setApiError(error.message || "Login failed. Please try again.");
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    }
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
          <span className="font-medium group-hover:text-white">
            Back to Home
          </span>
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
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              Welcome Back
            </h2>
            <p style={{ color: colors.muted }}>
              Sign in to continue to GymStore
            </p>
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
                  <svg
                    className="h-5 w-5"
                    style={{ color: colors.primary }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm" style={{ color: colors.primary }}>
                    {apiError}
                  </p>
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
              />
              {errors.email && (
                <p
                  className="mt-2 text-sm flex items-center"
                  style={{ color: colors.primary }}
                >
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
              />
              {errors.password && (
                <p
                  className="mt-2 text-sm flex items-center"
                  style={{ color: colors.primary }}
                >
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
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                    color: colors.muted,
                  }}
                >
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div
            className="mt-6 p-3 rounded-lg flex items-start gap-2"
            style={{
              backgroundColor: `${colors.success}10`,
              border: `1px solid ${colors.success}30`,
            }}
          >
            <Shield
              size={16}
              style={{ color: colors.success }}
              className="mt-0.5 flex-shrink-0"
            />
            <p className="text-xs" style={{ color: colors.success }}>
              Your login is secure and encrypted. We never share your personal
              information.
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
