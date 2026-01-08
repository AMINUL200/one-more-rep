import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Weight, Home, Heart, Target,
  Dumbbell, Scale, Zap, UserCheck,
  ArrowRight
} from 'lucide-react';

const ShopByGoal = () => {
  // Color Schema
  const colors = {
    primary: "#E10600",
    background: "#0B0B0B",
    cardBg: "#141414",
    border: "#262626",
    text: "#FFFFFF",
    muted: "#B3B3B3",
    success: "#22C55E",
    warning: "#FACC15",
    accent: "#3B82F6",
  };

  const goals = [
    {
      id: 'build-muscle',
      title: 'Build Muscle',
      description: 'Strength equipment for muscle growth & hypertrophy',
      icon: TrendingUp,
      color: '#E10600', // Red
      gradient: 'from-[#E10600] to-[#B30000]',
      products: ['Barbells', 'Weight Plates', 'Dumbbells', 'Power Racks'],
      image: '/image/build.webp',
      path: '/products/build-muscle'
    },
    {
      id: 'lose-weight',
      title: 'Lose Weight',
      description: 'Cardio & equipment for fat loss & calorie burn',
      icon: Scale,
      color: '#22C55E', // Green
      gradient: 'from-[#22C55E] to-[#16A34A]',
      products: ['Treadmills', 'Exercise Bikes', 'Jump Ropes', 'Battle Ropes'],
      image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&h=400&fit=crop',
      path: '/products/lose-weight'
    },
    {
      id: 'home-gym',
      title: 'Home Gym Setup',
      description: 'Complete home gym solutions & space-saving equipment',
      icon: Home,
      color: '#3B82F6', // Blue
      gradient: 'from-[#3B82F6] to-[#2563EB]',
      products: ['Multi-Gyms', 'Adjustable Benches', 'Storage', 'Mats'],
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop',
      path: '/products/home-gym'
    },
    {
      id: 'cardio',
      title: 'Cardio & Endurance',
      description: 'Improve heart health & build stamina',
      icon: Scale,
      color: '#FACC15', // Yellow
      gradient: 'from-[#FACC15] to-[#EAB308]',
      products: ['Ellipticals', 'Rowing Machines', 'Air Bikes', 'Step Machines'],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      path: '/products/cardio'
    },
    {
      id: 'beginner',
      title: 'Beginner Friendly',
      description: 'Equipment perfect for fitness newcomers',
      icon: UserCheck,
      color: '#8B5CF6', // Purple
      gradient: 'from-[#8B5CF6] to-[#7C3AED]',
      products: ['Resistance Bands', 'Kettlebells', 'Yoga Mats', 'Foam Rollers'],
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop',
      path: '/products/beginner'
    },
    {
      id: 'strength',
      title: 'Strength Training',
      description: 'Build raw power & functional strength',
      icon: Weight,
      color: '#F97316', // Orange
      gradient: 'from-[#F97316] to-[#EA580C]',
      products: ['Power Racks', 'Olympic Bars', 'Weight Benches', 'Lifting Platforms'],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
      path: '/products/strength'
    }
  ];

  return (
    <section 
      className="py-16 px-4 md:px-8"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-3">
            <span 
              className="text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full"
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
                border: `1px solid ${colors.primary}30`,
              }}
            >
              Shop By Your Goals
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span style={{ color: colors.text }}>Achieve Your </span>
            <span style={{ color: colors.primary }}>Fitness Goals</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.muted }}>
            People don't always think in products — they think in goals. Find the perfect equipment for your fitness journey.
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {goals.map((goal) => {
            const Icon = goal.icon;
            
            return (
              <Link
                key={goal.id}
                to={goal.path}
                className="group block"
              >
                <div 
                  className="h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {/* Image with Gradient Overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={goal.image}
                      alt={goal.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(to bottom, transparent 0%, ${goal.color}20 100%)`,
                      }}
                    />
                    
                    {/* Goal Icon */}
                    <div className="absolute top-4 right-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm"
                        style={{
                          backgroundColor: `${goal.color}20`,
                          border: `2px solid ${goal.color}30`,
                        }}
                      >
                        <Icon size={24} style={{ color: goal.color }} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 
                          className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform"
                          style={{ color: colors.text }}
                        >
                          {goal.title}
                        </h3>
                        <p className="text-sm" style={{ color: colors.muted }}>
                          {goal.description}
                        </p>
                      </div>
                      
                      {/* Arrow Icon */}
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 -translate-x-2 transition-all duration-300"
                        style={{
                          backgroundColor: `${goal.color}20`,
                          border: `1px solid ${goal.color}30`,
                        }}
                      >
                        <ArrowRight size={18} style={{ color: goal.color }} />
                      </div>
                    </div>

                    {/* Product Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {goal.products.slice(0, 3).map((product, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs rounded-full transition-all group-hover:scale-105"
                          style={{
                            backgroundColor: `${goal.color}10`,
                            color: goal.color,
                            border: `1px solid ${goal.color}20`,
                          }}
                        >
                          {product}
                        </span>
                      ))}
                      {goal.products.length > 3 && (
                        <span 
                          className="px-3 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: colors.border,
                            color: colors.muted,
                          }}
                        >
                          +{goal.products.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Gradient Border */}
                  <div 
                    className="h-1 w-0 group-hover:w-full transition-all duration-500"
                    style={{
                      background: `linear-gradient(90deg, ${goal.color}, ${goal.color}80)`,
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div 
            className="inline-block rounded-2xl p-1"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
            }}
          >
            <Link
              to="/products"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:gap-6"
              style={{
                backgroundColor: colors.background,
                color: colors.text,
              }}
            >
              <span>View All Fitness Goals</span>
              <ArrowRight 
                size={20} 
                className="group-hover:translate-x-2 transition-transform"
                style={{ color: colors.primary }}
              />
            </Link>
          </div>
          
          <p className="text-sm mt-6" style={{ color: colors.muted }}>
            Can't find your specific goal?{' '}
            <Link 
              to="/contact" 
              className="font-semibold hover:text-white transition-colors"
              style={{ color: colors.primary }}
            >
              Contact our fitness experts
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShopByGoal;