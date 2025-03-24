'use client';
import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input) return;

    const res = await fetch('https://3930-62-19-242-117.ngrok-free.app/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openhermes',
        prompt: input,
        stream: false,
      }),
    });

    const data = await res.json();
    setMessages([...messages, `👤 ${input}`, `🤖 ${data.response}`]);
    setInput('');
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Chat AI 🍑</h1>
      <div className="space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="bg-gray-200 p-2 rounded">{msg}</div>
        ))}
      </div>
      <input
        className="border p-2 rounded w-full"
        placeholder="Scrivi qualcosa di piccante..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="mt-2 bg-pink-500 text-white px-4 py-2 rounded"
      >
        Invia
      </button>
    </main>
  );
}
