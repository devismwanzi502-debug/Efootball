import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/index';
import { useAuth } from '../context/AuthContext';
import { FadeUp, Stagger, CardMotion } from '../components/Motion';

export default function TournamentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const fetchData = async () => {
    try {
      const data = await api.getTournament(id);
      setTournament(data.tournament);
      setParticipants(data.participants);
      setMatches(data.matches);
    } catch {
      navigate('/tournaments');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.joinTournament(id);
      fetchData();
    } catch (e) {
      alert(e.message);
    }
    setJoining(false);
  };

  const handleLeave = async () => {
    try {
      await api.leaveTournament(id);
      fetchData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleStart = async () => {
    try {
      await api.startTournament(id);
      fetchData();
    } catch (e) {
      alert(e.message);
    }
  };

  const isParticipant = user && participants.some(p => p.user_id === user.id);

  if (loading) return <div className="loading"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>⚽</motion.div></div>;
  if (!tournament) return null;

  return (
    <div className="page">
      <FadeUp>
        <div className="tournament-hero">
          <div className="t-hero-content">
            <span className={`badge badge-${tournament.status}`}>{tournament.status}</span>
            <h1>{tournament.name}</h1>
            <p>{tournament.description}</p>
            <div className="tourney-meta-big">
              <span>📅 {new Date(tournament.start_date).toLocaleDateString()} - {tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : 'TBD'}</span>
              <span>🏟️ {tournament.format}</span>
              <span>👥 {participants.length}/{tournament.max_participants}</span>
              {tournament.prize && <span>🏆 {tournament.prize}</span>}
            </div>
            {tournament.rules && (
              <div className="rules-box">
                <h3>Rules</h3>
                <p>{tournament.rules}</p>
              </div>
            )}
            <div className="t-hero-actions">
              {tournament.status === 'upcoming' && user && (
                <>
                  {isParticipant ? (
                    <button onClick={handleLeave} className="btn btn-outline">Leave</button>
                  ) : (
                    <button onClick={handleJoin} disabled={joining} className="btn btn-primary">
                      {joining ? 'Joining...' : 'Join Tournament'}
                    </button>
                  )}
                  {tournament.created_by === user.id && participants.length >= 2 && (
                    <button onClick={handleStart} className="btn btn-primary">Start Tournament</button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </FadeUp>

      <div className="tournament-content">
        <FadeUp delay={0.2}>
          <div className="section-header">
            <h2>Participants ({participants.length})</h2>
          </div>
        </FadeUp>
        <Stagger className="participants-grid">
          {participants.map((p, i) => (
            <CardMotion key={p.id} index={i}>
              <Link to={`/profile/${p.user_id}`} className="participant-card">
                <div className="p-avatar">{p.username[0].toUpperCase()}</div>
                <div className="p-info">
                  <strong>{p.username}</strong>
                  {p.team_name && <span>{p.team_name}</span>}
                </div>
                <span className="p-seed">Seed #{p.seed || i + 1}</span>
              </Link>
            </CardMotion>
          ))}
        </Stagger>

        {matches.length > 0 && (
          <>
            <FadeUp delay={0.3}>
              <div className="section-header"><h2>Bracket</h2></div>
            </FadeUp>
            <Stagger>
              {matches.map((m, i) => (
                <CardMotion key={m.id} index={i}>
                  <div className="match-card">
                    <div className="match-team home">
                      <span>{m.home_username || 'TBD'}</span>
                      <span className="score">{m.status === 'completed' ? m.home_score : '-'}</span>
                    </div>
                    <div className="match-vs">
                      <span>Round {m.round}</span>
                      VS
                      <span className={`badge badge-${m.status}`}>{m.status}</span>
                    </div>
                    <div className="match-team away">
                      <span>{m.away_username || 'TBD'}</span>
                      <span className="score">{m.status === 'completed' ? m.away_score : '-'}</span>
                    </div>
                  </div>
                </CardMotion>
              ))}
            </Stagger>
          </>
        )}
      </div>
    </div>
  );
}