import React, { useState } from "react";
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, RotateCcw } from "lucide-react";

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);

  const images = [
    "https://images.unsplash.com/photo-1599058917212-d750089bc07b",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    "https://images.unsplash.com/photo-1534367507877-0edd93bd013b",
  ];

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen pt-50 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ================= LEFT : IMAGE GALLERY ================= */}
        <div>
          <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
            <img
              src={images[selectedImage]}
              alt="Product"
              className="w-full h-[420px] object-cover"
            />
          </div>

          <div className="flex gap-4 mt-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`border rounded-xl overflow-hidden w-24 h-24 transition
                  ${selectedImage === i ? "border-[#E10600]" : "border-[#262626]"}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT : PRODUCT INFO ================= */}
        <div>
          <p className="text-[#E10600] text-sm font-semibold mb-2">
            Strength Equipment
          </p>

          <h1 className="text-4xl font-extrabold mb-4">
            Premium Adjustable Dumbbells
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-[#FACC15] fill-[#FACC15]" />
            ))}
            <span className="text-[#B3B3B3] text-sm">(214 Reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-[#E10600]">₹12,999</span>
            <span className="line-through text-[#B3B3B3]">₹15,999</span>
            <span className="bg-[#E10600] text-white px-3 py-1 text-sm rounded-full">
              18% OFF
            </span>
          </div>

          {/* Short Description */}
          <p className="text-[#B3B3B3] mb-6">
            Built for serious athletes. Adjustable dumbbells with premium grip,
            perfect for home and gym workouts.
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold">Quantity</span>
            <div className="flex items-center border border-[#262626] rounded-lg">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-4 py-2 hover:bg-[#141414]"
              >-</button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="px-4 py-2 hover:bg-[#141414]"
              >+</button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 bg-[#E10600] hover:bg-[#C10500] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition">
              <ShoppingCart /> Add to Cart
            </button>

            <button className="w-14 h-14 border-2 border-[#262626] rounded-xl flex items-center justify-center hover:border-[#E10600] transition">
              <Heart />
            </button>
          </div>

          {/* Trust Icons */}
          <div className="grid grid-cols-3 gap-4 text-sm text-[#B3B3B3]">
            <div className="flex flex-col items-center gap-2">
              <Truck className="text-[#E10600]" />
              Fast Delivery
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="text-[#E10600]" />
              Secure Payment
            </div>
            <div className="flex flex-col items-center gap-2">
              <RotateCcw className="text-[#E10600]" />
              Easy Returns
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESCRIPTION SECTION ================= */}
      <div className="max-w-7xl mx-auto mt-20 bg-[#141414] border border-[#262626] rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <ul className="space-y-3 text-[#B3B3B3]">
          <li>✔ Adjustable weight system</li>
          <li>✔ Anti-slip premium grip</li>
          <li>✔ Rust-resistant steel plates</li>
          <li>✔ Ideal for home & commercial gyms</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetails;
