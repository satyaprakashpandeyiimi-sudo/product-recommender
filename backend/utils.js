export function extractIdsFromChatCompletion(completion) {
  if (!completion) {
    throw new Error('No completion provided');
  }

  const rawChoices = completion?.choices;
  if (!rawChoices || rawChoices.length === 0) {
    throw new Error('OpenAI returned no choices');
  }
  const choice = rawChoices[0];
  const content = choice?.message?.content ?? choice?.text ?? (choice?.delta && choice.delta.content) ?? null;
  if (!content) {
    throw new Error('OpenAI returned no content');
  }

  let ids;
  try {
    ids = JSON.parse(content);
  } catch (err) {
    const match = content.match(/(\[[\s\S]*?\])/);
    if (!match) {
      throw new Error(`Could not find JSON array in model output: ${content}`);
    }
    try {
      ids = JSON.parse(match[1]);
    } catch (err2) {
      throw new Error(`Failed to parse JSON substring from model output: ${match[1]} - ${err2}`);
    }
  }

  if (!Array.isArray(ids)) {
    throw new Error('Parsed result is not an array');
  }
  return ids;
}

export function createSystemMessage() {
  return {
    role: 'system',
    content:
      'You are a friendly product recommendation assistant. Return ONLY a JSON array of product IDs matching the user request. Example: ["id1", "id2"]. Do NOT include any other text.'
  };
}
