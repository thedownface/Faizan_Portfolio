import { useCallback, useEffect, useRef, useState } from 'react';
import TunnelScroll from './TunnelScroll.jsx';
import Dossier from './Dossier.jsx';
import { HOLD_RANGES } from './tunnelScene.js';
import { PROFILE, ERAS } from './resume.js';

const phone = PROFILE.phone.replace(/[^\d+]/g, '');
const LINKS = [
  { label: 'RESUME', href: PROFILE.resume, download: true },
  { label: 'GITHUB', href: PROFILE.github, external: true },
  { label: 'LINKEDIN', href: PROFILE.linkedin, external: true },
  { label: 'EMAIL', href: 'mailto:' + PROFILE.email },
  { label: 'WHATSAPP', href: 'https://wa.me/' + phone.replace('+', ''), external: true },
  { label: 'PHONE', href: 'tel:' + phone },
  { label: 'INSTAGRAM', href: PROFILE.instagram, external: true },
];
const linkProps = (l) =>
  l.download ? { download: 'Faizan_Khan_Resume.pdf' } : l.external ? { target: '_blank', rel: 'noreferrer' } : {};

const [HOLD_FROM, HOLD_TO] = HOLD_RANGES[0];
const eraAt = (t) => ERAS.findIndex((e) => t >= e.from && t < e.to);

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [checkpoint, setCheckpoint] = useState(false);
  const [era, setEra] = useState(-1);
  const [dossierOpen, setDossierOpen] = useState(false);
  const fillRef = useRef(null);
  const hintRef = useRef(null);
  const endRef = useRef(null);
  const last = useRef({ checkpoint: false, era: -1 });

  // Runs every animation frame — DOM writes directly, React state only when a value flips.
  const onFrame = useCallback((p, t, dur) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
    if (hintRef.current) hintRef.current.style.opacity = p < 0.02 ? 1 : 0;
    if (endRef.current) endRef.current.style.transform = t > dur - 4 ? 'translateY(0)' : 'translateY(110%)';
    const cp = p >= HOLD_FROM - 0.002 && p <= HOLD_TO;
    if (cp !== last.current.checkpoint) setCheckpoint((last.current.checkpoint = cp));
    const e = p < 0.02 || cp ? -1 : eraAt(t);
    if (e !== last.current.era) setEra((last.current.era = e));
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = dossierOpen ? 'hidden' : '';
  }, [dossierOpen]);

  return (
    <div className="page">
      <TunnelScroll onFrame={onFrame} />

      <div ref={fillRef} className="progress" />
      <div ref={hintRef} className="hint">SCROLL TO DIG ↓</div>

      {ERAS.map((e, i) => (
        <div key={e.role} className={'era' + (i === era ? ' on' : '')} aria-hidden={i !== era}>
          <div className="era-when">{e.when}</div>
          <div className="era-role">{e.role}</div>
        </div>
      ))}

      <section className={'checkpoint' + (checkpoint ? ' on' : '')} aria-hidden={!checkpoint}>
        <div className="cp-kicker">CHECKPOINT · HALFWAY DOWN</div>
        <h2 className="cp-title">WHO'S DIGGING?</h2>
        <p className="cp-body">{PROFILE.summary}</p>
        <div className="cp-stats">
          {PROFILE.stats.map(([n, l]) => (
            <div key={l}>
              <strong>{n}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
        <div className="cp-actions">
          <a className="btn" href={PROFILE.github} target="_blank" rel="noreferrer" tabIndex={checkpoint ? 0 : -1}>
            GITHUB ↗
          </a>
          <a className="btn" href={PROFILE.resume} download="Faizan_Khan_Resume.pdf" tabIndex={checkpoint ? 0 : -1}>
            RESUME ↓
          </a>
          <button className="btn btn-ink" onClick={() => setDossierOpen(true)} tabIndex={checkpoint ? 0 : -1}>
            MORE ABOUT ME →
          </button>
        </div>
        <div className="cp-foot">KEEP SCROLLING TO DIG DEEPER ↓</div>
      </section>

      <div className="contact">
        <button className="contact-btn" onClick={() => setContactOpen((o) => !o)}>
          {contactOpen ? 'CLOSE  ×' : 'CONTACT  ↗'}
        </button>
        {contactOpen && (
          <div className="contact-menu">
            <button onClick={() => { setContactOpen(false); setDossierOpen(true); }}>
              <span>ABOUT ME</span>
              <span>→</span>
            </button>
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} {...linkProps(l)}>
                <span>{l.label}</span>
                <span>{l.download ? '↓' : '↗'}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div ref={endRef} className="end-bar">
        <div className="end-title">CONTACT · REACH OUT</div>
        <button onClick={() => setDossierOpen(true)}>ABOUT ME</button>
        {LINKS.map((l) => (
          <a key={l.label} href={l.href} {...linkProps(l)}>{l.label}</a>
        ))}
      </div>

      {dossierOpen && <Dossier onClose={() => setDossierOpen(false)} />}

      {/* Scroll length: ~14 viewports covers 14.4s–65.3s of timeline plus the checkpoint hold */}
      <div style={{ height: '1400vh' }} />
    </div>
  );
}
