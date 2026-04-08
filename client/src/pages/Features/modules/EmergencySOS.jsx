import { useState, useRef, useCallback, useEffect } from "react";

const HOSPITALS = [
  { name: 'City General Hospital',    type: 'Emergency & Trauma',   dist: '0.4 km', open: true,  eta: '3 min' },
  { name: 'St. Mercy Medical Centre', type: '24h Critical Care',    dist: '1.1 km', open: true,  eta: '7 min' },
  { name: 'North District Clinic',    type: 'Urgent Care',          dist: '2.3 km', open: true,  eta: '12 min' },
  { name: 'Sector 9 Polyclinic',      type: 'First Aid & Triage',   dist: '3.0 km', open: false, eta: '16 min' },
];

const EMERGENCY_CONTACTS = [
  { label: 'Police', num: '100' },
  { label: 'Ambulance', num: '108' },
  { label: 'Fire', num: '101' },
  { label: 'Women Helpline', num: '1091' },
];

const CIRC = 2 * Math.PI * 56;
const HOLD_MS = 3000;

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;900&display=swap');
  @keyframes sos-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.5)} 50%{box-shadow:0 0 0 18px rgba(239,68,68,0)} }
  @keyframes ring-ping { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.35);opacity:0} }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes blink-red { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes success-pop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
  .sos-btn:hover .sos-inner { background: #dc2626 !important; }
  .hospital-row:hover { background: rgba(239,68,68,0.06) !important; }
  .contact-pill:hover { background: rgba(239,68,68,0.12) !important; border-color: rgba(239,68,68,0.3) !important; }
`;
document.head.appendChild(style);

export default function SOSMatrixPage() {
  const [sosState, setSosState]   = useState('idle');
  const [progress, setProgress]   = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [time, setTime]           = useState(new Date());

  const holdActive = useRef(false);
  const holdStart  = useRef(null);
  const animRef    = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const startHold = useCallback((e) => {
    e.preventDefault();
    if (sosState === 'sent') return;
    holdActive.current = true;
    holdStart.current = Date.now();
    setSosState('holding');
    setCountdown(3);

    const tick = () => {
      if (!holdActive.current) return;
      const elapsed = Date.now() - holdStart.current;
      const pct = Math.min(elapsed / HOLD_MS, 1);
      setProgress(pct);
      setCountdown(Math.max(1, Math.ceil((1 - pct) * 3)));
      if (pct < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        holdActive.current = false;
        setSosState('sent');
        setCountdown(0);
      }
    };
    animRef.current = requestAnimationFrame(tick);
  }, [sosState]);

  const endHold = useCallback(() => {
    if (!holdActive.current) return;
    holdActive.current = false;
    cancelAnimationFrame(animRef.current);
    if (sosState !== 'sent') {
      setSosState('idle');
      setProgress(0);
      setCountdown(3);
    }
  }, [sosState]);

  const reset = () => { setSosState('idle'); setProgress(0); setCountdown(3); };

  useEffect(() => {
    window.addEventListener('mouseup', endHold);
    window.addEventListener('touchend', endHold);
    return () => { window.removeEventListener('mouseup', endHold); window.removeEventListener('touchend', endHold); };
  }, [endHold]);

  const strokeOffset = CIRC * (1 - progress);
  const isHolding = sosState === 'holding';
  const isSent = sosState === 'sent';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0101',
      fontFamily: "'Barlow Condensed', sans-serif",
      color: '#f1f5f9',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }} />

      {/* Alert ticker */}
      {isHolding && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
          background: '#ef4444', height: 36, display: 'flex', alignItems: 'center', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', animation: 'ticker 15s linear infinite', whiteSpace: 'nowrap', gap: 60 }}>
            {[...Array(8)].map((_, i) => (
              <span key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: '0.15em', color: '#fff' }}>
                ⚠ EMERGENCY UPLINK INITIATING ⚠ HOLD BUTTON TO CONFIRM ⚠ EMERGENCY UPLINK INITIATING ⚠ HOLD BUTTON TO CONFIRM &nbsp;&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto', padding: `${isHolding ? 56 : 24}px 20px 32px`, transition: 'padding 0.3s' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isSent ? '#22c55e' : '#ef4444',
                animation: isSent ? 'none' : 'blink-red 1s ease infinite',
              }} />
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: isSent ? '#22c55e' : '#ef4444', letterSpacing: '0.15em' }}>
                {isSent ? 'SIGNAL DISPATCHED' : 'SOS MATRIX // STANDBY'}
              </span>
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, letterSpacing: '0.04em', lineHeight: 0.9, color: '#f8fafc', margin: 0 }}>
              SOS<br />
              <span style={{ color: '#ef4444' }}>MATRIX</span>
            </h1>
          </div>
          <div style={{ textAlign: 'right', fontFamily: "'Share Tech Mono', monospace" }}>
            <div style={{ fontSize: 20, color: '#f8fafc' }}>
              {time.toLocaleTimeString('en-GB', { hour12: false })}
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 3, letterSpacing: '0.1em' }}>EMERGENCY RELAY</div>
            <div style={{ fontSize: 11, color: '#475569', letterSpacing: '0.1em' }}>NODE ACTIVE</div>
          </div>
        </div>

        {/* Quick Contacts */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {EMERGENCY_CONTACTS.map((c, i) => (
            <div key={i} className="contact-pill" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '8px 16px', background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, cursor: 'pointer',
              transition: 'all 0.15s', flex: '1 1 auto',
            }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 18, fontWeight: 700, color: '#ef4444' }}>{c.num}</span>
              <span style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* SOS Button Block */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: `1px solid ${isSent ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.12)'}`,
          borderRadius: 16, padding: '32px 20px', marginBottom: 20, textAlign: 'center',
          transition: 'border-color 0.3s',
        }}>

          {!isSent ? (
            <>
              <p style={{ fontSize: 13, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 28, fontFamily: "'Share Tech Mono', monospace" }}>
                {isHolding ? `BROADCASTING IN ${countdown}...` : 'PRESS & HOLD TO BROADCAST GPS'}
              </p>

              {/* Ring Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                <div style={{ position: 'relative', width: 160, height: 160 }}>
                  {/* Ping rings */}
                  {isHolding && [0, 0.3, 0.6].map((d, i) => (
                    <div key={i} style={{
                      position: 'absolute', inset: -10 - i * 8, borderRadius: '50%',
                      border: '1px solid rgba(239,68,68,0.3)',
                      animation: `ring-ping 1.5s ease-out ${d}s infinite`,
                      pointerEvents: 'none',
                    }} />
                  ))}

                  <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} viewBox="0 0 128 128" width="160" height="160">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="4" />
                    <circle
                      cx="64" cy="64" r="56" fill="none"
                      stroke="#ef4444" strokeWidth="5"
                      strokeDasharray={CIRC}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      style={{ transition: isHolding ? 'none' : 'stroke-dashoffset 0.3s ease' }}
                    />
                  </svg>

                  <div
                    className="sos-btn"
                    onMouseDown={startHold}
                    onTouchStart={startHold}
                    style={{
                      position: 'absolute', inset: 16, borderRadius: '50%',
                      background: 'transparent', cursor: 'pointer', userSelect: 'none',
                    }}
                  >
                    <div className="sos-inner" style={{
                      width: '100%', height: '100%', borderRadius: '50%',
                      background: isHolding ? '#991b1b' : '#ef4444',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 3, transition: 'background 0.15s',
                      animation: !isHolding ? 'sos-pulse 2s ease infinite' : 'none',
                    }}>
                      {isHolding ? (
                        <>
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#fff', letterSpacing: '0.08em', lineHeight: 1 }}>
                            {countdown}
                          </span>
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>SECONDS</span>
                        </>
                      ) : (
                        <>
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: '#fff', letterSpacing: '0.1em', lineHeight: 1 }}>SOS</span>
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>HOLD 3 SEC</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isHolding && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button onClick={endHold} style={{
                    fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '8px 24px', borderRadius: 8,
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#64748b', cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    ✕ Cancel
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ animation: 'success-pop 0.4s ease forwards' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.12)',
                  border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <path d="M8 18L15 25L28 11" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#22c55e', letterSpacing: '0.06em', marginBottom: 8 }}>
                SIGNAL BROADCASTED
              </div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#475569', marginBottom: 4 }}>
                GPS COORDINATES SENT TO DISPATCH
              </div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#22c55e', marginBottom: 20 }}>
                18.5204°N &nbsp;·&nbsp; 73.8567°E &nbsp;·&nbsp; ACC ±5m
              </div>
              <div style={{
                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 10, padding: '12px 18px', marginBottom: 20,
                fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#64748b',
                lineHeight: 1.7,
              }}>
                INCIDENT ID: EMG-{Math.floor(Math.random()*90000)+10000}<br />
                TIMESTAMP: {new Date().toISOString().replace('T',' ').slice(0,19)} UTC<br />
                RESPONSE ETA: ~3 MINUTES
              </div>
              <button onClick={reset} style={{
                fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '10px 28px', borderRadius: 8, background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', cursor: 'pointer',
              }}>Reset Uplink</button>
            </div>
          )}
        </div>

        {/* Nearest Hospitals */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 14, padding: '18px 20px',
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ef4444', letterSpacing: '0.15em', marginBottom: 14 }}>
            NEAREST EMERGENCY NODES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {HOSPITALS.map((h, i) => (
              <div key={i} className="hospital-row" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 14px', background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10,
                cursor: 'pointer', transition: 'background 0.15s',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: h.open ? 'rgba(239,68,68,0.12)' : 'rgba(100,116,139,0.1)',
                  border: `1px solid ${h.open ? 'rgba(239,68,68,0.25)' : 'rgba(100,116,139,0.15)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="6" y="2" width="2" height="10" rx="1" fill={h.open ? '#ef4444' : '#475569'} />
                    <rect x="2" y="6" width="10" height="2" rx="1" fill={h.open ? '#ef4444' : '#475569'} />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: h.open ? '#f8fafc' : '#475569' }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 1 }}>{h.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: h.open ? '#f59e0b' : '#334155' }}>{h.dist}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: h.open ? '#22c55e' : '#334155', marginTop: 2 }}>
                    {h.open ? `ETA ${h.eta}` : 'CLOSED'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#1e293b', letterSpacing: '0.1em' }}>
          SOS MATRIX v2.4 · EMERGENCY RELAY SYSTEM
        </div>
      </div>
    </div>
  );
}