export default function Home() {
  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#1C1C1A]">
      {/* NAV - responsive */}
      <header className="flex justify-between items-center px-4 sm:px-6 lg:px-12 py-4 border-b border-[#E5E2DB] bg-[#F6F5F2] sticky top-0 z-10">
        <h1 className="text-xl sm:text-2xl font-black tracking-tighter">THE DIARY</h1>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-[#5A5A55]">
          <a href="#" className="hover:text-black">Shop</a>
          <a href="#" className="hover:text-black">Brands</a>
          <a href="#" className="hover:text-black">Specials</a>
          <a href="#" className="hover:text-black">About</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="md:hidden border border-[#D8D3C8] px-3 py-2 rounded-full text-sm">Menu</button>
          <button className="bg-[#1C1C1A] text-white px-4 py-2 rounded-full text-sm">Cart (0)</button>
        </div>
      </header>

      {/* HERO - stacks on mobile, side-by-side on desktop */}
      <section className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-[1280px] mx-auto">
        <div className="order-2 lg:order-1">
          <p className="text-[11px] sm:text-xs tracking-[0.2em] text-[#8A857C]">JOHANNESBURG • EST. 2026 • LOCAL FASHION</p>
          <h2 className="text-[48px] leading-[0.95] sm:text-6xl lg:text-7xl font-black mt-4">
            WEAR<br/>YOUR<br/>STORY.
          </h2>
          <p className="mt-4 text-[#5A5A55] max-w-md text-base sm:text-lg leading-relaxed">
            The Diary is where Joburg's local brands write their next chapter.
            Shop their drops, their specials, their stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button className="bg-[#1C1C1A] text-white px-6 py-3 rounded-full font-semibold text-sm sm:text-base w-full sm:w-auto">Shop This Week's Drops</button>
            <button className="border border-[#1C1C1A] px-6 py-3 rounded-full font-semibold text-sm sm:text-base w-full sm:w-auto">Browse Brands</button>
          </div>
        </div>
        <div className="order-1 lg:order-2 bg-[#E8E2D6] w-full h-[280px] sm:h-[360px] lg:h-[420px] rounded-[24px] flex items-center justify-center text-center p-6">
          <p className="text-xl sm:text-2xl font-serif italic text-[#5A5A55]">Your hero image goes here<br/><span className="text-sm not-italic font-sans text-[#8A857C]">Streetwear / Amapiano / Vintage</span></p>
        </div>
      </section>

      {/* SPECIALS - 1 col on phone, 2 on tablet, 3 on desktop */}
      <section className="px-4 sm:px-6 lg:px-12 py-6 max-w-[1280px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
          <h3 className="text-2xl sm:text-3xl font-black">This Week's Specials</h3>
          <a href="#" className="underline text-sm text-[#5A5A55]">View all specials →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[
            { brand: "Soweto Street Co.", desc: "Oversized Tee + Cargo Set", special: "20% OFF THIS WEEK", price: "R 799  →  R 639" },
            { brand: "Yanos Fit", desc: "Amapiano Two-Piece", special: "BUY 2 GET 1 FREE", price: "R 1,200" },
            { brand: "Vintage Plug", desc: "Thrifted Denim Jacket", special: "TRY & DECIDE", price: "R 550" },
          ].map((item) => (
            <div key={item.brand} className="bg-white border border-[#E5E2DB] rounded-[20px] overflow-hidden flex flex-col">
              <div className="bg-[#EDEAE3] h-44 sm:h-48 flex items-center justify-center text-[#8A857C] text-sm">Product Photo</div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-[11px] tracking-[0.15em] text-[#8A857C] uppercase">{item.brand}</p>
                <h4 className="font-bold text-lg mt-1 leading-tight">{item.desc}</h4>
                <p className="text-sm text-[#5A5A55] mt-1">{item.price}</p>
                {/* Soft badge - not bright red/orange */}
                <span className="inline-block self-start mt-3 bg-[#EDE6D6] text-[#4A4438] text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide">{item.special}</span>
                <button className="w-full mt-4 bg-[#1C1C1A] text-white py-3 rounded-full font-semibold text-sm mt-auto">Shop Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS - stacks on mobile */}
      <section className="mx-4 sm:mx-6 lg:mx-12 my-8 bg-[#1C1C1A] text-white rounded-[24px] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1280px] lg:mx-auto">
        <div><h4 className="font-bold text-lg">1. Shop</h4><p className="text-[#B8B2A6] mt-1 text-sm leading-relaxed">Browse real local brands, not imports.</p></div>
        <div><h4 className="font-bold text-lg">2. Try & Decide</h4><p className="text-[#B8B2A6] mt-1 text-sm leading-relaxed">We deliver, you try on at home. Pay for what you keep.</p></div>
        <div><h4 className="font-bold text-lg">3. We Collect</h4><p className="text-[#B8B2A6] mt-1 text-sm leading-relaxed">Don't like it? We pick it up free. No risk.</p></div>
      </section>

      <footer className="px-4 py-6 text-center text-sm text-[#8A857C] border-t border-[#E5E2DB]">© 2026 THE DIARY — Johannesburg</footer>
    </main>
  );
}