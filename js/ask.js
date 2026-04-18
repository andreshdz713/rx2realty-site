// Ask (Q&A) page

const { useState: useStateA } = React;

function AskPage() {
  const { qa } = window.R2R_DATA;
  const [tab, setTab] = useStateA('all');
  const [expanded, setExpanded] = useStateA(null);
  const [draftQ, setDraftQ] = useStateA('');
  const [draftName, setDraftName] = useStateA('');

  const canSubmit = draftQ.trim() && draftName.trim();
  const submit = () => {
    if (!canSubmit) return;
    alert(`Question from ${draftName.trim()} queued! (demo)`);
    setDraftQ('');
    setDraftName('');
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'study', label: 'Study' },
    { id: 'licensing', label: 'Licensing' },
    { id: 'bridge', label: 'Pharmacy ↔ RE' },
    { id: 'career', label: 'Career' },
  ];
  const shown = tab === 'all' ? qa : qa.filter(q => q.topic === tab);

  return (
    <main>
      <section style={{ padding: '56px 0 40px', borderBottom: '1px solid var(--rule)' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 20 }}>Ask me anything</div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.025em', lineHeight: 1.05, maxWidth: '18ch' }}>
            Questions I get, <em style={{ fontStyle: 'italic', color: 'var(--terracotta)' }}>answered honestly.</em>
          </h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 20, maxWidth: '50ch', fontSize: 16 }}>
            Submit anything. About pharmacy, about the exam, about the pivot. I answer in public so other people in the same spot can find the answers too.
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 0 80px' }}>
        <div className="container-narrow">
          {qa.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center', marginBottom: 28 }}>
              <div className="qa-tabs" style={{ marginBottom: 0, flexWrap: 'wrap' }}>
                {tabs.map(t => (
                  <button key={t.id} className={'qa-tab' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>{t.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* Ask box */}
          <div className="composer" style={{ marginBottom: 32, marginTop: 0 }}>
            <div className="composer-head">
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--terracotta-soft)', display: 'grid', placeItems: 'center', color: '#8f4a2a', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14 }}>?</div>
              <div className="composer-label">Ask a new question</div>
            </div>
            <input
              type="text"
              value={draftName}
              onChange={e => setDraftName(e.target.value)}
              placeholder="Your name"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--rule-strong)',
                borderRadius: 8,
                fontFamily: 'inherit',
                fontSize: 14,
                background: 'var(--bg-card)',
                outline: 'none',
                marginBottom: 10,
              }}
            />
            <textarea
              value={draftQ}
              onChange={e => setDraftQ(e.target.value)}
              placeholder="e.g. How did you handle the financing math chapter?"
              style={{ minHeight: 60 }}
            />
            <div className="composer-foot">
              <div className="composer-hint">Answered in the order received · response within 48 hrs</div>
              <button className={'btn btn-sm ' + (canSubmit ? 'btn-terra' : 'btn-ghost')} disabled={!canSubmit} onClick={submit}>
                Submit <Icon.arrow/>
              </button>
            </div>
          </div>

          {qa.length === 0 ? (
            <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--ink-mute)' }}>
              No questions yet. Be the first to ask.
            </div>
          ) : shown.map((q, i) => {
            const isOpen = expanded === i;
            return (
              <div key={i} className="qa-card" onClick={() => setExpanded(isOpen ? null : i)}>
                <div className="qa-q">
                  <span className="qa-q-prefix">Q.</span>
                  <span>{q.q}</span>
                </div>
                {isOpen && (
                  <div className="qa-a">
                    <span className="qa-a-prefix">A.</span>
                    <span>{q.a}</span>
                  </div>
                )}
                <div className="qa-foot">
                  <span>asked by @{q.asker} · {q.answers} follow-ups</span>
                  <span>{isOpen ? 'collapse' : '+ expand answer'} · ♥ {q.likes}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { AskPage });
