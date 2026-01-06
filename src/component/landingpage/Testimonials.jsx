import React, { useEffect, useRef } from "react";
import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

const Testimonials = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      new Swiper(swiperRef.current, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        },
      });
    }
  }, []);

  const testimonials = [
    {
      name: "Marcus Johnson",
      role: "Powerlifter",
      image:
        "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=400&fit=crop",
      rating: 5,
      text: "Best equipment I've ever used. The quality is unmatched and delivery was lightning fast. My home gym is now my favorite place!",
    },
    {
      name: "Sarah Mitchell",
      role: "Fitness Coach",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      rating: 5,
      text: "Professional grade equipment at reasonable prices. I've recommended this store to all my clients. Outstanding customer service!",
    },
    {
      name: "David Chen",
      role: "CrossFit Athlete",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      rating: 5,
      text: "The dumbbells and barbells are incredibly durable. Been using them daily for 6 months with zero issues. Worth every penny!",
    },
    {
      name: "Emma Rodriguez",
      role: "Yoga Instructor",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      rating: 5,
      text: "Amazing selection of yoga mats and accessories. The quality exceeded my expectations. Fast shipping and great packaging too!",
    },
    {
      name: "James Wilson",
      role: "Bodybuilder",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      rating: 5,
      text: "This is my go-to store for all gym equipment. Quality products, competitive prices, and exceptional customer support. Highly recommend!",
    },
    {
      name: "Lisa Anderson",
      role: "Marathon Runner",
      image:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop",
      rating: 5,
      text: "The treadmill I bought is phenomenal! Smooth, quiet, and packed with features. Best investment for my fitness journey!",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
        
        .testimonials-section {
          background: #0B0B0B;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }
        
        .testimonials-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #E10600, transparent);
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .section-subtitle {
          color: #E10600;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        
        .section-title {
          color: #FFFFFF;
          font-size: 42px;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }
        
        .swiper {
          padding: 20px 0 60px;
        }
        
        .testimonial-card {
          background: #141414;
          border: 1px solid #262626;
          border-radius: 16px;
          padding: 32px;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .testimonial-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #E10600, transparent);
          transform: translateX(-100%);
          transition: transform 0.4s ease;
        }
        
        .testimonial-card:hover {
          transform: translateY(-8px);
          border-color: #E10600;
          box-shadow: 0 20px 40px rgba(225, 6, 0, 0.2);
        }
        
        .testimonial-card:hover::before {
          transform: translateX(0);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #E10600;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .testimonial-card:hover .avatar {
          transform: scale(1.1);
        }
        
        .user-info {
          flex: 1;
        }
        
        .user-name {
          color: #FFFFFF;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        
        .user-role {
          color: #B3B3B3;
          font-size: 14px;
          margin: 0;
        }
        
        .rating {
          display: flex;
          gap: 4px;
          margin-bottom: 16px;
        }
        
        .star {
          color: #E10600;
          font-size: 18px;
        }
        
        .quote-icon {
          color: #E10600;
          font-size: 40px;
          opacity: 0.3;
          margin-bottom: 12px;
          font-family: Georgia, serif;
          line-height: 1;
        }
        
        .testimonial-text {
          color: #B3B3B3;
          font-size: 15px;
          line-height: 1.7;
          margin: 0;
        }
        
        .swiper-pagination {
          bottom: 20px !important;
        }
        
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #262626;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active {
          background: #E10600;
          width: 30px;
          border-radius: 5px;
        }
        
        .swiper-button-next,
        .swiper-button-prev {
          width: 50px;
          height: 50px;
          background: #141414;
          border: 1px solid #262626;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #E10600;
          border-color: #E10600;
        }
        
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 20px;
          color: #FFFFFF;
          font-weight: 700;
        }
        
        @media (max-width: 768px) {
          .testimonials-section {
            padding: 60px 20px;
          }
          
          .section-title {
            font-size: 32px;
          }
          
          .testimonial-card {
            padding: 24px;
          }
          
          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }
        }
      `}</style>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <div className="inline-block mb-4">
              <span className="bg-[#E10600]/10 text-[#E10600] px-4 py-2 rounded-full text-sm font-bold border border-[#E10600]/20">
                TESTIMONIALS
              </span>
            </div>
            <h2 className="text-5xl font-bold mb-4">
              <span className="text-white">What Our </span>
              <span className="text-[#E10600]">Customers Say</span>
            </h2>
          </div>

          <div className="swiper" ref={swiperRef}>
            <div className="swiper-wrapper">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="swiper-slide">
                  <div className="testimonial-card">
                    <div className="card-header">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="avatar"
                      />
                      <div className="user-info">
                        <h3 className="user-name">{testimonial.name}</h3>
                        <p className="user-role">{testimonial.role}</p>
                      </div>
                    </div>

                    <div className="rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="star">
                          ★
                        </span>
                      ))}
                    </div>

                    <div className="quote-icon">"</div>

                    <p className="testimonial-text">{testimonial.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="swiper-pagination"></div>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
