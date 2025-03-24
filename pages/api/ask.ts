// pages/api/ask.ts

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      return res.status(200).end()
    }
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      })
  
      const data = await response.json()
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json(data)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Errore nella richiesta a Ollama' })
    }
  }
  