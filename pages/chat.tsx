import { useState, useEffect } from "react";
import axios from "axios";

export default function ChatPage() {
  const [wallet, setWallet] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: 'user' | 'ai', text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
      setWallet(savedWallet);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setMessages(prev => [...prev, { from: "user", text: input }]);

    try {
      const res = await axios.post("/api/chat", {
        wallet,
        message: input
      });

      setMessages(prev => [...prev, { from: "ai", text: res.data.reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { from: "ai", text: "Errore nella risposta." }]);
    }

    setInput("");
    setLoading(false);
  };

  if (!wallet) {
    return <p>⚠️ Devi fare login per usare la chat.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Chatta con Giulia 💋</h1>

      <div className="bg-gray-100 p-4 rounded-lg h-[400px] overflow-y-scroll space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === "user" ? "text-right" : "text-left"}>
            <span className={msg.from === "user" ? "text-blue-600" : "text-pink-600"}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Scrivi un messaggio..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          Invia
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Giulia sta scrivendo...</p>}
    </div>
  );
}
