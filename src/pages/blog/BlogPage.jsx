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

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Dummy blog data
  const dummyBlogs = [
    {
      id: 1,
      title: "10 Essential Exercises for Building Core Strength",
      slug: "essential-core-strength-exercises",
      category: "Workout Tips",
      author: "John Smith",
      date: "2024-03-15",
      read_time: "8 min read",
      excerpt: "Discover the most effective exercises to build a strong core and improve your overall fitness. From planks to Russian twists, we cover everything you need to know.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80",
      content: "Full content here..."
    },
    {
      id: 2,
      title: "The Ultimate Guide to Protein Supplements",
      slug: "ultimate-guide-protein-supplements",
      category: "Nutrition",
      author: "Sarah Johnson",
      date: "2024-03-10",
      read_time: "6 min read",
      excerpt: "Confused about which protein supplement to choose? This comprehensive guide breaks down whey, casein, plant-based proteins, and helps you make an informed decision.",
      image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=500&q=80",
      content: "Full content here..."
    },
    {
      id: 3,
      title: "5 Common Gym Mistakes Beginners Make",
      slug: "common-gym-mistakes-beginners",
      category: "Training",
      author: "Mike Wilson",
      date: "2024-03-05",
      read_time: "5 min read",
      excerpt: "Starting your fitness journey? Avoid these common mistakes that can hinder your progress and potentially lead to injuries. Learn the right way to train.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
      content: "Full content here..."
    },
    {
      id: 4,
      title: "How to Create a Sustainable Meal Plan",
      slug: "create-sustainable-meal-plan",
      category: "Nutrition",
      author: "Emily Brown",
      date: "2024-02-28",
      read_time: "7 min read",
      excerpt: "Meal planning doesn't have to be complicated. Learn how to create a sustainable nutrition plan that fits your lifestyle and helps you achieve your fitness goals.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80",
      content: "Full content here..."
    },
    {
      id: 5,
      title: "The Science of Muscle Recovery",
      slug: "science-muscle-recovery",
      category: "Science",
      author: "Dr. James Chen",
      date: "2024-02-20",
      read_time: "10 min read",
      excerpt: "Understanding how muscles recover is key to making progress. Explore the science behind muscle repair, optimal rest periods, and recovery techniques.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80",
      content: "Full content here..."
    },
    {
      id: 6,
      title: "Cardio vs. Weight Training: What's Better?",
      slug: "cardio-vs-weight-training",
      category: "Workout Tips",
      author: "Lisa Anderson",
      date: "2024-02-15",
      read_time: "6 min read",
      excerpt: "The eternal debate in fitness. We analyze the benefits of both cardio and weight training, and help you determine the right balance for your goals.",
      image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500&q=80",
      content: "Full content here..."
    },
    {
      id: 7,
      title: "Essential Supplements for Beginners",
      slug: "essential-supplements-beginners",
      category: "Supplements",
      author: "Tom Harris",
      date: "2024-02-10",
      read_time: "5 min read",
      excerpt: "New to supplements? Start here. Learn about the most important supplements for beginners and how to incorporate them safely into your routine.",
      image: "https://images.unsplash.com/photo-1579722821273-0f6c7b3e5b1d?w=500&q=80",
      content: "Full content here..."
    },
    {
      id: 8,
      title: "Yoga for Athletes: Benefits and Poses",
      slug: "yoga-for-athletes",
      category: "Wellness",
      author: "Priya Patel",
      date: "2024-02-05",
      read_time: "7 min read",
      excerpt: "Discover how yoga can enhance athletic performance, improve flexibility, and prevent injuries. Includes essential poses for athletes.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
      content: "Full content here..."
    },
    {
      id: 9,
      title: "The Truth About Detox Diets",
      slug: "truth-about-detox-diets",
      category: "Nutrition",
      author: "Rachel Green",
      date: "2024-01-30",
      read_time: "6 min read",
      excerpt: "Detox diets are popular but are they effective? We separate fact from fiction and provide evidence-based advice on cleansing your body.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
      content: "Full content here..."
    }
  ];

  // Simulate loading and set dummy data
  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setBlogs(dummyBlogs);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(dummyBlogs.map(blog => blog.category))];
        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        console.error('Error loading blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
    }
    return imagePath; // Dummy images are already full URLs
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

          {/* Search and Filter Bar */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card border border-theme rounded-xl focus:outline-none focus:border-primary transition-all text-primary"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-card border border-theme text-muted hover:border-primary hover:text-primary'
                    }`}
                  >
                    {category === 'all' ? 'All Posts' : category}
                  </button>
                ))}
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
                  onClick={() => navigate(`/blogs/${blog.slug}`)}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={getImageUrl(blog.image)}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
                      }}
                    />
                    
                    {/* Category Badge */}
                    {blog.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary/90 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                          <Tag size={12} />
                          {blog.category}
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
                        <span>{formatDate(blog.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{blog.author}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted text-sm mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Read More */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted">
                        <Clock size={14} />
                        <span>{blog.read_time}</span>
                      </div>
                      
                      <button 
                        className="flex items-center gap-2 text-primary font-semibold group/btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/blog/${blog.slug}`);
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
                {searchTerm || selectedCategory !== 'all' 
                  ? "No articles match your search criteria. Try different keywords or categories."
                  : "Check back soon for new articles and updates!"}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Newsletter Section */}
          <div className="mt-20">
            <div className="card rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-primary">Subscribe to </span>
                  <span className="text-gradient">Our Newsletter</span>
                </h2>
                <p className="text-muted text-lg mb-8">
                  Get the latest fitness tips, workout guides, and exclusive offers delivered straight to your inbox.
                </p>

                <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 bg-main border border-theme rounded-xl focus:outline-none focus:border-primary transition-all text-primary"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-primary transition-all flex items-center justify-center gap-2 group"
                  >
                    Subscribe
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <p className="text-xs text-muted mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;