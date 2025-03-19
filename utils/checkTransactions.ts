import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// Variabili d'ambiente di Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("⚠️ Errore: Le variabili d'ambiente di Supabase non sono definite!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Configurazione del wallet e importo previsto
const WALLET_ADDRESS = "TUO_WALLET_PI"; // ⚠️ Sostituisci con il tuo wallet personale
const WALLET_DESTINATARIO = "GCMEELHBN6VBVFGVRRD7PAGJZY63F3PWA4CL6QGXCYNMFPFL6J77B2RV"; // ⚠️ Wallet che riceve i pagamenti
const EXPECTED_AMOUNT = "1.0000000"; // Importo esatto in Pi
const SERVER_URL = "https://api.testnet.minepi.com"; // URL del nodo Pi Testnet

// Funzione per controllare le transazioni
async function checkTransactions() {
  console.log("🔍 Controllo transazioni in corso...");

  try {
    // Ottenere la lista delle ultime transazioni del wallet destinatario
    const response = await axios.get(`${SERVER_URL}/accounts/${WALLET_DESTINATARIO}/transactions?order=desc&limit=10`);
    
    if (!response.data || !response.data._embedded || !response.data._embedded.records) {
      console.log("⚠️ Nessuna transazione trovata.");
      return;
    }

    const transactions = response.data._embedded.records;

    for (const tx of transactions) { // Iteriamo sulle transazioni ricevute
      if (tx.successful && tx.operation_count === 1) {
        // Recuperiamo l'URL corretto per le operazioni di questa transazione
        const operationsUrl = tx._links.operations.href.split('{')[0];
        const operationsResponse = await axios.get(operationsUrl);
        
        if (!operationsResponse.data || !operationsResponse.data._embedded || !operationsResponse.data._embedded.records) {
          console.log(`⚠️ Nessuna operazione trovata per la transazione ${tx.hash}`);
          continue;
        }

        const operations = operationsResponse.data._embedded.records;

        for (const op of operations) {
          if (op.type === "payment" && op.to === WALLET_DESTINATARIO && op.amount === EXPECTED_AMOUNT) {
            console.log("✅ Pagamento ricevuto:", tx.hash);
            
            const senderWallet = op.from;

            // Controlliamo se l'utente esiste nel database
            const { data, error } = await supabase
              .from("users")
              .select("credits")
              .eq("wallet", senderWallet)
              .single();

            if (!error && data) {
              const newCredits = data.credits + 1;
              await supabase
                .from("users")
                .update({ credits: newCredits })
                .eq("wallet", senderWallet);
              console.log(`💰 Crediti aggiornati: ${newCredits} per ${senderWallet}`);

              // ✅ Notifica all'utente (puoi personalizzare questa parte)
              console.log(`🔔 L'utente ${senderWallet} ha ricevuto 1 credito!`);
            } else {
              console.log("⚠️ Utente non trovato, impossibile aggiornare crediti.");
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Errore durante il controllo delle transazioni:", error);
  }
}

// **Esegui lo script ogni 10 secondi per controllare le transazioni**
setInterval(checkTransactions, 10000);
