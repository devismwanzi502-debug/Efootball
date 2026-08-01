import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/index';
import { 
  FadeUp, Stagger, CardMotion, SlideLeft, ScaleIn, 
  BicycleKick, FloatingBall, MagneticButton, ParticleBurst, ScrollReveal
} from '../components/Motion';

export default function Home() {
  const [tourneys, setTourneys] = useState([]);
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showBurst, setShowBurst] = useState(false);

  useEffect(() => {
    api.getTournaments({ status: 'upcoming' }).then(d => setTourneys(d.tournaments.slice(0, 3))).catch(() => {});
    api.getPosts({ limit: 5 }).then(d => setPosts(d.posts)).catch(() => {});
    api.getLeaderboard().then(d => setLeaderboard(d.leaderboard.slice(0, 5))).catch(() => {});
  }, []);

  const handleBurst = (e) => {
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 1000);
  };

  return (
    <div className="home">
      <section className="hero">
        <motion.div
          className="hero-bg"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        
        <div className="hero-field">
          <motion.div
            className="field-lines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="center-circle" />
            <div className="penalty-box left" />
            <div className="penalty-box right" />
            <div className="goal-area left" />
            <div className="goal-area right" />
          </motion.div>
          
          <BicycleKick className="bicycle-kick" />
          
          {[...Array(6)].map((_, i) => (
            <FloatingBall key={i} delay={i * 0.5} size={1.5 + Math.random() * 1} />
          ))}
          
          <motion.div
            className="particle-field"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div className="hero-badge" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}>
            <span className="badge badge-primary">⚡ eFootball Community Hub</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Where <motion.span
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                rotateY: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="gradient-text"
            >Champions</motion.span> Are Made
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Compete in tournaments, climb the leaderboard, and connect with players worldwide.
          </motion.p>
          
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <MagneticButton asChild onClick={handleBurst}>
              <Link to="/tournaments" className="btn btn-primary btn-lg">
                <motion.span whileHover={{ x: 5 }} whileTap={{ x: -2 }}>Enter Arena →</motion.span>
              </Link>
            </MagneticButton>
            <Link to="/forum" className="btn btn-outline btn-lg">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Join Discussion</motion.span>
            </Link>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            <div className="stat">
              <motion.span className="stat-number" animate={{ count: 247 }} transition={{ duration: 2, delay: 1 }}>247</motion.span>
              <span className="stat-label">Active Players</span>
            </div>
            <div className="stat">
              <motion.span className="stat-number" animate={{ count: 89 }} transition={{ duration: 2, delay: 1.2 }}>89</motion.span>
              <span className="stat-label">Tournaments</span>
            </div>
            <div className="stat">
              <motion.span className="stat-number" animate={{ count: 1200 }} transition={{ duration: 2, delay: 1.4 }}>1.2K</motion.span>
              <span className="stat-label">Matches Played</span>
            </div>
          </motion.div>
        </motion.div>

        {showBurst && (
          <ParticleBurst 
            x="50%" 
            y="50%" 
            color="#22d3ee" 
            count={20}
          />
        )}
      </section>

      <div className="home-grid">
        <section className="home-section">
          <SlideLeft>
            <div className="section-header">
              <h2>🏆 Upcoming Tournaments</h2>
              <Link to="/tournaments">View All →</Link>
            </div>
          </SlideLeft>
          {tourneys.length === 0 ? (
            <ScaleIn>
              <div className="empty-state">
                <motion.div className="empty-icon" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>🏆</motion.div>
                <p>No upcoming tournaments yet. Be the first to create one!</p>
                <Link to="/tournaments/create" className="btn btn-primary">Create Tournament</Link>
              </div>
            </ScaleIn>
          ) : (
            <Stagger className="card-list">
              {tourneys.map((t, i) => (
                <CardMotion key={t.id} index={i}>
                  <Link to={`/tournaments/${t.id}`} className="card tournament-card">
                    <span className={`badge badge-${t.status}`}>{t.status}</span>
                    <h3>{t.name}</h3>
                    <p>{t.description?.substring(0, 80)}{t.description?.length > 80 ? '...' : ''}</p>
                    <div className="card-meta">
                      <span>📅 {new Date(t.start_date).toLocaleDateString()}</span>
                      <span>🏟️ {t.format}</span>
                      <span>👥 {t.max_participants} max</span>
                    </div>
                    {t.prize && <span className="card-prize">🏆 {t.prize}</span>}
                  </Link>
                </CardMotion>
              ))}
            </Stagger>
          )}
        </section>

        <section className="section">
          <SlideLeft>
            <div className="section-header">
              <h2>👑 Top Players</h2>
              <Link to="/leaderboard">View All →</Link>
            </div>
          </SlideLeft>
          {leaderboard.length === 0 ? (
            <div className="empty-state">No players ranked yet.</div>
          ) : (
            <Stagger>
              <div className="leaderboard-preview">
                {leaderboard.map((p, i) => (
                  <CardMotion key={p.user_id} index={i}>
                    <Link to={`/profile/${p.user_id}`} className="lb-preview-card">
                      <motion.div 
                        className={`lb-rank ${p.rank <= 3 ? 'top-3' : ''}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: i * 0.05 }}
                      >
                        {p.rank <= 3 ? ['', '🥇', '🥈', '🥉'][p.rank] : `#${p.rank}`}
                      </motion.div>
                      <motion.div 
                        className="lb-avatar"
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      >
                        {p.username[0].toUpperCase()}
                      </motion.div>
                      <div className="lb-info">
                        <strong>{p.username}</strong>
                        <span>{p.team_name || 'No team'}</span>
                      </div>
                      <motion.div
                        className="lb-points"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        {p.points} pts
                      </motion.div>
                    </Link>
                  </CardMotion>
                ))}
              </div>
            </Stagger>
          )}
        </section>

        <section className="section">
          <SlideLeft>
            <div className="section-header">
              <h2>💬 Latest Discussions</h2>
              <Link to="/forum">View All →</Link>
            </div>
          </SlideLeft>
          {posts.length === 0 ? (
            <div className="empty-state">No posts yet. Start a discussion!</div>
          ) : (
            <Stagger className="post-list">
              {posts.map((p, i) => (
                <CardMotion key={p.id} index={i}>
                  <Link to={`/forum/${p.id}`} className="post-item">
                    <motion.div 
                      className="post-category"
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="badge badge-cat">{p.category}</span>
                    </motion.div>
                    <div className="post-info">
                      <h4>{p.title}</h4>
                      <div className="post-meta">
                        <span>by {p.username}</span>
                        <span>{new Date(p.created_at).toLocaleDateString()}</span>
                        <motion.span 
                          className="likes"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                        >
                          ❤️ {p.likes}
                        </motion.span>
                      </div>
                    </div>
                    <motion.div 
                      className="post-arrow"
                      initial={{ x: -10 }}
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    >
                      →
                    </motion.div>
                  </Link>
                </CardMotion>
              ))}
            </Stagger>
          )}
        </section>
      </div>

      <ScrollReveal className="cta-section">
        <motion.div className="cta-card">
          <motion.h2 animate={{ letterSpacing: ['0px', '2px', '0px'] }} transition={{ duration: 3, repeat: Infinity }}>
            Ready to Compete?
          </motion.h2>
          <p>Join thousands of eFootball players in the ultimate community hub</p>
          <MagneticButton asChild>
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account →</Link>
          </MagneticButton>
        </motion.div>
      </ScrollReveal>
    </div>
  );
}