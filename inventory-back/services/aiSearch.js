const nlp = require('compromise');
const OpenAI = require('openai');
const Item = require('../models/item');
const { sanitizePrompt } = require('../utils/sanitize');
const { scoreItem } = require('../utils/score');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.aiSearch = async (prompt) => {
  try {
    const cleaned = sanitizePrompt(prompt);
    const doc = nlp(cleaned);

    const keywords = [
      ...doc.nouns().out('array'),
      ...doc.adjectives().out('array'),
      ...doc.topics().out('array')
    ];

    const items = await Item.findAll();

    const scored = items.map(item => ({
      item,
      score: scoreItem(cleaned, item, keywords)
    }));

    const ranked = scored
      .filter(i => i.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(i => i.item);

    if (ranked.length > 0) {
      return ranked;
    }

    // fallback to vector search
    return await openaiFallback(prompt, items);

  } catch (err) {
    console.error("AI Search Error:", err);
    throw new Error('Something went wrong with AI search.');
  }
};

const openaiFallback = async (prompt, items) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: prompt
    });

    const promptVector = response.data[0].embedding;

    // You must have embeddings stored per item in your DB. Example:
    const scored = items.map(item => {
      const itemVector = item.embedding; // assume it's a stored array
      if (!itemVector) return { item, score: 0 };
      return {
        item,
        score: cosineSimilarity(promptVector, itemVector)
      };
    });

    return scored
      .filter(i => i.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(i => i.item);

  } catch (err) {
    console.error("OpenAI fallback error:", err);
    throw new Error("Vector search fallback failed.");
  }
};

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}
