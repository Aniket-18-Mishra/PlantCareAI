import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

/**
 * Returns an initialized GoogleGenerativeAI instance.
 * Initializes lazily on first call.
 */
export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not defined in your .env file. ' +
      'Get a free API key from https://aistudio.google.com/app/apikey'
    );
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  return genAI;
};

/**
 * Returns the configured Gemini model name from .env
 */
export const getModelName = () => {
  return process.env.GEMINI_MODEL || 'gemini-3.8-flash';
};
