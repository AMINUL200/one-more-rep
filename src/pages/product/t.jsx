import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../component/common/PageLoader";

const ProductPage = () => {
  // Get slug from URL (simulated for demo - in real app use react-router)
  const slug = "plates"; // This would come from URL params
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);

  const [loading, setLoading] = useState(true);

  // 🔥 Simulate API call (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  

  // Dummy products data
  const allProducts = {
    plates: [
      {
        id: 1,
        name: "Olympic Weight Plate Set",
        price: 299,
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
        category: "plates",
      },
      {
        id: 2,
        name: "Bumper Plates 45lb",
        price: 189,
        rating: 4,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
        category: "plates",
      },
      {
        id: 3,
        name: "Cast Iron Weight Plates",
        price: 149,
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
        category: "plates",
      },
      {
        id: 4,
        name: "Rubber Coated Plates",
        price: 229,
        rating: 4,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
        category: "plates",
      },
      {
        id: 5,
        name: "Competition Bumper Set",
        price: 449,
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
        category: "plates",
      },
      {
        id: 6,
        name: "Standard Weight Plates",
        price: 99,
        rating: 3,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
        category: "plates",
      },
      {
        id: 7,
        name: "Fractional Plates Set",
        price: 79,
        rating: 4,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
        category: "plates",
      },
      {
        id: 8,
        name: "Color Coded Bumpers",
        price: 379,
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
        category: "plates",
      },
    ],
    barbells: [
      {
        id: 9,
        name: "Olympic Barbell 45lb",
        price: 249,
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop",
        category: "barbells",
      },
      {
        id: 10,
        name: "Power Lifting Barbell",
        price: 349,
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop",
        category: "barbells",
      },
    ],
    dumbbells: [
      {
        id: 11,
        name: "Adjustable Dumbbell Set",
        price: 399,
        rating: 5,
        image:
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=600&fit=crop",
        category: "dumbbells",
      },
    ],
  };

  const priceRanges = [
    { id: "p1", label: "Under ₹100", min: 0, max: 100 },
    { id: "p2", label: "$100 - ₹200", min: 100, max: 200 },
    { id: "p3", label: "₹200 - ₹300", min: 200, max: 300 },
    { id: "p4", label: "₹300 - ₹400", min: 300, max: 400 },
    { id: "p5", label: "Above ₹400", min: 400, max: Infinity },
  ];

  const ratingOptions = [
    { id: "r5", label: "5 Stars", value: 5 },
    { id: "r4", label: "4 Stars & Up", value: 4 },
    { id: "r3", label: "3 Stars & Up", value: 3 },
  ];

  // Get products based on slug
  const categoryProducts = allProducts[slug] || [];

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((product) => {
        return selectedPriceRanges.some((rangeId) => {
          const range = priceRanges.find((r) => r.id === rangeId);
          return product.price >= range.min && product.price < range.max;
        });
      });
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      filtered = filtered.filter((product) => product.rating >= minRating);
    }

    return filtered;
  }, [categoryProducts, searchQuery, selectedPriceRanges, selectedRatings]);

  const handlePriceChange = (rangeId) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const handleRatingChange = (ratingValue) => {
    setSelectedRatings((prev) =>
      prev.includes(ratingValue)
        ? prev.filter((r) => r !== ratingValue)
        : [...prev, ratingValue]
    );
  };

  const clearFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedRatings([]);
    setSearchQuery("");
  };

  if (loading) return <PageLoader />;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .product-page {
          background: #0B0B0B;
          min-height: 100vh;
          padding: 40px 20px;
        }

        .page-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 40px;
        }

        .breadcrumb {
          color: #B3B3B3;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .page-title {
          color: #FFFFFF;
          font-size: 36px;
          font-weight: 700;
          margin: 0;
          text-transform: capitalize;
        }

        .search-bar {
          width: 100%;
          background: #141414;
          border: 1px solid #262626;
          border-radius: 8px;
          padding: 14px 20px;
          color: #FFFFFF;
          font-size: 14px;
          margin-bottom: 30px;
          transition: all 0.3s ease;
        }

        .search-bar:focus {
          outline: none;
          border-color: #E10600;
          box-shadow: 0 0 0 3px rgba(225, 6, 0, 0.1);
        }

        .search-bar::placeholder {
          color: #B3B3B3;
        }

        .content-wrapper {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
        }

        .sidebar {
          position: sticky;
          top: 120px;
          height: fit-content;
        }

        .filter-section {
          background: #141414;
          border: 1px solid #262626;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .filter-title {
          color: #FFFFFF;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .clear-btn {
          background: transparent;
          border: none;
          color: #E10600;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .clear-btn:hover {
          opacity: 0.8;
        }

        .filter-group {
          margin-bottom: 16px;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          cursor: pointer;
          border-bottom: 1px solid #262626;
          margin-bottom: 12px;
        }

        .filter-group-title {
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 600;
          margin: 0;
        }

        .toggle-icon {
          color: #B3B3B3;
          font-size: 18px;
          transition: transform 0.3s ease;
        }

        .toggle-icon.open {
          transform: rotate(180deg);
        }

        .filter-options {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .filter-options.open {
          max-height: 500px;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          cursor: pointer;
        }

        .filter-option:hover .option-label {
          color: #E10600;
        }

        .checkbox {
          width: 18px;
          height: 18px;
          border: 2px solid #262626;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .checkbox.checked {
          background: #E10600;
          border-color: #E10600;
        }

        .checkbox.checked::after {
          content: '✓';
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
        }

        .option-label {
          color: #B3B3B3;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .products-section {
          min-height: 400px;
        }

        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .results-count {
          color: #B3B3B3;
          font-size: 14px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .product-card {
          background: #141414;
          border: 1px solid #262626;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .product-card:hover {
          transform: translateY(-8px);
          border-color: #E10600;
          box-shadow: 0 20px 40px rgba(225, 6, 0, 0.3);
        }

        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          height: 240px;
          background: #0B0B0B;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.1);
        }

        .product-info {
          padding: 20px;
        }

        .product-name {
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .star {
          color: #E10600;
          font-size: 14px;
        }

        .rating-text {
          color: #B3B3B3;
          font-size: 13px;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .view-btn {
  background: transparent;
  border: 2px solid #E10600;
  color: #E10600;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: #E10600;
  color: #FFFFFF;
  box-shadow: 0 0 15px rgba(225, 6, 0, 0.4);
}


        .product-price {
          color: #E10600;
          font-size: 24px;
          font-weight: 700;
        }

        .add-to-cart-btn {
          background: transparent;
          border: 2px solid #E10600;
          color: #E10600;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-to-cart-btn:hover {
          background: #E10600;
          color: #FFFFFF;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
        }

        .no-results-text {
          color: #B3B3B3;
          font-size: 18px;
          margin-bottom: 16px;
        }

        .no-results-subtext {
          color: #B3B3B3;
          font-size: 14px;
        }

        @media (max-width: 1024px) {
          .content-wrapper {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .product-page {
            padding: 20px 16px;
          }

          .page-title {
            font-size: 28px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="product-page">
        <div className="page-container">
          <div className="page-header">
            <div className="breadcrumb">Home / Products / {slug}</div>
            <h1 className="page-title">{slug}</h1>
          </div>

          <input
            type="text"
            className="search-bar"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="content-wrapper">
            {/* Sidebar Filters */}
            <aside className="sidebar">
              <div className="filter-section">
                <div className="filter-header">
                  <h3 className="filter-title">Filters</h3>
                  {(selectedPriceRanges.length > 0 ||
                    selectedRatings.length > 0) && (
                    <button className="clear-btn" onClick={clearFilters}>
                      Clear All
                    </button>
                  )}
                </div>

                {/* Price Filter */}
                <div className="filter-group">
                  <div
                    className="filter-group-header"
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                  >
                    <h4 className="filter-group-title">Price</h4>
                    <span
                      className={`toggle-icon ${isPriceOpen ? "open" : ""}`}
                    >
                      ▼
                    </span>
                  </div>
                  <div
                    className={`filter-options ${isPriceOpen ? "open" : ""}`}
                  >
                    {priceRanges.map((range) => (
                      <div
                        key={range.id}
                        className="filter-option"
                        onClick={() => handlePriceChange(range.id)}
                      >
                        <div
                          className={`checkbox ${
                            selectedPriceRanges.includes(range.id)
                              ? "checked"
                              : ""
                          }`}
                        />
                        <span className="option-label">{range.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="filter-group">
                  <div
                    className="filter-group-header"
                    onClick={() => setIsRatingOpen(!isRatingOpen)}
                  >
                    <h4 className="filter-group-title">Rating</h4>
                    <span
                      className={`toggle-icon ${isRatingOpen ? "open" : ""}`}
                    >
                      ▼
                    </span>
                  </div>
                  <div
                    className={`filter-options ${isRatingOpen ? "open" : ""}`}
                  >
                    {ratingOptions.map((option) => (
                      <div
                        key={option.id}
                        className="filter-option"
                        onClick={() => handleRatingChange(option.value)}
                      >
                        <div
                          className={`checkbox ${
                            selectedRatings.includes(option.value)
                              ? "checked"
                              : ""
                          }`}
                        />
                        <span className="option-label">{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <main className="products-section">
              <div className="products-header">
                <span className="results-count">
                  {filteredProducts.length} Products Found
                </span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-image-wrapper">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-image"
                        />
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-rating">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="star">
                                {i < product.rating ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          <span className="rating-text">
                            ({product.rating}.0)
                          </span>
                        </div>
                        <div className="product-footer">
                          <span className="product-price">
                            ₹{product.price}
                          </span>

                          <div style={{ display: "flex", gap: "10px" }}>
                            {/* VIEW BUTTON */}
                            <button
                              className="view-btn"
                              onClick={() =>
                                navigate(`/product-details/${product.id}`)
                              }
                            >
                              View
                            </button>

                            {/* ADD TO CART */}
                            <button className="add-to-cart-btn">
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p className="no-results-text">No products found</p>
                  <p className="no-results-subtext">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
