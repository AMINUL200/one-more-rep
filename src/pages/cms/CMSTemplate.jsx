import React, { useState } from 'react';

const CMSTemplate = () => {
  // Simulating backend data - you'll replace this with your actual backend data
  const [pageData, setPageData] = useState({
    title: "Premium Gym Equipment Guide",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
    imageAlign: "center", // Options: "center", "left", "right"
    content: `
      <h2>Build Your Dream Home Gym</h2>
      <p>Creating the perfect home gym starts with choosing the right equipment. Whether you're a beginner or a seasoned athlete, having quality gear makes all the difference in achieving your fitness goals.</p>
      
      <h3>Essential Equipment for Beginners</h3>
      <p>Start with the basics: adjustable dumbbells, a quality yoga mat, and resistance bands. These versatile pieces allow you to perform hundreds of exercises without breaking the bank.</p>
      
      <h3>Intermediate Level Equipment</h3>
      <p>As you progress, consider adding a power rack, Olympic barbell, and weight plates. These investments will last decades and provide unlimited workout possibilities.</p>
      
      <h3>Advanced Training Tools</h3>
      <p>For serious athletes, specialized equipment like competition kettlebells, plyometric boxes, and cable machines can take your training to the next level.</p>
      
      <p>Remember, the best equipment is the one you'll actually use. Start small, stay consistent, and gradually build your collection as your fitness journey evolves.</p>
    `
  });

  // Function to get layout classes based on alignment
  const getLayoutClasses = () => {
    switch (pageData.imageAlign) {
      case "center":
        return {
          container: "flex flex-col items-center",
          imageWrapper: "w-full max-w-5xl mb-12",
          contentWrapper: "w-full max-w-4xl"
        };
      case "left":
        return {
          container: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start",
          imageWrapper: "order-1",
          contentWrapper: "order-2"
        };
      case "right":
        return {
          container: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start",
          imageWrapper: "order-2 lg:order-2",
          contentWrapper: "order-1 lg:order-1"
        };
      default:
        return {
          container: "flex flex-col items-center",
          imageWrapper: "w-full max-w-5xl mb-12",
          contentWrapper: "w-full max-w-4xl"
        };
    }
  };

  const layoutClasses = getLayoutClasses();

  // Demo controls - remove in production
  const handleAlignmentChange = (align) => {
    setPageData({ ...pageData, imageAlign: align });
  };

  return (
    <div className="bg-main min-h-screen">
      {/* Demo Controls - Remove this in production */}
      <div className="bg-card border-b-2 border-theme py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-muted font-bold">Demo Controls (Backend):</span>
            <button
              onClick={() => handleAlignmentChange('center')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                pageData.imageAlign === 'center'
                  ? 'bg-primary text-white'
                  : 'bg-card border-2 border-theme text-muted hover:border-primary'
              }`}
            >
              Center Align
            </button>
            <button
              onClick={() => handleAlignmentChange('left')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                pageData.imageAlign === 'left'
                  ? 'bg-primary text-white'
                  : 'bg-card border-2 border-theme text-muted hover:border-primary'
              }`}
            >
              Left Align
            </button>
            <button
              onClick={() => handleAlignmentChange('right')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                pageData.imageAlign === 'right'
                  ? 'bg-primary text-white'
                  : 'bg-card border-2 border-theme text-muted hover:border-primary'
              }`}
            >
              Right Align
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-primary">{pageData.title}</span>
          </h1>
        </div>

        {/* Dynamic Layout Container */}
        <div className={layoutClasses.container}>
          {/* Image Section */}
          <div className={layoutClasses.imageWrapper}>
            <div className="relative overflow-hidden rounded-2xl border-2 border-theme">
              <img
                src={pageData.imageUrl}
                alt={pageData.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className={layoutClasses.contentWrapper}>
            <div 
              className="cms-content text-muted text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          </div>
        </div>

        {/* Full Width Content Below (if center aligned) */}
        {pageData.imageAlign === 'center' && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-card border-2 border-theme rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Additional Information
              </h3>
              <p className="text-muted text-lg leading-relaxed">
                This section appears below when image is center-aligned. Perfect for additional content, CTAs, or related information.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CMS Content Styling */}
      <style jsx>{`
        .cms-content h2 {
          color: var(--color-primary);
          font-size: 2rem;
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .cms-content h3 {
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .cms-content p {
          color: var(--text-muted);
          font-size: 1.125rem;
          line-height: 1.75;
          margin-bottom: 1.25rem;
        }

        .cms-content ul,
        .cms-content ol {
          color: var(--text-muted);
          margin-left: 1.5rem;
          margin-bottom: 1.25rem;
        }

        .cms-content li {
          margin-bottom: 0.5rem;
        }

        .cms-content strong {
          color: var(--color-primary);
          font-weight: bold;
        }

        .cms-content a {
          color: var(--color-primary);
          text-decoration: underline;
          transition: color 0.3s;
        }

        .cms-content a:hover {
          color: var(--color-primary-hover);
        }

        /* Center Align Specific */
        ${pageData.imageAlign === 'center' ? `
          .cms-content {
            text-align: left;
          }
        ` : ''}

        /* Left/Right Align Specific */
        ${pageData.imageAlign === 'left' || pageData.imageAlign === 'right' ? `
          @media (min-width: 1024px) {
            .cms-content {
              max-height: none;
            }
          }
        ` : ''}
      `}</style>
    </div>
  );
};

export default CMSTemplate;