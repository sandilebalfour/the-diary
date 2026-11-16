"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [trackedCode, setTrackedCode] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const STATUS_MAP: Record<string, { status: string; detail: string; step: number }> = {
    ordered: { status: "Ordered", detail: "We found your order. Seller is packing it. Drop at rank on Thu/Fri.", step: 0 },
    at_rank: { status: "At Rank", detail: "Your parcel is at the rank waiting for the next taxi.", step: 1 },
    on_taxi: { status: "On Taxi", detail: "Your parcel left the rank. It's on the taxi to you.", step: 2 },
    delivered: { status: "Delivered", detail: "Collected / Delivered. Thanks for shopping The Diary.", step: 3 },
  };

  const handleTrack = async (raw?: string) => {
    const c = (raw ?? code).trim().toUpperCase();
    if (!c) return;
    setCode(c);
    setTrackedCode(c);
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    setItems([]);

    const { data } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("order_code", c)
      .single();

    if (!data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setOrder(data);

    const { data: orderItems } = await supabaseClient
      .from("order_items")
      .select("*")
      .eq("order_id", data.id);
    setItems(orderItems || []);
    setLoading(false);
  };

  const result = order ? STATUS_MAP[order.status] || STATUS_MAP.ordered : null;

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#1C1C1A] px-4 sm:px-6 lg:px-12 py-8">
      <div className="max-w-[600px] mx-auto">
        <a href="/" className="text-sm font-bold underline">← Back to Home</a>
        <p className="text-[11px] tracking-[0.25em] text-[#8A857C] mt-6">THE DIARY • TRACK</p>
        <h1 className="text-5xl font-black tracking-tighter leading-[0.95] mt-2">Track<br/>Parcel.</h1>
        <p className="text-[#5A5A55] mt-3">Type your code from checkout. e.g. SOW-123</p>

        <div className="mt-6 bg-white border border-[#E5E2DB] rounded-[20px] p-4">
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") handleTrack(); }}
              placeholder="SOW-123"
              className="flex-1 min-w-0 border border-[#E5E2DB] px-4 py-4 rounded-full font-bold outline-none focus:border-black uppercase"
            />
            <button onClick={() => handleTrack()} disabled={loading} className="bg-black text-white px-6 py-4 rounded-full font-bold shrink-0 disabled:opacity-50">
              {loading ? "..." : "Track"}
            </button>
          </div>

          {notFound && (
            <div className="mt-4 bg-[#FFF1F1] rounded-[16px] p-4 text-center">
              <p className="font-black">No order found for {trackedCode}</p>
              <p className="text-sm text-[#5A5A55] mt-1">Check the code - it's on your order success screen. It looks like SOW-123, not SOW-001.</p>
            </div>
          )}

          {result && order && (
            <div className="mt-4 bg-[#F6F5F2] rounded-[16px] p-4">
              <p className="font-black">{trackedCode} • {result.status}</p>
              <p className="text-sm text-[#5A5A55] mt-1">{result.detail}</p>
              <p className="text-xs text-[#8A857C] mt-2">{order.kasi} • {order.delivery_type} • R{order.total_cents / 100} • {order.customer_name}</p>
              
              {items.length > 0 && (
                <div className="mt-3 border-t border-[#E5E2DB] pt-3">
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between text-sm">
                      <span>{it.product_name} x{it.quantity}</span>
                      <span className="font-bold">R{it.price_cents / 100}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-1 mt-4">
                {["Ordered", "At Rank", "On Taxi", "Delivered"].map((s, i) => (
                  <div key={s} className={`flex-1 h-[8px] rounded-full ${i <= result.step ? "bg-black" : "bg-[#E5E2DB]"}`}></div>
                ))}
              </div>
              <div className="flex justify-between text-[11px] font-bold text-[#8A857C] mt-2">
                <span>Ordered</span><span>At Rank</span><span>On Taxi</span><span>Delivered</span>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-[#8A857C]">
            <p>Your real code is the one you got after checkout - not the test ones below.</p>
            <p className="text-xs mt-1">If you checked out before, check Supabase &gt; orders table for your code.</p>
          </div>
        </div>

        <div className="mt-6 bg-white border border-[#E5E2DB] rounded-[20px] p-4">
          <h2 className="font-black">Pickup Points</h2>
          <ul className="text-sm mt-2 space-y-2">
            <li><b>Soweto</b> - Maponya Mall Rank • Thu 10am-4pm</li>
            <li><b>Tembisa</b> - Phumulani Mall • Thu 10am-4pm</li>
            <li><b>Alex</b> - Pan Africa • Fri 10am-4pm</li>
            <li><b>Pheli</b> - Marabastad Rank • Fri 10am-4pm</li>
            <li><b>Sosha</b> - Sosha Crossing • Fri 10am-4pm</li>
          </ul>
          <p className="text-xs text-[#8A857C] mt-3">Show your code at the rank to collect. No code = no parcel.</p>
        </div>

        <a href="https://wa.me/27600000000" target="_blank" className="block text-center mt-4 bg-black text-white py-4 rounded-full font-bold">Need help? WhatsApp Us →</a>
      </div>
    </main>
  );
}