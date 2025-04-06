'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Room = {
  id: string;
  player1: string | null;
  player2: string | null;
  status: string;
};

export default function PvpRooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet');
    if (!storedWallet) {
      router.push('/login');
      return;
    }
    setWallet(storedWallet);
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchRooms, 2000);
    fetchRooms();
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    const res = await fetch('/api/pvp-rooms');
    const data = await res.json();
    setRooms(data.rooms || []);
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!wallet) return;
    const res = await fetch('/api/pvp-join-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, roomId }),
    });

    const data = await res.json();
    if (res.ok) {
      if (data.ready) {
        router.push(`/pvp-select-bonus?id=${roomId}`);
      } else {
        alert('Sei entrato nella room, in attesa di un altro giocatore...');
      }
    } else {
      alert(data.error || 'Errore nel join della room');
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📡 Room PvP Disponibili</h1>
      <div style={styles.grid}>
        {rooms.map((room) => (
          <div key={room.id} style={styles.card}>
            <p><strong>Room:</strong> {room.id.slice(0, 6)}</p>
            <p><strong>Stato:</strong> {room.player1 && room.player2 ? '🎮 Piena' : room.player1 ? '🕐 In attesa' : '🔓 Vuota'}</p>
            <button style={styles.button} onClick={() => handleJoinRoom(room.id)}>
              Entra
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #002B36, #001F2B)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontFamily: 'Orbitron',
    color: '#00FFFF',
    marginBottom: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1rem',
    width: '100%',
    maxWidth: '800px',
  },
  card: {
    backgroundColor: '#111',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 0 10px #00FFFF55',
    textAlign: 'center',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#FF4500',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};
