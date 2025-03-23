import { useState } from 'react'
import axios from 'axios'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ from: 'user' | 'ai', text: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const wallet = 'INSERISCI_IL_WALLET_ATTIVO' // Da sostituire dinamicamente con il wallet dell’utente loggato

  const sendMessage = async () => {
    if (!input.trim()) return
    setLoading(true)
    setMessages(prev => [...prev, { from: 'user', text: input }])

    try {
      const response = await axios.post('/api/chat', {
        wallet,
        message: input
      })

      const aiReply = response.data.reply
      setMessages(prev => [...prev, { from: 'user', text: input }, { from: 'ai', text: aiReply }])
    } catch (error: any) {
      setMessages(prev => [...prev, { from: 'ai', text: 'Errore: ' + (error?.response?.data?.error || 'Impossibile rispondere') }])
    }

    setInput('')
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Chatta con Giulia 💋</h1>

      <div className="bg-gray-100 p-4 rounded-lg h-[400px] overflow-y-scroll space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.from === 'user' ? 'text-right' : 'text-left'}>
            <span className={msg.from === 'user' ? 'text-blue-600' : 'text-pink-600'}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Scrivi un messaggio..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          Invia
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Giulia sta scrivendo...</p>}
    </div>
  )
}
