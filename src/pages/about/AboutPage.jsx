import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-main">
      {/* ================= SECTION 1: FULL SCREEN BANNER ================= */}
      <section className="relative h-screen w-full">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80"
          alt="One Rep More Gym"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="text-primary">About</span>{" "}
              <span className="text-white">One Rep More</span>
            </h1>
            <p className="text-muted text-xl md:text-2xl max-w-3xl mx-auto">
              Your trusted partner in building strength, achieving goals, and transforming lives.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: CONTENT LEFT | IMAGE RIGHT ================= */}
      <section className="py-20 bg-main">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="mb-6">
                <span className="bg-primary/10 text-brand px-4 py-2 rounded-full text-sm font-bold border border-primary/20">
                  OUR STORY
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Building Strength, One Rep at a Time
              </h2>
              <p className="text-muted text-lg mb-6 leading-relaxed">
                Founded in 2015, One Rep More started with a simple mission: to make premium gym equipment accessible to everyone. From home gym enthusiasts to professional athletes, we've been serving the fitness community with dedication and passion.
              </p>
              <p className="text-muted text-lg mb-6 leading-relaxed">
                Our journey began in a small warehouse with just 50 products. Today, we're proud to offer over 500+ premium fitness equipment options, serving 10,000+ satisfied customers across the country.
              </p>
              <p className="text-muted text-lg leading-relaxed">
                Every product we sell is carefully selected, tested, and backed by our commitment to quality. We believe that the right equipment can transform not just your body, but your entire approach to fitness and life.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border-2 border-theme">
                <img
                  src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80"
                  alt="Our Story"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Accent Border */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: IMAGE LEFT | CONTENT RIGHT ================= */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-2xl border-2 border-theme">
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
                  alt="Our Mission"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Accent Border */}
              <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-primary rounded-2xl -z-10"></div>
            </div>

            {/* Right Content */}
            <div className="order-1 lg:order-2">
              <div className="mb-6">
                <span className="bg-primary/10 text-brand px-4 py-2 rounded-full text-sm font-bold border border-primary/20">
                  OUR MISSION
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Empowering Your Fitness Journey
              </h2>
              <p className="text-muted text-lg mb-6 leading-relaxed">
                At One Rep More, we're not just selling equipment—we're building a community of dedicated athletes and fitness enthusiasts who push their limits every single day.
              </p>
              <p className="text-muted text-lg mb-6 leading-relaxed">
                We believe that everyone deserves access to professional-grade equipment without breaking the bank. That's why we work directly with manufacturers to bring you the best prices without compromising on quality.
              </p>

              {/* Mission Points */}
              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted text-lg">
                    <span className="text-primary font-bold">Quality First:</span> Every product is tested and certified for safety and durability.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted text-lg">
                    <span className="text-primary font-bold">Customer Focus:</span> 24/7 support and expert advice to help you make the right choices.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted text-lg">
                    <span className="text-primary font-bold">Innovation:</span> Constantly updating our catalog with the latest fitness technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;