# eFootball Community Hub

A full-stack gaming community platform for eFootball players with tournaments, leaderboards, and forums.

## Features

- **User Authentication** - Register/login with JWT tokens
- **Tournaments** - Create, join, and manage knockout tournaments with brackets
- **Leaderboard** - Player rankings with points (3 per win, 1 per draw)
- **Forum** - Community discussions with categories, likes, and comments
- **Profiles** - Player stats, win rates, and match history
- **Modern UI** - Framer Motion animations, dark theme, responsive design

## Tech Stack

- **Backend**: Node.js, Express, SQLite (better-sqlite3)
- **Frontend**: React 18, Vite, React Router, Framer Motion
- **Auth**: JWT with bcryptjs
- **Deployment**: Render (free tier)

## Local Development

### Prerequisites
- Node.js 18+

### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 (proxies API to :3001)
```

## Render Deployment

1. Push to GitHub
2. Connect repo to Render
3. Use `render.yaml` for service configuration
4. Deploy both services

### Environment Variables (Backend)
- `JWT_SECRET` - Auto-generated on Render
- `PORT` - 10000 (Render default)
- `NODE_ENV` - production

### Environment Variables (Frontend)
- `VITE_API_URL` - `https://your-api.onrender.com`

## API Endpoints

### Auth
- `POST /api/users/register` - Register
- `POST /api/users/login` - Login
- `GET /api/users/me` - Current user
- `PUT /api/users/me` - Update profile

### Tournaments
- `GET /api/tournaments` - List (filter: status, search)
- `GET /api/tournaments/:id` - Details with bracket
- `POST /api/tournaments` - Create (auth)
- `POST /api/tournaments/:id/join` - Join (auth)
- `POST /api/tournaments/:id/leave` - Leave (auth)
- `PUT /api/tournaments/:id/start` - Start (creator)

### Leaderboard
- `GET /api/leaderboard` - Top 50

### Posts/Forum
- `GET /api/posts` - List (filter: category, page, limit)
- `GET /api/posts/:id` - Post with comments
- `POST /api/posts` - Create (auth)
- `POST /api/posts/:id/like` - Like (auth)
- `POST /api/posts/:id/comment` - Comment (auth)
- `DELETE /api/posts/:id` - Delete (owner)

## License

MIT