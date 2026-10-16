import fs from 'fs';
import path from 'path';
import { getGeminiClient, getModelName } from '../config/gemini.js';
import { validateGeminiResponse } from '../utils/validateGeminiResponse.js';

const MAX_503_RETRIES = 3;
const FALLBACK_MODEL = 'gemini-3.7-flash';

const isTemporaryAvailabilityError = (error) =>
  error?.status === 503 || /\b503\s+Service Unavailable\b/i.test(error?.message || '');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetries = async (genAI, modelName, contents) => {
  const model = genAI.getGenerativeModel({ model: modelName });

  for (let attempt = 0; attempt <= MAX_503_RETRIES; attempt += 1) {
    try {
      return await model.generateContent(contents);
    } catch (error) {
      if (!isTemporaryAvailabilityError(error) || attempt === MAX_503_RETRIES) {
        throw error;
      }

      const delayMs = 1000 * 2 ** attempt;
      console.warn(
        `Gemini model ${modelName} returned 503. Retrying ${attempt + 1}/${MAX_503_RETRIES} in ${delayMs}ms.`
      );
      await wait(delayMs);
    }
  }
};

/**
 * The structured prompt sent to Gemini with every plant image.
 *
 * Instructs Gemini to:
 * - Analyze the uploaded plant image
 * - Return a strict JSON response matching our schema
 * - Be honest about uncertainty
 * - Give safe, general treatment advice
 */
const buildPrompt = () => `
You are an agricultural plant-health image analysis assistant.

Carefully analyze the uploaded image of a plant or leaf.

Return ONLY a valid JSON object — no markdown, no explanation outside the JSON.

Use exactly this JSON structure:

{
  "plant": {
    "name": "string — plant species or 'Unknown' if unclear",
    "confidence": number — 0 to 100
  },
  "healthStatus": "string — one of: Healthy | Diseased | Uncertain | Insufficient image",
  "diagnosis": {
    "name": "string — disease/condition name or 'None detected' or 'Could not determine'",
    "confidence": number — 0 to 100,
    "certainty": "string — one of: possible | likely | uncertain"
  },
  "severity": "string — one of: None | Mild | Moderate | Severe | Unknown",
  "symptoms": ["array of visible symptom strings"],
  "possibleCauses": ["array of possible cause strings"],
  "recommendedActions": ["array of immediate action strings"],
  "treatment": ["array of treatment suggestion strings"],
  "prevention": ["array of prevention tip strings"],
  "professionalHelp": {
    "recommended": boolean,
    "reason": "string — brief reason why professional help may be needed, or empty string"
  },
  "disclaimer": "This result is an AI-generated indication based on the uploaded image. It should not be treated as a definitive agricultural diagnosis."
}

IMPORTANT RULES you must follow:
1. If the image is blurry, too dark, too distant, or otherwise insufficient, set healthStatus to "Insufficient image" and explain in the symptoms array what is wrong with the image.
2. If the plant cannot be identified, set plant.name to "Unknown" and plant.confidence to 0.
3. If no disease is visible, set diagnosis.name to "None detected", diagnosis.confidence to 0, and healthStatus to "Healthy".
4. Do NOT invent a disease just because the user might expect one.
5. Distinguish between "possible", "likely", and "uncertain" in the certainty field.
6. Treatment advice must be general and cautious. Do NOT give specific chemical dosages or dangerous pesticide instructions.
7. Always include the disclaimer exactly as shown.
8. All confidence values must be numbers between 0 and 100.
9. All array fields must be arrays even if empty.
10. Return ONLY valid JSON. No surrounding text, no markdown fences.
`;

/**
 * Converts an image file to the format required by the Gemini multimodal API.
 * @param {string} filePath - Absolute path to the uploaded image
 * @param {string} mimeType - MIME type (e.g., 'image/jpeg')
 */
const imageToGenerativePart = (filePath, mimeType) => {
  const imageData = fs.readFileSync(filePath);
  return {
    inlineData: {
      data: imageData.toString('base64'),
      mimeType,
    },
  };
};

/**
 * Analyzes a plant image using the Gemini multimodal API.
 *
 * @param {string} imagePath - Absolute path to the uploaded image file
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<{ parsed: object, rawText: string, valid: boolean }>}
 */
export const analyzePlantImage = async (imagePath, mimeType) => {
  const genAI = getGeminiClient();
  const modelName = getModelName();

  const prompt = buildPrompt();
  const imagePart = imageToGenerativePart(imagePath, mimeType);
  const contents = [prompt, imagePart];

  console.log(`🤖 Sending image to Gemini model: ${modelName}`);

  let result;
  try {
    result = await generateWithRetries(genAI, modelName, contents);
  } catch (error) {
    if (!isTemporaryAvailabilityError(error)) throw error;

    console.warn(
      `Gemini model ${modelName} remained unavailable after ${MAX_503_RETRIES} retries. Falling back to ${FALLBACK_MODEL}.`
    );
    result = await genAI
      .getGenerativeModel({ model: FALLBACK_MODEL })
      .generateContent(contents);
  }
  const rawText = result.response.text();

  console.log('📦 Gemini raw response (first 300 chars):', rawText?.slice(0, 300));

  const { parsed, valid } = validateGeminiResponse(rawText);

  return { parsed, rawText, valid };
};
