"use client";
import { useState, useEffect, useMemo } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function BrandDashboard() {
  const [brandName, setBrandName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [brand, setBrand] = useState<any>(null);
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"orders" | "products">("orders");
  const [statusFilter, setStatusFilter] = useState("All");

  // Add product form (brand's own)
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image_url: "", stock: "10", description: "", is_exclusive: false });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("diary-brand");
    if (saved) {
      try {
        const b = JSON.parse(saved);
        setBrand(b);
        setBrandName(b.name);
        setWhatsapp(b.whatsapp || "");
      } catch {}
    }
  }, []);

  const fetchBrandData = async (brandObj: any) => {
    setLoading(true);
    const { data: p } = await supabaseClient.from("products").select("*, brands(id, name, location)").eq("brand_id", brandObj.id).order("created_at", { ascending: false });
    const { data: o } = await supabaseClient.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
    const { data: allProducts } = await supabaseClient.from("products").select("id, brand_id").eq("brand_id", brandObj.id);
    const myProductIds = new Set((allProducts || []).map((x: any) => x.id));
    // Only orders that contain MY products
    const myOrders = (o || []).filter((ord: any) => (ord.order_items || []).some((i: any) => myProductIds.has(i.product_id)));
    setProducts(p || []);
    setOrders(myOrders);
    setLoading(false);
  };

  useEffect(() => { if (brand) fetchBrandData(brand); }, [brand]);

  const handleLogin = async () => {
    if (!brandName.trim() || !whatsapp.trim()) { setLoginError("Fill Brand Name + WhatsApp"); return; }
    setLoading(true);
    setLoginError("");
    const { data, error } = await supabaseClient.from("brands").select("*").ilike("name", brandName.trim()).single();
    if (error || !data) { setLoginError("Brand not found. Check spelling or ask Admin to approve you first."); setLoading(false); return; }
    // Compare whatsapp - strip spaces
    const cleanInput = whatsapp.replace(/\s/g, "");
    const cleanStored = (data.whatsapp || "").replace(/\s/g, "");
    if (cleanStored && cleanStored !== cleanInput) {
      setLoginError("WhatsApp doesn't match. Use the WhatsApp you signed up with.");
      setLoading(false);
      return;
    }
    if (!cleanStored) {
      // First login, save whatsapp
      await supabaseClient.from("brands").update({ whatsapp: whatsapp }).eq("id", data.id);
      data.whatsapp = whatsapp;
    }
    setBrand(data);
    localStorage.setItem("diary-brand", JSON.stringify(data));
    setLoading(false);
  };

  const logout = () => { localStorage.removeItem("diary-brand"); setBrand(null); setOrders([]); setProducts([]); };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price) { alert("Fill Name + Price"); return; }
    const { error } = await supabaseClient.from("products").insert({
      name: newProduct.name,
      price_cents: Math.round(parseFloat(newProduct.price) * 100),
      image_url: newProduct.image_url || null,
      brand_id: brand.id,
      stock: parseInt(newProduct.stock) || 0,
      description: newProduct.description,
      is_exclusive: newProduct.is_exclusive,
    });
    if (error) { alert("Error: " + error.message); return; }
    alert("Product added!");
    setNewProduct({ name: "", price: "", image_url: "", stock: "10", description: "", is_exclusive: false });
    setShowAdd(false);
    fetchBrandData(brand);
  };

  const updateStock = async (id: string, newStock: number) => {
    await supabaseClient.from("products").update({ stock: Math.max(0, newStock) }).eq("id", id);
    fetchBrandData(brand);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabaseClient.from("orders").update({ status }).eq("id", id);
    fetchBrandData(brand);
  };

  const totalSales = useMemo(() => orders.reduce((s, o) => s + o.total_cents, 0) / 100, [orders]);
  const filteredOrders = statusFilter === "All" ? orders : orders.filter((o) => o.status === statusFilter);

  // --- LOGIN SCREEN ---
  if (!brand) {
    return (
      <main className="min-h-screen bg-[#F6F5F2] text-[#1C1C1A] flex items-center justify-center px-4">
        <div className="bg-white rounded-[24px] p-6 w-full max-w-[420px] border border-[#E5E2DB]">
          <h1 className="text-3xl font-black tracking-tighter">Brand Login.</h1>
          <p className="text-sm text-[#5A5A55] mt-1">See YOUR orders, YOUR products, YOUR sales only.</p>
          <input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Brand Name * e.g. Soweto Street Co." className="w-full border border-[#E5E2DB] rounded-full px-5 py-4 mt-4 outline-none focus:border-black bg-white" />
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp * e.g. 076 123 4567" className="w-full border border-[#E5E2DB] rounded-full px-5 py-4 mt-3 outline-none focus:border-black bg-white" />
          {loginError && <p className="text-sm text-[#B91C1C] font-bold mt-2">{loginError}</p>}
          <button onClick={handleLogin} disabled={loading} className="w-full bg-black text-white py-4 rounded-full font-bold mt-4 disabled:opacity-50">{loading ? "Checking..." : "Login →"}</button>
          <p className="text-xs text-[#8A857C] mt-3 text-center">Use the WhatsApp you signed up with.<br/>Not approved yet? <a href="/" className="underline font-bold text-black">Signup first</a></p>
          <a href="/" className="block text-center text-xs underline mt-2">← Back to site</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#1C1C1A] px-4 py-6">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#8A857C]">BRAND DASHBOARD</p>
            <h1 className="text-3xl font-black tracking-tighter">{brand.name}</h1>
            <p className="text-sm text-[#5A5A55]">📍 {brand.location} • {brand.instagram || "No IG"} • {brand.whatsapp}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => fetchBrandData(brand)} className="bg-white border border-[#E5E2DB] px-4 py-2.5 rounded-full font-bold text-sm">Refresh ↻</button>
            <button onClick={logout} className="bg-black text-white px-4 py-2.5 rounded-full font-bold text-sm">Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E2DB] text-center"><p className="text-2xl font-black">{orders.length}</p><p className="text-xs font-bold text-[#8A857C]">MY ORDERS</p></div>
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E2DB] text-center"><p className="text-2xl font-black">R{totalSales}</p><p className="text-xs font-bold text-[#8A857C]">TOTAL SALES</p></div>
          <div className="bg-white rounded-[20px] p-4 border border-[#E5E2DB] text-center"><p className="text-2xl font-black">{products.length}</p><p className="text-xs font-bold text-[#8A857C]">MY PRODUCTS</p></div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={() => setTab("orders")} className={`px-5 py-3 rounded-full font-bold text-sm ${tab === "orders" ? "bg-black text-white" : "bg-white border border-[#E5E2DB]"}`}>📦 My Orders ({orders.length})</button>
          <button onClick={() => setTab("products")} className={`px-5 py-3 rounded-full font-bold text-sm ${tab === "products" ? "bg-black text-white" : "bg-white border border-[#E5E2DB]"}`}>🛍️ My Products ({products.length})</button>
        </div>

        {tab === "orders" && (
          <div className="mt-4">
            <div className="flex gap-2 flex-wrap">
              {["All", "ordered", "at_rank", "on_taxi", "delivered"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-full text-xs font-bold border ${statusFilter === s ? "bg-black text-white border-black" : "bg-white border-[#E5E2DB]"}`}>{s}</button>
              ))}
            </div>
            <div className="space-y-3 mt-3">
              {filteredOrders.length === 0 && <p className="bg-white rounded-[20px] p-8 text-center border border-[#E5E2DB]">No orders yet for this filter. Share your brand link!</p>}
              {filteredOrders.map((o: any) => (
                <div key={o.id} className="bg-white rounded-[20px] p-5 border border-[#E5E2DB]">
                  <div className="flex justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-black text-xl tracking-widest">{o.order_code} <span className="text-xs font-bold bg-[#F6F5F2] border border-[#E5E2DB] px-2 py-1 rounded-full ml-1">{o.status.toUpperCase()}</span></p>
                      <p className="text-sm mt-1"><b>{o.customer_name}</b> • {o.customer_whatsapp}</p>
                      <p className="text-xs text-[#5A5A55]">{o.delivery_type} • R{o.total_cents / 100} • {new Date(o.created_at).toLocaleString()}</p>
                      <p className="text-sm mt-2 bg-[#F6F5F2] rounded-[12px] p-2">{o.order_items?.filter((i: any) => products.some((p: any) => p.id === i.product_id)).map((i: any) => `${i.product_name} x${i.quantity}`).join(", ") || o.order_items?.map((i: any) => `${i.product_name} x${i.quantity}`).join(", ")}</p>
                      <p className="text-xs mt-1 text-[#8A857C]">⚠️ Only YOUR items in this order are shown. If order has other brands too, you only see yours.</p>
                    </div>
                    <div className="w-full sm:w-[180px]">
                      <p className="text-xs font-bold mb-1">UPDATE STATUS →</p>
                      <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className="border border-[#E5E2DB] rounded-full px-4 py-3 font-bold bg-white w-full">
                        <option value="ordered">🟡 Ordered</option><option value="at_rank">📦 At Rank</option><option value="on_taxi">🚕 On Taxi</option><option value="delivered">✅ Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="mt-4">
            <button onClick={() => setShowAdd(!showAdd)} className="w-full bg-black text-white py-4 rounded-full font-bold">{showAdd ? "Close ✕" : "+ Add Product"}</button>
            {showAdd && (
              <div className="bg-white rounded-[20px] p-5 border border-[#E5E2DB] mt-3 space-y-3">
                <input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Product Name * e.g. Oversized Tee" className="w-full border border-[#E5E2DB] rounded-full px-5 py-3.5 bg-white outline-none focus:border-black" />
                <div className="flex gap-2">
                  <input value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="Price * e.g. 349" type="number" className="flex-1 border border-[#E5E2DB] rounded-full px-5 py-3.5 bg-white outline-none focus:border-black" />
                  <input value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="Stock" type="number" className="w-[100px] border border-[#E5E2DB] rounded-full px-5 py-3.5 bg-white outline-none focus:border-black" />
                </div>
                <input value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="Image URL" className="w-full border border-[#E5E2DB] rounded-full px-5 py-3.5 bg-white outline-none focus:border-black" />
                {newProduct.image_url && <img src={newProduct.image_url} className="w-full h-[180px] object-cover rounded-[16px]" alt="preview" />}
                <textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Description..." rows={2} className="w-full border border-[#E5E2DB] rounded-[20px] px-5 py-3.5 bg-white outline-none focus:border-black" />
                <button onClick={handleAddProduct} className="w-full bg-black text-white py-4 rounded-full font-bold">Add Product →</button>
              </div>
            )}
            <div className="space-y-3 mt-3">
              {products.map((p: any) => (
                <div key={p.id} className="bg-white rounded-[20px] p-4 border border-[#E5E2DB] flex gap-3 items-center">
                  {p.image_url ? <img src={p.image_url} className="w-[60px] h-[60px] object-cover rounded-[12px]" alt={p.name} /> : <div className="w-[60px] h-[60px] bg-[#EDEAE3] rounded-[12px] flex items-center justify-center text-xs font-bold">No img</div>}
                  <div className="flex-1">
                    <p className="font-bold">{p.name}</p>
                    <p className="text-xs text-[#5A5A55]">R{p.price_cents / 100} • {p.description || ""}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateStock(p.id, p.stock - 1)} className="w-[28px] h-[28px] rounded-full border font-bold">-</button>
                      <span className="text-sm font-bold">Stock: {p.stock}</span>
                      <button onClick={() => updateStock(p.id, p.stock + 1)} className="w-[28px] h-[28px] rounded-full border font-bold">+</button>
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className="bg-white rounded-[20px] p-8 text-center border border-[#E5E2DB]">No products yet. Add your first product above!</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}