
interface WordEntry {
  word: string;
  player: "player1" | "player2";
  damage: number;
}

interface WordHistoryProps {
  words: WordEntry[];
}

type Language = "en" | "sv";

export default function WordHistory({ words }: WordHistoryProps) {
  
  const savedLang = localStorage.getItem("lang");
  const lang: Language = savedLang === "sv" ? "sv" : "en";

  const texts = {
    en: {
      title: "History",
      empty: "No words yet"
    },
    sv: {
      title: "Historik",
      empty: "Inga ord ännu"
    }
  };
  
  
  return (
    <div
      className="absolute left-4 top-1/2 -translate-y-1/2 w-48 bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/10"
      data-word-history
    >
      <h2 className="text-lg font-bold mb-2 text-center tracking-wide">
        {texts[lang].title}
      </h2>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {words.length === 0 && (
          <div className="text-sm text-gray-300 text-center opacity-70">
            {texts[lang].empty}
          </div>
        )}

        {words.map((entry, index) => (
          <div
            key={index}
            data-word-entry
            data-player={entry.player}
            data-damage={entry.damage}
            className={`
              flex justify-between items-center px-2 py-1 rounded-md
              ${entry.player === "player1" ? "bg-green-600/30" : "bg-red-600/30"}
            `}
          >
            <span className="font-semibold">{entry.word}</span>
            <span className="text-sm opacity-80">-{entry.damage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
