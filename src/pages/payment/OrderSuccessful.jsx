import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, Gift, Star, Shield,
  MessageSquare, Share2, Download,
  ChevronRight, Clock, ArrowRight
} from 'lucide-react';

const OrderSuccessful = () => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [showConfetti, setShowConfetti] = useState(true);

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

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen pt-30 md:pt-40">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                backgroundColor: [colors.primary, colors.success, colors.warning][i % 3],
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center w-full">
          {/* Success Animation */}
          <div className="relative inline-block mb-8">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full animate-ping-slow"
                style={{ backgroundColor: colors.success, opacity: 0.2 }}
              />
              <div className="absolute inset-4 rounded-full flex items-center justify-center animate-scaleIn"
                style={{
                  backgroundColor: colors.success,
                  boxShadow: `0 0 60px ${colors.success}80`,
                }}
              >
                <CheckCircle size={64} style={{ color: colors.text }} />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full animate-bounce"
              style={{ backgroundColor: colors.primary }}
            >
              <Gift size={24} className="text-white m-3" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full animate-bounce-delayed"
              style={{ backgroundColor: colors.warning }}
            >
              <Star size={24} className="text-white m-3" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: colors.text }}>
            Order <span style={{ color: colors.success }}>Confirmed!</span>
          </h1>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: colors.muted }}>
            Thank you for choosing One Rep More! Your gym equipment order has been successfully placed.
            You will receive a confirmation email shortly with your order details.
          </p>

          {/* Simple CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              to="/"
              className="px-8 py-4 rounded-lg font-semibold text-white transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, #B30000)`,
              }}
            >
              Return to Home
              <ArrowRight size={18} />
            </Link>

           
          </div>

          {/* Auto Redirect */}
          <div 
            className="rounded-2xl p-6 text-center max-w-md mx-auto"
            style={{
              background: `linear-gradient(135deg, ${colors.cardBg} 0%, #1a1a1a 100%)`,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex items-center gap-4 justify-center mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${colors.success}20`,
                  border: `1px solid ${colors.success}30`,
                }}
              >
                <Shield size={24} style={{ color: colors.success }} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text }}>
                  Order Secured
                </h3>
                <p className="text-sm" style={{ color: colors.muted }}>
                  Your order is confirmed and secure
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
                {timeLeft}s
              </div>
              <p className="text-sm mb-4" style={{ color: colors.muted }}>
                Redirecting to home page in {timeLeft} seconds
              </p>
              <Link 
                to="/"
                className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.text,
                }}
              >
                Go Home Now
              </Link>
            </div>
          </div>

          {/* Support Note */}
          <div className="mt-8 p-4 rounded-lg flex items-start justify-center gap-3 max-w-md mx-auto"
            style={{
              backgroundColor: `${colors.primary}10`,
              border: `1px solid ${colors.primary}30`,
            }}
          >
            <MessageSquare size={18} style={{ color: colors.primary }} />
            <p className="text-sm" style={{ color: colors.text }}>
              Need help? Contact our 24/7 support at{' '}
              <a href="mailto:support@onerepmore.com" className="font-semibold hover:underline" style={{ color: colors.primary }}>
                support@onerepmore.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s ease-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .animate-bounce-delayed {
          animation: bounce-delayed 2s ease-in-out infinite 0.5s;
        }
        
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessful;