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
  ChevronRight
} from 'lucide-react';
import PageHelmet from '../../component/common/PageHelmet';
import PageLoader from '../../component/common/PageLoader';

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Dummy blog data matching the structure from BlogPage
  const dummyBlogs = [
    {
      id: 1,
      title: "10 Essential Exercises for Building Core Strength",
      slug: "essential-core-strength-exercises",
      category: "Workout Tips",
      author: "John Smith",
      date: "2024-03-15",
      read_time: "8 min read",
      excerpt: "Discover the most effective exercises to build a strong core and improve your overall fitness.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80",
      content: `
        <div class="space-y-6">
          <p class="lead text-lg text-muted mb-6">
            Building a strong core is essential for overall fitness, athletic performance, and daily activities. 
            A well-developed core not only gives you a toned midsection but also improves posture, prevents back pain, 
            and enhances balance and stability.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">1. The Plank</h3>
          <p class="text-muted mb-4">
            The plank is a fundamental core exercise that targets your entire core, including your abs, back, and shoulders. 
            Start in a push-up position with your forearms on the ground. Keep your body in a straight line from head to heels. 
            Hold this position for 30-60 seconds, keeping your core tight and breathing steadily.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">2. Russian Twists</h3>
          <p class="text-muted mb-4">
            Russian twists target your obliques and improve rotational strength. Sit on the floor with your knees bent, 
            lean back slightly, and lift your feet off the ground. Hold a weight or medicine ball with both hands and 
            rotate your torso from side to side.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">3. Dead Bug</h3>
          <p class="text-muted mb-4">
            The dead bug exercise is excellent for core stability and coordination. Lie on your back with your arms extended 
            toward the ceiling and your legs in a tabletop position. Slowly extend your right arm and left leg toward the floor, 
            then return to start and alternate sides.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">4. Bicycle Crunches</h3>
          <p class="text-muted mb-4">
            Bicycle crunches target your rectus abdominis and obliques. Lie on your back with your hands behind your head, 
            bring your knees toward your chest, and alternate touching your elbow to the opposite knee in a pedaling motion.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">5. Leg Raises</h3>
          <p class="text-muted mb-4">
            Leg raises target your lower abs. Lie on your back with your legs straight and slowly lift them toward the ceiling, 
            then lower them back down without letting your feet touch the floor.
          </p>
          
          <div class="bg-card p-6 rounded-xl border border-theme mt-8">
            <h4 class="text-xl font-bold text-primary mb-3">Pro Tip</h4>
            <p class="text-muted">
              Consistency is key when building core strength. Aim to perform these exercises 3-4 times per week, 
              and gradually increase the duration or repetitions as you get stronger. Remember to maintain proper 
              form throughout each exercise to prevent injury and maximize results.
            </p>
          </div>
        </div>
      `,
      likes: 128,
      comments: 24
    },
    {
      id: 2,
      title: "The Ultimate Guide to Protein Supplements",
      slug: "ultimate-guide-protein-supplements",
      category: "Nutrition",
      author: "Sarah Johnson",
      date: "2024-03-10",
      read_time: "6 min read",
      excerpt: "Confused about which protein supplement to choose? This comprehensive guide breaks down whey, casein, plant-based proteins.",
      image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=500&q=80",
      content: `
        <div class="space-y-6">
          <p class="lead text-lg text-muted mb-6">
            Protein supplements are one of the most popular and widely used supplements in the fitness industry. 
            Whether you're looking to build muscle, lose weight, or improve recovery, understanding the different 
            types of protein can help you make an informed decision.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">Whey Protein</h3>
          <p class="text-muted mb-4">
            Whey protein is a complete protein derived from milk. It's quickly absorbed by the body, making it ideal 
            for post-workout recovery. Whey isolate contains higher protein content with less fat and lactose, while 
            whey concentrate is less processed and contains more bioactive compounds.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">Casein Protein</h3>
          <p class="text-muted mb-4">
            Also derived from milk, casein is digested slowly, providing a steady release of amino acids over several hours. 
            This makes it perfect for taking before bed to support muscle recovery overnight.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">Plant-Based Proteins</h3>
          <p class="text-muted mb-4">
            Options like pea, rice, hemp, and soy protein are excellent for vegans and those with dairy sensitivities. 
            Many plant-based blends combine different sources to create a complete amino acid profile comparable to whey.
          </p>
          
          <div class="bg-card p-6 rounded-xl border border-theme mt-8">
            <h4 class="text-xl font-bold text-primary mb-3">How to Choose</h4>
            <p class="text-muted">
              Consider your dietary restrictions, fitness goals, and budget when selecting a protein supplement. 
              Look for products with minimal additives and third-party testing for quality assurance.
            </p>
          </div>
        </div>
      `,
      likes: 95,
      comments: 18
    },
    {
      id: 3,
      title: "5 Common Gym Mistakes Beginners Make",
      slug: "common-gym-mistakes-beginners",
      category: "Training",
      author: "Mike Wilson",
      date: "2024-03-05",
      read_time: "5 min read",
      excerpt: "Starting your fitness journey? Avoid these common mistakes that can hinder your progress.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80",
      content: `
        <div class="space-y-6">
          <p class="lead text-lg text-muted mb-6">
            Starting a new fitness routine is exciting, but it's easy to make mistakes that can slow your progress 
            or lead to injury. Here are five common gym mistakes beginners make and how to avoid them.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">1. Skipping Warm-ups</h3>
          <p class="text-muted mb-4">
            Jumping straight into heavy lifting without warming up increases your risk of injury. Spend 5-10 minutes 
            doing dynamic stretches and light cardio to prepare your muscles and joints.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">2. Using Poor Form</h3>
          <p class="text-muted mb-4">
            Sacrificing form for heavier weights is a recipe for injury. Focus on proper technique first, then 
            gradually increase the weight as you build strength and confidence.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">3. Overtraining</h3>
          <p class="text-muted mb-4">
            More isn't always better. Your muscles need time to recover and grow. Aim for 48 hours of rest between 
            training the same muscle groups.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">4. Ignoring Nutrition</h3>
          <p class="text-muted mb-4">
            You can't out-train a bad diet. Proper nutrition is essential for energy, recovery, and results. 
            Focus on whole foods and adequate protein intake.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">5. Not Having a Plan</h3>
          <p class="text-muted mb-4">
            Wandering around the gym without a plan leads to inefficient workouts. Follow a structured program 
            designed for your goals, whether it's strength, hypertrophy, or endurance.
          </p>
        </div>
      `,
      likes: 156,
      comments: 32
    },
    {
      id: 4,
      title: "How to Create a Sustainable Meal Plan",
      slug: "create-sustainable-meal-plan",
      category: "Nutrition",
      author: "Emily Brown",
      date: "2024-02-28",
      read_time: "7 min read",
      excerpt: "Meal planning doesn't have to be complicated. Learn how to create a sustainable nutrition plan.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80",
      content: `
        <div class="space-y-6">
          <p class="lead text-lg text-muted mb-6">
            Creating a sustainable meal plan is about building habits that you can maintain long-term, 
            not following restrictive diets that leave you feeling deprived.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">Start with Your Goals</h3>
          <p class="text-muted mb-4">
            Determine your calorie and macronutrient needs based on your fitness goals. Whether you want to 
            build muscle, lose fat, or maintain weight, having clear targets helps guide your food choices.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">Plan Your Meals</h3>
          <p class="text-muted mb-4">
            Set aside time each week to plan your meals. Include a variety of protein sources, complex carbs, 
            healthy fats, and plenty of vegetables. Prep ingredients in advance to save time during busy weekdays.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">Include Flexibility</h3>
          <p class="text-muted mb-4">
            A sustainable meal plan allows for flexibility. Include room for occasional treats and social eating. 
            This prevents feelings of deprivation and makes it easier to stick with your plan long-term.
          </p>
        </div>
      `,
      likes: 87,
      comments: 15
    },
    {
      id: 5,
      title: "The Science of Muscle Recovery",
      slug: "science-muscle-recovery",
      category: "Science",
      author: "Dr. James Chen",
      date: "2024-02-20",
      read_time: "10 min read",
      excerpt: "Understanding how muscles recover is key to making progress.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80",
      content: `
        <div class="space-y-6">
          <p class="lead text-lg text-muted mb-6">
            Muscle recovery is a complex physiological process that's essential for growth and adaptation. 
            Understanding the science behind recovery can help you optimize your training and results.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">The Recovery Process</h3>
          <p class="text-muted mb-4">
            When you strength train, you create microscopic tears in your muscle fibers. During recovery, 
            your body repairs these tears and builds additional muscle tissue to prepare for future stress. 
            This process requires adequate protein intake, sleep, and rest days.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">Sleep and Recovery</h3>
          <p class="text-muted mb-4">
            Sleep is when your body releases growth hormone and performs most of its repair work. 
            Aim for 7-9 hours of quality sleep per night to optimize recovery and muscle growth.
          </p>
          
          <h3 class="text-2xl font-bold text-primary mt-8 mb-4">Active Recovery</h3>
          <p class="text-muted mb-4">
            Light activity on rest days can promote blood flow and speed up recovery. Walking, stretching, 
            or low-intensity cardio can help reduce muscle soreness without interfering with the repair process.
          </p>
        </div>
      `,
      likes: 112,
      comments: 21
    }
  ];

  // Load blog data based on slug
  useEffect(() => {
    const loadBlogDetails = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find blog by slug
        const foundBlog = dummyBlogs.find(b => b.slug === slug);
        
        if (foundBlog) {
          setBlog(foundBlog);
          
          // Get related posts (same category, excluding current blog)
          const related = dummyBlogs
            .filter(b => b.category === foundBlog.category && b.id !== foundBlog.id)
            .slice(0, 3);
          setRelatedPosts(related);
        } else {
          // If blog not found, redirect to blog page
          navigate('/blogs');
        }
      } catch (error) {
        console.error('Error loading blog:', error);
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlogDetails();
    }
  }, [slug, navigate]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80";
    return imagePath; // Dummy images are already full URLs
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) return <PageLoader />;
  if (!blog) return null;

  return (
    <>
      <PageHelmet title={`${blog.title} - ONE REP MORE`} />
      
      <div className="bg-main min-h-screen pt-30 md:pt-40 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/blog')}
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
              src={getImageUrl(blog.image)}
              alt={blog.title}
              className="w-full h-full object-cover"
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

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-6 mb-6"
          >
            <div className="flex items-center gap-2 text-muted">
              <Calendar size={18} className="text-primary" />
              <span>{formatDate(blog.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <User size={18} className="text-primary" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Clock size={18} className="text-primary" />
              <span>{blog.read_time}</span>
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

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-invert prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Share & Interaction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between py-6 border-y border-theme mb-12"
          >
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-muted hover:text-primary transition-colors">
                <Heart size={20} />
                <span>{blog.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-muted hover:text-primary transition-colors">
                <MessageCircle size={20} />
                <span>{blog.comments}</span>
              </button>
            </div>
            <button className="flex items-center gap-2 text-muted hover:text-primary transition-colors">
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
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="card rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={getImageUrl(post.image)}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-primary mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Calendar size={12} />
                        <span>{formatDate(post.date)}</span>
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