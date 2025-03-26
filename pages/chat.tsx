'use client';
import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    console.log("Click su INVIA"); // ✅ DEBUG

    if (!input) return;

    try {
      const res = await fetch('https://loveonpi.com/ask-francesca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      console.log("Risposta Francesca:", data); // ✅ DEBUG

      setMessages([...messages, `👤 ${input}`, `🤖 ${data.response}`]);
      setInput('');
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Chat con Francesca 💋</h1>
      <div className="space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="bg-gray-200 p-2 rounded">{msg}</div>
        ))}
      </div>
      <input
        className="border p-2 rounded w-full"
        placeholder="Scrivile qualcosa..."
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
