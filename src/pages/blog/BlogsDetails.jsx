import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  User,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  ChevronRight,
  Youtube,
  ExternalLink
} from 'lucide-react';
import PageHelmet from '../../component/common/PageHelmet';
import PageLoader from '../../component/common/PageLoader';
import { api } from '../../utils/app';
import { toast } from 'react-toastify';

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Color scheme
  const colors = {
    primary: "#E10600",
    primaryHover: "#FF0800",
    background: "#0B0B0B",
    cardBg: "#141414",
    border: "#262626",
    text: "#FFFFFF",
    textMuted: "#B3B3B3",
    success: "#22C55E",
    warning: "#FACC15",
  };

  // Fetch blog data based on slug
  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/blogs/${slug}`);
        
        if (response.data?.status) {
          const blogData = response.data.data;
          setBlog(blogData);
          setLikeCount(blogData.likes || 0);
          
          // Set related posts from API
          if (blogData.related_blog && blogData.related_blog.length > 0) {
            setRelatedPosts(blogData.related_blog);
          }
        } else {
          toast.error("Blog not found");
          navigate('/blogs');
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
        toast.error("Failed to load blog post");
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogDetails();
    }
  }, [slug, navigate]);

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
    }
    
    // If it's already a full URL
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    
    // Use web_image_url if available
    if (blog?.web_image_url) {
      return blog.web_image_url;
    }
    
    const storageUrl = import.meta.env.VITE_STORAGE_URL || '';
    return `${storageUrl}/${imagePath}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Handle like
  const handleLike = async () => {
    if (liked) return;
    
    try {
      // Uncomment when like API is available
      // await api.post(`/blogs/${blog.id}/like`);
      setLiked(true);
      setLikeCount(prev => prev + 1);
      toast.success("Thanks for liking this post!");
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.short_desc,
        url: window.location.href,
      }).catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) return <PageLoader />;
  if (!blog) return null;

  return (
    <>
      <PageHelmet 
        title={`${blog.title} - ONE REP MORE`}
        metaDescription={blog.short_desc || blog.title}
        metaKeywords={blog.title_meta || blog.title}
      />
      
      <div className="bg-main min-h-screen pt-30 md:pt-40 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </button>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[400px] rounded-2xl overflow-hidden mb-8"
          >
            <img
              src={getImageUrl(blog.web_image)}
              alt={blog.image_alt || blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
              }}
            />
            
            {/* Category Badge */}
            {blog.category && (
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold flex items-center gap-2">
                  <Tag size={14} />
                  {blog.category}
                </span>
              </div>
            )}
          </motion.div>

          {/* YouTube Link Section */}
          {blog.youtube_link && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-8"
            >
              <a
                href={blog.youtube_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-theme rounded-lg hover:border-primary transition-all duration-300 group"
              >
                <Youtube size={24} className="text-red-600" />
                <span className="text-primary font-medium group-hover:text-primary transition-colors">
                  Watch on YouTube
                </span>
                <ExternalLink size={16} className="text-muted group-hover:text-primary transition-colors" />
              </a>
            </motion.div>
          )}

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-6 mb-6"
          >
            <div className="flex items-center gap-2 text-muted">
              <Calendar size={18} className="text-primary" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <User size={18} className="text-primary" />
              <span>{blog.author || 'Admin'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Clock size={18} className="text-primary" />
              <span>{blog.read_time || '5 min read'}</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            {blog.title}
          </motion.h1>

          {/* Short Description */}
          {blog.short_desc && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-lg text-muted mb-8 border-l-4 border-primary pl-4 italic"
            >
              {blog.short_desc}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose text-muted prose-invert prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: blog.long_desc }}
          />

          {/* Share & Interaction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between py-6 border-y border-theme mb-12"
          >
            <div className="flex items-center gap-4">
              {/* <button 
                onClick={handleLike}
                disabled={liked}
                className={`flex items-center gap-2 transition-colors ${liked ? 'text-primary' : 'text-muted hover:text-primary'}`}
              >
                <Heart size={20} className={liked ? 'fill-primary' : ''} />
                <span>{likeCount}</span>
              </button>
              <button className="flex items-center gap-2 text-muted hover:text-primary transition-colors">
                <MessageCircle size={20} />
                <span>{blog.comments || 0}</span>
              </button> */}
            </div>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
            >
              <Share2 size={20} />
              Share
            </button>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6">
                <span className="text-primary">Related </span>
                <span className="text-gradient">Articles</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/blogs/${post.title_slug || post.id}`)}
                    className="card rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={post.web_image_url || getImageUrl(post.web_image)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-primary mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Calendar size={12} />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogDetails;