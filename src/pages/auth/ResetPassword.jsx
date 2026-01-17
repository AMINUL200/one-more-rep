import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Key, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import CustomInput from "../../component/form/CustomInput";
import { toast } from "react-toastify";
import { api } from "../../utils/app";

const ResetPassword = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    password_confirmation: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: Reset
  const [otpSent, setOtpSent] = useState(false);

  // ✅ UPDATED: Same color schema as LoginPage
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateEmailStep = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetStep = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "OTP must be 6 digits";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateEmailStep()) return;
    
    setIsLoading(true);
    
    try {
      // API 1: Send OTP
      const response = await api.post("/forgot-password", { email: formData.email });
      
      if (response.data?.success) {
        toast.success("OTP sent to your email!");
        setOtpSent(true);
        setStep(2);
      } else {
        toast.error(response.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateResetStep()) return;
    
    setIsLoading(true);
    
    try {
      // API 2: Reset password with all data
      const response = await api.post("/reset-password", formData);
      
      if (response.data?.success) {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.data?.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await api.post("/forgot-password", { email: formData.email });
      
      if (response.data?.success) {
        toast.success("OTP resent to your email!");
      } else {
        toast.error(response.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <>
            <h2 
              className="text-3xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              Reset Your Password
            </h2>
            <p 
              className="mb-6"
              style={{ color: colors.muted }}
            >
              Enter your email address to receive a verification code
            </p>
            
            <div>
              <CustomInput
                label="Email Address"
                name="email"
                type="email"
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
                <p className="mt-2 text-sm" style={{ color: colors.primary }}>{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 rounded-lg text-white font-semibold text-lg
                transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
              }}
            >
              {isLoading ? (
                <>
                  <div 
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                  ></div>
                  Sending OTP...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Send Verification Code
                </>
              )}
            </button>
          </>
        );

      case 2:
        return (
          <>
            <h2 
              className="text-3xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              Reset Password
            </h2>
            <p 
              className="mb-6"
              style={{ color: colors.muted }}
            >
              Enter the OTP sent to <span style={{ color: colors.primary }}>{formData.email}</span> and your new password
            </p>
            
            <div className="space-y-6">
              {/* OTP */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium" style={{ color: colors.text }}>6-Digit OTP</label>
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={isLoading}
                    className="text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
                    style={{ color: colors.primary }}
                  >
                    Resend OTP
                  </button>
                </div>
                <CustomInput
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  labelColor={colors.text}
                  borderColor={errors.otp ? colors.primary : colors.border}
                  focusColor={colors.primary}
                  placeholderColor={colors.muted}
                  className="bg-transparent"
                />
                {errors.otp && (
                  <p className="mt-2 text-sm" style={{ color: colors.primary }}>{errors.otp}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <div className="relative">
                  <CustomInput
                    label="New Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    labelColor={colors.text}
                    borderColor={errors.password ? colors.primary : colors.border}
                    focusColor={colors.primary}
                    placeholderColor={colors.muted}
                    className="bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-80 transition-opacity"
                    style={{ color: colors.muted }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm" style={{ color: colors.primary }}>{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <CustomInput
                    label="Confirm Password"
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    labelColor={colors.text}
                    borderColor={errors.password_confirmation ? colors.primary : colors.border}
                    focusColor={colors.primary}
                    placeholderColor={colors.muted}
                    className="bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-80 transition-opacity"
                    style={{ color: colors.muted }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-2 text-sm" style={{ color: colors.primary }}>{errors.password_confirmation}</p>
                )}
              </div>

              <div className="text-sm" style={{ color: colors.muted }}>
                <p className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4" style={{ color: colors.success }} />
                  Password must be at least 6 characters
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" style={{ color: colors.success }} />
                  Both passwords must match
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300
                  hover:bg-white/5 active:scale-[0.98]"
                style={{
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  backgroundColor: colors.cardBg,
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 py-3 rounded-lg text-white font-semibold text-lg
                  transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                }}
              >
                {isLoading ? (
                  <>
                    <div 
                      className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                    ></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>
            </div>
          </>
        );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    switch(step) {
      case 1:
        handleSendOTP(e);
        break;
      case 2:
        handleResetPassword(e);
        break;
    }
  };

  // Progress steps
  const steps = [
    { number: 1, label: "Email" },
    { number: 2, label: "Reset" }
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background decoration - similar to LoginPage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: colors.primary }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: colors.primary }}
        ></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/login")}
          className="mb-6 flex items-center space-x-2 transition-colors group"
          style={{ color: colors.muted }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium group-hover:text-white">Back to Login</span>
        </button>

        {/* Reset Password Card */}
        <div 
          className="rounded-2xl shadow-2xl p-8"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div 
              className="p-3 rounded-2xl shadow-lg"
              style={{ 
                backgroundColor: colors.background,
                border: `2px solid ${colors.border}`,
              }}
            >
              <Key className="w-8 h-8" style={{ color: colors.primary }} />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-8">
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.number}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold
                      ${step >= stepItem.number 
                        ? 'text-white' 
                        : 'text-gray-400'
                      }`}
                    style={{
                      backgroundColor: step >= stepItem.number ? colors.primary : 'transparent',
                      borderColor: step >= stepItem.number ? colors.primary : colors.border,
                    }}
                  >
                    {step > stepItem.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      stepItem.number
                    )}
                  </div>
                  <span 
                    className={`text-xs mt-2 font-medium`}
                    style={{ 
                      color: step >= stepItem.number ? colors.primary : colors.muted 
                    }}
                  >
                    {stepItem.label}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div 
                    className="flex-1 h-1 mx-2 rounded-full"
                    style={{ 
                      backgroundColor: step > stepItem.number ? colors.primary : colors.border 
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
          </form>

          {/* Security Note */}
          <div 
            className="mt-6 p-3 rounded-lg flex items-start gap-2"
            style={{
              backgroundColor: `${colors.success}10`,
              border: `1px solid ${colors.success}30`,
            }}
          >
            <CheckCircle size={16} style={{ color: colors.success }} className="mt-0.5 flex-shrink-0" />
            <p className="text-xs" style={{ color: colors.success }}>
              Your password reset process is secure and encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;