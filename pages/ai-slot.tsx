import React, { useState } from 'react';

const symbols = [
  'arancia', 'banana', 'bar', 'campana', 'ciliegia',
  'dollaro', 'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette',
  'uva', 'wild'
];

export default function AiSlot() {
  const [grid, setGrid] = useState(generateGrid());

  function generateGrid() {
    const newGrid = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        const random = symbols[Math.floor(Math.random() * symbols.length)];
        row.push(random);
      }
      newGrid.push(row);
    }
    return newGrid;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #002f3e, #003b4f)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '3rem',
      }}
    >
      <h1 style={{ color: '#00fbe2', fontSize: '2rem', marginBottom: '2rem' }}>
        MODALITÀ AI TEST SLOT
      </h1>

      <div
        style={{
          position: 'relative',
          width: 500,   // ⬅️ Ingrandita rispetto a prima
          height: 420,  // ⬅️ Ingrandita in altezza
        }}
      >
        <img
          src="/slot-symbols/slot.png"
          alt="Slot Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '17.5%',
            left: '12.5%',
            width: '75%',
            height: '67%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: '12px',
            padding: '5px',
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((symbol, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={`/slot-symbols/${symbol}.png`}
                  alt={symbol}
                  style={{ width: 55, height: 55 }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => setGrid(generateGrid())}
        style={{
          marginTop: '2.5rem',
          padding: '0.9rem 1.8rem',
          fontSize: '1.1rem',
          borderRadius: '14px',
          backgroundColor: '#ff4500',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        🎰 Gira
      </button>
    </div>
  );
}
