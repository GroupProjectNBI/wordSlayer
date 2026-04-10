import { Routes, Route } from 'react-router-dom';;
import HomePage from './pages/HomePage';;
import NewGame from './pages/NewGame';
import Rules from './pages/RulesPage';
import PlayGame from './pages/PlayGame';

function App() {
  return (
    <Routes>
      {/* Startsidan */}
      <Route path="/" element={<HomePage />} />

      {/* newgame */}
      <Route path="/newgame" element={<NewGame />} />

      {/* Rules page */}
      <Route path="/rules" element={<Rules />} />

      {/* playgame */}
      <Route path="/game" element={<PlayGame />} />
    </Routes>
  );
}

export default App;