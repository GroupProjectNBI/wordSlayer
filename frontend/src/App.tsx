import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NewGame from './pages/NewGame'
import JoinGame from './pages/JoinGame'
function App() {
  return (
    <Routes>
      {/* Startsidan */}
      <Route path="/" element={<HomePage />} />

      {/* Alfa-sidan (NewGame) */}
      <Route path="/newgame" element={<NewGame />} />
      {/* JoinGame-sidan */}
      <Route path="/join" element={<JoinGame />} />
    </Routes>
  )
}

export default App;