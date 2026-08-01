import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import CreateTournament from './pages/CreateTournament';
import Leaderboard from './pages/Leaderboard';
import Forum from './pages/Forum';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tournaments/create" element={<CreateTournament />} />
              <Route path="/tournaments/:id" element={<TournamentDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/new" element={<CreatePost />} />
              <Route path="/forum/:id" element={<PostDetail />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>© 2024 eFootball Hub. Not affiliated with Konami.</p>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}