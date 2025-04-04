import { useState } from 'react';

const symbols = [
  'arancia.png',
  'banana.png',
  'bar.png',
  'campana.png',
  'ciliegia.png',
  'dollaro.png',
  'formaggio.png',
  'fragola.png',
  'gemma.png',
  'interrogativo.png',
  'melone.png',
  'prugna.png',
  'sette.png',
  'slot.png',
  'stella.png',
  'uva.png',
  'wild.png',
];

export default function AiSlot() {
  const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

  const [grid, setGrid] = useState(
    Array.from({ length: 9 }, () => getRandomSymbol())
  );

  const spin = () => {
    const newGrid = Array.from({ length: 9 }, () => getRandomSymbol());
    setGrid(newGrid);
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Modalità AI Test Slot</h1>

      <div style={styles.slotGrid}>
        {grid.map((symbol, index) => (
          <div key={index} style={styles.cell}>
            <img src={`/slot-symbols/${symbol}`} alt={`symbol-${index}`} style={styles.img} />
          </div>
        ))}
      </div>

      <button style={styles.button} onClick={spin}>
        🎰 Gira
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'radial-gradient(circle, #0f172a, #0a0f1a)',
    minHeight: '100vh',
    padding: '2rem',
    color: 'white',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
  },
  slotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 100px)',
    gridTemplateRows: 'repeat(3, 100px)',
    gap: '10px',
    background: '#1e1e2f',
    padding: '1rem',
    borderRadius: '20px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
  },
  cell: {
    backgroundColor: '#00000033',
    border: '2px solid white',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    maxWidth: '70%',
    maxHeight: '70%',
  },
  button: {
    marginTop: '2rem',
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    background: '#f97316',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 4px #c2410c',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
