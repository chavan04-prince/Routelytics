// SafetyGridPage.jsx
// ─────────────────────────────────────────────────────────────
// SETUP — run once in your terminal:
//   npm install leaflet react-leaflet
//
// In your src/main.jsx (or index.jsx) add at the very top:
//   import 'leaflet/dist/leaflet.css'
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";

// ── SECTOR DATA ──────────────────────────────────────────────
// Each sector has real lat/lng so it appears on the map
// Change these coordinates to match your actual city areas

const SECTORS = [
  {
    id: "s7",
    name: "Sector 7",
    area: "Market District",
    risk: "high",
    lat: 18.5204,
    lng: 73.8567,
    radius: 650,      // circle size in meters
    pct: 92,          // risk bar fill percentage
    incidents: 47,
    tips: [
      "Avoid alleys after 20:00",
      "Use main boulevard only",
      "Travel in groups of 2+",
      "Preferred entry via Gate C",
    ],
  },
  {
    id: "s3",
    name: "Sector 3",
    area: "East Corridor",
    risk: "high",
    lat: 18.532,
    lng: 73.878,
    radius: 550,
    pct: 78,
    incidents: 31,
    tips: [
      "Police presence low at night",
      "Recommended curfew: 21:00",
      "Emergency beacons at Posts 3A & 3B",
      "Avoid underpass near Rail 7",
    ],
  },
  {
    id: "s4",
    name: "Sector 4",
    area: "Industrial Zone",
    risk: "med",
    lat: 18.508,
    lng: 73.842,
    radius: 720,
    pct: 55,
    incidents: 18,
    tips: [
      "Stay on lit pathways only",
      "Report suspicious vehicles immediately",
      "Check-in points at Depot A & Warehouse 12",
    ],
  },
  {
    id: "s6",
    name: "Sector 6",
    area: "Transit Hub",
    risk: "med",
    lat: 18.526,
    lng: 73.845,
    radius: 420,
    pct: 48,
    incidents: 14,
    tips: [
      "Pickpocket activity reported",
      "Keep valuables secured at all times",
      "CCTV coverage 80% of area",
    ],
  },
  {
    id: "s9",
    name: "Sector 9",
    area: "Uptown",
    risk: "low",
    lat: 18.541,
    lng: 73.863,
    radius: 580,
    pct: 22,
    incidents: 5,
    tips: [
      "Night patrols active 22:00–04:00",
      "Generally safe for travel",
      "Community watch program active",
    ],
  },
  {
    id: "s2",
    name: "Sector 2",
    area: "Residential",
    risk: "low",
    lat: 18.504,
    lng: 73.832,
    radius: 500,
    pct: 15,
    incidents: 3,
    tips: [
      "Quiet zone — low activity",
      "Emergency response avg. 4 min",
      "Neighborhood patrol every 2h",
    ],
  },
];

// ── COLOR CONFIG ─────────────────────────────────────────────

const RISK_COLOR = { high: "#ef4444", med: "#f59e0b", low: "#22c55e" };
const RISK_LABEL = { high: "HIGH",    med: "MED",     low: "LOW"     };
const RISK_BG    = {
  high: "rgba(239,68,68,0.12)",
  med:  "rgba(245,158,11,0.12)",
  low:  "rgba(34,197,94,0.12)",
};

// ── INJECT GLOBAL STYLES ─────────────────────────────────────

