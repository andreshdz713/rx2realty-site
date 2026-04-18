// Shared components & utilities for Rx2Realty

const { useState, useEffect, useRef, useMemo } = React;

// ---------- Icons (inline, simple) ----------
const Icon = {
  arrow: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  back: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  heart: ({ size = 14, filled }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  reply: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
    </svg>
  ),
  bookmark: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  plus: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  pin: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2z"/>
    </svg>
  ),
  clock: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  sparkle: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z"/></svg>
  ),
};

// ---------- Brand mark ----------
function BrandMark() {
  return (
    <div className="brand">
      <svg className="brand-mark-svg" viewBox="0 0 64 64" width="36" height="36" aria-hidden="true">
        <rect x="2" y="2" width="60" height="60" rx="4" fill="#faf7f2" stroke="#1e332a" strokeWidth="1.5"/>
        <text x="12" y="38" fontFamily="'Cormorant Garamond', 'Newsreader', serif" fontSize="22" fontStyle="italic" fontWeight="500" fill="#1e332a">Rx</text>
        <path d="M28 34 Q 34 30 40 34" fill="none" stroke="#c76d4a" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="40,34 36,31 36,37" fill="#c76d4a"/>
        <text x="42" y="42" fontFamily="'Cormorant Garamond', 'Newsreader', serif" fontSize="18" fontStyle="italic" fontWeight="500" fill="#1e332a">re</text>
        <circle cx="54" cy="48" r="4" fill="#c76d4a"/>
      </svg>
      <div className="brand-name">rx<em>2</em>realty</div>
      <div className="brand-tagline">From Prescriptions to Properties</div>
    </div>
  );
}

// ---------- Nav ----------
function Nav({ route, setRoute }) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'journal', label: 'Journal' },
    { id: 'ask', label: 'Ask' },
    { id: 'about', label: 'About' },
  ];
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <button onClick={() => setRoute('home')}><BrandMark /></button>
        <div className="nav-links">
          {items.map(it => (
            <button
              key={it.id}
              className={'nav-link' + (route === it.id || (it.id === 'journal' && route === 'post') ? ' active' : '')}
              onClick={() => setRoute(it.id)}
            >{it.label}</button>
          ))}
          <button className="nav-cta" onClick={() => setRoute('ask')}>Ask me anything</button>
        </div>
      </div>
    </nav>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>© 2026 rx2realty · A running log from compounding lab to closing table.</div>
        <div className="footer-links">
          <a href="#">RSS</a>
          <a href="#">Newsletter</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}

// ---------- Countdown hook ----------
function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

// ---------- Countdown card ----------
function CountdownCard() {
  const { exam } = window.R2R_DATA;
  const { days, hours, minutes, seconds } = useCountdown(exam.date);
  const progress = Math.round((exam.hoursCompleted / exam.hoursRequired) * 100);

  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="countdown">
      <div className="countdown-head">
        <div className="countdown-title">Exam countdown</div>
        <div className="countdown-live"><span className="pulse"/> LIVE</div>
      </div>
      <div className="countdown-exam"><em>{exam.name.split(' ')[0]}</em> {exam.name.split(' ').slice(1).join(' ')}</div>
      <div className="countdown-date">{fmt(exam.date)} · 9:00 AM CT</div>

      <div className="countdown-digits">
        <div className="countdown-cell">
          <div className="countdown-num">{String(days).padStart(2,'0')}</div>
          <div className="countdown-lbl">days</div>
        </div>
        <div className="countdown-cell">
          <div className="countdown-num">{String(hours).padStart(2,'0')}</div>
          <div className="countdown-lbl">hrs</div>
        </div>
        <div className="countdown-cell">
          <div className="countdown-num">{String(minutes).padStart(2,'0')}</div>
          <div className="countdown-lbl">min</div>
        </div>
        <div className="countdown-cell">
          <div className="countdown-num">{String(seconds).padStart(2,'0')}</div>
          <div className="countdown-lbl">sec</div>
        </div>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: progress + '%' }}/>
      </div>
      <div className="countdown-stats">
        <div><strong>{exam.hoursCompleted}</strong>/{exam.hoursRequired} study hrs</div>
        <div><strong>{progress}%</strong> complete</div>
        <div><strong>{exam.streak}</strong>-day streak</div>
      </div>
    </div>
  );
}

// ---------- Avatar ----------
function Avatar({ n, size, name }) {
  const initial = (name || 'R').charAt(0).toUpperCase();
  return <div className={'avatar avatar-' + n + (size ? ' ' + size : '')}>{initial}</div>;
}

// ---------- Category color helper ----------
const catChip = {
  Journal: 'chip-sage',
  'Study Log': 'chip-terra',
  Bridge: 'chip-amber',
};

Object.assign(window, {
  Icon, BrandMark, Nav, Footer, CountdownCard, Avatar, useCountdown, catChip,
});
