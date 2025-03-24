import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Chat() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
      setWallet(savedWallet);
      fetchCredits(savedWallet);
    } else {
      alert("⚠️ Wallet non trovato. Fai login prima.");
      router.push("/");
    }
  }, []);

  async function fetchCredits(wallet: string) {
    const res = await fetch("/api/getCredits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });
    const data = await res.json();
    if (data.success) setCredits(data.credits);
  }

  async function handleSendMessage() {
    if (!input.trim()) return;
    if (!wallet) return;

    if (credits <= 0) {
      alert("❌ Crediti insufficienti. Ricarica prima di continuare.");
      return;
    }

    const userMessage = input.trim();
    setMessages([...messages, { from: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://replicate-ai-production.up.railway.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await res.json();
      const aiResponse = data.output || "Errore nella risposta AI.";

      setMessages((prev) => [...prev, { from: "ai", text: aiResponse }]);

      // 🔻 Scala 1 credito dopo la risposta
      await fetch("/api/updateCredits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, amount: -1 }),
      });

      // 🔄 Aggiorna crediti mostrati
      fetchCredits(wallet);
    } catch (err) {
      console.error("Errore AI:", err);
      alert("❌ Errore nel contattare l'AI.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">💬 Chatta con Giulia</h1>
      <p className="mb-2">Crediti disponibili: <strong>{credits}</strong> Pi 💰</p>

      <div className="bg-white p-4 rounded shadow mb-4 h-96 overflow-y-scroll">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded ${
              msg.from === "user" ? "bg-blue-100 text-right" : "bg-pink-100 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Scrivi qui..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          onClick={handleSendMessage}
          disabled={loading}
        >
          Invia
        </button>
      </div>
    </div>
  );
}
