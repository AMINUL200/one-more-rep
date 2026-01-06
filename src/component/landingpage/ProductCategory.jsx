import React from "react";
import { Link } from "react-router-dom";

const ProductCategory = () => {
  const categories = [
    {
      id: 1,
      title: "Barbells",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
      description: "Premium Olympic Barbells",
      path:"products/plate"
    },
    {
      id: 2,
      title: "Plates",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
      description: "Weight Plates & Bumpers",
      path:"products/plate"
    },
    {
      id: 3,
      title: "Strength Equipment",
      image:
        "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800&h=600&fit=crop",
      description: "Power Racks & Machines",
      path:"products/plate"
    },
    {
      id: 4,
      title: "Benches",
      image:
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop",
      description: "Adjustable & Flat Benches",
      path:"products/plate"
    },
    {
      id: 5,
      title: "Dumbbells",
      image:
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
      description: "Fixed & Adjustable Sets",
      path:"products/plate"
    },
    {
      id: 6,
      title: "Cardio Equipment",
      image:
        "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=600&fit=crop",
      description: "Treadmills & Bikes",
      path:"products/plate"
    },
  ];

  return (
    <>
      <style>{`
        .category-section {
          background: #0B0B0B;
          padding: 80px 20px;
          position: relative;
        }
        
        .category-container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .category-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .category-subtitle {
          color: #E10600;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        
        .category-title {
          color: #FFFFFF;
          font-size: 42px;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }
        
        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        
        .category-card {
          background: #141414;
          border: 1px solid #262626;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          // cursor: pointer;
        }
        
        .category-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #E10600;
          transform: scaleX(0);
          transition: transform 0.4s ease;
          z-index: 2;
        }
        
        .category-card:hover {
          transform: translateY(-8px);
          border-color: #E10600;
          box-shadow: 0 20px 40px rgba(225, 6, 0, 0.3);
        }
        
        .category-card:hover::before {
          transform: scaleX(1);
        }
        
        .image-wrapper {
          position: relative;
          overflow: hidden;
          height: 280px;
        }
        
        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .category-card:hover .category-image {
          transform: scale(1.1);
        }
        
        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(11, 11, 11, 0.9), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        
        .category-card:hover .image-overlay {
          opacity: 1;
        }
        
        .card-content {
          padding: 24px;
        }
        
        .category-name {
          color: #FFFFFF;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
          transition: color 0.3s ease;
        }
        
        .category-card:hover .category-name {
          color: #E10600;
        }
        
        .category-desc {
          color: #B3B3B3;
          font-size: 14px;
          margin: 0 0 20px 0;
        }
        
        .shop-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #E10600;
          border: 2px solid #E10600;
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .shop-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: #E10600;
          transition: left 0.4s ease;
          z-index: -1;
        }
        
        .shop-button:hover {
          color: #FFFFFF;
          transform: translateX(4px);
        }
        
        .shop-button:hover::before {
          left: 0;
        }
        
        .arrow-icon {
          transition: transform 0.3s ease;
        }
        
        .shop-button:hover .arrow-icon {
          transform: translateX(4px);
        }
        
        @media (max-width: 768px) {
          .category-section {
            padding: 60px 16px;
          }
          
          .category-title {
            font-size: 32px;
          }
          
          .category-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .image-wrapper {
            height: 220px;
          }
          
          .card-content {
            padding: 20px;
          }
          
          .category-name {
            font-size: 20px;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <section className="category-section">
        <div className="category-container">
          <div className="category-header">
            <div className="category-subtitle">SHOP BY CATEGORY</div>
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-white">Explore Our </span>
              <span className="text-[#E10600]">Collections</span>
            </h2>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="image-wrapper">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="category-image"
                  />
                  <div className="image-overlay"></div>
                </div>

                <div className="card-content">
                  <h3 className="category-name">{category.title}</h3>
                  <p className="category-desc">{category.description}</p>
                  

                  <Link 
                  to={category.path}
                  className="shop-button">
                    Shop Now
                    <span className="arrow-icon">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductCategory;
