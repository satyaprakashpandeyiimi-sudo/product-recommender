import { extractIdsFromChatCompletion } from './utils.js';

const cases = [
  {
    name: 'clean json in message.content',
    completion: { choices: [{ message: { content: '["a","b","c"]' } }] }
  },
  {
    name: 'json with text around it',
    completion: { choices: [{ message: { content: 'Here are some ids: ["x","y"]' } }] }
  },
  {
    name: 'legacy .text property',
    completion: { choices: [{ text: '["1","2"]' }] }
  },
  {
    name: 'delta content',
    completion: { choices: [{ delta: { content: '["d","e"]' } }] }
  }
];

for (const c of cases) {
  try {
    const ids = extractIdsFromChatCompletion(c.completion);
    console.log(`PASS: ${c.name} =>`, ids);
  } catch (err) {
    console.error(`FAIL: ${c.name} =>`, err.message);
  }
}

// Invalid case - expected to throw
try {
  extractIdsFromChatCompletion({ choices: [{ message: { content: 'no json here' } }] });
  console.error('FAIL: invalid content should have thrown');
} catch (err) {
  console.log('PASS: invalid content threw error:', err.message);
}
