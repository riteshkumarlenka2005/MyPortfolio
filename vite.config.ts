import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

/**
 * Dev-only plugin: serves POST /api/ai/generate locally.
 * In production this is handled by the Vercel serverless function.
 * The GEMINI_API_KEY is injected from loadEnv so it is always available.
 */
function localApiPlugin(apiKey: string): Plugin {
  return {
    name: 'local-ai-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/ai/generate', async (req, res, next) => {
        if (req.method !== 'POST') return next();

        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'INVALID_API_KEY — add GEMINI_API_KEY to .env' }));
          return;
        }

        // Read request body
        let rawBody = '';
        req.on('data', (chunk: Buffer) => { rawBody += chunk.toString(); });
        req.on('end', async () => {
          let body: { prompt: string; model?: string };
          try { body = JSON.parse(rawBody); }
          catch { body = { prompt: '' }; }

          // Dynamically import to avoid bundling into client
          const { handleGenerate } = await import('./api/ai/generate');
          const result = await handleGenerate(body, apiKey);

          res.writeHead(result.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result.json));
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const geminiKey = env.GEMINI_API_KEY || '';
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), localApiPlugin(geminiKey)],
      define: {
        'process.env.API_KEY': JSON.stringify(geminiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
      },
      build: {
        chunkSizeWarningLimit: 1000,
      },
    };
});

