import React, { useState } from 'react';
import Image from 'next/image';
import path from 'path';

const symbols = [
  'arancia', 'banana', 'bar', 'campana', 'ciliegia', 'dollaro', 'formaggio',
  'fragola', 'gemma', 'interrogativo', 'melone', 'prugna', 'sette', 'stella',
  'trisette', 'uva', 'wild'
];

function getRandomSymbol() {
  const index = Math.floor(Math.random() * symbols.length);
  return `/slot-symbols/${symbols[index]}.png`;
}

const AiSlot = () => {
  const [grid, setGrid] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]);

  const handleSpin = () => {
    const newGrid = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, getRandomSymbol)
    );
    setGrid(newGrid);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #023047, #001219)',
      color: '#00FFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ marginBottom: '20px', fontSize: '28px' }}>MODALITÀ AI TEST SLOT</h1>

      <div style={{ position: 'relative' }}>
        <Image
          src="/slot-symbols/slot.png"
          alt="Slot Machine"
          width={500}
          height={500}
        />

        <div style={{
          position: 'absolute',
          top: '90px',
          left: '92px',
          width: '315px',
          height: '270px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '10px',
        }}>
          {grid.flat().map((symbol, index) => (
            <div key={index} style={{ width: '80px', height: '80px' }}>
              {symbol && (
                <Image
                  src={symbol}
                  alt="symbol"
                  width={80}
                  height={80}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSpin}
        style={{
          marginTop: '30px',
          padding: '12px 30px',
          fontSize: '18px',
          borderRadius: '10px',
          backgroundColor: '#ff4500',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0px 5px 15px rgba(0,0,0,0.3)'
        }}
      >
        🎰 Gira
      </button>
    </div>
  );
};

export default AiSlot;