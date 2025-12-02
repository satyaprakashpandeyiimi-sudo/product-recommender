import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { extractIdsFromChatCompletion, createSystemMessage } from './utils.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

let openai;
  if (!process.env.OPENAI_API_KEY) {
  // Local mock mode - do not call the real OpenAI API when the key is missing
  console.warn('OPENAI_API_KEY is not set. Starting server in MOCK mode (no real OpenAI calls).');
    openai = {
      chat: {
        completions: {
          create: async (opts) => {
            // Allow an easy way to simulate invalid (non-JSON) model output during local testing
            const userContent = (opts?.messages || []).find(m => m.role === 'user')?.content || '';
            if (userContent.includes('bad response')) {
              return { choices: [{ message: { content: 'This is not JSON' } }] };
            }
            return { choices: [{ message: { content: '["p1","p2"]' } }] };
          }
        }
      }
    };
} else {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

app.post('/recommend', async (req, res) => {
  const { query, products } = req.body;

  // Validate body
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid request: "query" must be a string.' });
  }
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Invalid request: "products" must be an array.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [createSystemMessage(), { role: 'user', content: `User query: "${query}"\nProducts: ${JSON.stringify(products)}` }]
    });

    let ids;
    try {
      ids = extractIdsFromChatCompletion(completion);
    } catch (err) {
      console.error('Failed to extract IDs from model completion:', err);
      return res.status(500).json({ error: 'Failed to parse model output as JSON array of ids.' });
    }

    console.log('IDs', ids);
    res.json({ ids });
  } catch (error) {
    // Print the full error structure if possible to make debugging easier
    console.error('Error calling OpenAI:', error?.response?.status, error?.response?.data ?? error);
    res.status(500).json({ error: 'Failed to get recommendations. Please try again.' });
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
