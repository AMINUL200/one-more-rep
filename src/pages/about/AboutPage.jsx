import React, { useState, useEffect } from 'react';
import PageLoader from '../../component/common/PageLoader';
import PageHelmet from '../../component/common/PageHelmet';
import { toast } from 'react-toastify';
import { api } from '../../utils/app';

const AboutPage = () => {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState({
    hero: null,
    story: null,
    mission: null,
    vision: null,
    values: null
  });

  // Fetch about page data
  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/about');
      if (response.data?.status) {
        const data = response.data.data;
        
        // Organize data by section based on page_name
        const sections = {
          hero: data.find(item => item.page_name === 'hero section'),
          story: data.find(item => item.page_name === 'story section'),
          mission: data.find(item => item.page_name === 'mission section'),
          vision: data.find(item => item.page_name === 'values section' || item.badge_text === 'OUR VISSON'),
          values: null // Values section if needed
        };
        
        setAboutData(sections);
      } else {
        toast.error("Failed to load about page data");
      }
    } catch (error) {
      console.error("Error fetching about page:", error);
      toast.error("Failed to load about page");
    } finally {
      setLoading(false);
    }
  };

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    
    const storageUrl = import.meta.env.VITE_STORAGE_URL || '';
    return `${storageUrl}/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="bg-main min-h-screen">
        <PageLoader />
      </div>
    );
  }

  // Hero section data
  const heroData = aboutData.hero;
  // Story section data
  const storyData = aboutData.story;
  // Mission section data
  const missionData = aboutData.mission;
  // Vision section data (from values section with badge "OUR VISSON")
  const visionData = aboutData.vision;
  // Values section data
  const valuesData = aboutData.values;

  return (
    <>
      <PageHelmet 
        title="About One Rep More - Premium Gym Equipment"
        metaDescription="Learn about One Rep More - your trusted partner in building strength, achieving goals, and transforming lives through premium fitness equipment."
      />
      
      <div className="bg-main">
        {/* ================= SECTION 1: FULL SCREEN BANNER / HERO SECTION ================= */}
        <section className="relative h-screen w-full">
          {heroData?.page_image ? (
            <img
              src={getImageUrl(heroData.page_image)}
              alt={heroData.image_alt || heroData.page_name || "One Rep More"}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
              alt="One Rep More Gym"
              className="w-full h-full object-cover"
            />
          )}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <span className="text-primary">About</span>{" "}
                <span className="text-white">{heroData?.heading || "One Rep More"}</span>
              </h1>
              {/* <p className="text-muted text-xl md:text-2xl max-w-3xl mx-auto">
                {heroData?.page_desc || "Your trusted partner in building strength, achieving goals, and transforming lives."}
              </p> */}
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: CONTENT LEFT | IMAGE RIGHT (STORY SECTION) ================= */}
        {storyData && (
          <section className="py-20 bg-main">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div>
                  {storyData.badge_text && (
                    <div className="mb-6">
                      <span className="bg-primary/10 text-brand px-4 py-2 rounded-full text-sm font-bold border border-primary/20">
                        {storyData.badge_text}
                      </span>
                    </div>
                  )}
                  <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                    {storyData.heading || "Our Story"}
                  </h2>
                  <div 
                    className="text-muted text-lg mb-6 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: storyData.description || storyData.page_desc || "Building Strength, One Rep at a Time" }}
                  />
                </div>

                {/* Right Image */}
                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-theme">
                    <img
                      src={getImageUrl(storyData.image) || "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80"}
                      alt={storyData.image_alt || storyData.heading || "Our Story"}
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                  {/* Accent Border */}
                  <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary rounded-2xl -z-10"></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 3: IMAGE LEFT | CONTENT RIGHT (MISSION SECTION) ================= */}
        {missionData && (
          <section className="py-20 bg-card">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Image */}
                <div className="relative order-2 lg:order-1">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-theme">
                    <img
                      src={getImageUrl(missionData.image) || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"}
                      alt={missionData.image_alt || missionData.heading || "Our Mission"}
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                  {/* Accent Border */}
                  <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-primary rounded-2xl -z-10"></div>
                </div>

                {/* Right Content */}
                <div className="order-1 lg:order-2">
                  {missionData.badge_text && (
                    <div className="mb-6">
                      <span className="bg-primary/10 text-brand px-4 py-2 rounded-full text-sm font-bold border border-primary/20">
                        {missionData.badge_text}
                      </span>
                    </div>
                  )}
                  <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                    {missionData.heading || "Our Mission"}
                  </h2>
                  <div 
                    className="text-muted text-lg mb-6 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: missionData.description || "Empowering Your Fitness Journey" }}
                  />

                  {/* Mission Points - if available */}
                  {missionData.desc_meta && (
                    <div className="space-y-4 mt-8">
                      {missionData.desc_meta.split('\n').map((point, index) => (
                        point.trim() && (
                          <div key={index} className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-muted text-lg">{point}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 4: CONTENT LEFT | IMAGE RIGHT (VISION SECTION) ================= */}
        {visionData && (
          <section className="py-20 bg-main">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div>
                  {visionData.badge_text && (
                    <div className="mb-6">
                      <span className="bg-primary/10 text-brand px-4 py-2 rounded-full text-sm font-bold border border-primary/20">
                        {visionData.badge_text}
                      </span>
                    </div>
                  )}
                  <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                    {visionData.heading || "Our Vision"}
                  </h2>
                  <div 
                    className="text-muted text-lg mb-6 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: visionData.description || "Creating a healthier world, one rep at a time" }}
                  />

                  {/* Vision Points - if available */}
                  {visionData.desc_meta && (
                    <div className="space-y-4 mt-8">
                      {visionData.desc_meta.split('\n').map((point, index) => (
                        point.trim() && (
                          <div key={index} className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-muted text-lg">{point}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Image */}
                {visionData.image && (
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-2xl border-2 border-theme">
                      <img
                        src={getImageUrl(visionData.image)}
                        alt={visionData.image_alt || visionData.heading || "Our Vision"}
                        className="w-full h-[500px] object-cover"
                      />
                    </div>
                    {/* Accent Border */}
                    <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary rounded-2xl -z-10"></div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Fallback Section if no data available */}
        {!storyData && !missionData && !visionData && !valuesData && (
          <section className="py-20 bg-main">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold text-primary mb-6">Coming Soon</h2>
              <p className="text-muted text-lg">Content is being updated. Please check back later.</p>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default AboutPage;