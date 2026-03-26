import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Eye, 
  ArrowRight, 
  Clock,
  Tag,
  ChevronRight,
  Search
} from 'lucide-react';
import PageHelmet from '../../component/common/PageHelmet';
import PageLoader from '../../component/common/PageLoader';
import { api } from '../../utils/app';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // API base URL
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/blogs`);
        
        if (response.data.status && response.data.data.blogs) {
          setBlogs(response.data.data.blogs);
        } else {
          console.error('Invalid API response structure');
          setBlogs([]);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Get image URL
  const getImageUrl = (webImage, mobileImage) => {
    // Try mobile image first, then web image, then fallback
    const imagePath = mobileImage || webImage;
    
    if (imagePath) {
      // If image path already contains full URL, use it directly
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      // Otherwise, construct full URL
      return `${STORAGE_URL}/${imagePath}`;
    }
    
    // Fallback image
    return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Recent';
    }
  };

  // Calculate read time (rough estimate based on short description length)
  const calculateReadTime = (shortDesc) => {
    if (!shortDesc) return '3 min read';
    const wordsPerMinute = 200;
    const wordCount = shortDesc.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    return `${readTime} min read`;
  };

  // Filter blogs based on search
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.short_desc?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) return <PageLoader />;

  return (
    <>
      <PageHelmet title="Blog - ONE REP MORE" />
      
      <div className="bg-main min-h-screen pt-30 md:pt-40 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="text-primary">Our </span>
              <span className="text-gradient">Blog</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted text-lg max-w-2xl mx-auto"
            >
              Stay updated with the latest fitness tips, workout guides, and industry news
            </motion.p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card border border-theme rounded-xl focus:outline-none focus:border-primary transition-all text-primary"
                />
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          {filteredBlogs.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {filteredBlogs.map((blog) => (
                <motion.article
                  key={blog.id}
                  variants={itemVariants}
                  className="group card rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/blogs/${blog.title_slug || blog.id}`)}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={getImageUrl(blog.web_image, blog.mobile_image)}
                      alt={blog.image_alt || blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
                      }}
                    />
                    
                    {/* YouTube Badge */}
                    {blog.youtube_link && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-red-600/90 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                          </svg>
                          Video
                        </span>
                      </div>
                    )}

                    {/* View Button Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-4 bg-primary rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Eye size={24} className="text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(blog.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{calculateReadTime(blog.short_desc)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-muted text-sm mb-4 line-clamp-3">
                      {blog.short_desc || "Click to read more about this topic..."}
                    </p>

                    {/* Read More */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted">
                        <User size={14} />
                        <span>Admin</span>
                      </div>
                      
                      <button 
                        className="flex items-center gap-2 text-primary font-semibold group/btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/blogs/${blog.title_slug || blog.id}`);
                        }}
                      >
                        Read More
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            // Empty State
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar size={40} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">No Articles Found</h3>
              <p className="text-muted max-w-md mx-auto mb-8">
                {searchTerm 
                  ? "No articles match your search criteria. Try different keywords."
                  : "Check back soon for new articles and updates!"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

         
        </div>
      </div>
    </>
  );
};

export default BlogPage;