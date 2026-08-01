import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/index';
import { FadeUp, Stagger, CardMotion } from '../components/Motion';

const CATEGORIES = ['all', 'general', 'guide', 'highlights', 'transfer', 'esports'];

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (category !== 'all') params.category = category;
    api.getPosts(params).then(d => {
      setPosts(d.posts);
      setTotalPages(d.totalPages);
      setLoading(false);
    });
  };

  useEffect(() => { setPage(1); }, [category]);
  useEffect(() => { fetchPosts(); }, [category, page]);

  return (
    <div className="page">
      <FadeUp>
        <div className="page-header">
          <h1>Forum</h1>
          <Link to="/forum/new" className="btn btn-primary">New Post</Link>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="filter-tabs">
          {CATEGORIES.map(c => (
            <button key={c} className={`tab ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </FadeUp>

      {loading ? (
        <div className="loading"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>⚽</motion.div></div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts in this category yet.</p>
          <Link to="/forum/new" className="btn btn-primary">Create Post</Link>
        </div>
      ) : (
        <>
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
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-sm">Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn btn-sm">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}