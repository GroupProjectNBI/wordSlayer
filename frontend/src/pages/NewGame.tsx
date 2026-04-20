import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function NewGame() {
    const navigate = useNavigate();
    const { sessionId } = useParams<{ sessionId: string }>();
    const [copied, setCopied] = useState(false);
    const error = '';

    const handleCopy = () => {
        if (sessionId) {
            navigator.clipboard.writeText(sessionId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
                    Start new game
                </h1>

                <div className="flex flex-col gap-3 mb-10">
                    {/* Det stora sessions-ID:t */}
                    <input
                        type="text"
                        value={sessionId || 'No session found'}
                        readOnly
                        className="w-full rounded-2xl border-2 border-slate-700 bg-slate-800 px-6 py-5 text-center font-mono text-3xl font-bold text-purple-300 outline-none shadow-inner"
                    />

                    {/* Den nya kopieringsknappen */}
                    <button
                        onClick={handleCopy}
                        disabled={!sessionId}
                        className={`w-full rounded-2xl py-4 text-xl font-bold transition-all duration-200 flex items-center justify-center gap-3 border-2 ${copied
                            ? 'bg-green-600/20 border-green-500 text-green-400'
                            : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
                            }`}
                    >
                        <span>{copied ? '✅' : '📋'}</span>
                        {copied ? 'Copied Game Code!' : 'Copy Game Code'}
                    </button>
                </div>

                {error && <div className="mb-4 text-lg text-red-400 font-semibold">{error}</div>}

                <div className="pt-6 border-t border-slate-800">
                    <button
                        onClick={handleStartGame}
                        disabled={!sessionId}
                        className="w-full rounded-2xl bg-purple-600 py-5 text-2xl font-bold text-white transition-all hover:bg-purple-500 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-xl shadow-purple-900/40"
                    >
                        Start Game
                    </button>
                    <p className="mt-4 text-slate-500 text-sm italic">
                        Click "Start Game" when you've shared the code with your opponent.
                    </p>
                </div>
            </section>
        </main>
    );
}