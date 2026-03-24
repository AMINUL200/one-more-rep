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
  Linkedin,
  Youtube,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Globe,
  Building2,
  PhoneCall,
} from "lucide-react";
import { toast } from "react-toastify";
import PageLoader from "../../component/common/PageLoader";
import PageHelmet from "../../component/common/PageHelmet";
import { api } from "../../utils/app";

const ContactUs = () => {
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState(null);
  const [faqs, setFaqs] = useState([]);

  // 🔥 Fetch contact data from API
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        // Fetch website settings from API
        const response = await api.get("/website-settings");
        console.log("Contact data:", response.data);
        
        if (response.data?.status && response.data?.data) {
          setContactData(response.data.data.settings);
          setFaqs(response.data.data.faqs || []);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
        toast.error("Failed to load contact information");
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    subject: "",
    message: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [openFaq, setOpenFaq] = useState(null);
  
  // Generate contact info from API data
  const getContactInfo = () => {
    if (!contactData) return [];
    
    return [
      {
        icon: Phone,
        title: "Phone Number",
        details: contactData.phone || "+1 (555) 123-4567",
        description: "Available 24/7 for urgent inquiries",
      },
      {
        icon: PhoneCall,
        title: "Landline",
        details: contactData.landline || "Not available",
        description: "Office hours: Mon - Fri, 9AM - 6PM",
      },
      {
        icon: Mail,
        title: "Email Address",
        details: contactData.email || "support@gymstore.com",
        description: "Response within 24 hours",
      },
      {
        icon: Mail,
        title: "Fax",
        details: contactData.fax || "Not available",
        description: "For official documents",
      },
      {
        icon: MapPin,
        title: "Our Location",
        details: contactData.street_address || "123 Fitness Street",
        description: `${contactData.city || "Miami"}, ${contactData.state || "FL"} ${contactData.zip || "33101"}, ${contactData.country || "USA"}`,
      },
      {
        icon: Clock,
        title: "Working Hours",
        details: "Mon - Fri: 9AM - 8PM",
        description: "Sat - Sun: 10AM - 6PM",
      },
    ];
  };
  
  // Get social media links from API data
  const getSocialLinks = () => {
    if (!contactData) return [];
    
    const socialLinks = [];
    
    if (contactData.facebook) {
      socialLinks.push({ icon: Facebook, label: "Facebook", url: contactData.facebook });
    }
    if (contactData.instagram) {
      socialLinks.push({ icon: Instagram, label: "Instagram", url: contactData.instagram });
    }
    if (contactData.twitter) {
      socialLinks.push({ icon: Twitter, label: "Twitter", url: contactData.twitter });
    }
    if (contactData.linkedin) {
      socialLinks.push({ icon: Linkedin, label: "LinkedIn", url: contactData.linkedin });
    }
    if (contactData.pinterest) {
      socialLinks.push({ icon: Instagram, label: "Pinterest", url: contactData.pinterest });
    }
    
    return socialLinks;
  };
  
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
    
    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Name is required";
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = "Name must be at least 2 characters";
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (formData.phone_number && !/^[\d\s\+\-\(\)]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Please enter a valid phone number";
    }
    
    if (!formData.subject?.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }
    
    if (!formData.message?.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post("/contact", formData);
      
      if (response.data?.status) {
        setSubmitSuccess(true);
        setFormData({
          full_name: "",
          email: "",
          phone_number: "",
          subject: "",
          message: "",
        });
        
        toast.success(response.data?.message || "Message sent successfully!");
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        toast.error(response.data?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Handle validation errors from API
      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || {};
        const formattedErrors = {};
        
        Object.keys(validationErrors).forEach(key => {
          formattedErrors[key] = validationErrors[key][0];
        });
        
        setErrors(formattedErrors);
        toast.error("Please check the form for errors");
      } else {
        toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  
  if (loading) return <PageLoader />;
  
  const contactInfo = getContactInfo();
  const socialLinks = getSocialLinks();
  
  return (
    <>
      <PageHelmet title={`Contact Us - ${contactData?.site_name || "ONE REP MORE"}`} />
      <div className="min-h-screen pt-30 bg-main">
        {/* Hero Section */}
        <div
          className="relative py-20 px-4 md:px-8 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, var(--bg-main) 0%, #1a1a1a 100%)`,
            borderBottom: '1px solid var(--bg-border)',
          }}
        >
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <div
                className="inline-block mb-4 px-4 py-2 rounded-full text-brand bg-[currentColor]/20 "
                // style={{
                //   backgroundColor: 'var(--color-primary-light)',
                //   border: '1px solid var(--color-primary)',
                //   opacity: 0.3,
                // }}
              >
                <span className="text-sm font-semibold uppercase tracking-wider ">
                  Get in Touch
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-primary">Contact </span>
                <span className="text-brand">Our Team</span>
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 card"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: 'var(--color-primary-light)',
                      border: '1px solid var(--color-primary)',
                      opacity: 0.3,
                    }}
                  >
                    <item.icon size={24} className="text-brand" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-primary">
                    {item.title}
                  </h3>
                  <p className="text-lg font-bold mb-1 text-brand">
                    {item.details}
                  </p>
                  <p className="text-sm text-muted">
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
                    style={{ backgroundColor: 'var(--color-primary-light)' }}
                  >
                    <MessageSquare size={24} className="text-brand" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">
                      Send us a Message
                    </h2>
                    <p className="text-muted">
                      We'll get back to you within 24 hours
                    </p>
                  </div>
                </div>

                {submitSuccess && (
                  <div
                    className="mb-6 p-4 rounded-lg flex items-center gap-3 bg-success/10 border border-success/30"
                  >
                    <CheckCircle size={20} className="text-success" />
                    <p className="font-medium text-success">
                      Message sent successfully! Our team will contact you soon.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.full_name ? "border-primary" : "border-theme"
                        }`}
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid',
                          borderColor: errors.full_name ? 'var(--color-primary)' : 'var(--bg-border)',
                          color: 'var(--text-primary)',
                        }}
                        placeholder="John Doe"
                      />
                      {errors.full_name && (
                        <p className="mt-1 text-sm flex items-center gap-1 text-error">
                          <AlertCircle size={12} />
                          {errors.full_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.email ? "border-primary" : "border-theme"
                        }`}
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid',
                          borderColor: errors.email ? 'var(--color-primary)' : 'var(--bg-border)',
                          color: 'var(--text-primary)',
                        }}
                        placeholder={contactData?.email || "john@example.com"}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm flex items-center gap-1 text-error">
                          <AlertCircle size={12} />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-primary">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.phone_number ? "border-primary" : "border-theme"
                      }`}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid',
                        borderColor: errors.phone_number ? 'var(--color-primary)' : 'var(--bg-border)',
                        color: 'var(--text-primary)',
                      }}
                      placeholder={contactData?.phone || "+1 (555) 123-4567"}
                    />
                    {errors.phone_number && (
                      <p className="mt-1 text-sm flex items-center gap-1 text-error">
                        <AlertCircle size={12} />
                        {errors.phone_number}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-primary">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.subject ? "border-primary" : "border-theme"
                      }`}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid',
                        borderColor: errors.subject ? 'var(--color-primary)' : 'var(--bg-border)',
                        color: 'var(--text-primary)',
                      }}
                      placeholder="How can we help?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm flex items-center gap-1 text-error">
                        <AlertCircle size={12} />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-2 text-primary">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                        errors.message ? "border-primary" : "border-theme"
                      }`}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid',
                        borderColor: errors.message ? 'var(--color-primary)' : 'var(--bg-border)',
                        color: 'var(--text-primary)',
                      }}
                      placeholder="Tell us about your gym equipment needs..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm flex items-center gap-1 text-error">
                        <AlertCircle size={12} />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-primary transition-all duration-300 hover:shadow-primary-hover disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-primary"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
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
                  className="rounded-2xl overflow-hidden mb-8 border border-theme"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  <div className="h-64 md:h-80 bg-gray-800 relative">
                    {/* Mock Map */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--color-primary-light)' }}
                        >
                          <MapPin size={32} className="text-brand" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-primary">
                          Our Location
                        </h3>
                        <p className="text-muted">
                          {contactData?.street_address || "123 Fitness Street"}, {contactData?.city || "Miami"}, {contactData?.state || "FL"} {contactData?.zip || "33101"}
                        </p>
                        <p className="text-muted">
                          {contactData?.country || "USA"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-primary">
                      Visit Our Showroom
                    </h3>
                    <p className="text-sm mb-4 text-muted">
                      Experience our premium gym equipment firsthand at our Miami
                      showroom. Our experts are available to guide you through our
                      complete range of fitness solutions.
                    </p>
                    <div className="flex gap-3">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 text-primary border border-theme"
                      >
                        Get Directions
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium text-primary transition-colors bg-primary hover:bg-primary-hover"
                      >
                        Schedule Visit
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                {socialLinks.length > 0 && (
                  <div
                    className="rounded-2xl p-6 card"
                  >
                    <h3 className="text-lg font-semibold mb-4 text-primary">
                      Connect With Us
                    </h3>
                    <p className="text-sm mb-6 text-muted">
                      Follow us on social media for the latest equipment releases,
                      fitness tips, and exclusive offers.
                    </p>
                    <div className="flex gap-4">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 hover:transform hover:-translate-y-1"
                          style={{
                            backgroundColor: 'var(--color-primary-light)',
                            border: '1px solid var(--bg-border)',
                          }}
                          aria-label={social.label}
                        >
                          <social.icon
                            size={20}
                            className="transition-colors group-hover:text-primary text-brand"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            {faqs.length > 0 && (
              <div className="mb-20">
                <div className="text-center mb-12">
                  <div
                    className="inline-block mb-4 px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-primary-light)',
                      border: '1px solid var(--color-primary)',
                      opacity: 0.3,
                    }}
                  >
                    <span className="text-sm font-semibold uppercase tracking-wider text-brand">
                      Common Questions
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-lg max-w-2xl mx-auto text-muted">
                    Find answers to the most common questions about our gym
                    equipment and services.
                  </p>
                </div>

                <div className="max-w-3xl mx-auto">
                  {faqs.map((item, index) => (
                    <div
                      key={item.id}
                      className={`mb-4 rounded-xl transition-all duration-300 card ${
                        openFaq === index ? "border-primary" : "border-theme"
                      }`}
                      style={{
                        border: '1px solid',
                        borderColor: openFaq === index ? 'var(--color-primary)' : 'var(--bg-border)',
                      }}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                      >
                        <span className="text-lg font-semibold pr-8 text-primary">
                          {item.faq_question}
                        </span>
                        {openFaq === index ? (
                          <ChevronUp size={20} className="text-brand" />
                        ) : (
                          <ChevronDown size={20} className="text-muted" />
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
                          className="pt-4 border-t border-theme text-muted"
                        >
                          <div dangerouslySetInnerHTML={{ __html: item.faq_answer }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;