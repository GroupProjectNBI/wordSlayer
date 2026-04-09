import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NewGame from './pages/NewGame'
function App() {
  return (
    <Routes>
      {/* Startsidan */}
      <Route path="/" element={<HomePage />} />

      {/* Alfa-sidan (NewGame) */}
      <Route path="/newgame" element={<NewGame />} />
    </Routes>
  )
}

export default App;