const injectStyles = () => {
  if (document.getElementById("sgp-styles")) return;
  const el = document.createElement("style");
  el.id = "sgp-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;700;900&display=swap');

    /* Dark-theme Leaflet popup overrides */
    .leaflet-popup-content-wrapper {
      background: #0f172a !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 10px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.7) !important;
      color: #f1f5f9 !important;
      font-family: 'Barlow Condensed', sans-serif !important;
      padding: 0 !important;
    }
    .leaflet-popup-content    { margin: 0 !important; padding: 0 !important; }
    .leaflet-popup-tip        { background: #0f172a !important; }
    .leaflet-popup-close-button { color: #64748b !important; font-size: 18px !important; right: 10px !important; top: 8px !important; }
    .leaflet-popup-close-button:hover { color: #f1f5f9 !important; }
    .leaflet-control-zoom a   { background: #0f172a !important; border-color: rgba(255,255,255,0.1) !important; color: #94a3b8 !important; }
    .leaflet-control-zoom a:hover { background: #1e293b !important; color: #f1f5f9 !important; }
    .leaflet-control-attribution { background: rgba(0,0,0,0.5) !important; color: #334155 !important; font-size: 9px !important; }
    .leaflet-control-attribution a { color: #475569 !important; }

    @keyframes sgp-scanline  { 0%{top:-5%} 100%{top:105%} }
    @keyframes sgp-pulse     { 0%,100%{opacity:1} 50%{opacity:.3} }
    @keyframes sgp-fadeup    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes sgp-blink     { 0%,49%{opacity:1} 50%,100%{opacity:0} }

    .sgp-row:hover  { background: rgba(255,255,255,0.04) !important; }
    .sgp-tip        { animation: sgp-fadeup 0.22s ease forwards; }
    .sgp-filter:hover { opacity: 0.8; }
  `;
  document.head.appendChild(el);
};

// ── FLY-TO HELPER (internal Leaflet hook) ────────────────────

function FlyTo({ sector }) {
  const map = useMap();
  useEffect(() => {
    if (sector) map.flyTo([sector.lat, sector.lng], 14, { duration: 1.1 });
  }, [sector, map]);
  return null;
}

// ── POPUP CARD ───────────────────────────────────────────────

function PopupCard({ s }) {
  return (
    <div style={{ padding: "14px 16px", minWidth: 220 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: RISK_COLOR[s.risk], flexShrink: 0 }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc" }}>
          {s.name} — {s.area}
        </span>
      </div>
      <div style={{
        display: "inline-block",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 10, padding: "3px 8px", borderRadius: 4,
        background: RISK_BG[s.risk], color: RISK_COLOR[s.risk],
        letterSpacing: "0.12em", marginBottom: 10,
      }}>
        {RISK_LABEL[s.risk]} RISK · {s.incidents} INCIDENTS
      </div>
      {s.tips.map((t, i) => (
        <div key={i} style={{ display: "flex", gap: 6, fontSize: 12, color: "#94a3b8", marginBottom: 3 }}>
          <span style={{ color: "#f59e0b" }}>›</span>{t}
        </div>
      ))}
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────

export default function SafetyGridPage() {
  const [selected,  setSelected]  = useState(null);
  const [filter,    setFilter]    = useState("all");
  const [time,      setTime]      = useState(new Date());
  const [scanPct,   setScanPct]   = useState(0);
  const [mapReady,  setMapReady]  = useState(false);

  // Inject CSS once
  useEffect(() => { injectStyles(); }, []);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Scanline loop
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => { v = (v + 1) % 101; setScanPct(v); }, 40);
    return () => clearInterval(t);
  }, []);

  // Delay map mount to avoid Leaflet SSR errors
  useEffect(() => { setTimeout(() => setMapReady(true), 100); }, []);

  const activeSector = SECTORS.find((s) => s.name === selected) ?? null;
  const listItems    = filter === "all" ? SECTORS : SECTORS.filter((s) => s.risk === filter);
  const [mapTheme, setMapTheme] = useState("dark"); // 'dark' | 'light'
  const TILE_URLS = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  };
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020408",
      fontFamily: "'Barlow Condensed', sans-serif",
      color: "#e2e8f0",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Background grid ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
      }} />

      {/* ── Scanline ── */}
      <div style={{
        position: "fixed", left: 0, right: 0, height: "2px", zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.35), transparent)",
        top: `${scanPct}%`,
        animation: "sgp-scanline 4s linear infinite",
      }} />

      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "24px 20px 48px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "sgp-pulse 1.5s ease infinite" }} />
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#22c55e", letterSpacing: "0.15em" }}>
                TACTICAL SAFETY GRID // LIVE
              </span>
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-0.01em", lineHeight: 0.92, color: "#f8fafc", margin: 0 }}>
              SAFETY<br /><span style={{ color: "#f59e0b" }}>GRID</span>
            </h1>
          </div>
          <div style={{ textAlign: "right", fontFamily: "'Share Tech Mono', monospace" }}>
            <div style={{ fontSize: 22, color: "#f8fafc", animation: "sgp-blink 1s step-end infinite" }}>
              {time.toLocaleTimeString("en-GB", { hour12: false })}
            </div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3, letterSpacing: "0.1em" }}>
              {time.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2, letterSpacing: "0.1em" }}>
              18.52°N · 73.85°E
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { label: "High Risk Zones",   value: 2,   color: "#ef4444" },
            { label: "Active Incidents",  value: 118, color: "#f59e0b" },
            { label: "Sectors Monitored",value: 6,   color: "#22c55e" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10, padding: "14px 18px",
            }}>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MAP BLOCK ── */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, padding: 20, marginBottom: 16,
        }}>
          {/* Map header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#22c55e", letterSpacing: "0.12em" }}>
              LIVE SECTOR MAP // CLICK A ZONE
            </span>
            <div style={{ display: "flex", gap: 14 }}>
              {["high","med","low"].map((r) => (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: RISK_COLOR[r] }} />
                  {RISK_LABEL[r]}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setMapTheme(prev => prev === "dark" ? "light" : "dark")}
            style={{
              padding: "6px 12px",
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Switch to {mapTheme === "dark" ? "Light" : "Dark"} Mode
          </button>

          {/* The actual Leaflet map */}
          {mapReady ? (
            <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <MapContainer
                center={[18.5204, 73.8567]}
                zoom={13}
                style={{ height: 420, width: "100%" }}
                scrollWheelZoom
              >
                {/*
                  FREE dark map tiles from CARTO — no API key needed.
                  Uses OpenStreetMap data under ODbL license.
                */}
                <TileLayer  
                  url={TILE_URLS[mapTheme]}
                  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                  subdomains="abcd"
                  maxZoom={19}
                />

                {/* Smoothly fly camera to selected sector */}
                <FlyTo sector={activeSector} />

                {/* One colored circle per sector */}
                {SECTORS.map((s) => (
                  <Circle
                    key={s.id}
                    center={[s.lat, s.lng]}
                    radius={s.radius}
                    pathOptions={{
                      color:       RISK_COLOR[s.risk],
                      fillColor:   RISK_COLOR[s.risk],
                      fillOpacity: selected === s.name ? 0.55 : 0.28,
                      weight:      selected === s.name ? 3 : 1.5,
                      // Dashed border for high-risk zones
                      dashArray:   s.risk === "high" ? "6 4" : undefined,
                    }}
                    eventHandlers={{
                      click: () => setSelected(s.name === selected ? null : s.name),
                    }}
                  >
                    <Popup maxWidth={280} autoPan>
                      <PopupCard s={s} />
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            </div>
          ) : (
            <div style={{
              height: 420, borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#334155", letterSpacing: "0.1em" }}>
                INITIALIZING MAP...
              </span>
            </div>
          )}

          {/* Tip panel — appears when a sector is selected */}
          <div style={{ marginTop: 14 }}>
            {activeSector ? (
              <div key={selected} className="sgp-tip" style={{
                background: RISK_BG[activeSector.risk],
                border: `1px solid ${RISK_COLOR[activeSector.risk]}44`,
                borderRadius: 10, padding: "14px 18px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: "'Share Tech Mono', monospace", fontSize: 10,
                    padding: "3px 8px", borderRadius: 4,
                    background: `${RISK_COLOR[activeSector.risk]}22`,
                    color: RISK_COLOR[activeSector.risk], letterSpacing: "0.1em",
                  }}>{RISK_LABEL[activeSector.risk]} RISK</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc" }}>
                    {activeSector.name} — {activeSector.area}
                  </span>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#475569", marginLeft: "auto" }}>
                    {activeSector.incidents} incidents recorded
                  </span>
                </div>
                {activeSector.tips.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
                    <span style={{ color: "#f59e0b" }}>›</span>{t}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: "14px 18px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 10, display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1e293b" }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: "#334155" }}>
                  CLICK A COLORED ZONE ON THE MAP TO VIEW TACTICAL BRIEFING
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {[
            { key: "all",  label: "All Sectors", color: "#22c55e" },
            { key: "high", label: "HIGH",         color: "#ef4444" },
            { key: "med",  label: "MED",          color: "#f59e0b" },
            { key: "low",  label: "LOW",          color: "#22c55e" },
          ].map(({ key, label, color }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                className="sgp-filter"
                onClick={() => setFilter(key)}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "7px 16px", borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
                  background: active ? `${color}18` : "transparent",
                  color: active ? color : "#64748b",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Sector list ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {listItems.map((s, i) => {
            const active = selected === s.name;
            return (
              <div
                key={s.id}
                className="sgp-row"
                onClick={() => setSelected(active ? null : s.name)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 18px", borderRadius: 10, cursor: "pointer",
                  background: active ? RISK_BG[s.risk] : "rgba(255,255,255,0.02)",
                  border: `1px solid ${active ? RISK_COLOR[s.risk] + "44" : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#334155", minWidth: 22 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: RISK_COLOR[s.risk], flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#f8fafc" }}>{s.name}</span>
                  <span style={{ color: "#475569" }}> — {s.area}</span>
                </div>
                {/* Risk bar */}
                <div style={{ width: 90, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                  <div style={{ width: `${s.pct}%`, height: "100%", background: RISK_COLOR[s.risk], borderRadius: 2 }} />
                </div>
                {/* Badge */}
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "0.1em",
                  padding: "4px 10px", borderRadius: 4,
                  background: RISK_BG[s.risk], color: RISK_COLOR[s.risk],
                  minWidth: 48, textAlign: "center",
                }}>{RISK_LABEL[s.risk]}</div>
                {/* Incident count */}
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "#334155", minWidth: 56, textAlign: "right" }}>
                  {s.incidents} INC
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 28, display: "flex", justifyContent: "space-between",
          fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
          color: "#1e293b", letterSpacing: "0.1em",
        }}>
          <span>TACTICAL SAFETY GRID v2.5.0</span>
          <span>TILES: CARTO DARK MATTER (FREE, NO KEY)</span>
        </div>
      </div>
    </div>
  );
}