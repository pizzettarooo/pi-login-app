// monitorPolling.ts
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE!
const STELLAR_WALLET = process.env.SITE_WALLET!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
  console.log("🚀 Monitor polling avviato")

  // 1. Recupera ultimo timestamp salvato
  const { data: state } = await supabase
    .from('monitor_state')
    .select('last_checked_timestamp')
    .eq('id', 1)
    .single()

  const lastTimestamp = state?.last_checked_timestamp || '1970-01-01T00:00:00Z'
  console.log("🕓 Ultimo timestamp elaborato:", lastTimestamp)

  // 2. Ottieni transazioni recenti da Horizon
  const url = `https://api.stellar.expert/explorer/public/account/${STELLAR_WALLET}/payments?limit=100&order=desc`
  const res = await axios.get(url)
  const allTransactions = res.data._embedded.records

  let newTxns = 0

  for (const tx of allTransactions) {
    if (tx.created_at <= lastTimestamp) continue // Già elaborata
    if (tx.to !== STELLAR_WALLET || tx.asset_type !== 'native') continue // Solo transazioni in Pi

    const senderWallet = tx.from
    const amount = parseFloat(tx.amount)

    // Cerca l'utente in Supabase
    const { data: user } = await supabase
      .from('users')
      .select('id, credits')
      .eq('wallet', senderWallet)
      .single()

    if (!user) {
      console.log(`⚠️ Wallet non registrato: ${senderWallet}`)
      continue
    }

    // 3. Aggiungi crediti all'utente
    await supabase
      .from('users')
      .update({ credits: user.credits + amount })
      .eq('id', user.id)

    // 4. Salva transazione
    await supabase
      .from('transactions')
      .insert({ id: tx.id, user_id: user.id, amount, type: 'deposit' })

    console.log(`💰 Accreditati ${amount} Pi a ${senderWallet}`)
    newTxns++
  }

  // 5. Aggiorna timestamp
  const newTimestamp = allTransactions[0]?.created_at || lastTimestamp
  await supabase
    .from('monitor_state')
    .upsert({ id: 1, last_checked_timestamp: newTimestamp }, { onConflict: 'id' })

  console.log(`✅ ${newTxns} nuove transazioni elaborate.`)
}

main().catch(err => console.error("❌ Errore monitorPolling:", err))
