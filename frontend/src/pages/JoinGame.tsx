import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swedenFlag from "../assets/sweden.png";
import ukFlag from "../assets/uk.png";

type Language = "en" | "sv";

export default function JoinGame() {
    const navigate = useNavigate();
    const [gameCode, setGameCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [gameLanguage, setGameLanguage] = useState<string | null>(null);

    // Denna useEffect lyssnar på ändringar i gameCode.
    // När koden är exakt 36 tecken (längden av en GUID), gör vi ett anrop.
    useEffect(() => {
        const fetchGameInfo = async (code: string) => {
            try {
                // Vi använder samma GET-endpoint som PlayGame använder
                const response = await fetch(`/api/game/${code}`);

                if (response.ok) {
                    const data = await response.json();
                    if (data.language) {
                        setGameLanguage(data.language);
                        setError(''); // Rensa eventuella gamla fel om vi hittar spelet
                    }
                } else {
                    setGameLanguage(null);
                }
            } catch (err) {
                console.error("Kunde inte hämta spelinfo:", err);
                setGameLanguage(null);
            }
        };

        const trimmedCode = gameCode.trim();
        if (trimmedCode.length === 36) {
            fetchGameInfo(trimmedCode);
        } else {
            // Nollställ språket om användaren raderar tecken
            setGameLanguage(null);
        }
    }, [gameCode]);

    const savedLang = localStorage.getItem("lang");
    const lang: Language = savedLang === "sv" ? "sv" : "en";

    const texts = {
        en: {
            title: "Join Game",
            placeholder: "Enter 36-character game code",
            join: "Join",
            enterCode: "Enter a game code.",
            joinError: "Could not join the game.",
            serverError: "Could not reach the server. Please try again."
        },
        sv: {
            title: "Gå med i spel",
            placeholder: "Ange 36-teckens spelkod",
            join: "Gå med",
            enterCode: "Ange en spelkod.",
            joinError: "Kunde inte gå med i spelet.",
            serverError: "Kunde inte nå servern. Försök igen."
        }
    };

    async function handleJoinGame() {
        // Clear any old error and validate the game code.
        setError('');

        if (!gameCode.trim()) {
            setError(texts[lang].enterCode);
            return;
        }

        setLoading(true);

        try {
            // Tell the backend to join the room as Player 2.
            const response = await fetch(`/api/game/${gameCode.trim()}/join`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "playerName": "Player 2"
                })
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                setError(body?.message ?? texts[lang].joinError);
                return;
            }

            // Om vi kommer hit har det gått bra! 
            // Spara att jag är Player 2 i den här fliken
            sessionStorage.setItem("playerName", "Player 2");

            navigate(`/game/${gameCode.trim()}`);
        } catch (err) {
            console.error(err);
            setError(texts[lang].serverError);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleJoinGame();
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
            <section className="w-full max-w-md px-6 text-center">
                <h1 className="mb-10 text-5xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {texts[lang].title}
                </h1>

                <div className="flex flex-col gap-4">
                    <input
                        id="game-code-input"
                        type="text"
                        placeholder={texts[lang].placeholder}
                        value={gameCode}
                        onChange={(e) => setGameCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full rounded-2xl border-2 border-slate-700 bg-slate-800 py-4 px-4 text-center font-mono text-lg font-medium text-purple-300 placeholder-slate-500 outline-none transition focus:border-purple-500"
                    />

                    {/* Visar språket om vi har hittat det */}
                    <div className="h-8 flex items-center justify-center">
                        {gameLanguage && (
                            <span className="flex items-center gap-2 text-slate-300 font-medium animate-pulse">
                                Dictionary set to:
                                {gameLanguage === 'swe' ? (
                                    <>
                                        <img src={swedenFlag} alt="Svenska" className="h-5 w-7 object-cover rounded-sm shadow-sm" />
                                        Svenska
                                    </>
                                ) : (
                                    <>
                                        <img src={ukFlag} alt="English" className="h-5 w-7 object-cover rounded-sm shadow-sm" />
                                        English
                                    </>
                                )}
                            </span>
                        )}
                    </div>

                    {error && <div className="text-sm text-red-400 font-semibold">{error}</div>}

                    <button
                        id="join-button"
                        onClick={handleJoinGame}
                        disabled={loading || !gameCode.trim()}
                        className="w-full rounded-2xl bg-purple-600 py-4 text-xl font-bold text-white transition hover:bg-purple-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-xl shadow-purple-900/40 mt-2"
                    >
                        {texts[lang].join}
                    </button>
                </div>
            </section>
        </main>
    );
}