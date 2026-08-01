import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/index';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (search) params.search = search;
      const data = await api.getTournaments(params);
      setTournaments(data.tournaments);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tournaments</h1>
        <Link to="/tournaments/create" className="btn btn-primary">Create Tournament</Link>
      </div>

      <div className="filters">
        <form onSubmit={handleSearch} className="search-form">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tournaments..." />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div className="filter-tabs">
          {['all', 'upcoming', 'active', 'completed'].map(s => (
            <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : tournaments.length === 0 ? (
        <div className="empty-state">
          <p>No tournaments found.</p>
          <Link to="/tournaments/create" className="btn btn-primary">Create One</Link>
        </div>
      ) : (
        <div className="card-grid">
          {tournaments.map(t => (
            <Link key={t.id} to={`/tournaments/${t.id}`} className="card tournament-card">
              <span className={`badge badge-${t.status}`}>{t.status}</span>
              <h3>{t.name}</h3>
              <p>{t.description?.substring(0, 100)}{t.description?.length > 100 ? '...' : ''}</p>
              <div className="card-meta">
                <span>{new Date(t.start_date).toLocaleDateString()}</span>
                <span>{t.format}</span>
                <span>Max: {t.max_participants}</span>
              </div>
              {t.creator_name && <span className="creator">by {t.creator_name}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}