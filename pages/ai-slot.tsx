'use client';

import Image from 'next/image';
import { useState } from 'react';

const symbols = [
  'arancia', 'banana', 'bar', 'campana', 'ciliegia', 'dollaro', 'formaggio',
  'fragola', 'gemma', 'gemma2', 'interrogativo', 'melone', 'prugna', 'sette',
  'stella', 'stella2', 'trisette', 'uva', 'wild'
];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

export default function AiSlot() {
  const [grid, setGrid] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);

  const handleSpin = () => {
    const newGrid = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => getRandomSymbol())
    );
    setGrid(newGrid);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#022C43] to-[#053F5E] text-white">
      <h1 className="text-3xl font-bold text-cyan-300 mb-8">MODALITÀ AI TEST SLOT</h1>

      <div className="relative w-[320px] h-[320px]">
        <Image src="/slot-symbols/slot.png" alt="Slot Machine" fill className="object-contain" />

        <div className="absolute top-[42px] left-[42px] w-[234px] h-[234px] grid grid-cols-3 grid-rows-3 gap-[1px]">
          {grid.flat().map((symbol, i) => (
            <div key={i} className="flex items-center justify-center">
              {symbol && (
                <Image
                  src={`/slot-symbols/${symbol}.png`}
                  alt={symbol}
                  width={50}
                  height={50}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSpin}
        className="mt-10 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
      >
        <span role="img" aria-label="slot">🎰</span> Gira
      </button>
    </div>
  );
}
