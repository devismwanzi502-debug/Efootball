import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/index';

export default function CreateTournament() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', format: 'knockout', max_participants: 16,
    prize: '', rules: '', start_date: '', end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.createTournament(form);
      navigate(`/tournaments/${data.tournament.id}`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <motion.div
        className="auth-card create-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Create Tournament</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="eFootball Champions League" />
            </div>
            <div className="form-group">
              <label>Format</label>
              <select name="format" value={form.format} onChange={handleChange}>
                <option value="knockout">Knockout</option>
                <option value="group-stage">Group Stage</option>
                <option value="league">League</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Tournament description..." rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Max Participants</label>
              <input type="number" name="max_participants" value={form.max_participants} onChange={handleChange} min={2} max={64} />
            </div>
            <div className="form-group">
              <label>Prize</label>
              <input type="text" name="prize" value={form.prize} onChange={handleChange} placeholder="e.g. 500 coins" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input type="datetime-local" name="start_date" value={form.start_date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="datetime-local" name="end_date" value={form.end_date} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Rules</label>
            <textarea name="rules" value={form.rules} onChange={handleChange} rows={3} placeholder="Tournament rules..." />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Tournament'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}