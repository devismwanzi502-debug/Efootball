import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/index';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setMessage('If the email exists, a reset code has been sent');
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="auth-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
          🔐
        </motion.div>
        <h2>Forgot Password</h2>
        <p className="auth-subtitle">Enter your email and we'll send you a 6-digit code</p>
        
        {error && <motion.div className="alert alert-error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}
        {message && <motion.div className="alert alert-success" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{message}</motion.div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <>
                <motion.div className="spinner" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
                Sending...
              </>
            ) : 'Send Reset Code'}
          </button>
        </form>
        
        <p className="auth-switch">
          <Link to="/login">← Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
}