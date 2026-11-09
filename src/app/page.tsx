"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedKasi, setSelectedKasi] = useState<string | null>(null);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [hoveredGender, setHoveredGender] = useState<string | null>(null);
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [hoveredStory, setHoveredStory] = useState<string | null>(null);
  const [hoveredKasi, setHoveredKasi] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);

  const allBrands = [
    { name: "Soweto Street Co.", tag: "SOWETO", desc: "Oversized tees, street fit" },
    { name: "Yanos Fit", tag: "AMAPIANO", desc: "Two-piece sets, Yanos style" },
    { name: "Pantsula King", tag: "AMAPANTSULA", desc: "Checked shirts, Converse" },
    { name: "Kasi Kulture", tag: "KASI", desc: "Hoodies, caps, kasi flex" },
    { name: "Vintage Plug", tag: "VINTAGE", desc: "One-of-one vintage finds" },
    { name: "Maboneng Muse", tag: "MABONENG", desc: "Minimal, art, Maboneng" },
    { name: "Heritage Threads", tag: "HERITAGE", desc: "Heritage prints" },
    { name: "Spantsula Style", tag: "SPANTSULA", desc: "Bucket hats, dance ready" },
    { name: "Bhinc'za Royal", tag: "AMABHINCA", desc: "Handmade beaded fits" },
    { name: "Isgebengu", tag: "BEADED", desc: "Beaded belts + bracelets" },
    { name: "Bujwa Boys", tag: "AMABUJWA", desc: "Bujwa crew, sweatshirts" },
    { name: "Kasi Bujwa Co.", tag: "BUJWA", desc: "Carvella, kasi flex" },
  ];

  const kasiList = [
    { name: "Soweto", short: "SOWETO", desc: "Pantsula, Yanos, Kasi Kulture", count: "48 items", color: "bg-[#EDEAE3]", hoverColor: "bg-[#D8CFC0]" },
    { name: "Tembisa", short: "TEMBISA", desc: "Streetwear, vintage, Yanos", count: "32 items", color: "bg-[#E8E2D6]", hoverColor: "bg-[#D5CDBA]" },
    { name: "Alex", short: "ALEX", desc: "Alexandra - Kasi Kulture, Bujwa", count: "27 items", color: "bg-[#F0EDE8]", hoverColor: "bg-[#DDD6CB]" },
    { name: "Pheli", short: "PHELI", desc: "Pretoria - Yanos, Heritage", count: "24 items", color: "bg-[#EDEAE3]", hoverColor: "bg-[#D8CFC0]" },
    { name: "Sosha", short: "SOSHA", desc: "Soshanguve - Street, Pantsula", count: "19 items", color: "bg-[#E8E2D6]", hoverColor: "bg-[#D5CDBA]" },
  ];

  const products = [
    { name: "Soweto Oversized Tee", brand: "Soweto Street Co.", price: 349, oldPrice: 499, gender: "Women", kasi: "Soweto", onSale: true },
    { name: "Yanos Two-Piece Set", brand: "Yanos Fit", price: 899, oldPrice: 1199, gender: "Women", kasi: "Pheli", onSale: true },
    { name: "Pantsula Checked Shirt", brand: "Pantsula King", price: 549, oldPrice: 699, gender: "Men", kasi: "Soweto", onSale: false },
    { name: "Kasi Heavy Hoodie", brand: "Kasi Kulture", price: 749, oldPrice: 899, gender: "Men", kasi: "Alex", onSale: false },
    { name: "Kids Pantsula Tee", brand: "Pantsula King", price: 249, oldPrice: 299, gender: "Kids", kasi: "Soweto", onSale: true },
    { name: "Kids Yanos Set", brand: "Yanos Fit", price: 399, oldPrice: 499, gender: "Kids", kasi: "Tembisa", onSale: false },
    { name: "Tembisa Vintage Tee", brand: "Vintage Plug", price: 299, oldPrice: 450, gender: "Men", kasi: "Tembisa", onSale: true },
    { name: "Sosha Street Hoodie", brand: "Kasi Bujwa Co.", price: 599, oldPrice: 799, gender: "Men", kasi: "Sosha", onSale: true },
  ];

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  const toggleSearch = () => {
    if (searchOpen) { setSearch(""); setSearchOpen(false); }
    else { setSearchOpen(true); setOpenMenu(null); setMobileMenuOpen(false); }
  };

  const goToFrame = (index: number) => {
    const c = framesRef.current;
    if (!c) return;
    c.scrollTo({ left: index * c.clientWidth, behavior: "smooth" });
    setCurrentFrame(index);
  };

  const onScrollFrames = () => {
    const c = framesRef.current;
    if (!c) return;
    setCurrentFrame(Math.round(c.scrollLeft / c.clientWidth));
  };

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: "smooth" });
    setOpenMenu(null);
    setMobileMenuOpen(false);
  };

  const clearAll = () => { setSelectedGender(null); setSelectedBrand(null); setSelectedKasi(null); };

  const pickGender = (g: string) => {
    setSelectedGender(g); setSelectedBrand(null); setSelectedKasi(null);
    setTimeout(() => document.getElementById("shop-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };
  const pickBrand = (b: string) => {
    setSelectedBrand(b); setSelectedGender(null); setSelectedKasi(null);
    setTimeout(() => document.getElementById("shop-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };
  const pickKasi = (k: string) => {
    setSelectedKasi(k); setSelectedGender(null); setSelectedBrand(null);
    setTimeout(() => document.getElementById("shop-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };
  const pickOnSale = () => {
    clearAll();
    // Use a special filter via search hack - we filter by onSale in filteredProducts below using selectedGender === "OnSale"
    setSelectedGender("OnSale");
    setTimeout(() => document.getElementById("shop-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };
  const pickExclusives = () => {
    clearAll();
    setSelectedGender("Exclusives");
    setTimeout(() => document.getElementById("shop-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedGender === "OnSale" && !p.onSale) return false;
    if (selectedGender === "Exclusives" && p.price < 700) return false;
    if (selectedGender && selectedGender !== "OnSale" && selectedGender !== "Exclusives" && p.gender !== selectedGender) return false;
    if (selectedBrand && p.brand !== selectedBrand) return false;
    if (selectedKasi && p.kasi !== selectedKasi) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.kasi.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const visibleBrands = showAllBrands ? allBrands : allBrands.slice(0, 4);
  const resultTitle = selectedGender === "OnSale" ? "On-Sale • Up to 30% Off" : selectedGender === "Exclusives" ? "Exclusives • Limited" : selectedGender ? `${selectedGender} • Shop` : selectedBrand ? `${selectedBrand}` : selectedKasi ? `${selectedKasi} • Shop by Kasi` : "All Products";

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#1C1C1A]">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-[#F6F5F2] border-b border-[#E5E2DB]">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-12 py-3 max-w-[1400px] mx-auto gap-2">
          <a href="/" className="text-xl sm:text-2xl font-black tracking-tighter shrink-0">THE DIARY</a>
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <a href="/" className="px-3 py-2.5 rounded-full hover:bg-white font-bold">Home</a>
            <button onClick={scrollToShop} className="px-3 py-2.5 rounded-full hover:bg-white">Shop</button>
            <a href="/brands" className="px-3 py-2.5 rounded-full hover:bg-white">Brands</a>
            <button onClick={pickOnSale} className="px-3 py-2.5 rounded-full hover:bg-white text-[#B91C1C] font-bold">On-Sale</button>
            <button onClick={pickExclusives} className="px-3 py-2.5 rounded-full hover:bg-white font-bold">Exclusives</button>
            <a href="/about" className="px-3 py-2.5 rounded-full hover:bg-white">About</a>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={toggleSearch} className={`w-[44px] h-[44px] rounded-full flex items-center justify-center text-[18px] border active:scale-95 transition ${searchOpen ? "bg-white text-black border-black" : "bg-black text-white border-black hover:scale-105"}`}>
              {searchOpen ? "✕" : "⌕"}
            </button>
            <button className="hidden sm:block bg-black text-white px-4 py-2.5 rounded-full text-sm font-bold min-h-[44px]">Cart (0)</button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden bg-white border border-black w-[44px] h-[44px] rounded-full font-bold">☰</button>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-black bg-white px-4 py-3">
            <div className="max-w-[1400px] mx-auto flex items-center gap-2">
              <span className="text-lg">⌕</span>
              <input ref={searchInputRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Soweto, Tembisa, Pantsula..." className="flex-1 py-2.5 outline-none bg-transparent min-w-0" />
              {search && <button onClick={() => setSearch("")} className="bg-black text-white w-[32px] h-[32px] rounded-full text-sm">✕</button>}
              <button onClick={scrollToShop} className="bg-black text-white px-4 py-2.5 rounded-full text-sm font-bold">Search</button>
            </div>
          </div>
        )}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white px-4 py-4">
            <a href="/" className="block py-3 font-bold border-b">Home</a>
            <button onClick={scrollToShop} className="block w-full text-left py-3 font-bold border-b">Shop</button>
            <a href="/brands" className="block py-3 font-bold border-b">Brands</a>
            <button onClick={pickOnSale} className="block w-full text-left py-3 font-bold text-[#B91C1C] border-b">On-Sale</button>
            <button onClick={pickExclusives} className="block w-full text-left py-3 font-bold border-b">Exclusives</button>
            <a href="/about" className="block py-3 font-bold">About</a>
          </div>
        )}
      </header>

      {/* HOME - SIDEWAYS */}
      <div ref={framesRef} onScroll={onScrollFrames} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-[92vh]" style={{ scrollbarWidth: "none" }}>
        <section className="w-full shrink-0 snap-start snap-always flex flex-col justify-between px-4 sm:px-6 lg:px-12 pt-8 pb-6">
          <div className="max-w-[1400px] w-full mx-auto">
            <p className="text-[11px] tracking-[0.25em] text-[#8A857C]">JOHANNESBURG • THE DIARY • 01 / 02</p>
            <h1 className="text-[52px] leading-[0.92] sm:text-7xl lg:text-[96px] font-black tracking-tighter mt-4">Wear Your<br/>Story.</h1>
            <p className="text-[#5A5A55] mt-4 max-w-md text-base sm:text-lg">The best local brands. One diary. From Amapiano to Amapantsula, Amabhinca to Amabujwa.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <button onClick={scrollToShop} className="flex-1 sm:flex-none bg-black text-white px-8 py-4 rounded-full font-bold min-h-[56px] hover:scale-[1.03] transition">SHOP</button>
              <a href="/brands" className="flex-1 sm:flex-none bg-white border border-black px-8 py-4 rounded-full font-bold min-h-[56px] flex items-center justify-center hover:bg-black hover:text-white transition">Browse Brands</a>
            </div>
          </div>
          <div className="max-w-[1400px] w-full mx-auto flex justify-between items-end mt-8">
            <div className="flex gap-2">
              <span className={`h-[6px] rounded-full transition-all ${currentFrame === 0 ? "w-[32px] bg-black" : "w-[12px] bg-[#D1CDC5]"}`}></span>
              <span className={`h-[6px] rounded-full transition-all ${currentFrame === 1 ? "w-[32px] bg-black" : "w-[12px] bg-[#D1CDC5]"}`}></span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-[11px] tracking-[0.2em] text-[#8A857C]">SWIPE → STORIES</p>
              <button onClick={() => goToFrame(1)} className="w-[64px] h-[64px] rounded-full bg-black text-white flex items-center justify-center text-2xl animate-pulse hover:scale-110 transition">→</button>
            </div>
          </div>
        </section>

        {/* STORIES */}
        <section className="w-full shrink-0 snap-start snap-always bg-white border-l border-[#E5E2DB] flex flex-col overflow-hidden">
          <div className="shrink-0 px-4 sm:px-6 lg:px-12 pt-6">
            <div className="max-w-[1400px] mx-auto flex justify-between items-start gap-4">
              <div>
                <p className="text-[11px] tracking-[0.25em] text-[#8A857C]">FRAME 02 / 02</p>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter mt-2 leading-[0.95]">Watch<br/>Stories.</h2>
                <p className="text-[#5A5A55] mt-2 text-sm">Hover a story to preview • Tap to watch</p>
              </div>
              <button onClick={() => goToFrame(0)} className="shrink-0 w-[56px] h-[56px] rounded-full bg-white border border-black flex items-center justify-center text-2xl hover:bg-black hover:text-white transition">←</button>
            </div>
            <p className="sm:hidden text-center text-[11px] font-bold tracking-[0.15em] mt-3 bg-black text-white py-2 rounded-full">← SWIPE CARDS TO SEE MORE →</p>
          </div>
          <div className="flex-1 flex flex-col justify-center py-4 min-h-0">
            <div ref={storiesRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 pb-2" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
              {[
                { title: "Pantsula Friday", brand: "Pantsula King • Soweto", tag: "AMAPANTSULA", color: "bg-[#EDEAE3]", preview: "Dance, checked shirts + Converse. 45s" },
                { title: "Yanos to the World", brand: "Yanos Fit • Pretoria", tag: "AMAPIANO", color: "bg-[#E8E2D6]", preview: "Two-piece sets, Yanos energy. 60s" },
                { title: "Bhinc'za Royal", brand: "Bhinc'za Royal • Durban", tag: "AMABHINCA", color: "bg-[#EDEAE3]", preview: "Handmade, beaded, royal. 30s" },
                { title: "Bujwa Boys", brand: "Bujwa Boys • Soweto", tag: "AMABUJWA", color: "bg-[#E8E2D6]", preview: "Bujwa crew, street flex. 50s" },
              ].map((s) => (
                <div key={s.title} onMouseEnter={() => setHoveredStory(s.title)} onMouseLeave={() => setHoveredStory(null)} className={`group shrink-0 w-[80vw] max-w-[320px] snap-start bg-[#F6F5F2] border-2 rounded-[24px] overflow-hidden flex flex-col cursor-pointer transition-all duration-300 ${hoveredStory === s.title ? "border-black shadow-xl -translate-y-1 scale-[1.02]" : "border-[#E5E2DB]"}`}>
                  <div className={`${s.color} h-[260px] flex flex-col justify-between p-4 relative overflow-hidden`}>
                    <div className="flex justify-between items-start">
                      <span className="bg-white text-[11px] font-bold px-3 py-1.5 rounded-full">{s.tag}</span>
                      <span className="bg-black text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full">▶ 0:45</span>
                    </div>
                    <div className={`absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 transition-opacity duration-300 ${hoveredStory === s.title ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                      <span className="w-[72px] h-[72px] rounded-full bg-white text-black flex items-center justify-center text-2xl">▶</span>
                      <p className="text-white font-bold text-sm">Watch Now</p>
                      <p className="text-white/70 text-xs px-6 text-center">{s.preview}</p>
                    </div>
                    <div className={`flex flex-col items-center gap-2 transition-opacity ${hoveredStory === s.title ? "opacity-0" : "opacity-100"}`}>
                      <span className="w-[64px] h-[64px] rounded-full bg-black text-white flex items-center justify-center text-xl group-hover:scale-110 transition">▶</span>
                      <p className="text-[11px] tracking-[0.15em] text-[#8A857C] font-bold">HOVER TO PREVIEW</p>
                    </div>
                    <div></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{s.title}</h3>
                    <p className="text-sm text-[#5A5A55]">{s.brand}</p>
                    <p className="text-xs mt-1 text-[#8A857C]">{hoveredStory === s.title ? s.preview : "Hover to see preview →"}</p>
                    <button className="w-full mt-3 py-3 rounded-full font-bold text-sm min-h-[48px] bg-black text-white">Watch Story</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-3 mt-2 sm:hidden">
              <button onClick={() => storiesRef.current?.scrollBy({ left: -280, behavior: "smooth" })} className="w-[44px] h-[44px] rounded-full bg-white border border-black">←</button>
              <span className="text-xs font-bold text-[#8A857C]">SCROLL STORIES</span>
              <button onClick={() => storiesRef.current?.scrollBy({ left: 280, behavior: "smooth" })} className="w-[44px] h-[44px] rounded-full bg-black text-white">→</button>
            </div>
          </div>
          <div className="shrink-0 px-4 pb-4 flex justify-between items-center max-w-[1400px] mx-auto w-full">
            <button onClick={() => goToFrame(0)} className="text-sm font-bold underline">← Back</button>
            <button onClick={scrollToShop} className="bg-black text-white px-5 py-3 rounded-full text-sm font-bold">Shop The Looks ↓</button>
          </div>
        </section>
      </div>

      <div className="flex justify-center py-3">
        <button onClick={scrollToShop} className="flex flex-col items-center gap-1 group">
          <span className="text-[11px] tracking-[0.2em] text-[#8A857C] font-bold group-hover:text-black">SCROLL DOWN • SHOP</span>
          <span className="w-[40px] h-[40px] rounded-full bg-black text-white flex items-center justify-center animate-bounce group-hover:scale-110 transition">↓</span>
        </button>
      </div>

      {/* ===== SHOP ===== */}
      <div ref={shopRef} className="bg-white border-t border-black px-4 sm:px-6 lg:px-12 py-8 sm:py-12 scroll-mt-[70px]">
        <div className="max-w-[1400px] mx-auto">

          {/* SHOP 01 - GENDER - MEN NO LONGER BLACK */}
          <p className="text-[11px] tracking-[0.25em] text-[#8A857C]">SHOP • 01</p>
          <div className="flex justify-between items-end gap-4">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[0.95] mt-2">Shop By<br/>Gender.</h2>
            {(selectedGender || selectedBrand || selectedKasi) && (
              <button onClick={clearAll} className="shrink-0 bg-black text-white px-4 py-2.5 rounded-full text-sm font-bold">Clear ✕</button>
            )}
          </div>
          <p className="text-[#5A5A55] mt-2">Hover a frame to preview • Tap to shop.</p>

          {/* WOMEN */}
          <button onClick={() => pickGender("Women")} onMouseEnter={() => setHoveredGender("Women")} onMouseLeave={() => setHoveredGender(null)} className={`group w-full mt-6 text-left rounded-[20px] overflow-hidden border-2 transition-all duration-300 ${selectedGender === "Women" ? "border-black shadow-xl" : "border-[#E5E2DB]"} ${hoveredGender === "Women" ? "-translate-y-1 shadow-xl border-black" : ""}`}>
            <div className={`h-[150px] sm:h-[190px] flex flex-col justify-between p-5 transition-colors ${hoveredGender === "Women" ? "bg-[#D8CFC0]" : "bg-[#EDEAE3]"}`}>
              <div className="flex justify-between items-start">
                <span className="bg-white text-[11px] font-bold px-3 py-1.5 rounded-full">WOMEN • 120+ ITEMS</span>
                <span className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-lg transition-all duration-300 ${hoveredGender === "Women" ? "bg-black text-white scale-110 rotate-[-45deg]" : "bg-white border border-black"}`}>{selectedGender === "Women" ? "✓" : "→"}</span>
              </div>
              <div>
                <h3 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">WOMEN</h3>
                <p className="text-sm mt-1 text-[#5A5A55]">{hoveredGender === "Women" ? "Shop Women → Yanos • Bhinc'za • Heritage • Maboneng • 120+ items" : "Yanos • Bhinc'za • Heritage • Maboneng"}</p>
                <p className={`text-xs font-bold tracking-[0.15em] mt-2 transition-all ${hoveredGender === "Women" ? "opacity-100" : "opacity-0"}`}>CLICK TO SHOP WOMEN →</p>
              </div>
            </div>
          </button>

          {/* MEN + KIDS - MEN NOW LIGHT, NOT BLACK */}
          <div className="flex gap-3 mt-3">
            {/* MEN - LIGHT GREY / CREAM - NO BLACK */}
            <button onClick={() => pickGender("Men")} onMouseEnter={() => setHoveredGender("Men")} onMouseLeave={() => setHoveredGender(null)} className={`group flex-1 text-left rounded-[20px] overflow-hidden border-2 transition-all duration-300 ${selectedGender === "Men" ? "border-black shadow-xl" : "border-[#E5E2DB]"} ${hoveredGender === "Men" ? "-translate-y-1 shadow-xl border-black scale-[1.01]" : ""}`}>
              <div className={`h-[180px] sm:h-[210px] flex flex-col justify-between p-4 sm:p-5 transition-colors ${hoveredGender === "Men" ? "bg-[#D1CDC5]" : "bg-[#E8E2D6]"}`}>
                <div className="flex justify-between items-start">
                  <span className="bg-white text-black text-[11px] font-bold px-3 py-1.5 rounded-full">MEN</span>
                  <span className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 ${hoveredGender === "Men" ? "bg-black text-white scale-110 rotate-[-45deg]" : "bg-white text-black border border-black"}`}>{selectedGender === "Men" ? "✓" : "→"}</span>
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none text-black">MEN</h3>
                  <p className="text-sm mt-1 text-[#5A5A55]">{hoveredGender === "Men" ? "Shop Men → Pantsula, Bujwa, Soweto, Kasi" : "Pantsula • Bujwa\nSoweto • Kasi"}</p>
                  <p className={`text-[11px] font-bold tracking-[0.15em] mt-2 transition-all ${hoveredGender === "Men" ? "opacity-100 text-black" : "opacity-0"}`}>CLICK TO SHOP →</p>
                </div>
              </div>
            </button>

            {/* KIDS */}
            <button onClick={() => pickGender("Kids")} onMouseEnter={() => setHoveredGender("Kids")} onMouseLeave={() => setHoveredGender(null)} className={`group flex-1 text-left rounded-[20px] overflow-hidden border-2 transition-all duration-300 ${selectedGender === "Kids" ? "border-black shadow-xl" : "border-[#E5E2DB]"} ${hoveredGender === "Kids" ? "-translate-y-1 shadow-xl border-black scale-[1.01]" : ""}`}>
              <div className={`h-[180px] sm:h-[210px] flex flex-col justify-between p-4 sm:p-5 transition-colors ${hoveredGender === "Kids" ? "bg-[#D8CFC0]" : "bg-[#F0EDE8]"}`}>
                <div className="flex justify-between items-start">
                  <span className="bg-white text-[11px] font-bold px-3 py-1.5 rounded-full">KIDS • NEW</span>
                  <span className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 ${hoveredGender === "Kids" ? "bg-black text-white scale-110 rotate-[-45deg]" : "bg-white border border-black"}`}>{selectedGender === "Kids" ? "✓" : "→"}</span>
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">KIDS</h3>
                  <p className="text-sm mt-1 text-[#5A5A55]">{hoveredGender === "Kids" ? "Shop Kids → Mini Pantsula, Mini Yanos" : "Mini Pantsula\nMini Yanos"}</p>
                  <p className={`text-[11px] font-bold tracking-[0.15em] mt-2 transition-all ${hoveredGender === "Kids" ? "opacity-100" : "opacity-0"}`}>CLICK TO SHOP →</p>
                </div>
              </div>
            </button>
          </div>

          {/* SHOP 02 - BRANDS */}
          <div className="mt-10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[11px] tracking-[0.25em] text-[#8A857C]">SHOP • 02</p>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tighter mt-1">Shop By Brands.</h3>
              </div>
              <button onClick={() => setShowAllBrands(!showAllBrands)} className="shrink-0 border border-black px-4 py-2.5 rounded-full text-sm font-bold bg-white hover:bg-black hover:text-white transition">
                {showAllBrands ? "Show Less ↑" : `Show More (${allBrands.length}) ↓`}
              </button>
            </div>
            <p className="text-[#5A5A55] text-sm mt-1">Hover a brand to preview • Tap to shop it.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {visibleBrands.map((b, i) => (
                <button key={b.name} onClick={() => pickBrand(b.name)} onMouseEnter={() => setHoveredBrand(b.name)} onMouseLeave={() => setHoveredBrand(null)} className={`group text-left rounded-[20px] border-2 p-4 h-[140px] sm:h-[160px] flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${selectedBrand === b.name ? "border-black bg-black text-white shadow-xl" : "border-[#E5E2DB] bg-[#F6F5F2]"} ${hoveredBrand === b.name && selectedBrand !== b.name ? "border-black bg-black text-white -translate-y-1 shadow-xl scale-[1.02]" : ""}`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${hoveredBrand === b.name || selectedBrand === b.name ? "bg-white text-black" : "bg-white border border-[#E5E2DB] text-black"}`}>{b.tag}</span>
                    <span className="text-xs font-bold">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg leading-tight">{b.name}</h4>
                    <p className={`text-xs mt-1 ${hoveredBrand === b.name || selectedBrand === b.name ? "text-white font-bold" : "text-[#8A857C]"}`}>{hoveredBrand === b.name || selectedBrand === b.name ? `${b.desc} • View →` : "Hover to preview →"}</p>
                  </div>
                  <span className={`absolute bottom-4 right-4 w-[32px] h-[32px] rounded-full bg-white text-black flex items-center justify-center font-bold transition-all ${hoveredBrand === b.name ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>→</span>
                </button>
              ))}
            </div>
            {!showAllBrands && (
              <button onClick={() => setShowAllBrands(true)} className="w-full mt-3 border border-dashed border-black rounded-[20px] py-4 font-bold text-sm bg-white hover:bg-black hover:text-white transition">
                + Show {allBrands.length - 4} More Brands ↓
              </button>
            )}
          </div>

          {/* SHOP 03 - SHOP BY KASI */}
          <div className="mt-10">
            <p className="text-[11px] tracking-[0.25em] text-[#8A857C]">SHOP • 03</p>
            <div className="flex justify-between items-end gap-4">
              <h3 className="text-3xl sm:text-4xl font-black tracking-tighter mt-1 leading-[0.95]">Shop By Kasi.</h3>
              {selectedKasi && <button onClick={() => setSelectedKasi(null)} className="shrink-0 bg-black text-white px-4 py-2.5 rounded-full text-sm font-bold">Clear {selectedKasi} ✕</button>}
            </div>
            <p className="text-[#5A5A55] text-sm mt-1">Where you from? Tap your kasi. Hover to preview.</p>

            {/* Kasi frames - scroll sideways on phone, grid on desktop */}
            <div className="flex gap-3 mt-5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-5 sm:overflow-visible snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
              {kasiList.map((k) => (
                <button
                  key={k.name}
                  onClick={() => pickKasi(k.name)}
                  onMouseEnter={() => setHoveredKasi(k.name)}
                  onMouseLeave={() => setHoveredKasi(null)}
                  className={`group shrink-0 w-[150px] sm:w-auto snap-start text-left rounded-[20px] border-2 p-4 h-[160px] sm:h-[180px] flex flex-col justify-between transition-all duration-300 ${selectedKasi === k.name ? "border-black shadow-xl scale-[1.02]" : "border-[#E5E2DB]"} ${hoveredKasi === k.name ? "-translate-y-1 shadow-xl border-black scale-[1.02]" : ""} ${hoveredKasi === k.name || selectedKasi === k.name ? k.hoverColor : k.color}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-white text-[10px] font-bold px-2.5 py-1 rounded-full">{k.short}</span>
                    <span className={`w-[36px] h-[36px] rounded-full flex items-center justify-center font-bold transition-all duration-300 ${hoveredKasi === k.name || selectedKasi === k.name ? "bg-black text-white scale-110 rotate-[-45deg]" : "bg-white border border-black"}`}>{selectedKasi === k.name ? "✓" : "→"}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-2xl leading-none">{k.name}</h4>
                    <p className="text-xs mt-2 text-[#5A5A55] leading-snug">{hoveredKasi === k.name || selectedKasi === k.name ? `Shop ${k.name} → ${k.desc}` : k.desc}</p>
                    <p className="text-[11px] font-bold mt-2">{k.count} • {hoveredKasi === k.name ? "CLICK TO SHOP →" : "Tap to shop"}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="sm:hidden text-center text-[11px] font-bold text-[#8A857C] mt-1">← SWIPE KASI →</p>
          </div>

          {/* SHOP 04 - ON-SALE + EXCLUSIVES */}
          <div className="mt-10">
            <p className="text-[11px] tracking-[0.25em] text-[#8A857C]">SHOP • 04</p>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tighter mt-1">Deals & Drops.</h3>
            <p className="text-[#5A5A55] text-sm mt-1">Hover to preview • Tap to shop.</p>

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              {/* ON-SALE */}
              <button onClick={pickOnSale} onMouseEnter={() => setHoveredGender("OnSale")} onMouseLeave={() => setHoveredGender(null)} className={`group flex-1 text-left rounded-[20px] overflow-hidden border-2 transition-all duration-300 ${selectedGender === "OnSale" ? "border-black shadow-xl" : "border-[#E5E2DB]"} ${hoveredGender === "OnSale" ? "-translate-y-1 shadow-xl border-black scale-[1.01]" : ""}`}>
                <div className={`h-[170px] sm:h-[190px] flex flex-col justify-between p-5 transition-colors ${hoveredGender === "OnSale" ? "bg-[#B91C1C]" : "bg-[#FFF1F1]"}`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${hoveredGender === "OnSale" ? "bg-white text-[#B91C1C]" : "bg-[#B91C1C] text-white"}`}>UP TO 30% OFF</span>
                    <span className={`w-[44px] h-[44px] rounded-full flex items-center justify-center text-lg transition-all duration-300 ${hoveredGender === "OnSale" ? "bg-white text-[#B91C1C] scale-110 rotate-[-45deg]" : "bg-white border border-[#B91C1C] text-[#B91C1C]"}`}>→</span>
                  </div>
                  <div>
                    <h4 className={`text-3xl sm:text-4xl font-black tracking-tighter leading-none transition-colors ${hoveredGender === "OnSale" ? "text-white" : "text-[#B91C1C]"}`}>ON-SALE</h4>
                    <p className={`text-sm mt-1 ${hoveredGender === "OnSale" ? "text-white font-bold" : "text-[#5A5A55]"}`}>{hoveredGender === "OnSale" ? "Shop On-Sale → Tees from R249, Hoodies from R599" : "Tees from R249 • Hoodies from R599"}</p>
                    <p className={`text-[11px] font-bold tracking-[0.15em] mt-2 transition-all ${hoveredGender === "OnSale" ? "opacity-100 text-white" : "opacity-0"}`}>CLICK TO SHOP DEALS →</p>
                  </div>
                </div>
              </button>

              {/* EXCLUSIVES */}
              <button onClick={pickExclusives} onMouseEnter={() => setHoveredGender("Exclusives")} onMouseLeave={() => setHoveredGender(null)} className={`group flex-1 text-left rounded-[20px] overflow-hidden border-2 transition-all duration-300 ${selectedGender === "Exclusives" ? "border-black shadow-xl" : "border-[#E5E2DB]"} ${hoveredGender === "Exclusives" ? "-translate-y-1 shadow-xl border-black scale-[1.01]" : ""}`}>
                <div className={`h-[170px] sm:h-[190px] flex flex-col justify-between p-5 transition-colors ${hoveredGender === "Exclusives" ? "bg-[#E8E2D6]" : "bg-white"}`}>
                  <div className="flex justify-between items-start">
                    <span className="bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full">LIMITED • 1 OF 1</span>
                    <span className={`w-[44px] h-[44px] rounded-full flex items-center justify-center text-lg transition-all duration-300 ${hoveredGender === "Exclusives" ? "bg-black text-white scale-110 rotate-[-45deg]" : "bg-white border border-black"}`}>→</span>
                  </div>
                  <div>
                    <h4 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">EXCLUSIVES</h4>
                    <p className="text-sm mt-1 text-[#5A5A55]">{hoveredGender === "Exclusives" ? "Shop Exclusives → One-of-one, collabs, early drops" : "One-of-one • Collabs • Early drops"}</p>
                    <p className={`text-[11px] font-bold tracking-[0.15em] mt-2 transition-all ${hoveredGender === "Exclusives" ? "opacity-100" : "opacity-0"}`}>CLICK TO SHOP EXCLUSIVES →</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* RESULTS */}
          <div id="shop-results" className="mt-10 scroll-mt-[90px]">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-xl">{resultTitle}</h3>
              <span className="text-sm text-[#8A857C]">{filteredProducts.length} items</span>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="mt-4 text-center py-10 bg-[#F6F5F2] rounded-[20px] border border-[#E5E2DB]">
                <p className="font-bold">No items yet for this pick</p>
                <p className="text-sm text-[#5A5A55] mt-1">Tap another gender, brand, kasi or deal</p>
                <button onClick={clearAll} className="mt-4 bg-black text-white px-6 py-3 rounded-full text-sm font-bold">Show All</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                {filteredProducts.map((p) => (
                  <div key={p.name} className="group bg-[#F6F5F2] border border-[#E5E2DB] rounded-[18px] overflow-hidden flex flex-col hover:border-black hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="bg-[#EDEAE3] aspect-square flex items-center justify-center p-3 relative overflow-hidden">
                      <span className="text-center font-black text-[#5A5A55] text-sm leading-tight group-hover:scale-105 transition">{p.name}</span>
                      {p.onSale && <span className="absolute top-2 left-2 bg-[#B91C1C] text-white text-[10px] font-bold px-2 py-1 rounded-full">ON-SALE</span>}
                      <span className="absolute top-2 right-2 bg-white text-[10px] font-bold px-2 py-1 rounded-full">{p.kasi}</span>
                      <span className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"><span className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs">Quick View →</span></span>
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-[10px] uppercase text-[#8A857C]">{p.brand} • {p.gender} • {p.kasi}</p>
                      <h4 className="font-bold text-sm mt-1 flex-1 leading-tight">{p.name}</h4>
                      <div className="flex items-center gap-2 mt-2"><span className="font-black">R{p.price}</span><span className="text-xs text-[#8A857C] line-through">R{p.oldPrice}</span></div>
                      <button className="w-full mt-2 bg-black text-white py-3 rounded-full font-bold text-xs min-h-[44px] hover:scale-[1.02] transition">Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="px-4 py-6 text-center text-sm text-[#8A857C] border-t bg-[#F6F5F2]">© 2026 THE DIARY — Johannesburg</footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E2DB] flex justify-around py-2 pb-[env(safe-area-inset-bottom)]">
        <a href="/" className="flex flex-col items-center px-4 py-1 min-w-[64px]"><span className="text-lg">🏠</span><span className="text-[11px] font-bold">Home</span></a>
        <button onClick={scrollToShop} className="flex flex-col items-center px-6 py-2 min-w-[64px] bg-black text-white rounded-full -mt-4 shadow-lg"><span className="text-lg">🛍️</span><span className="text-[11px] font-bold">Shop</span></button>
        <a href="/brands" className="flex flex-col items-center px-4 py-1 min-w-[64px]"><span className="text-lg">👕</span><span className="text-[11px] font-bold">Brands</span></a>
        <button className="flex flex-col items-center px-4 py-1 min-w-[64px]"><span className="text-lg">🛒</span><span className="text-[11px] font-bold">Cart (0)</span></button>
      </nav>
      <div className="md:hidden h-[70px] bg-[#F6F5F2]"></div>
    </main>
  );
}