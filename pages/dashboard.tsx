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
    <div style={{ padding: "20px" }}>
      <h1>
        <span role="img" aria-label="slot">
          🎰
        </span>{" "}
        Dashboard Utente
      </h1>
      <div>
        <span>Wallet: </span>
        <strong>{wallet}</strong>
      </div>
      <div>
        <span>Crediti: </span>
        <strong>{credits !== null ? credits : "Caricamento..."}</strong>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePlayAI}>Gioca con AI</button>
        <button onClick={handleRecharge} style={{ marginLeft: "10px" }}>
          Ricarica
        </button>
      </div>
    </div>
  );
}
