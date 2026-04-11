export default function Rules() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-md px-4 text-center">
        <h1 className="mb-10 text-5xl font-extrabold uppercase tracking-widest">
          RULES
        </h1>


        <p className="text-center text-white mb-10">
          WordSlayer is a fast-paced Player vs Player word battle.
          Each round tests your vocabulary, speed and strategy.
        </p>
        <ul className="space-y-4 text-lg leading-relaxed text-white">

        </ul>
        <li>• Each player starts with <strong>100 HP</strong>.</li>

        <li>• Only one player writes at a time. After submitting a word, the turn switches.</li>

        <li>• You cannot reuse words that have already been played in the same round.</li>

        <li>• There is <strong>no spell‑checking</strong>. Misspelled words do not count.</li>

        <li>
          • The player who writes the <strong>longest valid word</strong> wins the battle.
          The number of characters becomes the damage dealt to the opponent.
        </li>

        <li>• A player who reaches <strong>0 HP</strong> loses the round.</li>

        <li>
          • The winner earns points equal to their remaining HP, which are added to the leaderboard.
        </li>

        <li>• All words must be in <strong>English</strong>.</li>

        <li>
          • Each turn has a <strong>30‑second timer</strong>.
          If you fail to submit a word in time, you automatically lose the battle.
        </li>


      </section>
    </main>
  );
}

Rules.route = {
  path: "/rules",
};