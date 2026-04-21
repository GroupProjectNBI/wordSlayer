import { useNavigate } from 'react-router-dom';

type Language = "en" | "sv";

export default function Rules() {
  const navigate = useNavigate();

  const savedLang = localStorage.getItem("lang");
  const lang: Language = savedLang === "sv" ? "sv" : "en";

  const texts = {
    en: {
      title: "Game Rules",
      intro: "WordSlayer is a fast-paced Player vs Player word battle. Each round tests your vocabulary, speed and strategy.",
      rules: [
        "Each player starts with 100 HP.",
        "Only one player writes at a time. After submitting a word, the turn switches.",
        "You cannot reuse words that have already been played in the same round.",
        "There is no spell-checking. Misspelled words do not count.",
        "The player who writes the longest valid word wins the battle. The number of characters becomes the damage dealt to the opponent.",
        "A player who reaches 0 HP loses the round.",
        "The winner earns points equal to their remaining HP, which are added to the leaderboard.",
        "All words must be in English.",
        "Each turn has a 30-second timer. If you fail to submit a word in time, you automatically lose the battle."
      ],
      home: "Home"
    },
    sv: {
      title: "Spelregler",
      intro: "WordSlayer är ett snabbt Player vs Player-ordspel. Varje runda testar ditt ordförråd, din snabbhet och strategi.",
      rules: [
        "Varje spelare startar med 100 HP.",
        "Endast en spelare skriver åt gången. Efter att ett ord skickats växlar turen.",
        "Du kan inte återanvända ord som redan spelats i samma runda.",
        "Det finns ingen stavningskontroll. Felstavade ord räknas inte.",
        "Spelaren som skriver det längsta giltiga ordet vinner. Antalet bokstäver blir skadan som delas ut.",
        "En spelare som når 0 HP förlorar rundan.",
        "Vinnaren får poäng motsvarande sin kvarvarande HP som läggs till på leaderboarden.",
        "Alla ord måste vara på svenska.",
        "Varje tur har en timer på 30 sekunder. Missar du att skriva ett ord i tid förlorar du rundan."
      ],
      home: "Hem"
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-md px-4 text-center">
        <h1 className="mb-10 text-5xl font-extrabold tracking-widest">
          {texts[lang].title}
        </h1>

        <p className="text-center text-white mb-10">
          {texts[lang].intro}
        </p>
        <ul className="space-y-4 text-lg leading-relaxed text-white">
          {texts[lang].rules.map((rule, index) => (
            <li key={index}>• {rule}</li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 mt-10">
          <button
            onClick={() => navigate('/')}
            className="w-full rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500"
          >
            {texts[lang].home}
          </button>
        </div>
      </section>
    </main>
  );
}

Rules.route = {
  path: "/rules",
};
