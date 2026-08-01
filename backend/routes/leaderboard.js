import { Router } from 'express';
import db from '../database.js';

const router = Router();

router.get('/', (req, res) => {
  const leaderboard = db.prepare(
    `SELECT l.*, u.username, u.avatar, u.team_name, u.wins, u.losses, u.draws
     FROM leaderboard l
     JOIN users u ON l.user_id = u.id
     ORDER BY l.points DESC
     LIMIT 50`
  ).all();

  let rank = 1;
  const ranked = leaderboard.map((entry, i) => {
    if (i > 0 && entry.points < leaderboard[i - 1].points) rank = i + 1;
    return { ...entry, rank };
  });

  res.json({ leaderboard: ranked });
});

router.post('/update', (req, res) => {
  try {
    const users = db.prepare('SELECT id, wins, losses, draws FROM users').all();
    const updateStmt = db.prepare(
      'INSERT INTO leaderboard (user_id, points) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET points = ?, updated_at = CURRENT_TIMESTAMP'
    );

    const tx = db.transaction(() => {
      for (const u of users) {
        const points = u.wins * 3 + u.draws * 1;
        updateStmt.run(u.id, points, points);
      }
    });
    tx();

    res.json({ message: 'Leaderboard updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;