import { useState, useEffect } from "react";

const symbolNames = [
  "arancia", "banana", "bar", "campana", "campana2", "ciliegia", "dollaro",
  "formaggio", "fragola", "gemma", "gemma2", "interrogativo", "melone", "prugna",
  "sette", "stella", "stella2", "trisette", "uva", "wild"
];

const getRandomSymbol = () => {
  const index = Math.floor(Math.random() * symbolNames.length);
  return `/slot-symbols/${symbolNames[index]}.png`;
};

export default function AiSlot() {
  const [slots, setSlots] = useState<string[][]>([]);

  const spin = () => {
    const newGrid = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => getRandomSymbol())
    );
    setSlots(newGrid);
  };

  useEffect(() => {
    spin(); // inizializza alla prima apertura
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #00354d, #01222d)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: "40px"
      }}
    >
      <h1 style={{ color: "#00f7ff", marginBottom: "20px" }}>
        MODALITÀ AI TEST SLOT
      </h1>

      <div
        style={{
          backgroundImage: "url('/slot-symbols/slot.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "450px",
          height: "500px",
          position: "relative",
        }}
      >
        {/* GRID */}
        <div
          style={{
            position: "absolute",
            top: "123px",
            left: "52px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 80px)",
            gridTemplateRows: "repeat(3, 80px)",
            gap: "10px",
          }}
        >
          {slots.flat().map((symbol, i) => (
            <img
              key={i}
              src={symbol}
              alt="symbol"
              style={{ width: "80px", height: "80px" }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={spin}
        style={{
          marginTop: "30px",
          backgroundColor: "#ff3300",
          border: "none",
          borderRadius: "12px",
          padding: "12px 24px",
          color: "#fff",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 0 10px #000",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span role="img" aria-label="slot">🎰</span> Gira
      </button>
    </div>
  );
}
