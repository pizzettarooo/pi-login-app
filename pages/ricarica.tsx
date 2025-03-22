import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Ricarica() {
  const [countdown, setCountdown] = useState(300); // 5 minuti = 300 secondi
  const [wallet, setWallet] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) setWallet(savedWallet);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard"); // Torna alla dashboard
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-4">
      <h1 className="text-3xl font-bold mb-4">Ricarica Crediti</h1>
      <p className="mb-2">Invia Pi al wallet qui sotto 👇</p>
      <p className="font-mono text-lg p-2 bg-gray-100 rounded mb-4">
        GCMEELHBN6VBVFGVRRD7PAGJZY63F3PWA4CL6QGXCYNMFPFL6J77B2RV
      </p>
      <p className="text-sm text-gray-600 mb-6">
        Hai <span className="font-bold">{formatTime(countdown)}</span> per completare il pagamento.
        Dopo verrai riportato automaticamente alla dashboard.
      </p>
      <button
        className="text-blue-600 underline mt-4"
        onClick={() => router.push("/dashboard")}
      >
        Torna subito alla dashboard
      </button>
    </div>
  );
}
