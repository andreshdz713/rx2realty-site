// Forum + Q&A pages

const { useState: useStateF } = React;

function ForumPage({ setRoute, setThreadId }) {
  const { categories, threads } = window.R2R_DATA;
  const [activeCat, setActiveCat] = useStateF('all');
  const [search, setSearch] = useStateF('');

  const filtered = threads.filter(t =>
    (activeCat === 'all' || t.category === activeCat) &&
    (search === '' || t.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main>
      <section style={{ padding: '56px 0 32px', borderBottom: '1px solid var(--rule)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Forum · {threads.length === 0 ? 'open for the first question' : `${filtered.length} of ${threads.length} threads shown`}</div>
              <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.025em', lineHeight: 1.05 }}>
                The <em style={{ fontStyle: 'italic', color: 'var(--terracotta)' }}>back room</em>.
              </h1>
              <p style={{ color: 'var(--ink-soft)', marginTop: 16, maxWidth: '50ch', fontSize: 16 }}>
                Ask questions, share study tips, swap career stories. Pharmacists and real-estate folks welcome — especially the ones with a foot in both.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search threads..."
                style={{
                  padding: '10px 14px',
                  border: '1px solid var(--rule-strong)',
                  borderRadius: 8,
                  fontFamily: 'inherit',
                  fontSize: 14,
                  background: 'var(--bg-card)',
                  width: 260,
                  outline: 'none',
                }}
              />
              <button className="btn btn-primary"><Icon.plus/> New thread</button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div className="forum-layout">
            <aside>
              <div className="forum-sidebar-head">Categories</div>
              {categories.map(c => (
                <button
                  key={c.id}
                  className={'forum-cat' + (activeCat === c.id ? ' active' : '')}
                  onClick={() => setActiveCat(c.id)}
                >
                  <span>{c.name}</span>
                  <span className="forum-cat-count">{c.count}</span>
                </button>
              ))}
              <div className="forum-sidebar-head" style={{ marginTop: 20 }}>Filters</div>
              <button className="forum-cat"><span>Unanswered</span><span className="forum-cat-count">17</span></button>
              <button className="forum-cat"><span>Your subscriptions</span><span className="forum-cat-count">3</span></button>
            </aside>

            <div>
              {filtered.length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-mute)' }}>
                  {threads.length === 0
                    ? 'No threads yet. Start the first one with the button above.'
                    : 'No threads match that search.'}
                </div>
              )}
              {filtered.map(t => (
                <div key={t.id} className="thread-row" onClick={() => { setThreadId(t.id); setRoute('thread'); }}>
                  <Avatar n={t.avatar} name={t.author}/>
                  <div>
                    <div className="thread-title" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {t.pinned && <span className="chip chip-terra" style={{ padding: '2px 8px', fontSize: 10 }}><Icon.pin size={10}/> Pinned</span>}
                      {t.title}
                    </div>
                    <div className="thread-meta">
                      <span className="author">@{t.author}</span>
                      <span>·</span><span>{t.role}</span>
                      <span>·</span>
                      <span className="chip" style={{ padding: '2px 8px', fontSize: 10 }}>{categories.find(c => c.id === t.category)?.name || t.category}</span>
                    </div>
                  </div>
                  <div className="thread-stat">
                    <div className="thread-stat-num">{t.replies}</div>
                    <div className="thread-stat-lbl">replies</div>
                  </div>
                  <div className="thread-last">
                    <Icon.clock size={11}/> {t.lastActivity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------- Thread detail ----------
function ThreadPage({ setRoute }) {
  const td = window.R2R_DATA.threadDetail;
  const [replies, setReplies] = useStateF(td ? td.replies : []);
  const [draft, setDraft] = useStateF('');
  const [likes, setLikes] = useStateF({});

  if (!td) {
    return (
      <main>
        <div className="container-narrow" style={{ padding: '80px 0', textAlign: 'center' }}>
          <button className="back-link" onClick={() => setRoute('forum')}>
            <Icon.back/> Back to forum
          </button>
          <p style={{ marginTop: 24, color: 'var(--ink-mute)' }}>No thread selected.</p>
        </div>
      </main>
    );
  }

  const toggleLike = (key, baseline) => {
    setLikes(prev => {
      const cur = prev[key];
      if (cur === undefined) return { ...prev, [key]: baseline + 1 };
      return { ...prev, [key]: cur === baseline + 1 ? baseline : baseline + 1 };
    });
  };

  const post = () => {
    if (!draft.trim()) return;
    const html = draft.split('\n').filter(Boolean).map(p => p);
    setReplies([...replies, {
      author: 'you',
      role: 'Guest · just now',
      avatar: 6,
      time: 'just now',
      content: html,
      likes: 0,
    }]);
    setDraft('');
  };

  const renderContent = (content) => content.map((block, i) => {
    if (block.startsWith('<blockquote>')) {
      return <blockquote key={i} dangerouslySetInnerHTML={{ __html: block.replace(/<\/?blockquote>/g, '') }}/>;
    }
    return <p key={i} dangerouslySetInnerHTML={{ __html: block }}/>;
  });

  const PostBlock = ({ p, isOp, idx }) => {
    const key = isOp ? 'op' : 'r' + idx;
    const baselineLikes = p.likes;
    const currentLikes = likes[key] !== undefined ? likes[key] : baselineLikes;
    const liked = currentLikes > baselineLikes;

    return (
      <div className={'post-body' + (isOp ? ' op' : '')}>
        <div className="post-head">
          <Avatar n={p.avatar} name={p.author}/>
          <div>
            <div className="post-author">@{p.author} {isOp && <span className="chip chip-sage" style={{ padding: '1px 8px', fontSize: 10, marginLeft: 4 }}>OP</span>}</div>
            <div className="post-role">{p.role}</div>
          </div>
          <div className="post-time">{p.time}</div>
        </div>
        <div className="post-content">{renderContent(p.content)}</div>
        <div className="post-actions">
          <button className={'post-action' + (liked ? ' liked' : '')} onClick={() => toggleLike(key, baselineLikes)}>
            <Icon.heart filled={liked}/> {currentLikes}
          </button>
          <button className="post-action"><Icon.reply/> Reply</button>
          <button className="post-action"><Icon.bookmark/> Save</button>
        </div>
      </div>
    );
  };

  return (
    <main>
      <div className="container-narrow thread-detail-head">
        <button className="back-link" onClick={() => setRoute('forum')}>
          <Icon.back/> Back to forum
        </button>
        <div className="post-meta-row" style={{ marginBottom: 14 }}>
          <span className="chip chip-sage">{td.category}</span>
          <span className="sep">·</span>
          <span>{replies.length + 1} posts</span>
        </div>
        <h1 className="thread-detail-title">{td.title}</h1>
      </div>

      <div className="container-narrow" style={{ paddingBottom: 60 }}>
        <PostBlock p={td.op} isOp={true}/>
        {replies.map((r, i) => <PostBlock key={i} p={r} isOp={false} idx={i}/>)}

        <div className="composer">
          <div className="composer-head">
            <Avatar n={6} name="you" size="sm"/>
            <div className="composer-label">Reply as guest</div>
          </div>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Share your experience, ask a follow-up, or add nuance..."
          />
          <div className="composer-foot">
            <div className="composer-hint">Markdown supported · Be kind · No medical advice</div>
            <button className={'btn btn-sm ' + (draft.trim() ? 'btn-primary' : 'btn-ghost')} onClick={post} disabled={!draft.trim()}>
              Post reply <Icon.arrow/>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ---------- Q&A ----------
function AskPage() {
  const { qa } = window.R2R_DATA;
  const [tab, setTab] = useStateF('all');
  const [expanded, setExpanded] = useStateF(null);
  const [draftQ, setDraftQ] = useStateF('');

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
          <div className="eyebrow" style={{ marginBottom: 20 }}>Ask me anything · 89 questions answered</div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.025em', lineHeight: 1.05, maxWidth: '18ch' }}>
            Questions I get, <em style={{ fontStyle: 'italic', color: 'var(--terracotta)' }}>answered honestly.</em>
          </h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 20, maxWidth: '50ch', fontSize: 16 }}>
            Submit anything — about pharmacy, about the exam, about the pivot. I answer in public so other people in the same spot can find the answers too.
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 0 80px' }}>
        <div className="container-narrow">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center', marginBottom: 28 }}>
            <div className="qa-tabs" style={{ marginBottom: 0, flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button key={t.id} className={'qa-tab' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Ask box */}
          <div className="composer" style={{ marginBottom: 32, marginTop: 0 }}>
            <div className="composer-head">
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--terracotta-soft)', display: 'grid', placeItems: 'center', color: '#8f4a2a', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14 }}>?</div>
              <div className="composer-label">Ask a new question</div>
            </div>
            <textarea
              value={draftQ}
              onChange={e => setDraftQ(e.target.value)}
              placeholder="e.g. How did you handle the financing math chapter?"
              style={{ minHeight: 60 }}
            />
            <div className="composer-foot">
              <div className="composer-hint">Answered in the order received · response within 48 hrs</div>
              <button className={'btn btn-sm ' + (draftQ.trim() ? 'btn-terra' : 'btn-ghost')} disabled={!draftQ.trim()} onClick={() => { if (draftQ.trim()) { alert('Question queued! (demo)'); setDraftQ(''); }}}>
                Submit <Icon.arrow/>
              </button>
            </div>
          </div>

          {shown.map((q, i) => {
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
                  <span>{isOpen ? '— collapse' : '+ expand answer'} · ♥ {q.likes}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { ForumPage, ThreadPage, AskPage });
