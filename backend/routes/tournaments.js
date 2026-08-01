import { Router } from 'express';
import db from '../database.js';
import { authMiddleware, optionalAuth } from '../auth.js';

const router = Router();

router.get('/', (req, res) => {
  const { status, search } = req.query;
  let query = 'SELECT t.*, u.username as creator_name FROM tournaments t LEFT JOIN users u ON t.created_by = u.id';
  const params = [];
  const conditions = [];

  if (status) {
    conditions.push('t.status = ?');
    params.push(status);
  }
  if (search) {
    conditions.push('t.name LIKE ?');
    params.push(`%${search}%`);
  }
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY t.start_date DESC';

  const tournaments = db.prepare(query).all(...params);
  res.json({ tournaments });
});

router.get('/:id', (req, res) => {
  const tournament = db.prepare(
    'SELECT t.*, u.username as creator_name FROM tournaments t LEFT JOIN users u ON t.created_by = u.id WHERE t.id = ?'
  ).get(req.params.id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  const participants = db.prepare(
    'SELECT tp.*, u.username, u.avatar, u.team_name FROM tournament_participants tp JOIN users u ON tp.user_id = u.id WHERE tp.tournament_id = ? ORDER BY tp.seed ASC'
  ).all(req.params.id);

  const matches = db.prepare(
    `SELECT m.*, h.username as home_username, a.username as away_username,
     h.team_name as home_team, a.team_name as away_team
     FROM matches m
     LEFT JOIN users h ON m.home_user_id = h.id
     LEFT JOIN users a ON m.away_user_id = a.id
     WHERE m.tournament_id = ? ORDER BY m.round ASC`
  ).all(req.params.id);

  res.json({ tournament, participants, matches });
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, description, format, max_participants, prize, rules, start_date, end_date } = req.body;
    if (!name || !start_date) {
      return res.status(400).json({ error: 'Name and start date required' });
    }
    const result = db.prepare(
      `INSERT INTO tournaments (name, description, format, max_participants, prize, rules, start_date, end_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(name, description || '', format || 'knockout', max_participants || 16, prize || '', rules || '', start_date, end_date || null, req.user.id);
    res.status(201).json({ tournament: { id: result.lastInsertRowid, ...req.body } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/join', authMiddleware, (req, res) => {
  try {
    const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (tournament.status !== 'upcoming') return res.status(400).json({ error: 'Tournament is not open for registration' });

    const count = db.prepare('SELECT COUNT(*) as c FROM tournament_participants WHERE tournament_id = ?').get(req.params.id);
    if (count.c >= tournament.max_participants) return res.status(400).json({ error: 'Tournament is full' });

    db.prepare('INSERT OR IGNORE INTO tournament_participants (tournament_id, user_id) VALUES (?, ?)').run(req.params.id, req.user.id);
    res.json({ message: 'Joined successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/leave', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM tournament_participants WHERE tournament_id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ message: 'Left tournament' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/start', authMiddleware, (req, res) => {
  try {
    const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ? AND created_by = ?').get(req.params.id, req.user.id);
    if (!tournament) return res.status(403).json({ error: 'Not authorized' });

    const participants = db.prepare('SELECT * FROM tournament_participants WHERE tournament_id = ? ORDER BY RANDOM()').all(req.params.id);

    db.prepare('UPDATE tournaments SET status = ? WHERE id = ?').run('active', req.params.id);

    for (let i = 0; i < participants.length; i += 2) {
      if (i + 1 < participants.length) {
        db.prepare('INSERT INTO matches (tournament_id, round, home_user_id, away_user_id) VALUES (?, 1, ?, ?)')
          .run(req.params.id, participants[i].user_id, participants[i + 1].user_id);
      }
    }

    res.json({ message: 'Tournament started' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;