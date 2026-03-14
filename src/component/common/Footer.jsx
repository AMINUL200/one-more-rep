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
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = ({ categoryData }) => {
  // Generate shop links from categoryData
  const shopLinks = categoryData && categoryData.length > 0 
    ? categoryData.slice(0, 9).map(category => ({
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

  const socialLinks = [
    { icon: Facebook, url: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, url: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, url: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, url: "https://youtube.com", label: "YouTube" },
  ];

  const contactInfo = [
    { icon: Phone, text: "+91 1800-123-4567", url: "tel:+9118001234567" },
    {
      icon: Mail,
      text: "support@onerepmore.com",
      url: "mailto:support@onerepmore.com",
    },
    { icon: MapPin, text: "Mumbai, Maharashtra 400001", url: "#" },
  ];

  const trustBadges = [
    { icon: Shield, text: "Secure Payment" },
    { icon: CreditCard, text: "SSL Certified" },
    { icon: Truck, text: "Free Shipping" },
  ];

  return (
    <>
      {/* Red Horizontal Line before Footer */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E10600] to-transparent opacity-80" />

      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0B0B0B] text-white relative"
      >
        {/* Top Border for Visual Separation */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E10600] to-transparent opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
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
                {/* Logo Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="w-16 h-16 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src="/image/gym_logo.png"
                      alt="ONE REP MORE Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23E10600'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='white' text-anchor='middle' dy='.3em'%3E1RM%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      <span className="text-white">ONE</span>
                      <span className="text-[#E10600]"> REP MORE</span>
                    </h2>
                    <p className="text-[#B3B3B3] text-xs sm:text-sm mt-1">
                      Premium Fitness Equipment
                    </p>
                  </div>
                </div>
                <p className="text-[#B3B3B3] text-sm max-w-md">
                  India's premier destination for premium gym equipment and
                  fitness gear. Quality equipment for serious athletes.
                </p>
              </motion.div>

              {/* Contact Information */}
              <div className="space-y-3 mb-8">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.url}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-start sm:items-center gap-3 text-[#B3B3B3] hover:text-white transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center group-hover:bg-[#E10600]/10 group-hover:border-[#E10600]/30 transition-colors flex-shrink-0">
                      <info.icon size={16} />
                    </div>
                    <span className="text-sm sm:text-base break-all">
                      {info.text}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold mb-4 text-white">
                  Follow Us
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 260 }}
                      href={social.url}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center hover:bg-[#E10600] hover:border-[#E10600] transition-all duration-200 hover:scale-105"
                    >
                      <social.icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                {trustBadges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12 }}
                    className="p-3 rounded-lg bg-[#141414] border border-[#262626] text-center"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#E10600]/10 border border-[#E10600]/30 flex items-center justify-center">
                        <badge.icon size={16} className="text-[#E10600]" />
                      </div>
                    </div>
                    <span className="text-xs text-[#B3B3B3]">{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Shop Links & Newsletter */}
            <div>
              {/* Shop Links */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-6 text-white relative inline-block">
                  Shop Categories
                  <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#E10600] rounded-full" />
                </h3>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {shopLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="text-[#B3B3B3] hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#262626] mr-3 group-hover:bg-[#E10600] transition-colors" />
                      {link.name}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-[#141414] to-[#0B0B0B] border border-[#262626]">
                <h4 className="text-lg font-semibold mb-2 text-white">
                  Get Fitness Tips & Offers
                </h4>
                <p className="text-sm text-[#B3B3B3] mb-4">
                  Subscribe to our newsletter for exclusive deals and fitness advice
                </p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-[#0B0B0B] border border-[#262626] text-white placeholder-[#666] text-sm focus:outline-none focus:border-[#E10600] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-semibold text-white text-sm bg-gradient-to-r from-[#E10600] to-[#B30000] hover:from-[#FF0000] hover:to-[#E10600] transition-all duration-200 hover:shadow-lg hover:shadow-[#E10600]/20"
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
            className="mt-12 pt-8 border-t border-[#262626]"
          >
            {/* Payment Methods */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-[#B3B3B3] text-center sm:text-left">
                  We Accept:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {["VISA", "MASTERCARD", "RUPAY", "UPI", "NETBANKING"].map(
                    (method, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 rounded bg-[#141414] border border-[#262626] text-xs font-medium text-[#B3B3B3]"
                      >
                        {method}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Copyright & Links */}
            <div className="flex flex-col items-center gap-4 text-sm">
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="/privacy"
                  className="text-[#B3B3B3] hover:text-white transition-colors text-xs sm:text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-[#B3B3B3] hover:text-white transition-colors text-xs sm:text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="/sitemap"
                  className="text-[#B3B3B3] hover:text-white transition-colors text-xs sm:text-sm"
                >
                  Sitemap
                </a>
              </div>
              <p className="text-[#B3B3B3] text-xs sm:text-sm text-center">
                © {new Date().getFullYear()}{" "}
                <span className="text-white font-semibold">ONE REP MORE</span>.
                All rights reserved.
              </p>
            </div>

            {/* India Badge */}
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141414] border border-[#262626]">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                </div>
                <span className="text-sm text-[#B3B3B3] whitespace-nowrap">
                  Made in SWC
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;