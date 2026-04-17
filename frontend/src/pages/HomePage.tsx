import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useSound } from "../hooks/useSound"; //  NY IMPORT

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  //  TEST MODE CHECK (ingen musik i test)
  const isTest =
    typeof window !== "undefined" &&
    window.location.search.includes("test");

  //  LOAD HOME MUSIC (no loop)
  const homeMusic = useSound("/sounds/home-music.mp3");

  //  AUTO-PLAY AFTER FIRST USER INTERACTION
  useEffect(() => {
    if (isTest) return;

    function unlockAudio() {
      homeMusic.play();
      window.removeEventListener("click", unlockAudio);
    }

    window.addEventListener("click", unlockAudio);

    return () => window.removeEventListener("click", unlockAudio);
  }, [isTest]);

  //  MANUAL PLAY BUTTON
  function playAgain() {
    homeMusic.play();
  }

  // When the user clicks New game on the homepage,
  // we ask the backend to create the game session immediately.
  // The backend returns a session ID that we keep in the URL.
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
      // Go to the new game page with the session ID in the URL.
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
            onClick={() => navigate('/rules')}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
          >
            Rules
          </button>

          {/*  PLAY MUSIC BUTTON (flyttad hit, samma design) */}
          <button
            onClick={playAgain}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
          >
            Play Music
          </button>
        </div>
      </section>
    </main>
  );
}
