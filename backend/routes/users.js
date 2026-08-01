import { Router } from 'express';
import db from '../database.js';
import { generateToken, hashPassword, comparePassword, authMiddleware } from '../auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, platform, team_name } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password required' });
    }
    const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existing) {
      return res.status(409).json({ error: 'Username or email already taken' });
    }
    const hashed = await hashPassword(password);
    const result = db.prepare(
      'INSERT INTO users (username, email, password, platform, team_name) VALUES (?, ?, ?, ?, ?)'
    ).run(username, email, hashed, platform || null, team_name || null);

    const user = db.prepare('SELECT id, username, email, avatar, platform, team_name, wins, losses, draws FROM users WHERE id = ?').get(result.lastInsertRowid);

    db.prepare('INSERT OR IGNORE INTO leaderboard (user_id, points) VALUES (?, 0)').run(user.id);

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user);
    const { password: _, ...userData } = user;
    res.json({ user: userData, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare(
    'SELECT id, username, email, avatar, platform, team_name, bio, wins, losses, draws, created_at FROM users WHERE id = ?'
  ).get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

router.put('/me', authMiddleware, (req, res) => {
  try {
    const { avatar, platform, team_name, bio } = req.body;
    db.prepare('UPDATE users SET avatar = ?, platform = ?, team_name = ?, bio = ? WHERE id = ?')
      .run(avatar || null, platform || null, team_name || null, bio || '', req.user.id);
    const user = db.prepare(
      'SELECT id, username, email, avatar, platform, team_name, bio, wins, losses, draws, created_at FROM users WHERE id = ?'
    ).get(req.user.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile/:id', (req, res) => {
  const user = db.prepare(
    'SELECT id, username, avatar, platform, team_name, bio, wins, losses, draws, created_at FROM users WHERE id = ?'
  ).get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

export default router;