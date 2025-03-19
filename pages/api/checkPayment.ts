import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const WALLET_ADDRESS = "GCMEELHBN6VBVFGVRRD7PAGJZY63F3PWA4CL6QGXCYNMFPFL6J77B2RV"; // Wallet destinatario
const PI_API_URL = `https://api.testnet.minepi.com/accounts/${WALLET_ADDRESS}/payments`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { wallet, purchaseTime } = req.body;

  if (!wallet || !purchaseTime) {
    return res.status(400).json({ error: "Dati mancanti" });
  }

  try {
    const response = await fetch(PI_API_URL);
    if (!response.ok) {
      throw new Error(`Errore nella richiesta: ${response.statusText}`);
    }

    const data = await response.json() as { _embedded?: { records?: any[] } };
    const transactions = data._embedded?.records || [];
    
    

    // Filtra solo le transazioni ricevute DOPO la richiesta
    const validTransaction = transactions.find(
      (tx: any) =>
        tx.type === "payment" &&
        tx.to === WALLET_ADDRESS &&
        parseFloat(tx.amount) === 1 &&
        new Date(tx.created_at) > new Date(purchaseTime) // Confronta con il timestamp
    );

    if (validTransaction) {
      return res.status(200).json({ success: true, tx: validTransaction.id });
    }

    return res.status(200).json({ success: false });
  } catch (error) {
    console.error("Errore nel controllo della transazione:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
}
