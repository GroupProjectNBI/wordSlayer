import { useNavigate } from 'react-router-dom';

export default function NewGame() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen flex items-center justify-center">
            <section className="w-full max-w-md px-4 text-center">

                <h1 className="mb-10 text-5xl font-extrabold uppercase tracking-widest">
                    Start new game
                </h1>

                <input
                    type="text"
                    value="here should be a pin code later"
                    readOnly
                    className="mb-6 w-full rounded-lg border px-4 py-3 text-center text-lg"
                />

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate('/game')}
                        className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
                    >
                        Start Game
                    </button>
                </div>

            </section>
        </main>
    );
}
