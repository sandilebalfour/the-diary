"use client";

import { useState } from "react";

export default function BrandsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const brands = [
    { name: "Soweto Street Co.", location: "Soweto", category: "Streetwear", desc: "Oversized tees, cargos and bold prints from the heart of Soweto.", special: "20% OFF THIS WEEK", products: "24 products", color: "bg-[#EDEAE3]" },
    { name: "Yanos Fit", location: "Pretoria", category: "Amapiano", desc: "Two-pieces made for the dancefloor. Yanos to the world.", special: "BUY 2 GET 1 FREE", products: "18 products", color: "bg-[#E8E2D6]" },
    { name: "Vintage Plug", location: "Braamfontein", category: "Vintage", desc: "Hand-picked denim, jackets and retro finds. One of one.", special: "TRY & DECIDE", products: "32 products", color: "bg-[#EDEAE3]" },
    { name: "Maboneng Muse", location: "Maboneng, JHB", category: "Minimal", desc: "Clean, minimal fits. Black, beige, and nothing extra.", special: "FREE DELIVERY OVER R800", products: "12 products", color: "bg-[#E8E2D6]" },
    { name: "Kasi Kulture", location: "Alexandra", category: "Streetwear", desc: "Kasi pride in every stitch. Caps, hoodies and sets.", special: "NEW DROP FRIDAY", products: "21 products", color: "bg-[#EDEAE3]" },
    { name: "Heritage Threads", location: "Sandton", category: "Heritage", desc: "Modern cuts with African prints. Made to be remembered.", special: "10% OFF FIRST ORDER", products: "15 products", color: "bg-[#E8E2D6]" },

    // NEW - AMAPANTSULA
    { name: "Pantsula King", location: "Soweto", category: "Amapantsula", desc: "Sharp pantsula style. Converse, bucket hats, clean lines and attitude.", special: "PANTSULA FRIDAY - 15% OFF", products: "19 products", color: "bg-[#EDEAE3]" },
    { name: "Spantsula Style", location: "Tembisa", category: "Amapantsula", desc: "Dance-ready fits. High-waist pants, checked shirts, all-day swagger.", special: "NEW DANCE COLLECTION", products: "14 products", color: "bg-[#E8E2D6]" },

    // NEW - AMABHINCA
    { name: "Bhinc'za Royal", location: "Durban", category: "Amabhinca", desc: "Modern Bhinc'za. Beadwork, animal prints, and Zulu pride reimagined.", special: "HANDMADE BEADWORK", products: "22 products", color: "bg-[#EDEAE3]" },
    { name: "Isgebengu", location: "Umlazi", category: "Amabhinca", desc: "Traditional meets street. Amabhinca luxury - bold, proud, unapologetic.", special: "FREE BEADED BRACELET", products: "16 products", color: "bg-[#E8E2D6]" },

    // NEW - AMABUJWA
    { name: "Bujwa Boys", location: "Soweto", category: "Amabujwa", desc: "Amabujwa culture. Carvella, skinny jeans, and kasi flex.", special: "BUJWA ESSENTIALS DROP", products: "20 products", color: "bg-[#EDEAE3]" },
    { name: "Kasi Bujwa Co.", location: "Diepkloof", category: "Amabujwa", desc: "For the boys who grew up on the corner. Smart-casual kasi style.", special: "TRY & DECIDE", products: "17 products", color: "bg-[#E8E2D6]" },
  ];

  const categories = ["All", "Streetwear", "Amapiano", "Vintage", "Minimal", "Heritage", "Amapantsula", "Amabhinca", "Amabujwa"];

  const filteredBrands = activeCategory === "All" 
    ? brands 
    : brands.filter((b) => b.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#1C1C1A]">
      {/* NAV */}
      <header className="flex justify-between items-center px-4 sm:px-6 lg:px-12 py-4 border-b border-[#E5E2DB] sticky top-0 z-10 bg-[#F6F5F2]">
        <a href="/" className="text-xl sm:text-2xl font-black tracking-tighter">THE DIARY</a>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-[#5A5A55]">
          <a href="/" className="hover:text-black">Home</a>
          <a href="/brands" className="text-black font-bold">Brands</a>
          <a href="#" className="hover:text-black">Specials</a>
          <a href="#" className="hover:text-black">About</a>
        </nav>
        <button className="bg-[#1C1C1A] text-white px-4 py-2 rounded-full text-sm">Cart (0)</button>
      </header>

      {/* HEADER */}
      <section className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 max-w-[1280px] mx-auto">
        <p className="text-[11px] sm:text-xs tracking-[0.2em] text-[#8A857C]">THE DIARY • {filteredBrands.length} BRANDS SHOWING</p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mt-3 leading-[0.95]">Meet the brands<br/>writing Joburg.</h2>
        <p className="mt-4 text-[#5A5A55] max-w-lg text-base sm:text-lg leading-relaxed">
          From Amapiano to Amapantsula, Amabhinca to Amabujwa. Every style has a story.
        </p>

        {/* FILTERS */}
        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeCategory === cat
                  ? "bg-[#1C1C1A] text-white border-[#1C1C1A]"
                  : "bg-white border-[#E5E2DB] text-[#5A5A55] hover:border-[#1C1C1A]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* BRANDS GRID */}
      <section className="px-4 sm:px-6 lg:px-12 pb-12 max-w-[1280px] mx-auto">
        {filteredBrands.length === 0 ? (
          <p className="text-center text-[#5A5A55] py-12">No brands in this category yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrands.map((b) => (
              <div key={b.name} className="bg-white border border-[#E5E2DB] rounded-[20px] overflow-hidden flex flex-col hover:shadow-lg transition">
                <div className={`${b.color} h-44 sm:h-48 flex items-center justify-center`}>
                  <span className="text-2xl font-black tracking-tighter text-[#5A5A55] text-center px-4">{b.name}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[11px] tracking-[0.15em] uppercase text-[#8A857C]">{b.category} • {b.location}</p>
                  <h3 className="font-bold text-xl mt-2">{b.name}</h3>
                  <p className="text-sm text-[#5A5A55] mt-1 leading-relaxed flex-1">{b.desc}</p>
                  <p className="text-xs text-[#8A857C] mt-3">{b.products}</p>
                  <span className="inline-block self-start mt-2 bg-[#EDE6D6] text-[#4A4438] text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide">{b.special}</span>
                  <button className="w-full mt-4 bg-[#1C1C1A] text-white py-3 rounded-full font-semibold text-sm">View Brand</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="px-4 py-6 text-center text-sm text-[#8A857C] border-t border-[#E5E2DB]">© 2026 THE DIARY — Johannesburg</footer>
    </main>
  );
}