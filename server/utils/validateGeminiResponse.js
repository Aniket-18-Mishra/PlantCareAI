/**
 * Validates and normalizes the structured JSON response from Gemini.
 *
 * Gemini is instructed to return a specific JSON schema, but AI models
 * can occasionally return unexpected formats. This function ensures
 * the data stored in MongoDB is always clean and predictable.
 */

const DEFAULT_DIAGNOSIS = {
  plant: { name: 'Unknown', confidence: 0 },
  healthStatus: 'Uncertain',
  diagnosis: { name: 'Could not determine', confidence: 0, certainty: 'uncertain' },
  severity: 'Unknown',
  symptoms: [],
  possibleCauses: [],
  recommendedActions: [],
  treatment: [],
  prevention: [],
  professionalHelp: { recommended: false, reason: '' },
  disclaimer:
    'This result is an AI-generated indication based on the uploaded image. It should not be treated as a definitive agricultural diagnosis.',
};

/**
 * Ensures a value is an array of strings.
 */
const toStringArray = (value) => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') return value ? [value] : [];
  return [];
};

/**
 * Clamps a number between 0 and 100.
 */
const clampConfidence = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return Math.min(100, Math.max(0, num));
};

/**
 * Parses and validates the raw Gemini response string into a safe object.
 * @param {string} rawText - Raw text returned from Gemini
 * @returns {{ parsed: object, valid: boolean }}
 */
export const validateGeminiResponse = (rawText) => {
  let parsed;

  try {
    // Gemini sometimes wraps JSON in markdown code fences — strip them
    const cleaned = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    parsed = JSON.parse(cleaned);
  } catch {
    console.error('❌ Failed to parse Gemini response as JSON:', rawText?.slice(0, 200));
    return { parsed: DEFAULT_DIAGNOSIS, valid: false };
  }

  // Normalize each field with safe fallbacks
  const safe = {
    plant: {
      name:
        parsed?.plant?.name ||
        parsed?.plantName ||
        DEFAULT_DIAGNOSIS.plant.name,
      confidence: clampConfidence(
        parsed?.plant?.confidence ?? parsed?.plantConfidence
      ),
    },
    healthStatus:
      typeof parsed?.healthStatus === 'string'
        ? parsed.healthStatus
        : DEFAULT_DIAGNOSIS.healthStatus,
    diagnosis: {
      name:
        parsed?.diagnosis?.name ||
        parsed?.diseaseName ||
        DEFAULT_DIAGNOSIS.diagnosis.name,
      confidence: clampConfidence(
        parsed?.diagnosis?.confidence ?? parsed?.diseaseConfidence
      ),
      certainty:
        parsed?.diagnosis?.certainty ||
        DEFAULT_DIAGNOSIS.diagnosis.certainty,
    },
    severity:
      typeof parsed?.severity === 'string'
        ? parsed.severity
        : DEFAULT_DIAGNOSIS.severity,
    symptoms: toStringArray(parsed?.symptoms),
    possibleCauses: toStringArray(
      parsed?.possibleCauses || parsed?.causes
    ),
    recommendedActions: toStringArray(
      parsed?.recommendedActions || parsed?.actions
    ),
    treatment: toStringArray(parsed?.treatment),
    prevention: toStringArray(parsed?.prevention),
    professionalHelp: {
      recommended: Boolean(parsed?.professionalHelp?.recommended),
      reason:
        parsed?.professionalHelp?.reason ||
        DEFAULT_DIAGNOSIS.professionalHelp.reason,
    },
    disclaimer:
      typeof parsed?.disclaimer === 'string'
        ? parsed.disclaimer
        : DEFAULT_DIAGNOSIS.disclaimer,
  };

  return { parsed: safe, valid: true };
};
