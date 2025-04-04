import React, { useState } from 'react';

const symbols = [
  'arancia', 'banana', 'bar', 'campana', 'campana2', 'ciliegia',
  'dollaro', 'formaggio', 'fragola', 'gemma', 'gemma2', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'stella2', 'trisette', 'uva', 'wild'
];

const getRandomSymbol = () => {
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return `/slot-symbols/${symbols[randomIndex]}.png`;
};

export default function AiSlot() {
  const [reels, setReels] = useState([
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
  ]);

  const spin = () => {
    const newReels = [
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    ];
    setReels(newReels);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <h1 className="text-2xl font-bold mb-4 text-cyan-400">Modalità AI Test Slot</h1>

      <div className="relative w-[360px] h-[360px]">
        <img src="/slot-symbols/slot.png" alt="Slot Machine" className="w-full h-full" />

        {/* Grid dei simboli sopra la base slot.png */}
        <div className="absolute top-0 left-0 w-full h-full grid grid-cols-3 grid-rows-3 gap-1 p-5">
          {reels.flat().map((symbol, i) => (
            <div key={i} className="flex items-center justify-center">
              <img src={symbol} alt="symbol" className="w-[80px] h-[80px]" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={spin}
        className="mt-6 px-6 py-3 rounded-full bg-cyan-400 hover:bg-cyan-500 text-black text-lg font-bold shadow-lg"
      >
        Gira!
      </button>
    </div>
  );
}
