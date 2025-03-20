import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const STELLAR_API = "https://api.testnet.minepi.com/accounts/";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { wallet, amount } = req.body;

  if (!wallet || !amount) {
    return res.status(400).json({ success: false, error: "Wallet e importo richiesti" });
  }

  try {
    // 🔍 Ottiene la lista delle transazioni dal wallet
    const response = await axios.get(`${STELLAR_API}${wallet}/transactions`);
    const transactions = response.data?._embedded?.records || [];

    // 🔎 Trova una transazione valida con l'importo giusto
    const validTransaction = transactions.find((tx: any) => {
      return tx.source_account !== wallet && parseFloat(tx.amount) === amount;
    });

    if (validTransaction) {
      return res.status(200).json({ success: true, transaction: validTransaction });
    } else {
      return res.status(200).json({ success: false, message: "Nessuna transazione con importo corretto trovata" });
    }
  } catch (error) {
    console.error("Errore nel controllo transazioni:", error);
    return res.status(500).json({ success: false, error: "Errore nel recupero delle transazioni" });
  }
}
