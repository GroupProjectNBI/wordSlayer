import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewGame from './pages/NewGame';
import Rules from './pages/RulesPage';

function App() {
  return (
    <Routes>
      {/* Startsidan */}
      <Route path="/" element={<HomePage />} />

      {/* New game sidan */}
      <Route path="/newgame" element={<NewGame />} />

      {/* Rules page */}
      <Route path="/rules" element={<Rules />} />
    </Routes>
  );
}

export default App;