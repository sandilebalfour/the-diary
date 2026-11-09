"use client";

import { useState } from "react";

export default function BrandsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brands = [
    { name: "Soweto Street Co.", location: "Soweto", category: "Streetwear", desc: "Oversized tees, cargos and bold prints from the heart of Soweto.", special: "20% OFF THIS WEEK", products: "24 products", color: "bg-[#EDEAE3]" },
    { name: "Yanos Fit", location: "Pretoria", category: "Amapiano", desc: "Two-pieces made for the dancefloor. Yanos to the world.", special: "BUY 2 GET 1 FREE", products: "18 products", color: "bg-[#E8E2D6]" },
    { name: "Vintage Plug", location: "Braamfontein", category: "Vintage", desc: "Hand-picked denim, jackets and retro finds. One of one.", special: "TRY & DECIDE", products: "32 products", color: "bg-[#EDEAE3]" },
    { name: "Maboneng Muse", location: "Maboneng, JHB", category: "Minimal", desc: "Clean, minimal fits. Black, beige, and nothing extra.", special: "FREE DELIVERY OVER R800", products: "12 products", color: "bg-[#E8E2D6]" },
    { name: "Kasi Kulture", location: "Alexandra", category: "Streetwear", desc: "Kasi pride in every stitch. Caps, hoodies and sets.", special: "NEW DROP FRIDAY", products: "21 products", color: "bg-[#EDEAE3]" },
    { name: "Heritage Threads", location: "Sandton", category: "Heritage", desc: "Modern cuts with African prints. Made to be remembered.", special: "10% OFF FIRST ORDER", products: "15 products", color: "bg-[#E8E2D6]" },
    { name: "Pantsula King", location: "Soweto", category: "Amapantsula", desc: "Sharp pantsula style. Converse, bucket hats, clean lines and attitude.", special: "PANTSULA FRIDAY - 15% OFF", products: "19 products", color: "bg-[#EDEAE3]" },
    { name: "Spantsula Style", location: "Tembisa", category: "Amapantsula", desc: "Dance-ready fits. High-waist pants, checked shirts, all-day swagger.", special: "NEW DANCE COLLECTION", products: "14 products", color: "bg-[#E8E2D6]" },
    { name: "Bhinc'za Royal", location: "Durban", category: "Amabhinca", desc: "Modern Bhinc'za. Beadwork, animal prints, and Zulu pride reimagined.", special: "HANDMADE BEADWORK", products: "22 products", color: "bg-[#EDEAE3]" },
    { name: "Isgebengu", location: "Umlazi", category: "Amabhinca", desc: "Traditional meets street. Amabhinca luxury - bold, proud, unapologetic.", special: "FREE BEADED BRACELET", products: "16 products", color: "bg-[#E8E2D6]" },
    { name: "Bujwa Boys", location: "Soweto", category: "Amabujwa", desc: "Amabujwa culture. Carvella, skinny jeans, and kasi flex.", special: "BUJWA ESSENTIALS DROP", products: "20 products", color: "bg-[#EDEAE3]" },
    { name: "Kasi Bujwa Co.", location: "Diepkloof", category: "Amabujwa", desc: "For the boys who grew up on the corner. Smart-casual kasi style.", special: "TRY & DECIDE", products: "17 products", color: "bg-[#E8E2D6]" },
  ];

  const allBrands = brands.map(b => b.name);
  const categories = ["All", "Streetwear", "Amapiano", "Vintage", "Minimal", "Heritage", "Amapantsula", "Amabhinca", "Amabujwa"];

  // Search + Category together
  const filteredBrands = brands.filter((b) => {
    const catMatch = activeCategory === "All" || b.category === activeCategory;
    const q = search.toLowerCase().trim();
    const searchMatch = q === "" || b.name.toLowerCase().includes(q) || b.location.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q);
    return catMatch && searchMatch;
  });

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#1C1C1A]">
      {/* ===== SAME NAV AS HOME ===== */}
      <header className="sticky top-0 z-40 bg-[#F6F5F2]/95 backdrop-blur border-b border-[#E5E2DB]">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-12 py-3 max-w-[1400px] mx-auto gap-3">
          <a href="/" className="text-xl sm:text-2xl font-black tracking-tighter shrink-0">THE DIARY</a>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-[420px] mx-4">
            <div className="flex w-full bg-white border border-[#E5E2DB] rounded-full overflow-hidden focus-within:border-black">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search brands, e.g. Pantsula, Soweto..." className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent min-w-0" />
              {search && <button onClick={() => setSearch("")} className="px-3 text-[#8A857C] font-bold">✕</button>}
              <span className="px-4 flex items-center text-sm">🔍</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium shrink-0">
            <a href="/" className="px-3 py-2.5 rounded-full hover:bg-white">Home</a>
            <div className="relative" onMouseEnter={() => setOpenMenu("shop")} onMouseLeave={() => setOpenMenu(null)}>
              <button className={`px-3 py-2.5 rounded-full flex items-center gap-1 ${openMenu === "shop" ? "bg-[#1C1C1A] text-white" : "hover:bg-white"}`}>Shop <span className="text-xs">▾</span></button>
              {openMenu === "shop" && (
                <div className="absolute top-full left-0 mt-1 w-[420px] bg-white border border-[#E5E2DB] rounded-[20px] shadow-xl p-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[11px] tracking-[0.15em] text-[#8A857C] font-bold mb-3">SHOP BY GENDER</p>
                    <div className="flex flex-col gap-1">
                      <a href="/?gender=Men" className="px-3 py-2.5 rounded-xl hover:bg-[#F6F5F2] font-bold">Men →</a>
                      <a href="/?gender=Women" className="px-3 py-2.5 rounded-xl hover:bg-[#F6F5F2] font-bold">Women →</a>
                      <a href="/?gender=Uni" className="px-3 py-2.5 rounded-xl hover:bg-[#F6F5F2] font-bold">Uni-Sex →</a>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] tracking-[0.15em] text-[#8A857C] font-bold mb-3">CATEGORIES</p>
                    <div className="flex flex-col gap-1">
                      {["T-Shirts", "Hoodies", "Shoes", "Caps", "Accessories"].map((c) => (
                        <a key={c} href="/" className="px-3 py-2 rounded-xl hover:bg-[#F6F5F2]">{c}</a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative" onMouseEnter={() => setOpenMenu("brands")} onMouseLeave={() => setOpenMenu(null)}>
              <button className={`px-3 py-2.5 rounded-full flex items-center gap-1 ${openMenu === "brands" ? "bg-[#1C1C1A] text-white" : "hover:bg-white bg-white font-bold"}`}>Brands <span className="text-xs">▾</span></button>
              {openMenu === "brands" && (
                <div className="absolute top-full left-0 mt-1 w-[440px] bg-white border border-[#E5E2DB] rounded-[20px] shadow-xl p-6">
                  <p className="text-[11px] tracking-[0.15em] text-[#8A857C] font-bold mb-3">ALL BRANDS • {allBrands.length}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {allBrands.map((b) => (
                      <button key={b} onClick={() => { setSearch(b); setOpenMenu(null); }} className="text-left px-3 py-2.5 rounded-xl hover:bg-[#F6F5F2] text-sm font-medium">{b}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <a href="/on-sale" className="px-3 py-2.5 rounded-full hover:bg-white text-[#B91C1C] font-bold">On-Sale</a>
            <a href="/exclusives" className="px-3 py-2.5 rounded-full hover:bg-white font-bold">Exclusives</a>
            <a href="/about" className="px-3 py-2.5 rounded-full hover:bg-white">About</a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button className="hidden sm:block bg-[#1C1C1A] text-white px-4 py-2.5 rounded-full text-sm font-bold">Cart (0)</button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden bg-white border border-[#E5E2DB] w-[44px] h-[44px] rounded-full font-bold">☰</button>
          </div>
        </div>

        {/* Search - Mobile */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex w-full bg-white border border-[#E5E2DB] rounded-full overflow-hidden">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search brands..." className="flex-1 px-4 py-3 text-sm outline-none bg-transparent min-w-0" />
            {search && <button onClick={() => setSearch("")} className="px-3 font-bold text-[#8A857C]">✕</button>}
            <span className="px-4 flex items-center">🔍</span>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5E2DB] bg-white px-4 py-4 max-h-[70vh] overflow-y-auto">
            <a href="/" className="block py-3 font-bold border-b border-[#F6F5F2]">Home</a>
            <a href="/" className="block py-3 font-bold border-b border-[#F6F5F2]">Shop</a>
            <a href="/brands" className="block py-3 font-bold border-b border-[#F6F5F2]">Brands</a>
            <a href="/on-sale" className="block py-3 font-bold text-[#B91C1C] border-b border-[#F6F5F2]">On-Sale</a>
            <a href="/exclusives" className="block py-3 font-bold border-b border-[#F6F5F2]">Exclusives</a>
            <a href="/about" className="block py-3 font-bold">About</a>
          </div>
        )}
      </header>

      {/* HEADER + FILTERS */}
      <section className="px-4 sm:px-6 lg:px-12 py-8 max-w-[1280px] mx-auto">
        <p className="text-[11px] tracking-[0.2em] text-[#8A857C]">THE DIARY • {filteredBrands.length} BRANDS SHOWING {search && `• "${search}"`}</p>
        <h2 className="text-4xl sm:text-5xl font-black mt-3 leading-[0.95]">Meet the brands<br/>writing Joburg.</h2>
        <p className="mt-3 text-[#5A5A55] max-w-lg">From Amapiano to Amapantsula, Amabhinca to Amabujwa.</p>

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium border min-h-[44px] ${activeCategory === cat ? "bg-[#1C1C1A] text-white border-[#1C1C1A]" : "bg-white border-[#E5E2DB] text-[#5A5A55]"}`}>{cat}</button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section className="px-4 sm:px-6 lg:px-12 pb-12 max-w-[1280px] mx-auto">
        {filteredBrands.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[20px] border border-[#E5E2DB] px-4">
            <p className="font-bold text-lg">No brands found for "{search}"</p>
            <p className="text-sm text-[#5A5A55] mt-1">Try "Soweto", "Pantsula", "Bhinc'za"...</p>
            <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-4 bg-[#1C1C1A] text-white px-6 py-3 rounded-full text-sm font-bold">Show All Brands</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrands.map((b) => (
              <div key={b.name} className="bg-white border border-[#E5E2DB] rounded-[20px] overflow-hidden flex flex-col">
                <div className={`${b.color} h-44 flex items-center justify-center`}><span className="text-2xl font-black text-[#5A5A55] text-center px-4">{b.name}</span></div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[11px] tracking-[0.15em] uppercase text-[#8A857C]">{b.category} • {b.location}</p>
                  <h3 className="font-bold text-xl mt-2">{b.name}</h3>
                  <p className="text-sm text-[#5A5A55] mt-1 flex-1">{b.desc}</p>
                  <p className="text-xs text-[#8A857C] mt-3">{b.products}</p>
                  <span className="inline-block self-start mt-2 bg-[#EDE6D6] text-[11px] font-bold px-3 py-1.5 rounded-full">{b.special}</span>
                  <button className="w-full mt-4 bg-[#1C1C1A] text-white py-3 rounded-full font-bold text-sm min-h-[48px]">View Brand</button>
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