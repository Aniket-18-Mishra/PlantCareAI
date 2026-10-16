import express from 'express';
import { upload, handleUploadError } from '../middleware/upload.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import {
  createScan,
  getAllScans,
  getScanById,
  deleteScan,
  deleteAllScans,
} from '../controllers/scanController.js';

const router = express.Router();

// POST /api/scan — upload image and analyze (optionalAuth attaches user if logged in)
router.post(
  '/scan',
  optionalAuth,
  (req, res, next) => upload.single('image')(req, res, (err) => handleUploadError(err, req, res, next)),
  createScan
);

// GET /api/scans — get scans (filtered by user if authenticated)
router.get('/scans', optionalAuth, getAllScans);

// GET /api/scans/:id — get single scan
router.get('/scans/:id', getScanById);

// DELETE /api/scans — delete all scans (bulk clear history)
router.delete('/scans', optionalAuth, deleteAllScans);

// DELETE /api/scans/:id — delete scan
router.delete('/scans/:id', deleteScan);

export default router;
