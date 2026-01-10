import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowLeft, Shield, Lock, Check, Mail, Phone, User } from "lucide-react";
import CustomInput from "../../component/form/CustomInput";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

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
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Weak", color: colors.primary },
      { strength: 2, label: "Fair", color: colors.warning },
      { strength: 3, label: "Good", color: "#FACC15" },
      { strength: 4, label: "Strong", color: colors.success },
      { strength: 5, label: "Very Strong", color: "#16A34A" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Password requirements checklist
  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { label: "Contains number", met: /\d/.test(formData.password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log("Register data:", formData);
        setIsLoading(false);
        navigate("/login", { state: { successMessage: "Account created successfully! Please login." } });
      }, 1500);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: colors.primary }}
        ></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: colors.primary }}
        ></div>
        
        {/* Gym icons pattern */}
        <div className="absolute top-10 left-10">
          <span className="text-4xl">🏋️</span>
        </div>
        <div className="absolute bottom-10 right-10">
          <span className="text-4xl">💪</span>
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

        {/* Register Card */}
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
                className="p-3 rounded-2xl shadow-lg"
                style={{
                  backgroundColor: colors.background,
                  border: `2px solid ${colors.border}`,
                }}
              >
                <img
                  src="/image/gym_logo.png"
                  alt="One Rep More"
                  className="h-16 w-16 object-contain rounded-full"
                />
              </div>
            </div>
            <h2 
              className="text-3xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              Join <span style={{ color: colors.primary }}>One Rep More</span>
            </h2>
            <p style={{ color: colors.muted }}>
              Create your account and start building your dream gym
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <CustomInput
                label="Full Name"
                name="fullName"
                type="text"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                labelColor={colors.text}
                borderColor={errors.fullName ? colors.primary : colors.border}
                focusColor={colors.primary}
                placeholderColor={colors.muted}
                icon={User}
                iconColor={colors.muted}
                className="bg-transparent"
                style={{ color: colors.text }}
              />
              {errors.fullName && (
                <p className="mt-2 text-sm flex items-center" style={{ color: colors.primary }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: colors.primary }}
                  ></span>
                  {errors.fullName}
                </p>
              )}
            </div>

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
                icon={Mail}
                iconColor={colors.muted}
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

            {/* Phone Field */}
            <div>
              <CustomInput
                label="Phone Number"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                labelColor={colors.text}
                borderColor={errors.phone ? colors.primary : colors.border}
                focusColor={colors.primary}
                placeholderColor={colors.muted}
                icon={Phone}
                iconColor={colors.muted}
                className="bg-transparent"
                style={{ color: colors.text }}
              />
              {errors.phone && (
                <p className="mt-2 text-sm flex items-center" style={{ color: colors.primary }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: colors.primary }}
                  ></span>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <CustomInput
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                labelColor={colors.text}
                borderColor={errors.password ? colors.primary : colors.border}
                focusColor={colors.primary}
                placeholderColor={colors.muted}
                icon={Lock}
                iconColor={colors.muted}
                className="bg-transparent"
                style={{ color: colors.text }}
              />
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium ml-2" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${
                          req.met ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                          {req.met && <Check size={10} style={{ color: colors.text }} />}
                        </div>
                        <span className="text-xs" style={{ 
                          color: req.met ? colors.success : colors.muted 
                        }}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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

            {/* Confirm Password Field */}
            <div>
              <CustomInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                labelColor={colors.text}
                borderColor={errors.confirmPassword ? colors.primary : colors.border}
                focusColor={colors.primary}
                placeholderColor={colors.muted}
                icon={Lock}
                iconColor={colors.muted}
                className="bg-transparent"
                style={{ color: colors.text }}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm flex items-center" style={{ color: colors.primary }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: colors.primary }}
                  ></span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="pt-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded cursor-pointer focus:ring-2 focus:ring-offset-0"
                  style={{
                    backgroundColor: agreedToTerms ? colors.primary : colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    color: colors.primary,
                  }}
                />
                <label htmlFor="terms" className="text-sm cursor-pointer" style={{ color: colors.muted }}>
                  I agree to the{' '}
                  <Link to="/terms" className="font-semibold hover:text-white transition-colors" style={{ color: colors.primary }}>
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="font-semibold hover:text-white transition-colors" style={{ color: colors.primary }}>
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="mt-2 text-sm flex items-center" style={{ color: colors.primary }}>
                  <span 
                    className="inline-block w-1 h-1 rounded-full mr-2"
                    style={{ backgroundColor: colors.primary }}
                  ></span>
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-lg shadow-lg text-white font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mt-6"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
              }}
            >
              {isLoading ? (
                <>
                  <div 
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                  ></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div 
            className="mt-6 p-4 rounded-lg flex items-start gap-3"
            style={{
              backgroundColor: `${colors.success}10`,
              border: `1px solid ${colors.success}30`,
            }}
          >
            <Shield size={16} style={{ color: colors.success }} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm" style={{ color: colors.success }}>
              Your information is secure and encrypted. We never share your personal details.
            </p>
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
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:gap-4"
                style={{
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
              >
                Sign In to Existing Account
                <ArrowLeft size={18} className="rotate-180" />
              </Link>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;