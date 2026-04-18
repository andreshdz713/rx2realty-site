// Home, Journal, About pages

const { useState: useStateH } = React;

function HomePage({ setRoute, setPostId }) {
  const { topics, posts, recentSessions, exam } = window.R2R_DATA;
  const featured = posts[0];
  const rest = posts.slice(1, 4);

  const maxSession = Math.max(...recentSessions);

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <img
                src={window.__resources ? window.__resources.portrait : 'images/portrait.jpg'}
                alt="Andres Hernandez"
                className="hero-portrait"
              />
              <div className="eyebrow" style={{ marginBottom: 24 }}>Compounding pharmacist · exploring real estate in Texas</div>
              <h1 className="hero-headline">
                Two careers,<br/>
                <em>one curious mind.</em>
              </h1>
              <p className="hero-sub">
                I'm a compounding pharmacist exploring real estate. This is my running journal and gathering place, for pharmacists curious about real estate, and for real estate folks curious about the people who build personalized medicine. Everything I'm learning, out in the open.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => setRoute('journal')}>Read the journal <Icon.arrow/></button>
                <button className="btn btn-ghost" onClick={() => setRoute('ask')}>Ask me anything</button>
              </div>
              <div className="hero-meta">
                <div><strong>{exam.streak}</strong>-day study streak</div>
              </div>
            </div>
            <CountdownCard/>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Live dashboard · updated hourly</div>
              <h2 className="section-title">Where I am in the <em>study grind</em></h2>
            </div>
            <p className="section-sub">Public accountability. If the numbers slip, it's on me, which is precisely the point.</p>
          </div>

          <div className="dashboard">
            <div className="stat-card">
              <div className="stat-label">Practice exam avg</div>
              <div className="stat-value">{exam.practiceAvg}<span className="stat-unit">%</span></div>
              <div className="stat-delta">▲ 6 pts last 2 weeks</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Study hours</div>
              <div className="stat-value">{exam.hoursCompleted}<span className="stat-unit">hrs</span></div>
              <div className="stat-bars">
                {recentSessions.map((v, i) => (
                  <div key={i} className={'stat-bar' + (v >= 6 ? ' active' : '')} style={{ height: (v / maxSession * 100) + '%' }}/>
                ))}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Passing threshold</div>
              <div className="stat-value">70<span className="stat-unit">% needed</span></div>
              <div className="stat-delta">▲ {exam.practiceAvg - 70} above target</div>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Topic mastery · Fast Track Realty School topics</div>
            <div className="topics">
              {topics.map(t => (
                <div key={t.name} className="topic-row">
                  <div className="topic-name">{t.name}</div>
                  <div className="topic-prog">
                    <div className="topic-prog-fill" style={{ width: t.pct + '%', background: t.pct >= 80 ? 'var(--sage)' : t.pct >= 50 ? 'var(--amber)' : 'var(--terracotta)' }}/>
                  </div>
                  <div className="topic-pct">{t.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journal preview */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Journal</div>
              <h2 className="section-title">Notes from the <em>in-between</em></h2>
            </div>
            <button className="section-link" onClick={() => setRoute('journal')}>All entries <Icon.arrow/></button>
          </div>

          <div className="posts-grid">
            <div className="post-card feature" onClick={() => { setPostId(featured.id); setRoute('post'); }}>
              {featured.heroImage
                ? <img src={featured.heroImage} alt={featured.title} className="post-thumb" style={{ aspectRatio: '16/9', objectFit: 'cover', width: '100%', display: 'block' }}/>
                : <div className="post-thumb sage">[ lead image · hero photo ]</div>
              }
              <div className="post-meta-row">
                <span className={'chip ' + (catChip[featured.category] || '')}>{featured.category}</span>
                <span className="sep">·</span>
                <span>{featured.date}</span>
                <span className="sep">·</span>
                <span>{featured.readTime}</span>
              </div>
              <h3 className="post-title">{featured.title}</h3>
              <p className="post-excerpt">{featured.excerpt}</p>
              <div className="post-foot">
                <span>Read essay</span>
                <Icon.arrow/>
              </div>
            </div>

            {rest.map(p => (
              <div key={p.id} className="post-card" onClick={() => { setPostId(p.id); setRoute('post'); }}>
                <div className="post-meta-row">
                  <span className={'chip ' + (catChip[p.category] || '')}>{p.category}</span>
                  <span className="sep">·</span>
                  <span>{p.readTime}</span>
                </div>
                <h3 className="post-title">{p.title}</h3>
                <p className="post-excerpt">{p.excerpt}</p>
                <div className="post-foot">
                  <span>{p.date}</span>
                  <Icon.arrow/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Community</div>
              <h2 className="section-title">Two crowds, <em>one room</em></h2>
            </div>
            <p className="section-sub">Pharmacists, real estate people, and everyone swapping lanes, asking and answering in the open.</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button className="btn btn-primary" onClick={() => setRoute('ask')}>Ask a question <Icon.arrow/></button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------- Journal list ----------
function JournalPage({ setRoute, setPostId }) {
  const basePosts = window.R2R_DATA.posts;
  const [userPosts, setUserPosts] = useStateH(() => {
    try { return JSON.parse(localStorage.getItem('r2r_user_posts') || '[]'); } catch { return []; }
  });
  const posts = [...userPosts, ...basePosts];
  const [filter, setFilter] = useStateH('All');
  const [showModal, setShowModal] = useStateH(false);
  const cats = ['All', 'Journal', 'Study Log', 'Bridge'];
  const shown = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  const addEntry = (entry) => {
    const next = [entry, ...userPosts];
    setUserPosts(next);
    localStorage.setItem('r2r_user_posts', JSON.stringify(next));
    window.R2R_DATA.posts = [...next, ...basePosts];
    setShowModal(false);
  };

  return (
    <main>
      <section className="hero" style={{ paddingBottom: 32 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Journal · {posts.length} entries</div>
              <h1 className="hero-headline" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>
                Essays, study logs,<br/>
                <em>and field notes.</em>
              </h1>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: 40 }}>+ New entry</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 32, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <button
                key={c}
                className={'chip' + (filter === c ? ' chip-sage' : '')}
                onClick={() => setFilter(c)}
                style={{ cursor: 'pointer' }}
              >{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'grid', gap: 16 }}>
            {shown.map(p => (
              <div key={p.id} className="post-card" onClick={() => { setPostId(p.id); setRoute('post'); }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 28, alignItems: 'center' }}>
                <div>
                  <div className="post-meta-row" style={{ marginBottom: 12 }}>
                    <span className={'chip ' + (catChip[p.category] || '')}>{p.category}</span>
                    <span className="sep">·</span>
                    <span>{p.date}</span>
                    <span className="sep">·</span>
                    <span>{p.readTime}</span>
                  </div>
                  <h3 className="post-title" style={{ fontSize: 26 }}>{p.title}</h3>
                  <p className="post-excerpt" style={{ marginTop: 10 }}>{p.excerpt}</p>
                </div>
                {p.heroImage
                  ? <img src={p.heroImage} alt={p.title} className="post-thumb" style={{ aspectRatio: '4/3', objectFit: 'cover', width: '100%', display: 'block' }}/>
                  : <div className={'post-thumb ' + (p.thumb === 'sage' ? 'sage' : p.thumb === 'terra' ? 'terra' : '')} style={{ aspectRatio: '4/3' }}>
                      [ image ]
                    </div>
                }
              </div>
            ))}
          </div>
        </div>
      </section>

      {showModal && <EntryModal onSave={addEntry} onClose={() => setShowModal(false)}/>}
    </main>
  );
}

// ---------- Single post ----------
function PostPage({ postId, setRoute }) {
  const { posts } = window.R2R_DATA;
  const post = posts.find(p => p.id === postId) || posts[0];
  const [liked, setLiked] = useStateH(false);

  return (
    <main>
      <div className="container-narrow" style={{ paddingTop: 40 }}>
        <button className="back-link" onClick={() => setRoute('journal')}>
          <Icon.back/> All entries
        </button>
        <div className="post-meta-row" style={{ marginBottom: 20 }}>
          <span className={'chip ' + (catChip[post.category] || '')}>{post.category}</span>
          <span className="sep">·</span>
          <span>{post.date}</span>
          <span className="sep">·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 28 }}>
          {post.title}
        </h1>
        {post.heroImage
          ? <img src={post.heroImage} alt={post.title} style={{ display: 'block', width: '100%', maxWidth: 560, margin: '0 auto 40px', borderRadius: 12 }}/>
          : <div className={'post-thumb ' + (post.thumb || '')} style={{ aspectRatio: '16/7', marginBottom: 40, borderRadius: 12 }}>
              [ hero image placeholder ]
            </div>
        }
        <div className="post-content" style={{ fontSize: 18, lineHeight: 1.75 }}>
          {post.body ? (
            post.body.map((block, i) => block.startsWith('<blockquote>')
              ? <blockquote key={i} dangerouslySetInnerHTML={{ __html: block.replace(/<\/?blockquote>/g, '') }}/>
              : <p key={i} dangerouslySetInnerHTML={{ __html: block }}/>
            )
          ) : (
            <>
              <p>{post.excerpt}</p>
              <p>This essay is a placeholder. When you drop in your real writing it will render with this typographic rhythm. The serif display type gives weight to the title; the body type is tuned for comfortable reading at long lengths.</p>
              <blockquote>I don't want to leave pharmacy. I want to expand the shape of my week.</blockquote>
              <p>Below the fold, you'd include any real content: anecdotes from shifts, study techniques, interview notes with brokers. Treat this like a letter to the version of you who's one month behind.</p>
              <p>Finally, a closing call. Maybe a question for readers, or an invitation to ask a follow-up. The goal is always to turn a solo monologue into a shared conversation.</p>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 4, marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
          <button className={'post-action' + (liked ? ' liked' : '')} onClick={() => setLiked(!liked)}>
            <Icon.heart filled={liked}/> {liked ? 'Liked' : 'Like'}
          </button>
          <button className="post-action" onClick={() => setRoute('ask')}><Icon.reply/> Ask a follow-up</button>
          <button className="post-action"><Icon.bookmark/> Save</button>
        </div>
      </div>
    </main>
  );
}

// ---------- About ----------
function AboutPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.2fr', gap: 64, alignItems: 'center' }}>
          <div className="about-portrait">
            <img src={window.__resources ? window.__resources.portrait : "assets/portrait.png"} alt="rx2realty" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', imageRendering: 'auto' }}/>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>About · written April 2026</div>
            <h1 className="about-h1">
              I build personalized<br/>
              <em>medicine by day.</em><br/>
              Now I'm studying real estate too.
            </h1>
            <div className="about-body">
              <p>
                I'm a compounding pharmacist formulating formulations, who works with GLP-1 therapies and other peptide therapies. The craft taught me to build things that actually fit the people using them.
              </p>
              <p>
                I'm not leaving pharmacy. I love the science, the patients, the work. But I'm exploring real estate alongside it, because I want to understand how value gets made outside the lab, and because the two skillsets compound in interesting ways.
              </p>
              <p>
                If you're a pharmacist wondering whether this is possible, or a real estate pro curious why someone from the pharmacy world would show up here, this site is for both of you. Pull up a chair.
              </p>
            </div>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">Earned PharmD</div>
                <div className="timeline-title">Pharmacy school in 2021</div>
                <div className="timeline-desc">Foundations in clinical practice and a growing interest in personalized therapies.</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">Post-PharmD</div>
                <div className="timeline-title">Retail Pharmacist </div>
                <div className="timeline-desc">Retail and dispensing roles: counseling patients, managing workflow, and learning the pace of community pharmacy.</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">Transition</div>
                <div className="timeline-title">Compounding Manager</div>
                <div className="timeline-desc">Moved from dispensing into compounding: leading the lab, building SOPs, and formulating patient-specific therapies.</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">Current</div>
                <div className="timeline-title">Director of Product Innovation/Compounding Pharmacist</div>
                <div className="timeline-desc">Formulating new formulations, patient-specific therapies, and providing education to physicians and patients.</div>
              </div>
              <div className="timeline-item terra">
                <div className="timeline-year">April 2026</div>
                <div className="timeline-title">Started Texas real estate course</div>
                <div className="timeline-desc">180 hours through an approved Texas provider.</div>
              </div>
              <div className="timeline-item terra">
                <div className="timeline-year">Jul 2026 · planned</div>
                <div className="timeline-title">Take the Texas real estate exam</div>
                <div className="timeline-desc">
</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { HomePage, JournalPage, PostPage, AboutPage });
