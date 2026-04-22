import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import NewGame from './pages/NewGame';
import Rules from './pages/RulesPage';
import PlayGame from './pages/PlayGame';

import JoinGame from './pages/JoinGame';
function App() {
  return (
    <Routes>
      {/* Startsidan */}
      <Route path="/" element={<HomePage />} />

      {/* newgame: receives the session ID from the homepage and displays it */}
      <Route path="/newgame/:sessionId" element={<NewGame />} />

      {/* Rules page */}
      <Route path="/rules" element={<Rules />} />

      {/* playgame with session ID */}
      <Route path="/game/:sessionId" element={<PlayGame />} />

      {/* JoinGame-sidan */}
      <Route path="/join" element={<JoinGame />} />
    </Routes>
  );
}

export default App;