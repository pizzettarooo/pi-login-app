import { useEffect, useState } from "react";

export default function Dashboard() {
  const [wallet, setWallet] = useState("");
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      setWallet(storedWallet);
      fetchCredits(storedWallet);
    }
  }, []);

  const fetchCredits = async (wallet: string) => {
    try {
      const response = await fetch("/api/getCredits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet }),
      });

      const data = await response.json();
      setCredits(data.credits ?? 0);
    } catch (error) {
      console.error("Errore nel recupero crediti:", error);
    }
  };

  const handlePlayAI = () => {
    window.location.href = "/chat";
  };

  const handleRecharge = () => {
    window.location.href = "/ricarica";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">
      <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white border-opacity-20">
        <h1 className="text-3xl font-bold text-center mb-6">
          🎰 Dashboard Utente
        </h1>

        <div className="mb-4 text-center">
          <p className="text-sm uppercase text-gray-400 mb-1">Wallet</p>
          <p className="text-lg font-semibold break-all text-emerald-400">{wallet}</p>
        </div>

        <div className="mb-6 text-center">
          <p className="text-sm uppercase text-gray-400 mb-1">Crediti</p>
          <p className="text-2xl font-bold text-yellow-400">
            {credits !== null ? credits : "Caricamento..."}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={handlePlayAI}
            className="bg-blue-600 hover:bg-blue-700 transition rounded-xl py-2 font-semibold"
          >
            Gioca con AI
          </button>
          <button
            onClick={handleRecharge}
            className="bg-purple-600 hover:bg-purple-700 transition rounded-xl py-2 font-semibold"
          >
            Ricarica
          </button>
        </div>
      </div>
    </div>
  );
}
