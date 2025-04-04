import { useState } from "react";

const symbols = [
  "arancia", "banana", "bar", "ciliegia", "dollaro", "formaggio", "fragola", "gemma",
  "interrogativo", "melone", "prugna", "sette", "stella", "trisette", "uva", "wild"
];

export default function AiSlot() {
  const [slots, setSlots] = useState(generateSlots());

  function generateSlots() {
    const getRandom = () => symbols[Math.floor(Math.random() * symbols.length)];
    return Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, getRandom)
    );
  }

  const spin = () => {
    setSlots(generateSlots());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03202f] to-[#01151f] flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-cyan-300 drop-shadow-[0_0_5px_#00ffff] mb-[-20px] z-10 relative">
        LoveOnPi <span className="text-white">AI Slot</span>
      </h1>

      <div className="relative mt-6 p-4 sm:p-6 rounded-[2rem] bg-[#111827] border-[6px] border-violet-600 shadow-[0_0_40px_#7c3aed]">
        <div className="grid grid-cols-3 grid-rows-3 gap-3 bg-[#1f2937] p-5 rounded-2xl">
          {slots.flat().map((symbol, i) => (
            <div
              key={i}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-[#111] border-[3px] border-white/20 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner"
            >
              <img
                src={`/slot-symbols/${symbol}.png`}
                alt={symbol}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={spin}
        className="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2"
      >
        <span role="img" aria-label="slot">🎰</span> Gira
      </button>
    </div>
  );
}
