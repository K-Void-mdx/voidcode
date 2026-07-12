const SYSTEM_PROMPT = `You are VOID Assistant, the intelligent learning companion for K-VOID Programming Hub.
You help users learn to code by explaining programming concepts clearly, providing code examples, debugging issues, suggesting learning paths, and answering questions about courses and lessons.
Be concise, accurate, and encouraging. Use code examples when helpful.`

const PROVIDERS = {
  groq: {
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    key: () => process.env.GROQ_API_KEY || ''
  },
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'openai/gpt-4o-mini',
    key: () => process.env.OPENROUTER_API_KEY || ''
  },
  opencodezen: {
    endpoint: 'https://zen.opencode.ai/v1/chat/completions',
    model: 'opencode-zen-1',
    key: () => process.env.OPENCODE_ZEN_API_KEY || ''
  },
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    key: () => process.env.GEMINI_API_KEY || ''
  }
}

async function callOpenAiLike(name, message, context) {
  const p = PROVIDERS[name]
  const key = p.key()
  if (!key) throw new Error('No key for ' + name)
  const resp = await fetch(p.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({
      model: p.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(context ? [{ role: 'system', content: 'Context: ' + context }] : []),
        { role: 'user', content: message }
      ],
      max_tokens: 1024,
      temperature: 0.7
    })
  })
  if (!resp.ok) throw new Error(name + ' ' + resp.status)
  const data = await resp.json()
  return data.choices[0].message.content
}

async function callGemini(message, context) {
  const key = PROVIDERS.gemini.key()
  if (!key) throw new Error('No key for gemini')
  const prompt = SYSTEM_PROMPT + '\n\n' + (context ? 'Context: ' + context + '\n\n' : '') + message
  const resp = await fetch(PROVIDERS.gemini.endpoint + '?key=' + key, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
    })
  })
  if (!resp.ok) throw new Error('gemini ' + resp.status)
  const data = await resp.json()
  return data.candidates[0].content.parts[0].text
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } }
  }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) } }

  const { message, context, provider = 'groq' } = body
  if (!message) return { statusCode: 400, body: JSON.stringify({ error: 'message is required' }) }

  const order = [provider, 'groq', 'openrouter', 'gemini', 'opencodezen'].filter((p, i, a) => a.indexOf(p) === i)

  for (const p of order) {
    const cfg = PROVIDERS[p]
    if (!cfg || !cfg.key()) continue
    try {
      const reply = p === 'gemini' ? await callGemini(message, context) : await callOpenAiLike(p, message, context)
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ reply, provider: p })
      }
    } catch (e) {
      console.error(p, 'failed:', e.message)
    }
  }

  return { statusCode: 503, body: JSON.stringify({ error: 'All AI providers unavailable.' }) }
}
