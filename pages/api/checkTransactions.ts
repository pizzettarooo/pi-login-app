import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY!;
const WALLET_DESTINATARIO = "TUO_WALLET_PI"; // Cambia con il wallet del sito
const EXPECTED_AMOUNT = "1.0000000";
const SERVER_URL = "https://api.testnet.minepi.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo non consentito" });

  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: "Wallet non fornito" });

  try {
    const response = await axios.get(`${SERVER_URL}/accounts/${WALLET_DESTINATARIO}/transactions?order=desc&limit=10`);
    const transactions = response.data._embedded.records;

    for (const tx of transactions) {
      if (tx.successful && tx.operation_count === 1) {
        const operationsResponse = await axios.get(`${SERVER_URL}/transactions/${tx.hash}/operations`);
        const operations = operationsResponse.data._embedded.records;

        for (const op of operations) {
          if (op.type === "payment" && op.to === WALLET_DESTINATARIO && op.amount === EXPECTED_AMOUNT && op.from === wallet) {
            // Aggiorna crediti utente
            const { data, error } = await supabase.from("users").select("credits").eq("wallet", wallet).single();

            if (!error && data) {
              const newCredits = data.credits + 1;
              await supabase.from("users").update({ credits: newCredits }).eq("wallet", wallet);
              return res.json({ success: true, message: "Pagamento confermato!" });
            }
          }
        }
      }
    }

    return res.json({ success: false, message: "Pagamento non trovato." });
  } catch (error) {
    console.error("Errore nel controllo delle transazioni:", error);
    return res.status(500).json({ error: "Errore nel server" });
  }
}
