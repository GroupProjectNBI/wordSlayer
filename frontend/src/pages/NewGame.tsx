
export default function NewGame() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <section className="w-full max-w-md px-4 text-center">
                <h1 className="mb-10 text-5xl font-extrabold uppercase tracking-widest">
                    Start new game
                </h1>

                <div className="flex flex-col gap-4">
                    <input type="text" value="here should be a pin code later" disabled />
                    <button className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500">
                        Start game
                    </button>
                </div>
            </section>
        </main>
    );
}
