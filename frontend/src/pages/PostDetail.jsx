import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/index';
import { useAuth } from '../context/AuthContext';
import { FadeUp, Stagger, CardMotion } from '../components/Motion';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getPost(id).then(d => {
      setPost(d.post);
      setComments(d.comments);
      setLoading(false);
    }).catch(() => navigate('/forum'));
  }, [id]);

  const handleLike = async () => {
    try {
      await api.likePost(id);
      setPost({ ...post, likes: post.likes + 1 });
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const data = await api.commentPost(id, newComment.trim());
      setComments([...comments, data.comment]);
      setNewComment('');
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.deletePost(id);
      navigate('/forum');
    } catch {}
  };

  if (loading) return <div className="loading"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>⚽</motion.div></div>;
  if (!post) return null;

  return (
    <div className="page">
      <FadeUp>
        <article className="forum-post-full">
          <div className="post-full-header">
            <span className="badge badge-cat">{post.category}</span>
            <h1>{post.title}</h1>
            <div className="post-full-meta">
              <span className="post-author">
                <span className="avatar-sm">{post.username[0].toUpperCase()}</span>
                {post.username}
              </span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
              {user && user.id === post.user_id && (
                <button onClick={handleDelete} className="btn btn-sm btn-ghost">Delete</button>
              )}
            </div>
          </div>
          <div className="post-full-body">{post.content}</div>
          <div className="post-full-footer">
            <motion.button
              onClick={handleLike}
              className="btn btn-outline"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ❤️ {post.likes} Likes
            </motion.button>
          </div>
        </article>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div className="comments-section">
          <h2>Comments ({comments.length})</h2>
          <Stagger>
            {comments.map((c, i) => (
              <CardMotion key={c.id} index={i}>
                <div className="comment-card">
                  <div className="avatar">{c.username[0].toUpperCase()}</div>
                  <div className="comment-body">
                    <strong>{c.username}</strong>
                    <span className="comment-date">{new Date(c.created_at).toLocaleString()}</span>
                    <p>{c.content}</p>
                  </div>
                </div>
              </CardMotion>
            ))}
          </Stagger>
          {user ? (
            <form onSubmit={handleComment} className="comment-form">
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..." rows={3} required />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="empty-state">Login to leave a comment.</p>
          )}
        </div>
      </FadeUp>
    </div>
  );
}