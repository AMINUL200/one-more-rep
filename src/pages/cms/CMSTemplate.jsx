import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLoader from '../../component/common/PageLoader';
import PageHelmet from '../../component/common/PageHelmet';
import { toast } from 'react-toastify';
import { api } from '../../utils/app';

const CMSTemplate = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({
    page_name: "",
    page_heading: "",
    short_desc: "",
    description: "",
    image: "",
    image_alt: "",
    image_align: "center",
    status: true
  });

  // Fetch CMS page data based on slug
  useEffect(() => {
    const fetchCMSPage = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/cms-pages/${slug}`);
        
        if (response.data?.status) {
          const data = response.data.data;
          setPageData({
            page_name: data.page_name || "",
            page_heading: data.page_heading || "",
            short_desc: data.short_desc || "",
            description: data.description || "",
            image: data.image || "",
            image_alt: data.image_alt || "",
            image_align: data.image_align || "center",
            status: data.status === 1
          });
        } else {
          toast.error("Page not found");
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching CMS page:", error);
        toast.error("Failed to load page");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCMSPage();
    }
  }, [slug, navigate]);

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    
    const storageUrl = import.meta.env.VITE_STORAGE_URL || '';
    return `${storageUrl}/${imagePath}`;
  };

  // Function to get layout classes based on alignment
  const getLayoutClasses = () => {
    switch (pageData.image_align) {
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

  if (loading) {
    return (
      <div className="bg-main min-h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <PageHelmet 
        title={`${pageData.page_name} - ONE REP MORE`}
        metaDescription={pageData.short_desc || pageData.page_heading}
      />
      
      <div className="bg-main min-h-screen">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-20 md:pt-40">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-primary">{pageData.page_heading || pageData.page_name}</span>
            </h1>
            {pageData.short_desc && (
              <p className="text-lg text-muted max-w-3xl mx-auto">
                {pageData.short_desc}
              </p>
            )}
          </div>

          {/* Dynamic Layout Container */}
          <div className={layoutClasses.container}>
            {/* Image Section */}
            {pageData.image && (
              <div className={layoutClasses.imageWrapper}>
                <div className="relative overflow-hidden rounded-2xl border border-theme shadow-lg">
                  <img
                    src={getImageUrl(pageData.image)}
                    alt={pageData.image_alt || pageData.page_name}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className={layoutClasses.contentWrapper}>
              <div 
                className="cms-content text-primary text-base md:text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: pageData.description }}
              />
            </div>
          </div>
        </div>

        {/* CMS Content Styling */}
        <style jsx>{`
          .cms-content h1 {
            color: var(--color-primary);
            font-size: 2.5rem;
            font-weight: bold;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }

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

          .cms-content h4 {
            color: var(--text-primary);
            font-size: 1.25rem;
            font-weight: bold;
            margin-top: 1.25rem;
            margin-bottom: 0.5rem;
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
            color: var(--text-primary);
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

          .cms-content blockquote {
            border-left: 4px solid var(--color-primary);
            padding-left: 1.5rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: var(--text-muted);
          }

          .cms-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem;
            margin: 1.5rem 0;
          }

          .cms-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }

          .cms-content th,
          .cms-content td {
            border: 1px solid var(--border);
            padding: 0.75rem;
            text-align: left;
          }

          .cms-content th {
            background-color: var(--bg-card);
            color: var(--text-primary);
            font-weight: bold;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .cms-content h1 {
              font-size: 2rem;
            }
            
            .cms-content h2 {
              font-size: 1.75rem;
            }
            
            .cms-content h3 {
              font-size: 1.35rem;
            }
            
            .cms-content p {
              font-size: 1rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default CMSTemplate;