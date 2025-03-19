import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch("/api/getCredits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet: "TUO_WALLET" }), // Cambia con il wallet dell'utente
        });

        const data = await response.json();
        if (data.success) {
          setCredits(data.credits);
        } else {
          setCredits(0);
        }
      } catch (error) {
        console.error("Errore nel recupero dei crediti:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCredits();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Dashboard</h1>
      <p>Benvenuto! Qui puoi gestire il tuo account.</p>

      {loading ? (
        <p>Caricamento crediti...</p>
      ) : (
        <h2>Crediti disponibili: {credits !== null ? credits : "Errore"}</h2>
      )}

      <Link href="/purchase">
        <button style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", marginTop: "20px" }}>
          Effettua un Pagamento
        </button>
      </Link>
    </div>
  );
}
