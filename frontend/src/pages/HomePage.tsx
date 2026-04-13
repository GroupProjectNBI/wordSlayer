// import routes from "../routes";
// import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-md px-4 text-center">
        <h1 className="mb-10 text-5xl font-extrabold uppercase tracking-widest">
          Word Slayer
        </h1>

        <div className="flex flex-col gap-4">
          <button onClick={() => navigate('/newgame')} className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500">
            New game
          </button>

<button 
  id="btn-join-game"
  onClick={() => navigate('/join')} 
  className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
>
  Join Game
</button>

          <button onClick={() => navigate('/rules')} className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500">
            Rules
          </button>
        </div>
      </section>
    </main>
  );
}