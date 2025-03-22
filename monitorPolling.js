import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lytlsiqllcbyqziveqca.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5dGxzaXFsbGNieXF6aXZlcWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxOTU1NTksImV4cCI6MjA1Nzc3MTU1OX0.P4mWU1dXtt82lk0bHc6I9cURfK3c6rl09RF2miqSglA'; // usa la tua chiave completa
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WALLET_ADDRESS = 'GCMEELHBN6VBVFGVRRD7PAGJZY63F3PWA4CL6QGXCYNMFPFL6J77B2RV';
const STELLAR_API = `https://api.testnet.minepi.com/accounts/${WALLET_ADDRESS}/transactions`;

let lastCursor = null; // qui memorizziamo l'ultimo paging_token

async function fetchTransactions() {
  try {
    const url = lastCursor
      ? `${STELLAR_API}?cursor=${lastCursor}&order=asc`
      : `${STELLAR_API}?order=asc`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Errore nella richiesta API Stellar');

    const data = await response.json();
    return data._embedded?.records || [];
  } catch (error) {
    console.error('❌ Errore nel recupero delle transazioni:', error.message);
    return [];
  }
}

async function processTransactions() {
  console.log('🔍 Controllo nuove transazioni...');
  const transactions = await fetchTransactions();

  for (const tx of transactions) {
    const { id, created_at, source_account, paging_token } = tx;

    // Aggiorna il cursore per evitare duplicati in futuro
    lastCursor = paging_token;

    const { data: existingTx } = await supabase
      .from('transactions')
      .select('id')
      .eq('id', id)
      .single();

    if (existingTx) {
      console.log(`🔹 Transazione ${id} già registrata. Ignorata.`);
      continue;
    }

    const operationURL = tx._links.operations.href.replace('{?cursor,limit,order}', '');
    const opRes = await fetch(operationURL);
    const opData = await opRes.json();
    const operation = opData._embedded?.records?.[0];

    if (!operation || operation.type !== 'payment' || operation.to !== WALLET_ADDRESS) {
      console.log(`⏭️ Transazione ${id} non è un pagamento in entrata. Ignorata.`);
      continue;
    }

    const amount = parseFloat(operation.amount);

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, credits')
      .eq('wallet', source_account)
      .single();

    if (!user) {
      console.log(`⚠️ Mittente ${source_account} non trovato nel database.`);
      if (userError) console.error('❌ Errore Supabase:', userError.message);
      continue;
    }

    const updatedCredits = user.credits + Math.floor(amount);

    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: updatedCredits })
      .eq('id', user.id);

    if (updateError) {
      console.error(`❌ Errore aggiornamento crediti per ${source_account}:`, updateError);
      continue;
    }

    const { error: insertError } = await supabase
      .from('transactions')
      .insert([{ id, user_id: user.id, amount, type: 'payment', created_at }]);

    if (insertError) {
      console.error(`❌ Errore salvataggio transazione ${id}:`, insertError);
      continue;
    }

    console.log(`✅ Transazione ${id} registrata. Importo: ${amount} Pi. Crediti aggiornati a ${updatedCredits}.`);
  }
}

setInterval(processTransactions, 30000);
console.log('🔍 Monitoraggio transazioni avviato...');
