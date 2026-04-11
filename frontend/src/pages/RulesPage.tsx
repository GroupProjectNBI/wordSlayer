export default function Rules() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-md px-4 text-center">
        <h1 className="mb-10 text-5xl font-extrabold uppercase tracking-widest">
          RULES
        </h1>
        <p>
          WordSlayer is a Player vs Player game.
        </p>
        <p></p>
        <p>
          Each player got 100 HP at the start of new game.
        </p>
        <p>
          Only one player can write at the moment, after one player has written one word, it's the next players turn.
        </p>
        <p>
          Each player cannot use the same words on the same round.
        </p>
        <p>
          There is not any missspelling correction, so you have to write the word correct otherwise the word is not gonna count.
        </p>
        <p>
          The player that have wrote the longest word each battle wins and the total amount of charecters the word was is going to hit the other player HP with the same amount.
        </p>
        <p>
          The player that reach 0 HP lose the round.
        </p>
        <p>
          The player that wins, are getting those points player had left on HP-bar in a leaderboard.
        </p>
        <p>
          Every word has to be in English
        </p>
        <p>
          For each time is your turn you have an timer set to 30 Seconds, so you have to be fast. If you don't write any word you lose automatically that battle.
        </p>


      </section>
    </main>
  );
}

Rules.route = {
  path: "/rules",
};