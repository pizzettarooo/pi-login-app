const WebSocket = require('ws');

const walletAddress = "GCMEELHBN6VBVFGVRRD7PAGJZY63F3PWA4CL6QGXCYNMFPFL6J77B2RV";
const ws = new WebSocket(`wss://api.testnet.minepi.com/accounts/${walletAddress}/transactions`);

ws.on('open', function open() {
    console.log("📡 Connesso al WebSocket, in attesa di nuove transazioni...");
});

ws.on('message', function incoming(data) {
    console.log("💰 Nuova transazione ricevuta:", JSON.parse(data));
});

ws.on('error', function error(err) {
    console.error("❌ Errore WebSocket:", err);
});

ws.on('close', function close() {
    console.log("🔴 Connessione WebSocket chiusa.");
});
