import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  ArrowLeft,
  Shield,
  Lock,
  Check,
  Mail,
  Phone,
  User,
} from "lucide-react";
import CustomInput from "../../component/form/CustomInput";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../../utils/app";
import PageHelmet from "../../component/common/PageHelmet";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "", // Added phone field
  });
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

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

    if (!formData.name?.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Weak", color: "var(--color-primary)" },
      { strength: 2, label: "Fair", color: "var(--color-warning)" },
      { strength: 3, label: "Good", color: "var(--color-warning)" },
      { strength: 4, label: "Strong", color: "var(--color-success)" },
      { strength: 5, label: "Very Strong", color: "#16A34A" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Password requirements checklist
  const passwordRequirements = [
    { label: "At least 6 characters", met: formData.password.length >= 6 },
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    {
      label: "Contains uppercase letter",
      met: /[A-Z]/.test(formData.password),
    },
    {
      label: "Contains lowercase letter",
      met: /[a-z]/.test(formData.password),
    },
    { label: "Contains number", met: /\d/.test(formData.password) },
    {
      label: "Contains special character",
      met: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        // Prepare data for API - send all required fields
        const registerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        };

        console.log("Sending registration data:", registerData);

        const res = await api.post("/register", registerData);
        
        console.log("Registration response:", res.data);
        
        if (res.data?.status) {
          toast.success(res.data.message || "Registration successful! Please login.");
          
          // Auto login after register
          if (res.data.data?.token && res.data.data?.user) {
            await login(res.data.data.user, res.data.data.token);
            
            // Redirect based on role
            if (res.data.data.user.role === "admin") {
              navigate("/admin", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          } else {
            // If auto-login fails, redirect to login page
            navigate("/login", { 
              state: { message: "Registration successful! Please login." } 
            });
          }
        } else {
          toast.error(res.data?.message || "Registration failed");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Registration error:", error);
        
        // Handle validation errors
        if (error.response?.status === 422) {
          const validationErrors = error.response.data?.errors || {};
          const formattedErrors = {};
          
          Object.keys(validationErrors).forEach(key => {
            formattedErrors[key] = validationErrors[key][0];
          });
          
          setErrors(formattedErrors);
          toast.error("Please check the form for errors");
        } else {
          toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        }
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <PageHelmet title="Register - ONE REP MORE" />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-main">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: 'var(--color-primary)' }}
          ></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
            style={{ backgroundColor: 'var(--color-primary)' }}
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
            className="mb-6 flex items-center space-x-2 transition-colors group text-muted hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>

          {/* Register Card */}
          <div className="rounded-2xl shadow-2xl p-8 bg-card border border-theme">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-2xl shadow-lg bg-main border-2 border-theme">
                  <img
                    src="/image/gym_logo.png"
                    alt="One Rep More"
                    className="h-16 w-16 object-contain rounded-full"
                  />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-primary">
                Join <span className="text-brand">One Rep More</span>
              </h2>
              <p className="text-muted">
                Create your account and start building your dream gym
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <CustomInput
                  label="Full Name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  borderColor={errors.name ? 'var(--color-primary)' : 'var(--bg-border)'}
                  focusColor="var(--color-primary)"
                  icon={User}
                  className="bg-transparent"
                />
                {errors.name && (
                  <p className="mt-2 text-sm flex items-center text-brand">
                    <span className="inline-block w-1 h-1 rounded-full mr-2 bg-brand"></span>
                    {errors.name}
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
                  borderColor={errors.email ? 'var(--color-primary)' : 'var(--bg-border)'}
                  focusColor="var(--color-primary)"
                  icon={Mail}
                  className="bg-transparent"
                />
                {errors.email && (
                  <p className="mt-2 text-sm flex items-center text-brand">
                    <span className="inline-block w-1 h-1 rounded-full mr-2 bg-brand"></span>
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
                  borderColor={errors.phone ? 'var(--color-primary)' : 'var(--bg-border)'}
                  focusColor="var(--color-primary)"
                  icon={Phone}
                  className="bg-transparent"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm flex items-center text-brand">
                    <span className="inline-block w-1 h-1 rounded-full mr-2 bg-brand"></span>
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
                  borderColor={errors.password ? 'var(--color-primary)' : 'var(--bg-border)'}
                  focusColor="var(--color-primary)"
                  icon={Lock}
                  className="bg-transparent"
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--color-primary-light)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                            backgroundColor: passwordStrength.color,
                          }}
                        ></div>
                      </div>
                      <span
                        className="text-xs font-medium ml-2"
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>

                    {/* Password Requirements */}
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center ${
                              req.met ? "bg-success" : "bg-border"
                            }`}
                          >
                            {req.met && (
                              <Check size={10} className="text-primary" />
                            )}
                          </div>
                          <span
                            className="text-xs"
                            style={{
                              color: req.met ? 'var(--color-success)' : 'var(--text-muted)',
                            }}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="mt-2 text-sm flex items-center text-brand">
                    <span className="inline-block w-1 h-1 rounded-full mr-2 bg-brand"></span>
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
                  borderColor={errors.confirmPassword ? 'var(--color-primary)' : 'var(--bg-border)'}
                  focusColor="var(--color-primary)"
                  icon={Lock}
                  className="bg-transparent"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm flex items-center text-brand">
                    <span className="inline-block w-1 h-1 rounded-full mr-2 bg-brand"></span>
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
                      backgroundColor: agreedToTerms
                        ? 'var(--color-primary)'
                        : 'var(--bg-card)',
                      border: '1px solid var(--bg-border)',
                      color: 'var(--color-primary)',
                    }}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm cursor-pointer text-muted"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-semibold hover:text-primary transition-colors text-brand"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-semibold hover:text-primary transition-colors text-brand"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-2 text-sm flex items-center text-brand">
                    <span className="inline-block w-1 h-1 rounded-full mr-2 bg-brand"></span>
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-lg shadow-lg text-primary font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-primary-hover hover:scale-[1.02] active:scale-[0.98] mt-6 bg-gradient-primary"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
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

           

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-theme"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:gap-4 border border-theme text-primary hover:border-brand hover:bg-brand/10"
                >
                  Sign In to Existing Account
                  <ArrowLeft size={18} className="rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;