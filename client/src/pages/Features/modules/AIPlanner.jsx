import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Zap, Play, MapPin, Plus, Trash2, Navigation, DollarSign } from 'lucide-react';

/* ─── Inline global styles (injected once) ─────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@300;400;500;600;700&display=swap');

    .ap-root * { box-sizing: border-box; }

    .ap-root {
      --indigo:      #6366f1;
      --indigo-hi:   #818cf8;
      --indigo-dim:  rgba(99,102,241,0.15);
      --indigo-glow: rgba(99,102,241,0.08);
      --surface:     #0a0a0a;
      --surface-2:   #111111;
      --surface-3:   #181818;
      --surface-4:   #222222;
      --border:      rgba(255,255,255,0.05);
      --border-md:   rgba(255,255,255,0.10);
      --border-hi:   rgba(255,255,255,0.18);
      --text-1: #f5f5f5;
      --text-2: #888;
      --text-3: #444;
      --red:    #f87171;
      --green:  #34d399;
      --amber:  #fbbf24;
      --pink:   #f472b6;
      --sky:    #60a5fa;
      --font-display: 'Syne', system-ui, sans-serif;
      --font-body:    'Manrope', system-ui, sans-serif;
    }

    .ap-root { font-family: var(--font-body); color: var(--text-1); }

    /* Glass card */
    .glass-card {
      background: rgba(255,255,255,0.02);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    /* Input */
    .ap-input {
      width: 100%;
      background: #000;
      border: 1px solid var(--border-md);
      border-radius: 16px;
      padding: 14px 18px;
      color: var(--text-1);
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 500;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .ap-input:focus {
      border-color: var(--indigo);
      box-shadow: 0 0 0 3px var(--indigo-glow);
    }
    .ap-input::placeholder { color: var(--text-3); font-weight: 400; }

    /* Range slider */
    .ap-range {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 3px;
      background: var(--border-md); border-radius: 2px;
      outline: none; cursor: pointer; margin-top: 2px;
    }
    .ap-range::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 16px; height: 16px; border-radius: 50%;
      background: var(--indigo-hi);
      box-shadow: 0 0 0 3px var(--indigo-dim);
      cursor: pointer; transition: transform .15s;
    }
    .ap-range:hover::-webkit-slider-thumb { transform: scale(1.25); }
    .ap-range::-moz-range-thumb {
      width: 16px; height: 16px; border-radius: 50%;
      background: var(--indigo-hi); border: none; cursor: pointer;
    }

    /* Tab underline */
    .ap-tab { position: relative; transition: color .2s; }
    .ap-tab::after {
      content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
      height: 2px; background: var(--indigo-hi);
      transform: scaleX(0); transform-origin: left;
      transition: transform .28s cubic-bezier(.4,0,.2,1);
    }
    .ap-tab.active { color: var(--indigo-hi) !important; }
    .ap-tab.active::after { transform: scaleX(1); }

    /* Animations */
    @keyframes ap-fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ap-fade-up { animation: ap-fadeUp .32s ease both; }

    @keyframes ap-barIn { from { width: 0%; } }
    .ap-bar { animation: ap-barIn .6s cubic-bezier(.4,0,.2,1) both; }

    @keyframes ap-pulse {
      0%,100% { opacity: 1; } 50% { opacity: .5; }
    }
    .ap-pulse { animation: ap-pulse 1.4s ease infinite; }

    /* Hover lift */
    .ap-lift { transition: transform .2s, box-shadow .2s; }
    .ap-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(0,0,0,.5); }

    /* Remove btn hover */
    .ap-remove:hover { border-color: var(--red) !important; color: var(--red) !important; }

    /* Metric accent top border */
    .ap-metric-accent { border-top: 2px solid var(--indigo) !important; }
  `}</style>
);

/* ─── Helpers ──────────────────────────────────────────────── */
const PHASES = [
  'Initializing neural link…',
  'Mapping spatial graph…',
  'Running TSP heuristic…',
  'Pruning suboptimal branches…',
  'Converging on optimal route…',
];
const LETTERS = 'ABCDEFGHIJKLMNOP';
const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');

/* ─── Animated number ──────────────────────────────────────── */
function AnimNum({ value }) {
  const [disp, setDisp] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const s = prev.current, e = value, dur = 420, t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
      setDisp(Math.round(s + (e - s) * ease));
      if (p < 1) requestAnimationFrame(tick); else prev.current = e;
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{inr(disp)}</>;
}

/* ─── Shared sub-components ────────────────────────────────── */
const SLabel = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>
    {children}
  </div>
);

const MetricBox = ({ label, value, accent }) => (
  <div
    className={`ap-lift${accent ? ' ap-metric-accent' : ''}`}
    style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px' }}
  >
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 700, color: accent ? 'var(--indigo-hi)' : 'var(--text-1)', fontFamily: 'var(--font-display)' }}>{value}</div>
  </div>
);

/* ─── Route Optimizer ──────────────────────────────────────── */
function RouteOptimizer() {
  const [origin, setOrigin] = useState('');
  const [wps, setWps] = useState(['', '', '']);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const optimize = useCallback(() => {
    const filled = wps.filter(w => w.trim());
    if (!origin.trim() || !filled.length) { alert('Enter an origin and at least one waypoint.'); return; }
    setRunning(true); setResult(null); setProgress(0); setPhase(PHASES[0]);
    let pct = 0, p = 0;
    const iv = setInterval(() => {
      pct += Math.random() * 5 + 2; if (pct > 100) pct = 100;
      setProgress(Math.round(pct));
      if (p < PHASES.length && pct > (p + 1) * 18) { p++; setPhase(PHASES[Math.min(p, PHASES.length - 1)]); }
      if (pct >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          const optimized = shuffle(filled);
          const stops = [origin.trim(), ...optimized];
          const perLeg = Math.floor(Math.random() * 80 + 40);
          let time = 8 * 60;
          const timeline = stops.map((s, i) => {
            const h = String(Math.floor(time / 60)).padStart(2, '0');
            const m = String(time % 60).padStart(2, '0');
            const item = { name: s, time: `${h}:${m}`, km: i > 0 ? perLeg : null, isOrigin: i === 0 };
            time += Math.floor(perLeg / 60 * 60 + 22);
            return item;
          });
          setResult({ stops: stops.length, totalKm: perLeg * filled.length, totalH: Math.round(perLeg * filled.length / 60 * 10) / 10, timeline });
          setRunning(false);
        }, 400);
      }
    }, 55);
  }, [origin, wps]);

  return (
    <div className="space-y-4">
      {/* Origin */}
      <div className="glass-card rounded-[2rem] bg-[#0a0a0a] border border-white/5 p-6">
        <SLabel>Point of Origin</SLabel>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--indigo-hi)', pointerEvents: 'none' }}>
            <MapPin size={14} />
          </span>
          <input className="ap-input" style={{ paddingLeft: 40 }} placeholder="Enter starting city or address…" value={origin} onChange={e => setOrigin(e.target.value)} />
        </div>
      </div>

      {/* Waypoints */}
      <div className="glass-card rounded-[2rem] bg-[#0a0a0a] border border-white/5 p-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <SLabel>Waypoints</SLabel>
          <button
            onClick={() => setWps(w => [...w, ''])}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 10, background: 'var(--indigo-dim)', color: 'var(--indigo-hi)', border: '1px solid rgba(99,102,241,.2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', letterSpacing: '0.04em' }}
          >
            <Plus size={12} /> Add Stop
          </button>
        </div>
        <div className="space-y-3">
          {wps.map((wp, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface-3)', border: '1px solid var(--border-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-2)', flexShrink: 0, fontFamily: 'var(--font-display)' }}>
                {LETTERS[i]}
              </div>
              <input className="ap-input" style={{ flex: 1, margin: 0 }} placeholder={`Destination ${LETTERS[i]}…`} value={wp} onChange={e => setWps(w => w.map((x, j) => j === i ? e.target.value : x))} />
              <button
                className="ap-remove"
                onClick={() => setWps(w => w.filter((_, j) => j !== i))}
                style={{ width: 34, height: 34, borderRadius: 10, background: 'transparent', border: '1px solid var(--border-md)', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'border-color .15s, color .15s' }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={optimize}
        disabled={running}
        className="w-full py-5 bg-indigo-600 text-white font-black uppercase rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-xl"
        style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.08em', opacity: running ? 0.6 : 1, cursor: running ? 'not-allowed' : 'pointer' }}
      >
        <Navigation size={16} />
        {running ? 'Processing…' : 'Optimize Neural Path'}
        <Play size={15} />
      </button>

      {/* Progress */}
      {running && (
        <div className="glass-card ap-fade-up rounded-[2rem] bg-[#0a0a0a] border border-white/5 p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text-2)', fontStyle: 'italic' }} className="ap-pulse">{phase}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--indigo-hi)', fontFamily: 'var(--font-display)' }}>{progress}%</div>
          </div>
          <div style={{ height: 4, background: 'var(--border-md)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, borderRadius: 2, background: 'linear-gradient(90deg,#6366f1,#818cf8)', transition: 'width .08s linear', boxShadow: '0 0 10px #6366f1' }} />
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {PHASES.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: progress > (i + 1) * 18 ? 'var(--indigo)' : 'var(--border-md)', transition: 'background .3s' }} />
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="ap-fade-up space-y-4">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            <MetricBox label="Stops"    value={result.stops}          accent />
            <MetricBox label="Distance" value={`${result.totalKm} km`} />
            <MetricBox label="Duration" value={`${result.totalH}h`}    />
          </div>

          <div className="glass-card ap-lift rounded-[2rem] bg-[#0a0a0a] border border-white/5 p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <SLabel>Optimized Timeline</SLabel>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20, background: 'var(--indigo-dim)', color: 'var(--indigo-hi)' }}>
                Neural route
              </span>
            </div>
            {result.timeline.map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.isOrigin ? '#6366f1' : 'var(--surface-3)', border: s.isOrigin ? 'none' : '1px solid var(--border-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: s.isOrigin ? '#fff' : 'var(--text-2)', boxShadow: s.isOrigin ? '0 0 14px rgba(99,102,241,.4)' : 'none', fontFamily: 'var(--font-display)' }}>
                      {s.isOrigin ? 'S' : i}
                    </div>
                    {i < result.timeline.length - 1 && <div style={{ width: 1, height: 28, background: 'linear-gradient(var(--border-md),transparent)', marginTop: 3 }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: i < result.timeline.length - 1 ? 8 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s.isOrigin ? 'Depart' : 'Arrive'} · {s.time}</div>
                      </div>
                      {s.km && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>{s.km} km</div>
                          <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>leg</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Budget Calculator ────────────────────────────────────── */
const DEFAULT_V = { dist: 500, fuel: 100, kmpl: 15, toll: 300, food: 600, stay: 1200, days: 3, misc: 500 };
const SLIDERS = [
  { key: 'dist', label: 'Distance',      unit: 'km',   min: 50,  max: 3000, step: 10  },
  { key: 'fuel', label: 'Fuel price',    unit: '₹/L',  min: 80,  max: 140,  step: 1   },
  { key: 'kmpl', label: 'Mileage',       unit: 'kmpl', min: 5,   max: 40,   step: 1   },
  { key: 'toll', label: 'Tolls',         unit: '₹',    min: 0,   max: 2000, step: 50  },
  { key: 'food', label: 'Food / day',    unit: '₹',    min: 200, max: 3000, step: 50  },
  { key: 'stay', label: 'Stay / night',  unit: '₹',    min: 500, max: 8000, step: 100 },
  { key: 'days', label: 'Trip days',     unit: 'days', min: 1,   max: 30,   step: 1   },
  { key: 'misc', label: 'Misc buffer',   unit: '₹',    min: 0,   max: 5000, step: 100 },
];
const BAR_COLORS = ['var(--indigo-hi)', 'var(--sky)', 'var(--green)', 'var(--pink)', 'var(--amber)'];

function BudgetCalculator() {
  const [v, setV] = useState(DEFAULT_V);
  const upd = (k, val) => setV(s => ({ ...s, [k]: +val }));

  const fuel  = Math.round((v.dist / v.kmpl) * v.fuel);
  const food  = Math.round(v.food * v.days);
  const stay  = Math.round(v.stay * Math.max(v.days - 1, 1));
  const total = fuel + v.toll + food + stay + v.misc;
  const liters = Math.round(v.dist / v.kmpl);
  const perKm  = (total / v.dist).toFixed(1);
  const fShare = Math.round((fuel / total) * 100);
  const perDay = Math.round(total / v.days);

  const breakdown = [
    { label: 'Fuel',          val: fuel,   pct: fuel / total  },
    { label: 'Tolls',         val: v.toll, pct: v.toll / total },
    { label: 'Food',          val: food,   pct: food / total  },
    { label: 'Accommodation', val: stay,   pct: stay / total  },
    { label: 'Misc buffer',   val: v.misc, pct: v.misc / total },
  ];

  return (
    <div className="space-y-4">
      {/* Hero total card */}
      <div
        className="ap-lift"
        style={{ background: 'linear-gradient(135deg,#0d0a24,#0a0a0a)', border: '1px solid rgba(99,102,241,.25)', borderRadius: 28, padding: '26px 28px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--indigo-hi)', marginBottom: 8, opacity: 0.7 }}>Total Mission Cost</div>
        <div style={{ fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-display)', color: '#fff', lineHeight: 1.05 }}>
          <AnimNum value={total} />
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg,rgba(99,102,241,.4),transparent)', margin: '18px 0' }} />
        <div style={{ display: 'flex', gap: 0 }}>
          {[{ l: 'Per Day', v: inr(perDay) }, { l: 'Per Km', v: `₹${perKm}` }, { l: 'Fuel Share', v: `${fShare}%` }].map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{m.l}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>{m.v}</div>
              </div>
              {i < 2 && <div style={{ width: 1, background: 'var(--border-md)', margin: '0 16px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="glass-card rounded-[2rem] bg-[#0a0a0a] border border-white/5 p-6">
        <SLabel>Mission Parameters</SLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
          {SLIDERS.map(({ key, label, unit, min, max, step }) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', fontFamily: 'var(--font-display)' }}>
                  {v[key].toLocaleString('en-IN')}
                  <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 2, fontFamily: 'var(--font-body)', fontWeight: 400 }}>{unit}</span>
                </span>
              </div>
              <input type="range" className="ap-range" min={min} max={max} step={step} value={v[key]} onChange={e => upd(key, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* Expense breakdown */}
      <div className="glass-card ap-lift rounded-[2rem] bg-[#0a0a0a] border border-white/5 p-6">
        <SLabel>Expense Forecast</SLabel>
        <div className="space-y-4">
          {breakdown.map(({ label, val, pct }, i) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: BAR_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{inr(val)}</span>
              </div>
              <div style={{ height: 3, background: 'var(--border-md)', borderRadius: 2, overflow: 'hidden' }}>
                <div className="ap-bar" style={{ height: '100%', width: `${Math.round(pct * 100)}%`, background: BAR_COLORS[i], borderRadius: 2, boxShadow: `0 0 6px ${BAR_COLORS[i]}80` }} />
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--border-md),transparent)', margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--indigo-hi)', fontFamily: 'var(--font-display)' }}>{inr(total)}</span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        <MetricBox label="Fuel Liters" value={`${liters}L`} accent />
        <MetricBox label="Cost / Km"   value={`₹${perKm}`} />
        <MetricBox label="Fuel Share"  value={`${fShare}%`} />
      </div>
    </div>
  );
}

/* ─── Root AIPlanner ───────────────────────────────────────── */
const AIPlanner = () => {
  const [tab, setTab] = useState('planner');

  return (
    <>
      <GlobalStyles />
      <div className="ap-root space-y-8" style={{ fontFamily: 'var(--font-body)' }}>
        {/* Header — matches original structure */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 24px rgba(99,102,241,.4)' }}>
            <Zap className="text-white" size={22} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#f5f5f5', lineHeight: 1 }}>
              AI Travel Planner
            </h2>
            <p style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
              Neural Route Optimizer &amp; Budget Forecaster
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-md)', marginBottom: 4 }}>
          {[
            { key: 'planner', label: 'Route Optimizer', icon: <Navigation size={13} /> },
            { key: 'budget',  label: 'Budget Calculator', icon: <DollarSign size={13} /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              className={`ap-tab${tab === key ? ' active' : ''}`}
              onClick={() => setTab(key)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'transparent', border: 'none', color: tab === key ? 'var(--indigo-hi)' : 'var(--text-3)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.03em' }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Active panel */}
        <div className="ap-fade-up" key={tab}>
          {tab === 'planner' ? <RouteOptimizer /> : <BudgetCalculator />}
        </div>
      </div>
    </>
  );
};

export default AIPlanner;