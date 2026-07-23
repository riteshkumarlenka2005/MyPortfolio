/**
 * AI Communication Engine — Provider Interface
 *
 * All AI providers implement this interface.
 * Swap Gemini for OpenAI by changing one line in ai.config.ts.
 */

export interface AIProviderCapabilities {
  streaming: boolean;
  jsonMode: boolean;
  vision: boolean;
  functionCalling: boolean;
}

export interface AIProvider {
  /** Send a prompt and get back raw text */
  generate(prompt: string): Promise<string>;

  /** What this provider supports */
  capabilities(): AIProviderCapabilities;

  /** Check if the provider is reachable */
  isAvailable(): Promise<boolean>;

  /** Human-readable provider name */
  getProviderName(): string;

  /** Current model being used */
  getModelName(): string;
}
