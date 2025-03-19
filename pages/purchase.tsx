import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PurchasePage() {
  const [status, setStatus] = useState("⏳ In attesa di pagamento...");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minuti (300 secondi)
  const router = useRouter();
  
  const WALLET_DESTINATION = "GCMEELHBN6VBVFGVRRD7PAGJZY63F3PWA4CL6QGXCYNMFPFL6J77B2RV";
  const AMOUNT_REQUIRED = 1; // Cambia con l'importo corretto

  useEffect(() => {
    let interval = setInterval(async () => {
      const response = await fetch("/api/checkTransactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: WALLET_DESTINATION, amount: AMOUNT_REQUIRED }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus("✅ Pagamento confermato! Crediti aggiornati.");
        clearInterval(interval);
        setTimeout(() => {
          router.push("/dashboard"); // 🔄 Reindirizza alla dashboard dopo la conferma
        }, 2000);
      } else {
        setTimeLeft((prev) => prev - 10);
        if (timeLeft <= 0) {
          setStatus("❌ Pagamento non ricevuto in tempo.");
          clearInterval(interval);
        }
      }
    }, 10000); // Controlla ogni 10 secondi

    return () => clearInterval(interval);
  }, [timeLeft, router]);

  return (
    <div className="p-6 bg-white rounded shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4">Effettua il Pagamento</h1>
      <p className="text-lg mb-2">Invia <strong>{AMOUNT_REQUIRED} Pi</strong> al seguente wallet:</p>
      
      <p className="text-xl font-mono text-blue-600 bg-gray-100 p-2 rounded-md break-all">
        {WALLET_DESTINATION}
      </p>

      <p className="text-sm text-gray-600 mt-2">Tempo rimasto: <strong>{timeLeft} secondi</strong></p>

      <h2 className="text-lg font-semibold mt-4">{status}</h2>
    </div>
  );
}
