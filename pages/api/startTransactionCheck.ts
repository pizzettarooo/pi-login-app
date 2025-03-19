import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SERVER_URL = "https://api.testnet.minepi.com";
const WALLET_DESTINATARIO = "GCMEELHBN6VBVFGVRRD7PAGJZY63F3PWA4CL6QGXCYNMFPFL6J77B2RV"; // Il tuo wallet
const EXPECTED_AMOUNT = "1.0000000"; // Importo previsto

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { wallet } = req.body;

  if (!wallet) {
    return res.status(400).json({ error: "Wallet mancante" });
  }

  console.log(`🔍 Inizio verifica per ${wallet}`);

  const startTime = Date.now();
  const timeout = 5 * 60 * 1000; // 5 minuti

  const interval = setInterval(async () => {
    if (Date.now() - startTime > timeout) {
      console.log(`❌ Tempo scaduto per ${wallet}`);
      clearInterval(interval);
      return;
    }

    try {
      const response = await axios.get(`${SERVER_URL}/accounts/${WALLET_DESTINATARIO}/transactions?order=desc&limit=10`);
      const transactions = response.data._embedded.records;

      for (const tx of transactions) {
        if (tx.successful && tx.operation_count === 1) {
          const operationsResponse = await axios.get(tx._links.operations.href);
          const operations = operationsResponse.data._embedded.records;

          for (const op of operations) {
            if (op.type === "payment" && op.to === WALLET_DESTINATARIO && op.amount === EXPECTED_AMOUNT) {
              console.log(`✅ Pagamento ricevuto da ${wallet}, TX: ${tx.hash}`);
              clearInterval(interval);

              // Aggiorna i crediti dell'utente su Supabase
              const { data, error } = await supabase
                .from("users")
                .select("credits")
                .eq("wallet", wallet)
                .single();

              if (!error && data) {
                const newCredits = data.credits + 1;
                await supabase
                  .from("users")
                  .update({ credits: newCredits })
                  .eq("wallet", wallet);
                console.log(`💰 Crediti aggiornati: ${newCredits} per ${wallet}`);
              } else {
                console.log("⚠️ Utente non trovato, impossibile aggiornare crediti.");
              }

              return res.status(200).json({ success: true, message: "Pagamento ricevuto e crediti aggiornati!" });
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ Errore durante il controllo delle transazioni:", error);
    }
  }, 10000); // Controlla ogni 10 secondi
}
