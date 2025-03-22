import { useEffect, useState } from "react";

export default function Dashboard() {
  const [credits, setCredits] = useState<number>(0);
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");

    if (savedWallet) {
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
        console.warn("❌ Crediti non trovati.");
        setCredits(0);
      }
    } catch (err) {
      console.error("❌ Errore durante il recupero crediti:", err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {wallet ? (
        <p className="text-xl">
          Wallet: <strong>{wallet}</strong><br />
          Crediti disponibili: <strong>{credits}</strong> Pi 💰
        </p>
      ) : (
        <p className="text-red-500">Nessun wallet trovato. Fai il login prima!</p>
      )}
    </div>
  );
}
