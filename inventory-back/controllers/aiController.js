const { aiSearch } = require('../services/aiSearch');

exports.search = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    const results = await aiSearch(prompt);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No items matched your prompt' });
    }
    res.json({ message: 'AI search results', data: results });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'AI search failed', error: err.message });
  }
};
