
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JoinGame() {
    const navigate = useNavigate();
    const [gameCode, setGameCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleJoinGame() {
        // Clear any old error and validate the game code.
        setError('');

        if (!gameCode.trim()) {
            setError('Enter a game code.');
            return;
        }

        setLoading(true);

        try {
            // Tell the backend to join the room as Player 2.
            const response = await fetch(`/api/game/${gameCode}/join`, {
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
                setError(body?.message ?? 'Could not join the game.');
                return;
            }

            // Om vi kommer hit har det gått bra! 
            // Spara att jag är Player 2 i den här fliken
            sessionStorage.setItem("playerName", "Player 2");

            navigate(`/game/${gameCode}`);
        } catch (err) {
            console.error(err);
            setError('Could not reach the server. Please try again.');
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
        <main className="min-h-screen flex items-center justify-center">
            <section className="w-full max-w-md px-4 text-center">
                <h1 className="mb-10 text-5xl font-extrabold uppercase tracking-widest">
                    Join Game
                </h1>

                <div className="flex flex-col gap-4">
                    <input
                        id="game-code-input"
                        type="text"
                        placeholder="Enter code"
                        value={gameCode}
                        onChange={(e) => setGameCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full rounded-xl bg-white/10 py-4 text-lg text-center text-white placeholder-gray-400 outline-none"
                    />
                    {error && <div className="text-sm text-red-400">{error}</div>}
                    <button
                        id="join-button"
                        onClick={handleJoinGame}
                        disabled={loading}
                        className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Join
                    </button>
                </div>
            </section>
        </main>
    );
}