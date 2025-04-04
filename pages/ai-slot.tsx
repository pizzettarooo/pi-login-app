import { useState } from "react";

const symbols = [
  "🍒", "🍋", "🍉", "🍇", "🍊", "🍎", "🍓", "🍍",
  "🥝", "🥭", "🫐", "🍏", "🍌", "🍈", "🍑", "🍐",
  "💎", "⭐", "🍀", "🎰", "🔥", "👑", "🔔", "🍫",
  "🪙", "💰", "🎲", "🧿", "⚡", "🧨", "🎉", "Ⓟ", // Pi simbolo finale!
];

export default function AiSlot() {
  const [reels, setReels] = useState<string[]>(["❓", "❓", "❓"]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult("");
    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const final = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      setReels(final);
      setSpinning(false);
      setResult(
        final[0] === final[1] && final[1] === final[2]
          ? "🎉 Hai vinto!"
          : "💨 Ritenta!"
      );
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎰 Slot Machine Test AI</h1>
      <div style={styles.slot}>
        {reels.map((symbol, i) => (
          <div key={i} style={styles.reel}>
            {symbol}
          </div>
        ))}
      </div>
      <button style={styles.button} onClick={spin} disabled={spinning}>
        {spinning ? "🎲 In corso..." : "▶️ SPIN"}
      </button>
      <p style={styles.result}>{result}</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center" as const,
    padding: "2rem",
    fontFamily: "monospace",
    background: "linear-gradient(to bottom, #1c1c1c, #3a3a3a)",
    minHeight: "100vh",
    color: "#fff",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  slot: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    marginBottom: "1rem",
  },
  reel: {
    fontSize: "3rem",
    padding: "1rem 1.5rem",
    backgroundColor: "#222",
    borderRadius: "12px",
    boxShadow: "0 0 12px #fff4",
    border: "2px solid #555",
  },
  button: {
    fontSize: "1.2rem",
    padding: "0.6rem 1.5rem",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#f39c12",
    color: "#fff",
    cursor: "pointer",
  },
  result: {
    fontSize: "1.5rem",
    marginTop: "1rem",
  },
};
