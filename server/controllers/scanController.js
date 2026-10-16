import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Scan from '../models/Scan.js';
import { analyzePlantImage } from '../services/geminiService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map from file extension to MIME type
const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/**
 * POST /api/scan
 * Receives an uploaded image, analyzes it with Gemini, saves result to MongoDB.
 */
export const createScan = async (req, res, next) => {
  // Multer has already validated the file type and size
  if (!req.file) {
    return errorResponse(res, 'No image file was uploaded. Please select a plant image.', 400);
  }

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const mimeType = MIME_TYPES[ext] || req.file.mimetype;

  try {
    // Call Gemini via our dedicated service
    const { parsed, rawText, valid } = await analyzePlantImage(filePath, mimeType);

    // Build the relative image URL for the frontend to fetch
    const imageUrl = `/uploads/${path.basename(filePath)}`;

    // Save to MongoDB (attach userId if user is authenticated)
    const scan = await Scan.create({
      userId: req.user?._id || null,
      imagePath: imageUrl,
      imageOriginalName: req.file.originalname,
      plant: parsed.plant,
      healthStatus: parsed.healthStatus,
      diagnosis: parsed.diagnosis,
      severity: parsed.severity,
      symptoms: parsed.symptoms,
      possibleCauses: parsed.possibleCauses,
      recommendedActions: parsed.recommendedActions,
      treatment: parsed.treatment,
      prevention: parsed.prevention,
      professionalHelp: parsed.professionalHelp,
      disclaimer: parsed.disclaimer,
      rawResponse: valid ? undefined : rawText, // Only store raw if parsing failed
    });

    console.log(`✅ Scan saved to MongoDB: ${scan._id}`);

    return successResponse(res, scan, 201);
  } catch (err) {
    // Clean up uploaded file if analysis fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Cleaned up uploaded file after error');
    }

    // Provide human-readable Gemini error messages
    if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('API key')) {
      return errorResponse(
        res,
        'Invalid Gemini API key. Please check your GEMINI_API_KEY in server/.env',
        401
      );
    }

    if (err.message?.includes('quota') || err.message?.includes('RESOURCE_EXHAUSTED')) {
      return errorResponse(
        res,
        'Gemini API quota exceeded. Please wait a moment and try again.',
        429
      );
    }

    next(err);
  }
};

/**
 * GET /api/scans
 * Returns all scans, sorted by most recent first.
 */
export const getAllScans = async (req, res, next) => {
  try {
    // If user is authenticated, return only their scans; else return all anonymous scans
    const filter = req.user ? { userId: req.user._id } : { userId: null };

    const scans = await Scan.find(filter)
      .sort({ createdAt: -1 })
      .select('-rawResponse') // Exclude raw Gemini response for performance
      .lean();

    return successResponse(res, scans);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/scans/:id
 * Returns a single scan by its MongoDB ID.
 */
export const getScanById = async (req, res, next) => {
  try {
    const scan = await Scan.findById(req.params.id).select('-rawResponse').lean();

    if (!scan) {
      return errorResponse(res, 'Scan not found. It may have been deleted.', 404);
    }

    return successResponse(res, scan);
  } catch (err) {
    // Handle invalid ObjectId format
    if (err.name === 'CastError') {
      return errorResponse(res, 'Invalid scan ID format.', 400);
    }
    next(err);
  }
};

/**
 * DELETE /api/scans/:id
 * Deletes a scan from MongoDB and removes the associated image file.
 */
export const deleteScan = async (req, res, next) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return errorResponse(res, 'Scan not found. It may have already been deleted.', 404);
    }

    // Delete the image file from disk safely
    if (scan.imagePath) {
      try {
        const absoluteImagePath = path.join(__dirname, '..', scan.imagePath);
        if (fs.existsSync(absoluteImagePath)) {
          fs.unlinkSync(absoluteImagePath);
          console.log(`🗑️ Deleted image: ${absoluteImagePath}`);
        }
      } catch (fileErr) {
        console.warn('⚠️ Could not remove image file:', fileErr.message);
      }
    }

    await Scan.findByIdAndDelete(req.params.id);

    return successResponse(res, { message: 'Scan deleted successfully.' });
  } catch (err) {
    if (err.name === 'CastError') {
      return errorResponse(res, 'Invalid scan ID format.', 400);
    }
    next(err);
  }
};

/**
 * DELETE /api/scans
 * Clears scan history (user's scans if authenticated, or anonymous scans).
 */
export const deleteAllScans = async (req, res, next) => {
  try {
    const filter = req.user ? { userId: req.user._id } : { userId: null };
    const scans = await Scan.find(filter).select('imagePath');

    // Attempt to remove images
    for (const scan of scans) {
      if (scan.imagePath) {
        try {
          const absoluteImagePath = path.join(__dirname, '..', scan.imagePath);
          if (fs.existsSync(absoluteImagePath)) {
            fs.unlinkSync(absoluteImagePath);
          }
        } catch (e) {
          // ignore individual file deletion errors
        }
      }
    }

    const result = await Scan.deleteMany(filter);
    console.log(`🗑️ Cleared ${result.deletedCount} scans from history`);

    return successResponse(res, {
      message: `Successfully cleared ${result.deletedCount} scan(s).`,
      count: result.deletedCount,
    });
  } catch (err) {
    next(err);
  }
};

