
export default function JoinGame() {
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
                        className="w-full rounded-xl bg-white/10 py-4 text-lg text-center text-white placeholder-gray-400 outline-none" 
                    />
                    <button 
                        id="join-button" 
                        className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
                    >
                        Join
                    </button>
                </div>
            </section>
        </main>
    );
}