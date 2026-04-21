import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Två olika typer för att hålla isär UI och Ordbok
type UiLanguage = "en" | "sv";
type DictLanguage = "eng" | "swe";

export default function NewGame() {
    const navigate = useNavigate();
    const { sessionId } = useParams<{ sessionId: string; }>();
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    // 1. SPRÅK PÅ SKÄRMEN (UI)
    // Läser endast av vad som finns sparat i webläsaren sedan tidigare.
    const savedLang = localStorage.getItem("lang");
    const uiLang: UiLanguage = savedLang === "sv" ? "sv" : "en";

    // 2. SPRÅK FÖR ORDBOKEN (Backend)
    // Detta är spelets regler. Standard är engelska, men kan klickas på av spelaren.
    const [dictLang, setDictLang] = useState<DictLanguage>("eng");

    const texts = {
        en: {
            title: "Start new game",
            noSession: "No session found",
            copyGameCode: "Copy Game Code",
            copiedGameCode: "Copied Game Code!",
            selectDictionary: "Select Dictionary:",
            startGame: "Start Game",
            startHint: 'Click "Start Game" when you\'ve shared the code with your opponent.',
            dictError: "Could not save dictionary choice. Please try again."
        },
        sv: {
            title: "Starta nytt spel",
            noSession: "Ingen session hittades",
            copyGameCode: "Kopiera spelkod",
            copiedGameCode: "Spelkoden kopierad!",
            selectDictionary: "Välj ordbok för matchen:",
            startGame: "Starta spel",
            startHint: 'Klicka på "Starta spel" när du har delat koden med din motståndare.',
            dictError: "Kunde inte spara valet av ordbok. Försök igen."
        }
    };

    const handleCopy = () => {
        if (sessionId) {
            navigator.clipboard.writeText(sessionId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Uppdaterar ENDAST ordboken, inte UI-språket
    const handleDictionaryChange = async (selectedDict: DictLanguage) => {
        setDictLang(selectedDict);

        if (!sessionId) return;

        try {
            const response = await fetch(`/api/game/${sessionId}/language`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ language: selectedDict }),
            });

            if (!response.ok) {
                throw new Error("Failed to update dictionary language");
            }
        } catch (err) {
            console.error("Kunde inte spara ordboksspråket till servern:", err);
            setError(texts[uiLang].dictError);
        }
    };

    const handleStartGame = () => {
        if (sessionId) {
            sessionStorage.setItem("playerName", "Player 1");
            navigate(`/game/${sessionId}`);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
            <section className="w-full max-w-lg px-6 text-center">
                <h1 className="mb-12 text-5xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    {texts[uiLang].title}
                </h1>

                <div className="flex flex-col gap-3 mb-8">
                    <input
                        type="text"
                        value={sessionId || texts[uiLang].noSession}
                        readOnly
                        className="w-full rounded-2xl border-2 border-slate-700 bg-slate-800 px-6 py-5 text-center font-mono text-3xl font-bold text-purple-300 outline-none shadow-inner"
                    />

                    <button
                        onClick={handleCopy}
                        disabled={!sessionId}
                        className={`w-full rounded-2xl py-4 text-xl font-bold transition-all duration-200 flex items-center justify-center gap-3 border-2 ${copied
                            ? 'bg-green-600/20 border-green-500 text-green-400'
                            : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
                            }`}
                    >
                        <span>{copied ? '✅' : '📋'}</span>
                        {copied ? texts[uiLang].copiedGameCode : texts[uiLang].copyGameCode}
                    </button>
                </div>

                {/* --- Val av ordbok --- */}
                <div className="mb-8">
                    <p className="mb-3 text-slate-400 font-medium">{texts[uiLang].selectDictionary}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => handleDictionaryChange("eng")}
                            className={`text-5xl transition-all duration-200 ${dictLang === "eng"
                                ? "scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                : "opacity-50 hover:opacity-80 hover:scale-105"
                                }`}
                            title="English Dictionary"
                        >
                            ENG
                        </button>
                        <button
                            onClick={() => handleDictionaryChange("swe")}
                            className={`text-5xl transition-all duration-200 ${dictLang === "swe"
                                ? "scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                : "opacity-50 hover:opacity-80 hover:scale-105"
                                }`}
                            title="Svensk Ordbok"
                        >
                            SE
                        </button>
                    </div>
                </div>

                {error && <div className="mb-4 text-lg text-red-400 font-semibold">{error}</div>}

                <div className="pt-6 border-t border-slate-800">
                    <button
                        onClick={handleStartGame}
                        disabled={!sessionId}
                        className="w-full rounded-2xl bg-purple-600 py-5 text-2xl font-bold text-white transition-all hover:bg-purple-500 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-xl shadow-purple-900/40"
                    >
                        {texts[uiLang].startGame}
                    </button>
                    <p className="mt-4 text-slate-500 text-sm italic">
                        {texts[uiLang].startHint}
                    </p>
                </div>
            </section>
        </main>
    );
}