import { useState } from "react";

const symbolNames = [
  "arancia", "banana", "bar", "campana", "campana2", "ciliegia", "dollaro",
  "formaggio", "fragola", "gemma", "gemma2", "interrogativo", "melone", "prugna",
  "sette", "stella", "stella2", "trisette", "uva", "wild"
];

const getRandomSymbol = () => {
  const randomIndex = Math.floor(Math.random() * symbolNames.length);
  return `/slot-symbols/${symbolNames[randomIndex]}.png`;
};

export default function AiSlot() {
  const [slots, setSlots] = useState([
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
  ]);

  const spin = () => {
    setSlots([
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    ]);
  };

  return (
    <div
      style={{
        backgroundImage: "url('/slot-symbols/slot.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "600px",
        height: "650px",
        margin: "50px auto",
        position: "relative",
      }}
    >
      <h1 style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        color: "#00f7ff",
        fontSize: "28px",
        fontFamily: "sans-serif"
      }}>
        MODALITÀ AI TEST SLOT
      </h1>

      {/* SLOT GRID */}
      <div
        style={{
          position: "absolute",
          top: "180px",
          left: "90px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gridTemplateRows: "repeat(3, 100px)",
          gap: "10px"
        }}
      >
        {slots.flat().map((symbol, i) => (
          <img key={i} src={symbol} width={100} height={100} alt="symbol" />
        ))}
      </div>

      {/* BUTTON */}
      <button
        onClick={spin}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          backgroundColor: "#ff3300",
          border: "none",
          borderRadius: "10px",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 0 10px #000"
        }}
      >
        🎰 Gira
      </button>
    </div>
  );
}
