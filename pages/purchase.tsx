import { useEffect, useState } from "react";

export default function PurchasePage() {
  const [status, setStatus] = useState("In attesa di pagamento...");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minuti

  useEffect(() => {
    let interval = setInterval(async () => {
      const response = await fetch("/api/checkTransactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: "TUO_WALLET" }), // Cambia con il wallet dell'utente
      });

      const data = await response.json();
      if (data.success) {
        setStatus("✅ Pagamento confermato! Crediti aggiornati.");
        clearInterval(interval);
      } else {
        setTimeLeft((prev) => prev - 10);
        if (timeLeft <= 0) {
          setStatus("❌ Pagamento non ricevuto in tempo.");
          clearInterval(interval);
        }
      }
    }, 10000); // Controlla ogni 10 secondi

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Effettua il Pagamento</h1>
      <p>Invia 1 Pi al wallet indicato e attendi la conferma.</p>
      <p>Tempo rimasto: {timeLeft} secondi</p>
      <h2>{status}</h2>
    </div>
  );
}
