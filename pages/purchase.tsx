import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PurchasePage() {
  const [status, setStatus] = useState("In attesa di pagamento...");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minuti
  const router = useRouter();
  const WALLET_DESTINAZIONE = "GCMEELHBN6VBVFGVRRD7PAGJZY63F3PWA4CL6QGXCYNMFPFL6J77B2RV";

  useEffect(() => {
    let interval = setInterval(async () => {
      const response = await fetch("/api/checkTransactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: WALLET_DESTINAZIONE, amount: 1 }), // Controlliamo solo transazioni di 1 Pi
      });

      const data = await response.json();
      if (data.success) {
        setStatus("✅ Pagamento confermato! Reindirizzamento...");
        clearInterval(interval);

        // ⏳ Aspetta 3 secondi e reindirizza alla dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
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
      <p>Invia <strong>1 Pi</strong> al seguente wallet:</p>
      <h3 style={{ color: "blue" }}>{WALLET_DESTINAZIONE}</h3>
      <p>Tempo rimasto: {timeLeft} secondi</p>
      <h2>{status}</h2>
    </div>
  );
}
