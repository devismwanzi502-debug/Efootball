import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/index';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailParam = searchParams.get('email');
  
  const [email, setEmail] = useState(emailParam || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email || !code || !password) {
      setError('All fields are required');
      return;
    }
    if (code.length !== 6) {
      setError('Code must be 6 digits');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await api.resetPassword(email, code, password);
      setMessage('Password has been reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="auth-icon" initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
          🔢
        </motion.div>
        <h2>Enter Reset Code</h2>
        <p className="auth-subtitle">Check your email for the 6-digit code</p>
        
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
          <div className="form-group">
            <label>6-Digit Code</label>
            <input 
              type="text" 
              value={code} 
              onChange={handleCodeChange} 
              required 
              placeholder="000000"
              maxLength={6}
              style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', textAlign: 'center', fontFamily: 'monospace' }}
              autoComplete="one-time-code"
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <>
                <motion.div className="spinner" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
                Resetting...
              </>
            ) : 'Reset Password'}
          </button>
        </form>
        
        <p className="auth-switch">
          <Link to="/forgot-password">← Resend Code</Link>
        </p>
        <p className="auth-switch" style={{ marginTop: '8px' }}>
          <Link to="/login">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
}