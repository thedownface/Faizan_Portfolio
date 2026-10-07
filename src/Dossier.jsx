import { useEffect } from 'react';
import { PROFILE, EXPERIENCE, SKILLS, HONORS } from './resume.js';

// Full "more about me" sheet, opened from the checkpoint, contact menu or end bar.
export default function Dossier({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="dossier-backdrop" onClick={onClose}>
      <article className="dossier" role="dialog" aria-modal="true" aria-label="About Faizan Khan" onClick={(e) => e.stopPropagation()}>
        <button className="dossier-close" onClick={onClose} autoFocus>CLOSE ×</button>
        <div className="cp-kicker">THE DIGGER · FIELD NOTES</div>
        <h2 className="dossier-name">FAIZAN KHAN</h2>
        <div className="dossier-title">{PROFILE.title} · {PROFILE.focus}</div>
        <p className="dossier-summary">
          {PROFILE.summary} Built a CDC streaming platform that took financial risk data from 15–25 minute latency to
          near real-time, and now builds ontology-driven knowledge graphs on Stardog with MCP serving layers.
        </p>
        <div className="cp-actions">
          <a className="btn btn-ink" href={PROFILE.resume} download="Faizan_Khan_Resume.pdf">RESUME ↓</a>
          <a className="btn" href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
          <a className="btn" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a>
          <a className="btn" href={'mailto:' + PROFILE.email}>EMAIL ↗</a>
        </div>

        <h3 className="dossier-h">EXPERIENCE</h3>
        {EXPERIENCE.map((x) => (
          <section key={x.when} className="dossier-job">
            <div className="dossier-job-head">
              <strong>{x.role}</strong> <span>— {x.org}</span>
              <em>{x.when}</em>
            </div>
            <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>
        ))}

        <h3 className="dossier-h">TOOLS IN HAND</h3>
        <dl className="dossier-skills">
          {SKILLS.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>

        <h3 className="dossier-h">CERTIFICATIONS, AWARDS, EDUCATION</h3>
        <ul>{HONORS.map((h) => <li key={h}>{h}</li>)}</ul>
      </article>
    </div>
  );
}
