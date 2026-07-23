/**
 * AI Communication Engine — useAIEngine Hook
 *
 * Full state machine for the UI:
 *   idle → validating → generating → done → error
 *
 * UI components call this hook. They never touch AIEngine directly.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { aiEngine } from '../core/AIEngine';
import type { AIRequest, AIResponse, ContactFormData, Purpose, ToneAction } from '../types/ai.types';
import { AIError } from '../types/error.types';

export type EngineStatus = 'idle' | 'generating' | 'done' | 'error' | 'sending' | 'sent';

export interface AIEngineState {
  status:         EngineStatus;
  response:       AIResponse | null;
  error:          string | null;         // User-facing error message
  isFallback:     boolean;
  generationCount: number;
  providerStatus: 'online' | 'offline' | 'checking';
}

export interface UseAIEngineReturn extends AIEngineState {
  generate:    (request: AIRequest) => Promise<void>;
  generateGreeting: (name: string) => Promise<string>;
  regenerate:  (request: AIRequest) => Promise<void>;
  improve:     (request: AIRequest, action: ToneAction) => Promise<void>;
  send:        (formData: ContactFormData, subject: string, message: string) => Promise<void>;
  reset:       () => void;
  detectIntent: (text: string) => ReturnType<typeof aiEngine.detectIntent>;
  session:     ReturnType<typeof aiEngine.getSession>;
  providerInfo: ReturnType<typeof aiEngine.getProviderInfo>;
}

export function useAIEngine(): UseAIEngineReturn {
  const [state, setState] = useState<AIEngineState>({
    status:          'idle',
    response:        null,
    error:           null,
    isFallback:      false,
    generationCount: 0,
    providerStatus:  'checking',
  });

  const generationCountRef = useRef(0);

  // Check provider status on mount
  useEffect(() => {
    let cancelled = false;
    aiEngine.checkStatus().then(s => {
      if (!cancelled) {
        setState(prev => ({ ...prev, providerStatus: s }));
      }
    });
    return () => { cancelled = true; };
  }, []);

  const setGenerating = () =>
    setState(prev => ({ ...prev, status: 'generating', error: null }));

  const setDone = (response: AIResponse) => {
    generationCountRef.current += 1;
    setState(prev => ({
      ...prev,
      status:          'done',
      response,
      error:           null,
      isFallback:      response.isFallback,
      generationCount: generationCountRef.current,
    }));
  };

  const setError = (err: unknown) => {
    const msg = err instanceof AIError
      ? err.userMessage
      : 'Something went wrong. Please try again.';
    setState(prev => ({ ...prev, status: 'error', error: msg }));
  };

  const generate = useCallback(async (request: AIRequest) => {
    setGenerating();
    try {
      const response = await aiEngine.generate(request);
      setDone(response);
    } catch (err) {
      setError(err);
    }
  }, []);

  const regenerate = useCallback(async (request: AIRequest) => {
    setGenerating();
    try {
      const response = await aiEngine.regenerate(request);
      setDone(response);
    } catch (err) {
      setError(err);
    }
  }, []);

  const improve = useCallback(async (request: AIRequest, action: ToneAction) => {
    if (!state.response) return;
    setGenerating();
    try {
      const response = await aiEngine.improve(
        request,
        action,
        state.response.subject,
        state.response.message,
      );
      setDone(response);
    } catch (err) {
      setError(err);
    }
  }, [state.response]);

  const send = useCallback(async (
    formData: ContactFormData,
    subject:  string,
    message:  string,
  ) => {
    setState(prev => ({ ...prev, status: 'sending', error: null }));
    try {
      await aiEngine.send(formData, subject, message);
      setState(prev => ({ ...prev, status: 'sent' }));
    } catch (err) {
      setError(err);
    }
  }, []);

  const reset = useCallback(() => {
    generationCountRef.current = 0;
    setState({
      status:          'idle',
      response:        null,
      error:           null,
      isFallback:      false,
      generationCount: 0,
      providerStatus:  state.providerStatus,
    });
  }, [state.providerStatus]);

  return {
    ...state,
    generate,
    generateGreeting: (name: string) => aiEngine.generateGreeting(name),
    regenerate,
    improve,
    send,
    reset,
    detectIntent: (text) => aiEngine.detectIntent(text),
    session:      aiEngine.getSession(),
    providerInfo: aiEngine.getProviderInfo(),
  };
}
