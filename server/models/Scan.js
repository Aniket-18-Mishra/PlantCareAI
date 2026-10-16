import mongoose from 'mongoose';

/**
 * Scan Schema — stores the result of each plant image analysis.
 *
 * V1: No user authentication required. All scans are anonymous.
 * V2: Add a `userId` field once authentication is implemented.
 */
const scanSchema = new mongoose.Schema(
  {
    // Optional: reference to a user (null for anonymous scans)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    // Path to the uploaded image (local dev) or URL (cloud storage in production)
    imagePath: {
      type: String,
      required: true,
    },

    // Original filename for display purposes
    imageOriginalName: {
      type: String,
      default: 'plant-image',
    },

    // Plant identification
    plant: {
      name: { type: String, default: 'Unknown' },
      confidence: { type: Number, default: 0, min: 0, max: 100 },
    },

    // Overall health status: "Healthy" | "Diseased" | "Uncertain" | "Insufficient image"
    healthStatus: {
      type: String,
      default: 'Unknown',
    },

    // Diagnosis details
    diagnosis: {
      name: { type: String, default: 'None detected' },
      confidence: { type: Number, default: 0, min: 0, max: 100 },
      certainty: { type: String, default: 'uncertain' }, // "possible" | "likely" | "uncertain"
    },

    // Severity: "None" | "Mild" | "Moderate" | "Severe" | "Unknown"
    severity: {
      type: String,
      default: 'Unknown',
    },

    // Arrays of text items
    symptoms: [{ type: String }],
    possibleCauses: [{ type: String }],
    recommendedActions: [{ type: String }],
    treatment: [{ type: String }],
    prevention: [{ type: String }],

    // Professional help recommendation
    professionalHelp: {
      recommended: { type: Boolean, default: false },
      reason: { type: String, default: '' },
    },

    // AI disclaimer text
    disclaimer: {
      type: String,
      default:
        'This result is an AI-generated indication based on the uploaded image. It should not be treated as a definitive agricultural diagnosis.',
    },

    // Raw Gemini response stored for debugging purposes
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      select: false, // Not returned in normal queries to keep response lean
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Scan = mongoose.model('Scan', scanSchema);

export default Scan;
