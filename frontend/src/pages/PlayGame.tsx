import { useState } from "react";
import GameBoard from "../components/GameBoard";
import DamagePopup from "../components/DamagePopup";

export default function PlayGame() {
  // --- 1. STATE (REAKTS MINNE) ---
  // Här sparar vi all data som ska kunna ändras på skärmen.
  const [player1, setPlayer1] = useState({ username: "PlayerOne", hp: 100 });
  const [player2, setPlayer2] = useState({ username: "PlayerTwo", hp: 100 });
  const [word, setWord] = useState(""); // Håller koll på vad användaren skriver i inputfältet 
  //  const [timer, setTimer] = useState(30);

  const [turn, setTurn] = useState<"player1" | "player2">("player1");
  const [popups, setPopups] = useState<{ id: number; amount: number; position: "left" | "right"; }[]>([]);
  const [history, setHistory] = useState<{ word: string; player: "player1" | "player2"; damage: number; }[]>([]);

  // --- 2. HJÄLPFUNKTIONER ---
  function dealDamage(amount: number, target: "left" | "right") {
    const id = Date.now();
    setPopups((prev) => [...prev, { id, amount, position: target }]);
    // Uppdatera HP
    if (target === "left") {
      setPlayer1((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
    } else {
      setPlayer2((p) => ({ ...p, hp: Math.max(0, p.hp - amount) }));
    }
  }

  // --- 3. KORT 1: LOGIK FÖR ATT SKICKA TILL BACKEND ---
  // Vi gör funktionen 'async' eftersom vi ska vänta på svar från servern (fetch)
  async function onSubmitWord() {
    // A) Kontrollera att det inte är tomt
    if (!word.trim()) return;

    // B) Hårdkodat ID för testning (detta ersätts senare av dynamiskt ID från en Lobby)
    const sessionId = "cd748152-6f11-40e9-8cdb-e52ec2b17f2a"; // dummy men rätt 

    try {
      // C) Skicka anropet till C#
      // Vi använder 'await' så att koden väntar här tills servern svarat
      const response = await fetch(`/api/game/${sessionId}/playword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wordGuess: word }), // Matchar C#-klassen 'HandeWordRequest'
      });

      // D) Hantera svaret
      if (response.ok) {
        console.log(`✅ Backend godkände: ${word}`);

        // --- LOKAL LOGIK (Körs bara om backend svarar 200 OK) ---
        const damage = word.length;
        setHistory((prev) => [...prev, { word, player: turn, damage }]);

        if (turn === "player1") {
          dealDamage(damage, "right");
          setTurn("player2");
        } else {
          dealDamage(damage, "left");
          setTurn("player1");
        }

        // Töm inputfältet (detta triggar en omrendering så fältet blir blankt)
        setWord("");
      } else {
        // Om backend svarar t.ex. 400 (ordet finns inte i english.txt)
        const errorData = await response.json();
        console.warn("⚠️ Backend nekade ordet:", errorData.message);
        alert(errorData.message); // Visa felet för användaren
      }
    } catch (error) {
      console.error("❌ Nätverksfel:", error);
    }
  }

  // --- 4. RENDERING (DET SOM VISAS) ---
  return (
    <GameBoard
      player1={player1}
      player2={player2}
      // timer={timer}
      turn={turn}
      word={word}           // Skickar ner nuvarande ord-state
      setWord={setWord}     // Skickar ner funktionen för att uppdatera ordet
      onSubmitWord={onSubmitWord} // Skickar ner funktionen som körs vid klick
      history={history}
    >
      {/* Damage-popups ritas upp här */}
      {popups.map((p) => (
        <DamagePopup
          key={p.id}
          amount={p.amount}
          position={p.position}
          onComplete={() =>
            setPopups((prev) => prev.filter((x) => x.id !== p.id))
          }
        />
      ))}
    </GameBoard>
  );
}