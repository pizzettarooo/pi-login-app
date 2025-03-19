import { useRouter } from "next/router";

export default function CheckoutPage() {
  const router = useRouter();

  const handlePayment = () => {
    alert("💳 Pagamento completato con successo!");
    router.push("/dashboard"); // 🔥 DOPO IL PAGAMENTO, VA ALLA DASHBOARD
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Pagamento Richiesto</h2>
      <p>Per accedere ai servizi, effettua un pagamento di <b>1 Pi</b>.</p>
      <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Paga 1 Pi
      </button>
    </div>
  );
}
