import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSound } from "../hooks/useSound";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // TEST MODE CHECK (ingen musik i test)
  const isTest =
    typeof window !== "undefined" &&
    window.location.search.includes("test");

  // LOAD HOME MUSIC (no loop)
  const homeMusic = useSound("/sounds/Welcome.mp3");

  // PLAY ONLY WHEN USER CLICKS SPECIFIC BUTTONS
  function playWelcome() {
    if (isTest) return;
    homeMusic.stop();        // säkerställ att den startar från början
    homeMusic.play();
  }

  // RULES BUTTON — spelar musik + navigerar
  function handleRulesClick() {
    playWelcome();
    navigate('/rules');
  }

  // NEW GAME
  async function handleCreateNewGame() {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/newGame', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Could not create game session');
      }

      const data = await response.json();
      navigate(`/newgame/${data.sessionId}`);
    } catch (err) {
      console.error(err);
      setError('Det gick inte att skapa nytt spel. Försök igen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-md px-4 text-center">
        <h1 className="mb-10 text-5xl font-extrabold uppercase tracking-widest">
          Word Slayer
        </h1>

        {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

        <div className="flex flex-col gap-4">
          <button
            onClick={handleCreateNewGame}
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Skapar nytt spel...' : 'New game'}
          </button>

          <button
            id="btn-join-game"
            onClick={() => navigate('/join')}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
          >
            Join Game
          </button>

          <button
            onClick={handleRulesClick}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
          >
            Rules
          </button>

          {/* PLAY WELCOME MUSIC BUTTON */}
          <button
            onClick={playWelcome}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
          >
            Welcome message
          </button>
        </div>
      </section>
    </main>
  );
}
