import React from "react";

const Footer = () => {
  const footerLinks = {
    company: {
      title: "Company",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Careers", url: "/careers" },
        { name: "Contact", url: "/contact" },
        { name: "Blog", url: "/blog" },
      ],
    },
    products: {
      title: "Products",
      links: [
        { name: "Equipment", url: "/products/equipment" },
        { name: "Supplements", url: "/products/supplements" },
        { name: "Gym Wear", url: "/products/gym-wear" },
        { name: "Combos", url: "/products/combos" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", url: "/help" },
        { name: "Order Tracking", url: "/orders" },
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms & Conditions", url: "/terms" },
      ],
    },
  };

  return (
    <footer className="bg-[#0B0B0B] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-lg font-semibold mb-5 text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      className="text-[#B3B3B3] hover:text-[#E10600] transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="mt-12 border-t border-[#262626]" />

        {/* BOTTOM BAR */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#B3B3B3]">
            © {new Date().getFullYear()} <span className="text-[#E10600] font-semibold">GYMSTORE</span>.  
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
