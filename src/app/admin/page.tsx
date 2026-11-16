"use client";
import { useState, useEffect, useMemo } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"orders" | "brands" | "products">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [orderBrandFilter, setOrderBrandFilter] = useState("All Brands");
  const [orderKasiFilter, setOrderKasiFilter] = useState("All Kasis");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All Status");
  const [brandKasiFilter, setBrandKasiFilter] = useState("All Kasis");
  const [search, setSearch] = useState("");

  // --- ADD PRODUCT FORM ---
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image_url: "",
    brand_id: "",
    stock: "10",
    description: "",
    is_exclusive: false,
  });
  const [addingProduct, setAddingProduct] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const { data: o } = await supabaseClient.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    const { data: a } = await supabaseClient.from("brand_applications").select("*").order("created_at", { ascending: false });
    const { data: p } = await supabaseClient.from("products").select("*, brands(id, name, location)").order("created_at", { ascending: false });
    const { data: b } = await supabaseClient.from("brands").select("*").order("name");
    setOrders(o || []);
    setApplications(a || []);
    setProducts(p || []);
    setBrands(b || []);
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchAll(); }, [authed]);

  const updateOrderStatus = async (id: string, status: string) => {
    await supabaseClient.from("orders").update({ status }).eq("id", id);
    fetchAll();
  };

  const updateApplication = async (id: string, status: string) => {
    await supabaseClient.from("brand_applications").update({ status }).eq("id", id);
    fetchAll();
  };

  const approveBrand = async (app: any) => {
    const { error } = await supabaseClient.from("brands").insert({
      name: app.brand_name,
      location: app.kasi,
      instagram: app.instagram || "",
      whatsapp: app.whatsapp || "",
      category: Array.isArray(app.category) ? app.category : [app.category],
    }).select().single();
    if (error) { alert("Error: " + error.message); return; }
    await supabaseClient.from("brand_applications").update({ status: "approved" }).eq("id", app.id);
    alert(`${app.brand_name} approved! They can now login to /brand-dashboard with WhatsApp ${app.whatsapp}`);
    fetchAll();
  };

  // --- ADD PRODUCT LOGIC ---
  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.brand_id) {
      alert("Fill Product Name, Price, and Brand");
      return;
    }
    setAddingProduct(true);
    const { error } = await supabaseClient.from("products").insert({
      name: newProduct.name,
      price_cents: Math.round(parseFloat(newProduct.price) * 100),
      image_url: newProduct.image_url || null,
      brand_id: newProduct.brand_id,
      stock: parseInt(newProduct.stock) || 0,
      description: newProduct.description,
      is_exclusive: newProduct.is_exclusive,
    });
    setAddingProduct(false);
    if (error) { alert("Error: " + error.message); return; }
    alert(`🔥 ${newProduct.name} added!`);
    setNewProduct({ name: "", price: "", image_url: "", brand_id: "", stock: "10", description: "", is_exclusive: false });
    setShowAddProduct(false);
    fetchAll();
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    await supabaseClient.from("products").delete().eq("id", id);
    fetchAll();
  };

  const updateStock = async (id: string, newStock: number) => {
    await supabaseClient.from("products").update({ stock: Math.max(0, newStock) }).eq("id", id);
    fetchAll();
  };

  // --- MAP product_id -> brand name + kasi ---
  const productToBrand = useMemo(() => {
    const map: Record<string, { name: string; kasi: string }> = {};
    products.forEach((p) => {
      if (p.brands) map[p.id] = { name: p.brands.name, kasi: p.brands.location || "JHB" };
    });
    return map;
  }, [products]);

  // --- Enrich orders with brands ---
  const enrichedOrders = useMemo(() => {
    return orders.map((o) => {
      const brandsInOrder = [...new Set((o.order_items || []).map((i: any) => productToBrand[i.product_id]?.name || i.product_name))];
      const kasiOfBrands = [...new Set((o.order_items || []).map((i: any) => productToBrand[i.product_id]?.kasi || "Unknown"))];
      return { ...o, brandsInOrder, kasiOfBrands };
    });
  }, [orders, productToBrand]);

  // --- Filter lists ---
  const allKasis = ["All Kasis", ...new Set([...brands.map((b) => b.location).filter(Boolean), ...applications.map((a) => a.kasi).filter(Boolean), "Soweto", "Tembisa", "Alex", "Pheli", "Sosha", "Maboneng"])];
  const uniqueKasis = [...new Set(allKasis)];

  const allBrandNames = ["All Brands", ...new Set(brands.map((b) => b.name))];

  const filteredOrders = enrichedOrders.filter((o) => {
    if (orderBrandFilter !== "All Brands" && !o.brandsInOrder.includes(orderBrandFilter)) return false;
    if (orderKasiFilter !== "All Kasis" && o.kasi !== orderKasiFilter && !o.kasiOfBrands.includes(orderKasiFilter)) return false;
    if (orderStatusFilter !== "All Status" && o.status !== orderStatusFilter) return false;
    if (search && !o.order_code.toLowerCase().includes(search.toLowerCase()) && !(o.customer_name || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredBrands = brands.filter((b) => {
    if (brandKasiFilter !== "All Kasis" && b.location !== brandKasiFilter) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Group brands by Kasi for display
  const brandsByKasi = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredBrands.forEach((b) => {
      const k = b.location || "Other";
      if (!groups[k]) groups[k] = [];
      groups[k].push(b);
    });
    return groups;
  }, [filteredBrands]);

  // Group orders by Brand for display
  const ordersByBrand = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredOrders.forEach((o) => {
      const key = o.brandsInOrder.length > 0 ? o.brandsInOrder.join(" + ") : "Unknown Brand";
      if (!groups[key]) groups[key] = [];
      groups[key].push(o);
    });
    return groups;
  }, [filteredOrders]);

  const pendingApps = applications.filter((a) => a.status === "pending");

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#F6F5F2] text-[#1C1C1A] flex items-center justify-center px-4">
        <div className="bg-white rounded-[24px] p-6 w-full max-w-[400px] text-center border border-[#E5E2DB]">
          <h1 className="text-2xl font-black text-[#1C1C1A]">Admin Login</h1>
          <p className="text-sm text-[#5A5A55] mt-1">The Diary team only</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && password === "diary2026") setAuthed(true); }} placeholder="Admin password" className="w-full border border-[#E5E2DB] rounded-full px-5 py-4 mt-4 outline-none focus:border-black bg-white text-[#1C1C1A] placeholder:text-[#8A857C]" />
          <button onClick={() => { if (password === "diary2026") setAuthed(true); else alert("Wrong password"); }} className="w-full bg-black text-white py-4 rounded-full font-bold mt-3">Enter Admin →</button>
          <p className="text-xs text-[#8A857C] mt-3">Temp password: diary2026</p>
          <a href="/" className="block text-xs underline mt-2 text-[#1C1C1A]">← Back to site</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#1C1C1A] px-4 py-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-[#1C1C1A]">Admin • The Diary</h1>
            <p className="text-sm text-[#5A5A55]">Orders by Brand • Brands by Kasi</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={fetchAll} className="bg-white text-[#1C1C1A] border border-[#E5E2DB] px-4 py-2.5 rounded-full font-bold text-sm">Refresh ↻</button>
            <a href="/brand-dashboard" className="bg-white text-[#1C1C1A] border border-[#E5E2DB] px-4 py-2.5 rounded-full font-bold text-sm">Brand Dashboard →</a>
            <a href="/" className="bg-black text-white px-4 py-2.5 rounded-full font-bold text-sm">View Site →</a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E2DB] text-center">
            <p className="text-2xl font-black text-[#1C1C1A]">{orders.length}</p>
            <p className="text-xs text-[#8A857C] font-bold">TOTAL ORDERS</p>
            <p className="text-xs mt-1 text-[#1C1C1A]">R{orders.reduce((s, o) => s + o.total_cents, 0) / 100} revenue</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E2DB] text-center">
            <p className="text-2xl font-black text-[#1C1C1A]">{pendingApps.length}</p>
            <p className="text-xs text-[#8A857C] font-bold">PENDING BRANDS</p>
            <p className="text-xs mt-1 text-[#1C1C1A]">{brands.length} live brands</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E2DB] text-center">
            <p className="text-2xl font-black text-[#1C1C1A]">{uniqueKasis.length - 1}</p>
            <p className="text-xs text-[#8A857C] font-bold">KASIS</p>
            <p className="text-xs mt-1 text-[#1C1C1A]">{products.length} products</p>
          </div>
        </div>

        <div className="flex gap-2 mt-5 overflow-x-auto pb-1">
          <button onClick={() => setTab("orders")} className={`px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap border ${tab === "orders" ? "bg-black text-white border-black" : "bg-white text-[#1C1C1A] border-[#E5E2DB]"}`}>📦 Orders by Brand ({filteredOrders.length})</button>
          <button onClick={() => setTab("brands")} className={`px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap border ${tab === "brands" ? "bg-black text-white border-black" : "bg-white text-[#1C1C1A] border-[#E5E2DB]"}`}>👕 Brands by Kasi ({filteredBrands.length}) {pendingApps.length > 0 && `• ${pendingApps.length} pending`}</button>
          <button onClick={() => setTab("products")} className={`px-5 py-3 rounded-full font-bold text-sm whitespace-nowrap border ${tab === "products" ? "bg-black text-white border-black" : "bg-white text-[#1C1C1A] border-[#E5E2DB]"}`}>🛍️ Products ({products.length})</button>
        </div>

        {/* ========== FILTERS ========== */}
        {tab === "orders" && (
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E2DB] mt-4">
            <p className="font-black text-sm text-[#1C1C1A]">Filter Orders</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              <select value={orderBrandFilter} onChange={(e) => setOrderBrandFilter(e.target.value)} className="border border-[#E5E2DB] rounded-full px-3 py-3 text-sm font-bold bg-white text-[#1C1C1A]">
                {allBrandNames.map((b) => <option key={b}>{b}</option>)}
              </select>
              <select value={orderKasiFilter} onChange={(e) => setOrderKasiFilter(e.target.value)} className="border border-[#E5E2DB] rounded-full px-3 py-3 text-sm font-bold bg-white text-[#1C1C1A]">
                {uniqueKasis.map((k) => <option key={k}>{k}</option>)}
              </select>
              <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="border border-[#E5E2DB] rounded-full px-3 py-3 text-sm font-bold bg-white text-[#1C1C1A]">
                <option>All Status</option><option>ordered</option><option>at_rank</option><option>on_taxi</option><option>delivered</option>
              </select>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search code / name..." className="border border-[#E5E2DB] rounded-full px-4 py-3 text-sm bg-white text-[#1C1C1A] placeholder:text-[#8A857C]" />
            </div>
            {(orderBrandFilter !== "All Brands" || orderKasiFilter !== "All Kasis" || orderStatusFilter !== "All Status") && (
              <button onClick={() => { setOrderBrandFilter("All Brands"); setOrderKasiFilter("All Kasis"); setOrderStatusFilter("All Status"); setSearch(""); }} className="mt-2 text-xs font-bold underline text-[#1C1C1A]">Clear filters ✕</button>
            )}
          </div>
        )}

        {tab === "brands" && (
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E2DB] mt-4">
            <p className="font-black text-sm text-[#1C1C1A]">Filter Brands</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <select value={brandKasiFilter} onChange={(e) => setBrandKasiFilter(e.target.value)} className="border border-[#E5E2DB] rounded-full px-4 py-3 text-sm font-bold bg-white text-[#1C1C1A]">
                {uniqueKasis.map((k) => <option key={k}>{k}</option>)}
              </select>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search brand name..." className="flex-1 min-w-[180px] border border-[#E5E2DB] rounded-full px-4 py-3 text-sm bg-white text-[#1C1C1A] placeholder:text-[#8A857C]" />
              {brandKasiFilter !== "All Kasis" && <button onClick={() => { setBrandKasiFilter("All Kasis"); setSearch(""); }} className="text-xs font-bold underline text-[#1C1C1A]">Clear ✕</button>}
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {uniqueKasis.filter((k) => k !== "All Kasis").map((k) => (
                <button key={k} onClick={() => setBrandKasiFilter(k)} className={`px-3 py-2 rounded-full text-xs font-bold border ${brandKasiFilter === k ? "bg-black text-white border-black" : "bg-[#F6F5F2] text-[#1C1C1A] border-[#E5E2DB]"}`}>{k}</button>
              ))}
            </div>
          </div>
        )}

        {loading && <p className="text-center mt-8 text-[#1C1C1A]">Loading...</p>}

        {/* ========== ORDERS GROUPED BY BRAND ========== */}
        {tab === "orders" && !loading && (
          <div className="mt-4">
            {filteredOrders.length === 0 && <p className="text-center bg-white text-[#1C1C1A] rounded-[20px] p-8 border border-[#E5E2DB]">No orders for this filter. Try clearing filters.</p>}
            {Object.entries(ordersByBrand).map(([brandName, brandOrders]: any) => (
              <div key={brandName} className="mb-5">
                <div className="flex justify-between items-center mb-2 px-1">
                  <h3 className="font-black text-lg text-[#1C1C1A]">{brandName}</h3>
                  <span className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-full">{brandOrders.length} order(s) • R{brandOrders.reduce((s: number, o: any) => s + o.total_cents, 0) / 100}</span>
                </div>
                <div className="space-y-3">
                  {brandOrders.map((o: any) => (
                    <div key={o.id} className="bg-white rounded-[20px] p-5 border border-[#E5E2DB]">
                      <div className="flex justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex gap-2 items-center flex-wrap">
                            <p className="font-black text-xl tracking-widest text-[#1C1C1A]">{o.order_code}</p>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F6F5F2] text-[#1C1C1A] border border-[#E5E2DB]">{o.status.toUpperCase()}</span>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EDEAE3] text-[#1C1C1A]">📍 {o.kasi} • Buyer Kasi</span>
                          </div>
                          <p className="text-sm mt-1 text-[#1C1C1A]"><b>{o.customer_name}</b> • {o.customer_whatsapp}</p>
                          <p className="text-xs text-[#5A5A55]">{o.delivery_type} • R{o.total_cents / 100} • {new Date(o.created_at).toLocaleString()}</p>
                          <p className="text-sm mt-2 bg-[#F6F5F2] text-[#1C1C1A] rounded-[12px] p-2">{o.order_items?.map((i: any) => `${i.product_name} x${i.quantity} (${productToBrand[i.product_id]?.name || "Unknown"})`).join(", ")}</p>
                        </div>
                        <div className="shrink-0 w-full sm:w-[200px]">
                          <p className="text-xs font-bold mb-1 text-[#1C1C1A]">CHANGE STATUS →</p>
                          <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className="border border-[#E5E2DB] rounded-full px-4 py-3 font-bold bg-white text-[#1C1C1A] w-full">
                            <option value="ordered">🟡 Ordered</option>
                            <option value="at_rank">📦 At Rank</option>
                            <option value="on_taxi">🚕 On Taxi</option>
                            <option value="delivered">✅ Delivered</option>
                          </select>
                          <a href={`https://wa.me/${o.customer_whatsapp.replace(/\s/g, "")}?text=Hi ${o.customer_name}, your order ${o.order_code} is now ${o.status}`} target="_blank" className="block text-center mt-2 bg-black text-white py-2.5 rounded-full text-xs font-bold">WhatsApp Customer</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========== BRANDS GROUPED BY KASI ========== */}
        {tab === "brands" && !loading && (
          <div className="mt-4 space-y-5">
            {pendingApps.length > 0 && (
              <div className="bg-[#FFF1F1] border border-[#E5E2DB] rounded-[20px] p-4">
                <p className="font-black text-[#1C1C1A]">⏳ {pendingApps.length} Pending Applications - Need Approval</p>
                {pendingApps.map((app) => (
                  <div key={app.id} className="bg-white rounded-[16px] p-4 mt-3 flex justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-bold text-[#1C1C1A]">{app.brand_name} • {app.kasi}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(Array.isArray(app.category) ? app.category : [app.category]).filter(Boolean).map((cat: string) => (
                          <span key={cat} className="text-xs font-bold bg-[#F6F5F2] border border-[#E5E2DB] text-[#1C1C1A] px-2.5 py-1 rounded-full">{cat}</span>
                        ))}
                      </div>
                      <p className="text-sm text-[#5A5A55] mt-2">{app.owner_name} • {app.whatsapp} • {app.about}</p>
                      {app.instagram && <p className="text-xs text-[#5A5A55]">IG: {app.instagram}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => approveBrand(app)} className="bg-black text-white px-4 py-2.5 rounded-full font-bold text-sm h-fit">Approve ✓</button>
                      <button onClick={() => updateApplication(app.id, "rejected")} className="bg-white text-[#1C1C1A] border border-[#E5E2DB] px-4 py-2.5 rounded-full font-bold text-sm h-fit">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {Object.entries(brandsByKasi).map(([kasi, kasiBrands]: any) => (
              <div key={kasi}>
                <div className="flex justify-between items-center mb-2 px-1">
                  <h3 className="font-black text-lg text-[#1C1C1A]">📍 {kasi}</h3>
                  <span className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-full">{kasiBrands.length} brand(s)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {kasiBrands.map((b: any) => {
                    const brandProducts = products.filter((p) => p.brands?.name === b.name);
                    const brandOrders = enrichedOrders.filter((o) => o.brandsInOrder.includes(b.name));
                    return (
                      <div key={b.id} className="bg-white rounded-[20px] p-4 border border-[#E5E2DB]">
                        <p className="font-black text-[#1C1C1A]">{b.name}</p>
                        <p className="text-xs text-[#5A5A55]">IG: {b.instagram || "-"} • {b.location} • WA: {b.whatsapp || "-"}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(Array.isArray(b.category) ? b.category : b.category ? [b.category] : []).map((cat: string) => (
                            <span key={cat} className="text-xs font-bold bg-[#F6F5F2] border border-[#E5E2DB] text-[#1C1C1A] px-2.5 py-1 rounded-full">{cat}</span>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <span className="text-xs font-bold bg-[#F6F5F2] px-2.5 py-1.5 rounded-full text-[#1C1C1A]">{brandProducts.length} products</span>
                          <span className="text-xs font-bold bg-[#F6F5F2] px-2.5 py-1.5 rounded-full text-[#1C1C1A]">{brandOrders.length} orders</span>
                          <span className="text-xs font-bold bg-[#F6F5F2] px-2.5 py-1.5 rounded-full text-[#1C1C1A]">R{brandOrders.reduce((s: number, o: any) => s + o.total_cents, 0) / 100} sales</span>
                        </div>
                        <button onClick={() => { setTab("orders"); setOrderBrandFilter(b.name); setOrderKasiFilter("All Kasis"); }} className="w-full mt-3 bg-black text-white py-2.5 rounded-full font-bold text-xs">View {b.name} Orders →</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {filteredBrands.length === 0 && <p className="text-center bg-white text-[#1C1C1A] rounded-[20px] p-8 border border-[#E5E2DB]">No brands for this Kasi.</p>}
          </div>
        )}

        {/* ========== PRODUCTS + ADD PRODUCT FORM ========== */}
        {tab === "products" && !loading && (
          <div className="mt-4">
            <button onClick={() => setShowAddProduct(!showAddProduct)} className="w-full bg-black text-white py-4 rounded-full font-bold">
              {showAddProduct ? "Close Form ✕" : "+ Add New Product"}
            </button>

            {showAddProduct && (
              <div className="bg-white rounded-[20px] p-5 border border-[#E5E2DB] mt-3 space-y-3">
                <p className="font-black">New Product</p>
                <input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product Name * e.g. Soweto Oversized Tee" className="w-full border border-[#E5E2DB] rounded-full px-5 py-3.5 bg-white outline-none focus:border-black text-[#1C1C1A]" />
                <div className="flex gap-2">
                  <input value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Price * e.g. 349" type="number" className="flex-1 border border-[#E5E2DB] rounded-full px-5 py-3.5 bg-white outline-none focus:border-black text-[#1C1C1A]" />
                  <input value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="Stock" type="number" className="w-[100px] border border-[#E5E2DB] rounded-full px-5 py-3.5 bg-white outline-none focus:border-black text-[#1C1C1A]" />
                </div>
                <select value={newProduct.brand_id} onChange={(e) => setNewProduct({ ...newProduct, brand_id: e.target.value })} className="w-full border border-[#E5E2DB] rounded-full px-5 py-3.5 bg-white font-bold text-[#1C1C1A]">
                  <option value="">Select Brand *</option>
                  {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name} • {b.location}</option>)}
                </select>
                <input value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="Image URL (paste Instagram / Imgur link)" className="w-full border border-[#E5E2DB] rounded-full px-5 py-3.5 bg-white outline-none focus:border-black text-[#1C1C1A]" />
                {newProduct.image_url && <img src={newProduct.image_url} alt="preview" className="w-full h-[200px] object-cover rounded-[16px]" />}
                <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Description..." rows={2} className="w-full border border-[#E5E2DB] rounded-[20px] px-5 py-3.5 bg-white outline-none focus:border-black text-[#1C1C1A]" />
                <label className="flex items-center gap-2 text-sm font-bold text-[#1C1C1A]">
                  <input type="checkbox" checked={newProduct.is_exclusive} onChange={(e) => setNewProduct({ ...newProduct, is_exclusive: e.target.checked })} className="w-[20px] h-[20px]" />
                  Exclusive / Limited Drop?
                </label>
                <button onClick={handleAddProduct} disabled={addingProduct} className="w-full bg-black text-white py-4 rounded-full font-bold disabled:opacity-50">
                  {addingProduct ? "Adding..." : "Add Product →"}
                </button>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="flex-1 border border-[#E5E2DB] rounded-full px-4 py-3 text-sm bg-white text-[#1C1C1A] placeholder:text-[#8A857C]" />
            </div>

            <div className="space-y-3 mt-3">
              {products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase())).map((p) => (
                <div key={p.id} className="bg-white rounded-[20px] p-4 border border-[#E5E2DB] flex gap-3 items-center">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-[60px] h-[60px] object-cover rounded-[12px] shrink-0" /> : <div className="w-[60px] h-[60px] bg-[#EDEAE3] rounded-[12px] flex items-center justify-center text-xs font-bold text-[#1C1C1A] shrink-0">No img</div>}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1C1C1A] truncate">{p.name}</p>
                    <p className="text-xs text-[#5A5A55]">{p.brands?.name} • 📍 {p.brands?.location || "JHB"} • R{p.price_cents / 100}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <button onClick={() => updateStock(p.id, p.stock - 1)} className="w-[28px] h-[28px] rounded-full border font-bold text-[#1C1C1A]">-</button>
                      <span className="text-sm font-bold text-[#1C1C1A]">Stock: {p.stock}</span>
                      <button onClick={() => updateStock(p.id, p.stock + 1)} className="w-[28px] h-[28px] rounded-full border font-bold text-[#1C1C1A]">+</button>
                      <button onClick={() => deleteProduct(p.id, p.name)} className="ml-2 text-xs font-bold text-[#B91C1C]">Delete</button>
                    </div>
                  </div>
                  <span className={`px-4 py-2.5 rounded-full font-bold text-xs shrink-0 ${p.stock > 0 ? "bg-[#F6F5F2] text-[#1C1C1A] border border-[#E5E2DB]" : "bg-[#FFF1F1] text-[#B91C1C] border border-[#E5E2DB]"}`}>{p.stock > 0 ? `In Stock: ${p.stock}` : "Out of Stock"}</span>
                </div>
              ))}
              {products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                <p className="text-center bg-white rounded-[20px] p-8 border border-[#E5E2DB] text-[#1C1C1A]">No products. Add one above!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}