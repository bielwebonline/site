// api/test.js — visita /api/test en tu web para diagnosticar
module.exports = function handler(req, res) {
  const hasKey = !!process.env.GROQ_API_KEY;
  const keyPreview = hasKey
    ? process.env.GROQ_API_KEY.substring(0, 8) + '...'
    : 'NO ENCONTRADA';

  res.status(200).json({
    status: 'ok',
    groq_key_present: hasKey,
    groq_key_preview: keyPreview,
    node_version: process.version,
    timestamp: new Date().toISOString()
  });
};
