"use client";

import { useState } from "react";

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [trackedCode, setTrackedCode] = useState("");
  const [result, setResult] = useState<{ status: string; detail: string; step: number } | null>(null);

  const handleTrack = (raw?: string) => {
    const c = (raw ?? code).trim().toUpperCase() || "SOW-001";
    setCode(c);
    setTrackedCode(c);
    if (c.startsWith("SOW")) setResult({ status: "On Taxi • Soweto → CBD", detail: "Your parcel left Maponya Rank at 10:15. Driver: Taxi #SOW-12. Collect at Bree Rank.", step: 2 });
    else if (c.startsWith("TEM")) setResult({ status: "At Rank • Tembisa", detail: "Your parcel is at Phumulani Mall Rank waiting for next taxi to CBD.", step: 1 });
    else if (c.startsWith("ALEX")) setResult({ status: "Delivered • Alex", detail: "Collected at Pan Africa at 14:20. Thanks for shopping The Diary.", step: 3 });
    else if (c.startsWith("PHELI") || c.startsWith("PHE")) setResult({ status: "On Taxi • Pheli → CBD", detail: "Left Marabastad Rank at 11:00. ETA Bree Rank 12:30.", step: 2 });
    else if (c.startsWith("SOS")) setResult({ status: "Ordered • Sosha", detail: "Seller confirmed. Drop at Sosha Crossing on Friday 10am.", step: 0 });
    else setResult({ status: "Ordered", detail: "We found your order. Seller is packing it. Drop at rank on Thu/Fri.", step: 0 });
  };

  return (
    <main className="min-h-screen bg-[#F6F5F2] text-[#1C1C1A] px-4 sm:px-6 lg:px-12 py-8">
      <div className="max-w-[600px] mx-auto">
        <a href="/" className="text-sm font-bold underline">← Back to Home</a>
        <p className="text-[11px] tracking-[0.25em] text-[#8A857C] mt-6">THE DIARY • TRACK</p>
        <h1 className="text-5xl font-black tracking-tighter leading-[0.95] mt-2">Track<br/>Parcel.</h1>
        <p className="text-[#5A5A55] mt-3">Type your code from WhatsApp. e.g. SOW-001, TEM-002, ALEX-003</p>

        <div className="mt-6 bg-white border border-[#E5E2DB] rounded-[20px] p-4">
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") handleTrack(); }}
              placeholder="SOW-001"
              className="flex-1 min-w-0 border border-[#E5E2DB] px-4 py-4 rounded-full font-bold outline-none focus:border-black"
            />
            <button onClick={() => handleTrack()} className="bg-black text-white px-6 py-4 rounded-full font-bold shrink-0">Track</button>
          </div>

          {result && (
            <div className="mt-4 bg-[#F6F5F2] rounded-[16px] p-4">
              <p className="font-black">{trackedCode} • {result.status}</p>
              <p className="text-sm text-[#5A5A55] mt-1">{result.detail}</p>
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
            <p>Try these test codes:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {["SOW-001", "TEM-002", "ALEX-003", "PHELI-004", "SOSHA-005"].map((c) => (
                <button key={c} onClick={() => handleTrack(c)} className="bg-[#F6F5F2] border border-[#E5E2DB] px-3 py-2 rounded-full font-bold text-xs hover:bg-black hover:text-white transition">{c}</button>
              ))}
            </div>
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