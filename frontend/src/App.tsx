import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewGame from './pages/NewGame';
import PlayGame from './pages/PlayGame';

function App() {
  return (
    <Routes>
      {/* Startsidan */}
      <Route path="/" element={<HomePage />} />

      {/* newgame */}
      <Route path="/newgame" element={<NewGame />} />

      {/* playgame */}
      <Route path="/game" element={<PlayGame />} />
    </Routes>
  );
}

export default App;