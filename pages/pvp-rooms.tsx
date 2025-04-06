// FILE: pages/pvp-rooms.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Match {
  id: string;
  player1: string | null;
  player2: string | null;
  status: string;
}

export default function PvpRooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Match[]>([]);
  const [wallet, setWallet] = useState<string | null>(null);
  const [loadingRoom, setLoadingRoom] = useState<string | null>(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet');
    if (!storedWallet) router.push('/login');
    else setWallet(storedWallet);
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch('/api/pvp-rooms');
      const data = await res.json();
      setRooms(data.rooms);
    };
    fetchRooms();
    const interval = setInterval(fetchRooms, 2000);
    return () => clearInterval(interval);
  }, []);

  const joinRoom = async (roomId: string) => {
    if (!wallet) return;
    setLoadingRoom(roomId);

    const res = await fetch('/api/pvp-join-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, roomId })
    });

    const data = await res.json();
    if (res.ok) router.push(`/pvp-select-bonus?id=${data.matchId}`);
    else alert(data.error);

    setLoadingRoom(null);
  };

  return (
    <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', color: '#00FFFF' }}>Stanze PvP disponibili</h1>
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        {rooms.map((room) => {
          const isFull = room.player1 && room.player2;
          const isWaiting = room.status === 'waiting' && (!room.player2 || !room.player1);
          return (
            <button
              key={room.id}
              onClick={() => joinRoom(room.id)}
              disabled={isFull || loadingRoom === room.id}
              style={{
                padding: '1rem 2rem',
                borderRadius: '10px',
                backgroundColor: isFull ? '#555' : isWaiting ? '#FFA500' : '#00BFFF',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                cursor: isFull ? 'not-allowed' : 'pointer'
              }}
            >
              {isFull ? 'Piena' : isWaiting ? 'In attesa di giocatori...' : 'Vuota'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
