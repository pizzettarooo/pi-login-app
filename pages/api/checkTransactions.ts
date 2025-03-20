import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const STELLAR_API = "https://api.testnet.minepi.com/accounts/";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { wallet } = req.body;

  if (!wallet) {
    return res.status(400).json({ success: false, error: "Wallet richiesto" });
  }

  try {
    // 🔍 Ottiene la lista delle transazioni dal wallet
    const response = await axios.get(`${STELLAR_API}${wallet}/transactions`);
    const transactions = response.data?._embedded?.records || [];

    // 🔎 Controlla se ci sono transazioni ricevute dal wallet
    const receivedTransactions = transactions.filter((tx: any) => {
      return tx.source_account !== wallet; // Esclude le transazioni inviate dal wallet stesso
    });

    if (receivedTransactions.length > 0) {
      return res.status(200).json({ success: true, transactions: receivedTransactions });
    } else {
      return res.status(200).json({ success: false, message: "Nessuna transazione in entrata trovata" });
    }
  } catch (error) {
    console.error("Errore nel controllo transazioni:", error);
    return res.status(500).json({ success: false, error: "Errore nel recupero delle transazioni" });
  }
}
