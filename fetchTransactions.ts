import fetch from 'node-fetch';

// Sostituisci con il tuo wallet pubblico su Pi Testnet
const WALLET_PUBLIC_KEY = "GCMEELHBN6VBVFGVRRD7PAGJZY63F3PWA4CL6QGXCYNMFPFL6J77B2RV";

// URL dell'API Horizon per recuperare le transazioni
const HORIZON_API_URL = `https://api.testnet.minepi.com/accounts/${WALLET_PUBLIC_KEY}/payments`;

async function fetchDeposits() {
    try {
        const response = await fetch(HORIZON_API_URL);
        if (!response.ok) {
            throw new Error(`Errore nella richiesta: ${response.statusText}`);
        }

        const data: any = await response.json();  // 👈 Qui forziamo il tipo `any`

        // Filtriamo solo i depositi (transazioni in entrata)
        const deposits = data._embedded?.records?.filter((tx: any) =>
            tx.type === "payment" && tx.to === WALLET_PUBLIC_KEY
        ) || [];

        if (deposits.length === 0) {
            console.log("🔴 Nessun deposito trovato.");
        } else {
            console.log("✅ Depositi ricevuti:");
            deposits.forEach((tx: any) => {
                console.log(`🔹 Importo: ${tx.amount} Pi - Da: ${tx.from} - ID Tx: ${tx.id}`);
            });
        }
    } catch (error) {
        console.error("❌ Errore:", error);
    }
}

// Esegui lo script
fetchDeposits();
