// FILE: pages/pvp-rooms.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PvpRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet');
    if (!storedWallet) return router.push('/login');
    setWallet(storedWallet);
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchRooms, 2000);
    fetchRooms();
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/pvp-rooms');
      const data = await res.json();
      setRooms(data.rooms || []);
      setLoading(false);
    } catch (err) {
      console.error('Errore caricamento rooms', err);
    }
  };

  const handleJoin = async (roomId?: string) => {
    if (!wallet) return;
    const res = await fetch('/api/pvp-join-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, roomId })
    });
    const data = await res.json();
    if (res.ok) {
      router.push(`/pvp-select-bonus?id=${data.matchId}`);
    } else {
      alert(data.error || 'Errore durante l’accesso alla room');
    }
  };

  const getStatus = (room: any) => {
    if (!room.player1 && !room.player2) return 'Vuota';
    if (room.player1 && !room.player2) return 'In attesa';
    return 'Completa';
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Room PvP disponibili</h1>
      {loading ? (
        <p style={styles.text}>Caricamento...</p>
      ) : (
        <div style={styles.grid}>
          {rooms.map((room, idx) => (
            <div key={room.id} style={styles.card}>
              <p>Room {idx + 1}</p>
              <p>Status: {getStatus(room)}</p>
              {getStatus(room) !== 'Completa' && (
                <button onClick={() => handleJoin(room.id)} style={styles.button}>
                  Entra
                </button>
              )}
            </div>
          ))}
          {/* Aggiunge nuova room se meno di 3 vuote */}
          {rooms.filter(r => getStatus(r) === 'Vuota').length < 3 && (
            <button onClick={() => handleJoin()} style={styles.newButton}>
              ➕ Crea nuova room
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #002B36, #001F2B)',
    padding: '2rem',
    color: 'white',
    fontFamily: 'Arial',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#00ffff',
    fontFamily: 'Orbitron'
  },
  text: {
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  card: {
    backgroundColor: '#111',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid #00ffff55',
    textAlign: 'center'
  },
  button: {
    marginTop: '1rem',
    backgroundColor: '#00ffff',
    color: '#000',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  newButton: {
    marginTop: '2rem',
    backgroundColor: '#FF4500',
    color: '#fff',
    padding: '1rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
