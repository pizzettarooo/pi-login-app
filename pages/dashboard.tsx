import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [credits, setCredits] = useState<number>(0);
  const [wallet, setWallet] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
      console.log("💾 Wallet:", savedWallet);
      setWallet(savedWallet);
      fetchCredits(savedWallet);
    } else {
      console.warn("⚠️ Nessun wallet trovato nel localStorage.");
    }
  }, []);

  async function fetchCredits(wallet: string) {
    try {
      const res = await fetch("/api/getCredits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });

      const data = await res.json();
      if (data.success) {
        setCredits(data.credits);
      } else {
        setCredits(0);
      }
    } catch (err) {
      console.error("Errore nel recupero crediti:", err);
    }
  }

  // ✅ Funzione per chiamare AI su Railway
  async function handleAskAI() {
    try {
      const res = await fetch("https://replicate-ai-production.up.railway.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Ciao, come stai?" }),
      });

      const data = await res.json();
      console.log("🤖 Risposta AI:", data.output);
      alert(data.output);
    } catch (err) {
      console.error("Errore nella richiesta AI:", err);
      alert("❌ Errore nel contattare l'AI.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {wallet ? (
        <>
          <p className="text-xl text-center mb-4">
            Wallet: <strong>{wallet}</strong><br />
            Crediti disponibili: <strong>{credits}</strong> Pi 💰
          </p>

          <button
            className="mb-3 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => router.push("/ricarica")}
          >
            Ricarica crediti
          </button>

          <button
            className="mb-3 px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            onClick={() => router.push("/chat")}
          >
            💋 Chatta con Giulia (1 Pi / messaggio)
          </button>

          {/* ✅ Bottone per test diretto su Railway */}
          <button
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleAskAI}
          >
            Test AI su Railway
          </button>
        </>
      ) : (
        <p className="text-red-500">Nessun wallet trovato. Fai il login prima!</p>
      )}
    </div>
  );
}
