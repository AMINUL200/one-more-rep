import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Shield,
  CreditCard,
  Truck,
  Globe,
  Linkedin,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = ({ categoryData, contactData }) => {
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Generate shop links from categoryData
  const shopLinks =
    categoryData && categoryData.length > 0
      ? categoryData.slice(0, 9).map((category) => ({
          name: category.name,
          url: `/products/${category.slug}`,
        }))
      : [
          { name: "Strength Equipment", url: "/products/strength" },
          { name: "Cardio Machines", url: "/products/cardio" },
          { name: "Yoga & Pilates", url: "/products/yoga" },
          { name: "Accessories", url: "/products/accessories" },
          { name: "Supplements", url: "/products/supplements" },
          { name: "Apparel", url: "/products/apparel" },
        ];

  // Generate social links from contactData
  const socialLinks = [
    {
      icon: Facebook,
      url: contactData?.facebook || "https://facebook.com",
      label: "Facebook",
      active: !!contactData?.facebook,
    },
    {
      icon: Twitter,
      url: contactData?.twitter || "https://twitter.com",
      label: "Twitter",
      active: !!contactData?.twitter,
    },
    {
      icon: Instagram,
      url: contactData?.instagram || "https://instagram.com",
      label: "Instagram",
      active: !!contactData?.instagram,
    },
    {
      icon: Linkedin,
      url: contactData?.linkedin || "https://linkedin.com",
      label: "LinkedIn",
      active: !!contactData?.linkedin,
    },
    { icon: Youtube, url: "#", label: "YouTube", active: false },
  ].filter((social) => social.active);

  // Generate contact info from contactData
  const contactInfo = [
    {
      icon: Phone,
      text: contactData?.phone || "+91 1800-123-4567",
      url: `tel:${contactData?.phone?.replace(/\s/g, "") || "+9118001234567"}`,
    },
    {
      icon: Mail,
      text: contactData?.email || "support@onerepmore.com",
      url: `mailto:${contactData?.email || "support@onerepmore.com"}`,
    },
    {
      icon: MapPin,
      text: `${contactData?.street_address || "Mumbai"}, ${contactData?.city || "Maharashtra"} ${contactData?.zip || "400001"}`,
      url: "#",
    },
  ];

  const trustBadges = [
    { icon: Shield, text: "Secure Payment" },
    { icon: CreditCard, text: "SSL Certified" },
    { icon: Truck, text: "Free Shipping" },
  ];

  return (
    <>
      {/* Red Horizontal Line before Footer */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-80" />

      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-main text-primary relative"
      >
        {/* Top Border for Visual Separation */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-30" />

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Main Footer Content - 2 column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column - Brand & Contact Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                {/* Logo Section - Increased height */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="w-auto h-20 sm:w-auto sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-card border border-theme p-2">
                    <img
                      src={`${STORAGE_URL}/${contactData?.site_web_logo}`}
                      alt={contactData?.site_logo_alt || "ONE REP MORE Logo"}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E10600'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='white' text-anchor='middle' dy='.3em'%3E1RM%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                      <span className="text-primary">
                        {contactData?.site_name?.split(" ")[0] || "ONE"}
                      </span>
                      <span className="text-brand">
                        {" "}
                        {contactData?.site_name
                          ?.split(" ")
                          .slice(1)
                          .join(" ") || "REP MORE"}
                      </span>
                    </h2>
                    {/* Tagline */}
                    <p className="text-sm text-muted italic tracking-wide">
                      {contactData?.punch_line || "Your Ultimate Fitness Destination"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Contact Information - Increased font size */}
              <div className="space-y-4 mb-10">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.url}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-start sm:items-center gap-4 text-muted hover:text-brand transition-colors duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-card border border-theme flex items-center justify-center group-hover:bg-brand/10 group-hover:border-brand transition-colors flex-shrink-0">
                      <info.icon size={18} className="text-muted group-hover:text-brand transition-colors" />
                    </div>
                    <span className="text-base sm:text-lg break-all font-medium">
                      {info.text}
                    </span>
                  </motion.a>
                ))}

                {/* Additional Contact Info (if available) */}
                {contactData?.landline && (
                  <motion.a
                    href={`tel:${contactData.landline.replace(/\s/g, "")}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.24 }}
                    className="flex items-start sm:items-center gap-4 text-muted hover:text-brand transition-colors duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-card border border-theme flex items-center justify-center group-hover:bg-brand/10 group-hover:border-brand transition-colors flex-shrink-0">
                      <Phone size={18} className="text-muted group-hover:text-brand transition-colors" />
                    </div>
                    <span className="text-base sm:text-lg break-all font-medium">
                      Landline: {contactData.landline}
                    </span>
                  </motion.a>
                )}
              </div>

              {/* Social Links - Larger icons */}
              {socialLinks.length > 0 && (
                <div className="mb-10">
                  <h4 className="text-base font-semibold mb-5 text-primary">
                    Follow Us
                  </h4>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        whileHover={{ scale: 1.15, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 260 }}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-12 h-12 rounded-xl bg-card border border-theme flex items-center justify-center hover:bg-brand hover:border-brand transition-all duration-200 hover:scale-105 group"
                      >
                        <social.icon size={22} className="text-muted group-hover:text-white transition-colors" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badges - Larger */}
              <div className="grid grid-cols-3 gap-4">
                {trustBadges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12 }}
                    className="p-4 rounded-xl bg-card border border-theme text-center hover-lift hover-glow transition-all"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary-light border border-primary/30 flex items-center justify-center">
                        <badge.icon size={20} className="text-brand" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted">{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Shop Links & Newsletter */}
            <div>
              {/* Shop Links - Increased font size */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-primary relative inline-block">
                  Shop Categories
                  <span className="absolute -bottom-2 left-0 w-16 h-0.5 bg-brand rounded-full" />
                </h3>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {shopLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="text-base text-muted hover:text-brand transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-2 h-2 rounded-full bg-border mr-3 group-hover:bg-brand transition-colors" />
                      {link.name}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Newsletter Subscription - Larger text */}
              <div className="p-8 rounded-2xl bg-gradient-to-r from-card to-main border border-theme shadow-card">
                <h4 className="text-xl font-bold mb-3 text-primary">
                  Get Fitness Tips & Offers
                </h4>
                <p className="text-base text-muted mb-5">
                  Subscribe to our newsletter for exclusive deals and fitness advice
                </p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-5 py-3 rounded-xl bg-main border border-theme text-primary placeholder-muted text-base focus:outline-none focus:border-brand transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl font-semibold text-base btn-primary transition-all duration-200"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 pt-10 border-t border-theme"
          >
            {/* Copyright & Links - Increased font size */}
            <div className="flex flex-col items-center gap-4 text-sm">
              <div className="flex flex-wrap justify-center gap-8">
                <a
                  href="/privacy"
                  className="text-muted hover:text-brand transition-colors text-sm sm:text-base link-underline"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-muted hover:text-brand transition-colors text-sm sm:text-base link-underline"
                >
                  Terms of Service
                </a>
                <a
                  href="/sitemap"
                  className="text-muted hover:text-brand transition-colors text-sm sm:text-base link-underline"
                >
                  Sitemap
                </a>
              </div>
              <p className="text-muted text-sm sm:text-base text-center">
                © {new Date().getFullYear()}{" "}
                <span className="text-brand font-semibold">
                  {contactData?.site_name || "ONE REP MORE"}
                </span>
                . All rights reserved.
              </p>
            </div>

            {/* India Badge */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-theme hover-lift hover-glow transition-all">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                </div>

                <a
                  href="https://skilledworkerscloud.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-brand transition-colors whitespace-nowrap font-medium"
                >
                  Developed by Skilled Workers Cloud
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;