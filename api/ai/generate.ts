import type { IncomingMessage, ServerResponse } from 'http';

/**
 * POST /api/ai/generate
 *
 * Serverless function that proxies requests to the Gemini API.
 * GEMINI_API_KEY is accessed exclusively in this server environment
 * and is never exposed to the client browser.
 *
 * Deployed on Vercel — runs as a serverless function in production.
 * In development, served by the Vite middleware defined in vite.config.ts.
 *
 * Body: { prompt: string; model?: string }
 * Response: { raw: string } | { error: string }
 */

interface RequestBody {
  prompt: string;
  model?: string;
}

// Shared handler used by both Vercel and the Vite dev middleware
export async function handleGenerate(
  body: RequestBody,
  apiKey: string,
): Promise<{ status: number; json: Record<string, unknown> }> {
  const { prompt, model = 'gemini-3.1-flash-lite' } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return { status: 400, json: { error: 'Prompt is required' } };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errorBody = await geminiRes.json().catch(() => ({}));
      const status = geminiRes.status;
      if (status === 429) return { status: 429, json: { error: 'QUOTA_EXCEEDED' } };
      if (status === 400) return { status: 400, json: { error: 'INVALID_REQUEST', detail: errorBody } };
      if (status === 403) return { status: 403, json: { error: 'INVALID_API_KEY' } };
      return { status, json: { error: 'GEMINI_ERROR', detail: errorBody } };
    }

    const data = await geminiRes.json();
    const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!rawText) {
      const finishReason = data?.candidates?.[0]?.finishReason;
      if (finishReason === 'SAFETY') return { status: 200, json: { error: 'SAFETY_BLOCKED' } };
      return { status: 200, json: { error: 'EMPTY_RESPONSE' } };
    }

    return { status: 200, json: { raw: rawText } };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { status: 503, json: { error: 'NETWORK_ERROR', detail: message } };
  }
}

// ─── Vercel Handler (production) ─────────────────────────────────────────────

export default async function handler(req: IncomingMessage & { body?: RequestBody }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'INVALID_API_KEY' }));
    return;
  }

  const body = req.body ?? {};
  const result = await handleGenerate(body as RequestBody, apiKey);

  res.writeHead(result.status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(result.json));
}
