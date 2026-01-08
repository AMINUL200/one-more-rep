import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PageLoader from "../../component/common/PageLoader";

const ContactUs = () => {
  const [loading, setLoading] = useState(true);

  // 🔥 Simulate API call (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [openFaq, setOpenFaq] = useState(null);
  
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
  
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Number",
      details: "+1 (555) 123-4567",
      description: "Available 24/7 for urgent inquiries",
    },
    {
      icon: Mail,
      title: "Email Address",
      details: "support@gymstore.com",
      description: "Response within 24 hours",
    },
    {
      icon: MapPin,
      title: "Our Location",
      details: "123 Fitness Street",
      description: "Miami, FL 33101, USA",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Mon - Fri: 9AM - 8PM",
      description: "Sat - Sun: 10AM - 6PM",
    },
  ];
  
  const faqItems = [
    {
      question: "What is your return policy for gym equipment?",
      answer:
      "We offer a 30-day return policy for all gym equipment. Items must be in original condition with all packaging. For large equipment, we provide free pickup service for returns.",
    },
    {
      question: "Do you offer installation services?",
      answer:
      "Yes, we offer professional installation services for all large equipment purchases. Installation is free with purchases over $500. Our certified technicians ensure proper setup and safety checks.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and offer financing options through Affirm for qualified purchases.",
    },
    {
      question: "How long does shipping take?",
      answer:
      "Standard shipping takes 3-7 business days. Express shipping (2-3 business days) is available for an additional fee. Large equipment may take 7-14 days for delivery and installation scheduling.",
    },
    {
      question: "Do you offer commercial gym equipment?",
      answer:
      "Yes, we specialize in both residential and commercial gym equipment. Contact our commercial sales team for bulk pricing, custom configurations, and commercial warranties.",
    },
    {
      question: "What is your warranty policy?",
      answer:
      "All our equipment comes with a minimum 1-year warranty. Premium equipment has extended warranties up to 5 years. Warranty covers manufacturing defects and includes parts replacement.",
    },
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      }, 1500);
    }
  };
  
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  if (loading) return <PageLoader />;
  
  return (
    <div
      style={{ backgroundColor: colors.background }}
      className="min-h-screen pt-30"
      >
      {/* Hero Section */}
      <div
        className="relative py-20 px-4 md:px-8 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.background} 0%, #1a1a1a 100%)`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div
              className="inline-block mb-4 px-4 py-2 rounded-full"
              style={{
                backgroundColor: `${colors.primary}20`,
                border: `1px solid ${colors.primary}30`,
              }}
            >
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: colors.primary }}
              >
                Get in Touch
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span style={{ color: colors.text }}>Contact </span>
              <span style={{ color: colors.primary }}>Our Team</span>
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto"
              style={{ color: colors.muted }}
            >
              Have questions about our premium gym equipment? Our fitness
              experts are here to help you build your perfect workout space.
            </p>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10">
            <span className="text-4xl">🏋️</span>
          </div>
          <div className="absolute bottom-10 right-10">
            <span className="text-4xl">💪</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Contact Info Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${colors.primary}20`,
                    border: `1px solid ${colors.primary}30`,
                  }}
                >
                  <item.icon size={24} style={{ color: colors.primary }} />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: colors.text }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-lg font-bold mb-1"
                  style={{ color: colors.primary }}
                >
                  {item.details}
                </p>
                <p className="text-sm" style={{ color: colors.muted }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Form & Map Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Form */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <MessageSquare size={24} style={{ color: colors.primary }} />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    Send us a Message
                  </h2>
                  <p style={{ color: colors.muted }}>
                    We'll get back to you within 24 hours
                  </p>
                </div>
              </div>

              {submitSuccess && (
                <div
                  className="mb-6 p-4 rounded-lg flex items-center gap-3"
                  style={{
                    backgroundColor: `${colors.success}20`,
                    border: `1px solid ${colors.success}30`,
                  }}
                >
                  <CheckCircle size={20} style={{ color: colors.success }} />
                  <p className="font-medium" style={{ color: colors.success }}>
                    Message sent successfully! Our team will contact you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${
                          errors.name ? colors.primary : colors.border
                        }`,
                        color: colors.text,
                      }}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: colors.primary }}
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: colors.text }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${
                          errors.email ? colors.primary : colors.border
                        }`,
                        color: colors.text,
                      }}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: colors.primary }}
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E10600] transition-all"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      color: colors.text,
                    }}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.subject ? "border-red-500" : ""
                    }`}
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${
                        errors.subject ? colors.primary : colors.border
                      }`,
                      color: colors.text,
                    }}
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: colors.primary }}
                    >
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.text }}
                  >
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.message ? "border-red-500" : ""
                    }`}
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${
                        errors.message ? colors.primary : colors.border
                      }`,
                      color: colors.text,
                    }}
                    placeholder="Tell us about your gym equipment needs..."
                  />
                  {errors.message && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: colors.primary }}
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Social Links */}
            <div>
              {/* Map Container */}
              <div
                className="rounded-2xl overflow-hidden mb-8 border"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                }}
              >
                <div className="h-64 md:h-80 bg-gray-800 relative">
                  {/* Mock Map */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${colors.primary}20` }}
                      >
                        <MapPin size={32} style={{ color: colors.primary }} />
                      </div>
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: colors.text }}
                      >
                        Our Location
                      </h3>
                      <p style={{ color: colors.muted }}>
                        123 Fitness Street, Miami, FL 33101
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: colors.text }}
                  >
                    Visit Our Showroom
                  </h3>
                  <p className="text-sm mb-4" style={{ color: colors.muted }}>
                    Experience our premium gym equipment firsthand at our Miami
                    showroom. Our experts are available to guide you through our
                    complete range of fitness solutions.
                  </p>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
                      style={{
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      Get Directions
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Schedule Visit
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text }}
                >
                  Connect With Us
                </h3>
                <p className="text-sm mb-6" style={{ color: colors.muted }}>
                  Follow us on social media for the latest equipment releases,
                  fitness tips, and exclusive offers.
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: Facebook, label: "Facebook" },
                    { icon: Instagram, label: "Instagram" },
                    { icon: Twitter, label: "Twitter" },
                    { icon: Youtube, label: "YouTube" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="group w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 hover:transform hover:-translate-y-1"
                      style={{
                        backgroundColor: `${colors.primary}10`,
                        border: `1px solid ${colors.border}`,
                      }}
                      aria-label={social.label}
                    >
                      <social.icon
                        size={20}
                        className="transition-colors group-hover:text-white"
                        style={{ color: colors.primary }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div
                className="inline-block mb-4 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  border: `1px solid ${colors.primary}30`,
                }}
              >
                <span
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: colors.primary }}
                >
                  Common Questions
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.text }}
              >
                Frequently Asked Questions
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: colors.muted }}
              >
                Find answers to the most common questions about our gym
                equipment and services.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={`mb-4 rounded-xl transition-all duration-300 ${
                    openFaq === index ? "border-[#E10600]" : ""
                  }`}
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${
                      openFaq === index ? colors.primary : colors.border
                    }`,
                  }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span
                      className="text-lg font-semibold pr-8"
                      style={{ color: colors.text }}
                    >
                      {item.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp size={20} style={{ color: colors.primary }} />
                    ) : (
                      <ChevronDown size={20} style={{ color: colors.muted }} />
                    )}
                  </button>

                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ${
                      openFaq === index
                        ? "pb-5 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div
                      className="pt-4 border-t"
                      style={{
                        borderColor: colors.border,
                        color: colors.muted,
                      }}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
