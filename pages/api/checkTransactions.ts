import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const STELLAR_API = "https://api.mainnet.minepi.com/accounts/";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Metodo non consentito" });
  }

  const { wallet } = req.body;

  if (!wallet) {
    return res.status(400).json({ success: false, error: "Wallet richiesto" });
  }

  try {
    console.log(`🔍 Controllo transazioni per il wallet: ${wallet}`);

    // 🔍 Ottiene la lista delle transazioni del wallet
    const response = await axios.get(`${STELLAR_API}${wallet}/transactions`);
    console.log(`✅ API risposta ricevuta:`, response.data);

    const transactions = response.data?._embedded?.records || [];

    for (const tx of transactions) {
      console.log(`🔍 Analizzando transazione: ${tx.id}`);

      // 🔍 Prende i dettagli della transazione
      const txDetails = await axios.get(tx._links.operations.href);
      console.log(`📄 Dettagli transazione:`, txDetails.data);

      const operations = txDetails.data?._embedded?.records || [];

      for (const op of operations) {
        console.log(`➡️ Operazione trovata:`, op);

        if (op.type === "payment" && op.to === wallet && parseFloat(op.amount) > 0) {
          console.log(`✅ Transazione valida trovata:`, op);
          return res.status(200).json({ success: true, transaction: op });
        }
      }
    }

    console.log("❌ Nessuna transazione trovata.");
    return res.status(200).json({ success: false, message: "Nessuna transazione trovata" });

  } catch (error) {
    console.error("🚨 Errore nel recupero delle transazioni:", error);
    return res.status(500).json({ success: false, error: `Errore: ${error.message}` });
  }
}
