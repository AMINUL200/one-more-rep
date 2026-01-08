import React, { useEffect, useState } from 'react';
import { Dumbbell, Weight, Target, Trophy, Zap } from 'lucide-react';

const PageLoader = () => {
  const [currentInstrument, setCurrentInstrument] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [progress, setProgress] = useState(0);

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
  };

  // Gym instruments to rotate
  const gymInstruments = [
    { icon: Dumbbell, label: "Dumbbell", color: "#E10600" },
    { icon: Weight, label: "Weight Plate", color: "#FACC15" },
    { icon: Target, label: "Target", color: "#22C55E" },
    { icon: Trophy, label: "Trophy", color: "#8B5CF6" },
    { icon: Zap, label: "Energy", color: "#F97316" },
  ];

  // Motivational quotes
  const motivationalQuotes = [
    "Every rep brings you closer to your goals 💪",
    "Strength doesn't come from comfort zones 🏋️",
    "Your only limit is you 🚀",
    "Push harder, lift heavier, grow stronger 🔥",
    "One more rep can change everything ⭐",
    "The pain of discipline is less than the pain of regret 🎯"
  ];

  // Rotate instruments
  useEffect(() => {
    const instrumentInterval = setInterval(() => {
      setCurrentInstrument(prev => (prev + 1) % gymInstruments.length);
    }, 1500);
    
    return () => clearInterval(instrumentInterval);
  }, []);

  // Rotate quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % motivationalQuotes.length);
    }, 2000);
    
    return () => clearInterval(quoteInterval);
  }, []);

  // Simulate progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, []);

  const InstrumentIcon = gymInstruments[currentInstrument].icon;
  const instrumentColor = gymInstruments[currentInstrument].color;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: colors.background }}
    >
      {/* Top: Company Logo & Heading */}
      <div className="text-center mb-12 animate-fadeIn">
        <div className="relative w-20 h-20 mx-auto mb-6">
          {/* Logo Container */}
          <div className="absolute inset-0 rounded-full overflow-hidden border-2 p-1"
            style={{ 
              borderColor: colors.primary,
              backgroundColor: colors.cardBg,
            }}
          >
            <img
              src="/image/gym_logo.png"
              alt="One Rep More"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          {/* Animated Ring */}
          <div className="absolute -ins-2 rounded-full animate-ping-slow opacity-30"
            style={{ border: `2px solid ${colors.primary}` }}
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2"
          style={{ color: colors.text }}
        >
          ONE <span style={{ color: colors.primary }}>REP</span> MORE
        </h1>
        <p className="text-sm uppercase tracking-widest"
          style={{ color: colors.muted }}
        >
          Premium Fitness Equipment
        </p>
      </div>

      {/* Middle: Rotating Gym Instrument */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-10">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 animate-spin-slow"
          style={{ 
            borderColor: `${instrumentColor}40`,
            borderTopColor: instrumentColor,
            borderRightColor: instrumentColor,
          }}
        />
        
        {/* Middle Ring */}
        <div className="absolute inset-8 rounded-full border-2 animate-spin-reverse"
          style={{ 
            borderColor: `${instrumentColor}30`,
            borderBottomColor: instrumentColor,
            borderLeftColor: instrumentColor,
          }}
        />
        
        {/* Instrument Display */}
        <div className="relative z-10 text-center">
          <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mt-12 mb-4 transition-all duration-500 animate-pulse-subtle"
            style={{
              backgroundColor: `${instrumentColor}15`,
              border: `2px solid ${instrumentColor}30`,
              boxShadow: `0 0 40px ${instrumentColor}30`,
            }}
          >
            <InstrumentIcon 
              size={48} 
              className="animate-bounce-subtle"
              style={{ color: instrumentColor }}
            />
          </div>
          
          <h3 className="text-xl font-bold uppercase tracking-wider"
            style={{ color: colors.text }}
          >
            {gymInstruments[currentInstrument].label}
          </h3>
         
        </div>
        
        {/* Floating Dots */}
        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full animate-float"
          style={{ backgroundColor: colors.primary }}
        />
        <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full animate-float-delayed"
          style={{ backgroundColor: colors.accent }}
        />
      </div>

      {/* Bottom: Motivational Quote */}
      <div className="max-w-md text-center mb-8">
        <div className="relative">
          {/* Quote Marks */}
          <div className="absolute -left-6 -top-4 text-3xl"
            style={{ color: colors.primary }}
          >
            "
          </div>
          <p className="text-lg md:text-xl px-8 py-4 rounded-xl transition-all duration-500 animate-fadeInUp"
            style={{
              color: colors.text,
              backgroundColor: `${colors.cardBg}80`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.border}`,
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {motivationalQuotes[currentQuote]}
          </p>
          <div className="absolute -right-6 -bottom-4 text-3xl"
            style={{ color: colors.primary }}
          >
            "
          </div>
        </div>
      </div>

      {/* Bottom: Dot Loader */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: index * 20 <= progress ? colors.primary : colors.border,
                animation: `pulse 1.5s ease-in-out ${index * 0.2}s infinite`,
                transform: index * 20 <= progress ? 'scale(1.2)' : 'scale(1)',
                boxShadow: index * 20 <= progress ? `0 0 20px ${colors.primary}` : 'none'
              }}
            />
          ))}
        </div>
       
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(15px) scale(1.1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 12s linear infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 0.5s;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
        
        .animate-pulse-subtle {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;