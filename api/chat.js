// api/chat.js — Vercel Serverless Proxy for Groq
const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured in Vercel environment variables' });
  }

  try {
    // Parse body — Vercel auto-parses JSON but handle both cases
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON body' }); }
    }

    const { messages } = body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages array' });
    }

    const payload = JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 400,
      temperature: 0.7
    });

    const groqResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => { data += chunk; });
        response.on('end', () => {
          resolve({ status: response.statusCode, body: data });
        });
      });

      request.on('error', reject);
      request.setTimeout(15000, () => {
        request.destroy();
        reject(new Error('Request timeout after 15s'));
      });

      request.write(payload);
      request.end();
    });

    let parsed;
    try { parsed = JSON.parse(groqResponse.body); }
    catch { return res.status(500).json({ error: 'Invalid JSON from Groq', raw: groqResponse.body.substring(0, 200) }); }

    if (groqResponse.status !== 200) {
      return res.status(groqResponse.status).json({ error: parsed?.error?.message || 'Groq API error', details: parsed });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error('Proxy error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
