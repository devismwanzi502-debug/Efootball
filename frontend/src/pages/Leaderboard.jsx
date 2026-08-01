import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/index';
import { FadeUp, Stagger, CardMotion } from '../components/Motion';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard().then(d => { setLeaderboard(d.leaderboard); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>⚽</motion.div></div>;

  return (
    <div className="page">
      <FadeUp>
        <div className="page-header">
          <h1>Leaderboard</h1>
          <p>Top 50 players ranked by performance points (3 per win, 1 per draw)</p>
        </div>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="leaderboard-list">
          <Stagger>
            {leaderboard.map((p, i) => (
              <CardMotion key={p.user_id} index={i}>
                <div className={`lb-card ${p.rank <= 3 ? `lb-top-${p.rank}` : ''}`}>
                  <div className="lb-rank">{p.rank <= 3 ? ['','🥇','🥈','🥉'][p.rank] : `#${p.rank}`}</div>
                  <div className="lb-avatar">{p.username[0].toUpperCase()}</div>
                  <div className="lb-info">
                    <strong><a href={`/profile/${p.user_id}`}>{p.username}</a></strong>
                    <span>{p.team_name || 'No team'}</span>
                  </div>
                  <div className="lb-stats">
                    <div className="lb-stat">
                      <span className="lb-stat-val">{p.wins}</span>
                      <span className="lb-stat-label">W</span>
                    </div>
                    <div className="lb-stat">
                      <span className="lb-stat-val">{p.draws}</span>
                      <span className="lb-stat-label">D</span>
                    </div>
                    <div className="lb-stat">
                      <span className="lb-stat-val">{p.losses}</span>
                      <span className="lb-stat-label">L</span>
                    </div>
                  </div>
                  <div className="lb-points">{p.points} pts</div>
                  {p.rank <= 3 && (
                    <motion.div
                      className="lb-glow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                    />
                  )}
                </div>
              </CardMotion>
            ))}
          </Stagger>
        </div>
      </FadeUp>
    </div>
  );
}