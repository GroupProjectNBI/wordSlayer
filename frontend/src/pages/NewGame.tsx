import { useNavigate, useParams } from 'react-router-dom';

type Language = "en" | "sv";

export default function NewGame() {
    const navigate = useNavigate();
    const { sessionId } = useParams<{ sessionId: string }>();
    const error = '';

    const savedLang = localStorage.getItem("lang");
    const lang: Language = savedLang === "sv" ? "sv" : "en";

    const texts = {
        en: {
            title: "Start new game",
            noSession: "No session found",
            startGame: "Start Game",
        },
        sv: {
            title: "Starta nytt spel",
            noSession: "Ingen session hittades",
            startGame: "Starta spel",
        }
    };

    // This page shows the session ID that was created on the homepage.
    // The user does not type the ID here, it comes from the URL.
    const handleStartGame = () => {
        if (sessionId) {
            // Spara att jag är Player 1 i den här fliken
            sessionStorage.setItem("playerName", "Player 1");
            navigate(`/game/${sessionId}`);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center">
            <section className="w-full max-w-md px-4 text-center">

                <h1 className="mb-10 text-5xl font-extrabold uppercase tracking-widest">
                    {texts[lang].title}
                </h1>

                {/* Show the backend-generated session code in a readonly field. */}
                <input
                    type="text"
                    value={sessionId || texts[lang].noSession}
                    readOnly
                    className="mb-3 w-full rounded-lg border px-4 py-3 text-center text-lg font-mono text-sm"
                />

                {error && <div className="mb-3 text-sm text-red-400">{error}</div>}

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleStartGame}
                        disabled={!sessionId}
                        className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {texts[lang].startGame}
                    </button>
                </div>

            </section>
        </main>
    );
}
