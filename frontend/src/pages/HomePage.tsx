import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import swedenFlag from "../assets/sweden.png";
import ukFlag from "../assets/uk.png";

type Language = "en" | "sv";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const savedLang = localStorage.getItem("lang");
  const [lang, setLang] = useState<Language>(savedLang === "sv" ? "sv" : "en");


  const texts: Record<Language, {
    newGame: string;
    creatingNewGame: string;
    joinGame: string;
    rules: string;
    errorCreateGame: string;
  }> = {
    en: {
      newGame: "New Game",
      creatingNewGame: "Creating new game...",
      joinGame: "Join Game",
      rules: "Rules",
      errorCreateGame: "Could not create a new game. Please try again."
    },
    sv: {
      newGame: "Nytt spel",
      creatingNewGame: "Skapar nytt spel...",
      joinGame: "Gå med i spel",
      rules: "Regler",
      errorCreateGame: "Kunde inte skapa ett nytt spel. Försök igen."
    }
  };
  

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
      setError(texts[lang].errorCreateGame);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-md px-4 text-center">
        <h1
          data-testid="homepage-title"
          className="mb-10 text-5xl font-extrabold uppercase tracking-widest"
        >
          Word Slayer
        </h1>
        <div className="mb-6 flex justify-center gap-4">
          <button
            className="hover:scale-110 transition"
            onClick={() => {
              localStorage.setItem("lang", "sv");
              setLang("sv");
            }}
          >
            <img src={swedenFlag} alt="Swedish" className="h-6 w-8 object-cover" />
          </button>

          <button
            className="hover:scale-110 transition"
            onClick={() => {
              localStorage.setItem("lang", "en");
              setLang("en");
            }}
          >
            <img src={ukFlag} alt="English" className="h-6 w-8 object-cover" />
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

        <div className="flex flex-col gap-4">
          <button
            id="btn-new-game"
            onClick={handleCreateNewGame}
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? texts[lang].creatingNewGame : texts[lang].newGame}
          </button>

          <button
            id="btn-join-game"
            onClick={() => navigate('/join')}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
          >
            {texts[lang].joinGame}
          </button>

          <button
            id="btn-rules"           
            onClick={() => navigate('/rules')}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
          >
            {texts[lang].rules}
          </button>
        </div>
      </section>
    </main>
  );
}