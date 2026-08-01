import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <motion.span
            className="logo-icon"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            ⚽
          </motion.span>
          eFootball Hub
        </Link>
        <div className="nav-links">
          <Link to="/tournaments" className={location.pathname.startsWith('/tournaments') ? 'active' : ''}>Tournaments</Link>
          <Link to="/leaderboard" className={location.pathname === '/leaderboard' ? 'active' : ''}>Leaderboard</Link>
          <Link to="/forum" className={location.pathname.startsWith('/forum') ? 'active' : ''}>Forum</Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-user">
                <span className="nav-avatar">{user.username[0].toUpperCase()}</span>
                {user.username}
              </Link>
              <button onClick={handleLogout} className="btn btn-sm btn-ghost">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}