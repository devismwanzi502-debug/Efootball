import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users.js';
import tournamentsRouter from './routes/tournaments.js';
import leaderboardRouter from './routes/leaderboard.js';
import postsRouter from './routes/posts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/tournaments', tournamentsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/posts', postsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (isProd) {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`eFootball Community API running on http://localhost:${PORT}`);
});