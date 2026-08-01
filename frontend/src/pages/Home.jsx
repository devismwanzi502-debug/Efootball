import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/index';
import { Stagger, CardMotion, FadeUp, FadeLeft } from '../components/Motion';

export default function Home() {
  const [tourneys, setTourneys] = useState([]);
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    api.getTournaments({ status: 'upcoming' }).then(d => setTourneys(d.tournaments.slice(0, 3))).catch(() => {});
    api.getPosts({ limit: 5 }).then(d => setPosts(d.posts)).catch(() => {});
    api.getLeaderboard().then(d => setLeaderboard(d.leaderboard.slice(0, 5))).catch(() => {});
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <motion.div
          className="hero-bg"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5 }}
        />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Welcome to the <motion.span
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="gradient-text"
            >eFootball</motion.span> Community Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Compete in tournaments, track your stats, and connect with players worldwide.
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/tournaments" className="btn btn-primary btn-lg">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>View Tournaments</motion.span>
            </Link>
            <Link to="/forum" className="btn btn-outline btn-lg">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Join Discussion</motion.span>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-balls"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-ball"
              animate={{
                y: [0, -20 - i * 5, 0],
                x: [0, 10 + i * 3, 0, -(5 + i * 2), 0],
              }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.3 }}
            >
              ⚽
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="home-grid">
        <section className="home-section">
          <FadeLeft>
            <div className="section-header">
              <h2>Upcoming Tournaments</h2>
              <Link to="/tournaments">View All →</Link>
            </div>
          </FadeLeft>
          {tourneys.length === 0 ? (
            <div className="empty-state">No upcoming tournaments yet. Be the first to create one!</div>
          ) : (
            <Stagger className="card-list">
              {tourneys.map((t, i) => (
                <CardMotion key={t.id} index={i}>
                  <Link to={`/tournaments/${t.id}`} className="card tournament-card">
                    <span className={`badge badge-${t.status}`}>{t.status}</span>
                    <h3>{t.name}</h3>
                    <p>{t.description?.substring(0, 80)}{t.description?.length > 80 ? '...' : ''}</p>
                    <div className="card-meta">
                      <span>{new Date(t.start_date).toLocaleDateString()}</span>
                      <span>{t.format}</span>
                    </div>
                  </Link>
                </CardMotion>
              ))}
            </Stagger>
          )}
        </section>

        <section className="section">
          <FadeLeft>
            <div className="section-header">
              <h2>Top Players</h2>
              <Link to="/leaderboard">View All →</Link>
            </div>
          </FadeLeft>
          {leaderboard.length === 0 ? (
            <p className="empty-state">No players ranked yet.</p>
          ) : (
            <Stagger>
              <table className="table">
                <thead><tr><th>#</th><th>Player</th><th>Team</th><th>Points</th><th>W/L/D</th></tr></thead>
                <tbody>
                  {leaderboard.map((p, i) => (
                    <CardMotion key={p.user_id} index={i}>
                      <tr>
                        <td className="rank">#{p.rank}</td>
                        <td><Link to={`/profile/${p.user_id}`}>{p.username}</Link></td>
                        <td>{p.team_name || '-'}</td>
                        <td className="points">{p.points}</td>
                        <td>{p.wins}-{p.losses}-{p.draws}</td>
                      </tr>
                    </CardMotion>
                  ))}
                </tbody>
              </table>
            </Stagger>
          )}
        </section>

        <section className="section">
          <FadeLeft>
            <div className="section-header">
              <h2>Latest Discussions</h2>
              <Link to="/forum">View All →</Link>
            </div>
          </FadeLeft>
          {posts.length === 0 ? (
            <p className="empty-state">No posts yet. Start a discussion!</p>
          ) : (
            <Stagger className="post-list">
              {posts.map((p, i) => (
                <CardMotion key={p.id} index={i}>
                  <Link to={`/forum/${p.id}`} className="post-item">
                    <div className="post-category">
                      <span className="badge badge-cat">{p.category}</span>
                    </div>
                    <div className="post-info">
                      <h4>{p.title}</h4>
                      <div className="post-meta">
                        <span>by {p.username}</span>
                        <span>{new Date(p.created_at).toLocaleDateString()}</span>
                        <span>{p.likes} likes</span>
                      </div>
                    </div>
                  </Link>
                </CardMotion>
              ))}
            </Stagger>
          )}
        </section>
      </div>
    </div>
  );
}