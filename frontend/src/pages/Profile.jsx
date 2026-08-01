import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/index';
import { FadeUp } from '../components/Motion';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfile(id).then(d => {
      setProfile(d.user);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>⚽</motion.div></div>;
  if (!profile) return <div className="empty-state">User not found</div>;

  const total = profile.wins + profile.losses + profile.draws || 1;
  const winRate = ((profile.wins / total) * 100).toFixed(1);

  return (
    <div className="page">
      <FadeUp>
        <div className="profile-header">
          <div className="profile-avatar-big">
            <motion.div
              className="avatar-circle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {profile.username[0].toUpperCase()}
            </motion.div>
          </div>
          <h1>{profile.username}</h1>
          {profile.team_name && <p className="profile-team">{profile.team_name}</p>}
          {profile.platform && <span className="badge">{profile.platform}</span>}
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <p className="profile-date">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="profile-stats">
          <motion.div className="stat-card"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
            <span className="stat-val">{profile.wins}</span>
            <span className="stat-label">Wins</span>
          </motion.div>
          <motion.div className="stat-card"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}>
            <span className="stat-val">{profile.draws}</span>
            <span className="stat-label">Draws</span>
          </motion.div>
          <motion.div className="stat-card"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
            <span className="stat-val">{profile.losses}</span>
            <span className="stat-label">Losses</span>
          </motion.div>
          <motion.div className="stat-card"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}>
            <span className="stat-val">{winRate}%</span>
            <span className="stat-label">Win Rate</span>
          </motion.div>
        </div>
      </FadeUp>
    </div>
  );
}