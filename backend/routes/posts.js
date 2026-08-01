import { Router } from 'express';
import db from '../database.js';
import { authMiddleware, optionalAuth } from '../auth.js';

const router = Router();

router.get('/', (req, res) => {
  const { category, search, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let query = `SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id`;
  const params = [];
  const conditions = [];

  if (category) {
    conditions.push('p.category = ?');
    params.push(category);
  }
  if (search) {
    conditions.push('(p.title LIKE ? OR p.content LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const posts = db.prepare(query).all(...params);

  const countQuery = 'SELECT COUNT(*) as total FROM posts'
    + (conditions.length ? ' WHERE ' + conditions.join(' AND ') : '');
  const { total } = db.prepare(countQuery).get(...params.slice(0, -2));

  res.json({ posts, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
});

router.get('/:id', (req, res) => {
  const post = db.prepare(
    'SELECT p.*, u.username, u.avatar FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?'
  ).get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const comments = db.prepare(
    'SELECT c.*, u.username, u.avatar FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC'
  ).all(req.params.id);

  res.json({ post, comments });
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, content, category, image_url } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }
    const result = db.prepare(
      'INSERT INTO posts (user_id, title, content, category, image_url) VALUES (?, ?, ?, ?, ?)'
    ).run(req.user.id, title, content, category || 'general', image_url || null);
    res.status(201).json({ post: { id: result.lastInsertRowid, ...req.body } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/like', authMiddleware, (req, res) => {
  try {
    db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Liked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/comment', authMiddleware, (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content required' });
    const result = db.prepare('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)')
      .run(req.params.id, req.user.id, content);
    const comment = db.prepare(
      'SELECT c.*, u.username, u.avatar FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?'
    ).get(result.lastInsertRowid);
    res.status(201).json({ comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const post = db.prepare('SELECT * FROM posts WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!post) return res.status(403).json({ error: 'Not authorized' });
    db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;