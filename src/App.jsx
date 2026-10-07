import { useCallback, useRef, useState } from 'react';
import TunnelScroll from './TunnelScroll.jsx';

const PHONE = '+910000000000';
const INSTAGRAM = 'yourhandle';

const phone = PHONE.replace(/[^\d+]/g, '');
const LINKS = [
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/faizan-khan-a64443213', external: true },
  { label: 'WHATSAPP', href: 'https://wa.me/' + phone.replace('+', ''), external: true },
  { label: 'PHONE', href: 'tel:' + phone },
  { label: 'GITHUB', href: 'https://github.com/thedownface', external: true },
  { label: 'INSTAGRAM', href: 'https://instagram.com/' + INSTAGRAM, external: true },
];
const ext = (l) => (l.external ? { target: '_blank', rel: 'noreferrer' } : {});

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const fillRef = useRef(null);
  const hintRef = useRef(null);
  const endRef = useRef(null);

  // Runs every animation frame — write straight to the DOM, no React state.
  const onFrame = useCallback((p, t, dur) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
    if (hintRef.current) hintRef.current.style.opacity = p < 0.03 ? 1 : 0;
    if (endRef.current) endRef.current.style.transform = t > dur - 4 ? 'translateY(0)' : 'translateY(110%)';
  }, []);

  return (
    <div className="page">
      <TunnelScroll onFrame={onFrame} />

      <div ref={fillRef} className="progress" />
      <div ref={hintRef} className="hint">SCROLL TO DIG ↓</div>

      <div className="contact">
        <button className="contact-btn" onClick={() => setContactOpen((o) => !o)}>
          {contactOpen ? 'CLOSE  ×' : 'CONTACT  ↗'}
        </button>
        {contactOpen && (
          <div className="contact-menu">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} {...ext(l)}>
                <span>{l.label}</span>
                <span>↗</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div ref={endRef} className="end-bar">
        <div className="end-title">CONTACT · REACH OUT</div>
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} {...ext(l)}>{l.label}</a>
        ))}
      </div>

      {/* Scroll length: ~11.5 viewports maps to the 14.4s–61.5s stretch of the timeline */}
      <div style={{ height: '1150vh' }} />
    </div>
  );
}
