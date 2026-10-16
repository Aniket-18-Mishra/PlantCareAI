import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env as well as project root
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

// ─── Validate critical environment variables ────────────────────────────────
const requiredEnvVars = ['MONGODB_URI', 'GEMINI_API_KEY', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('   Please create server/.env with the required values.');
  console.error('   See server/.env.example for the full list.');
  process.exit(1);
}

// ─── Connect to MongoDB ─────────────────────────────────────────────────────
await connectDB();

// ─── Express App Setup ──────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images to load in browser
    contentSecurityPolicy: false, // Allow client scripts and fonts
  })
);

// CORS — allow requests from the React frontend or same-origin
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Rate limiting — prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please wait a few minutes and try again.',
  },
});

// Stricter limit specifically for the analysis endpoint
const scanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 scans per minute per IP
  message: {
    success: false,
    message: 'Too many scan requests. Please wait a moment.',
  },
});

app.use('/api/', limiter);
app.use('/api/scan', scanLimiter);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Serve uploaded images statically ──────────────────────────────────────
// In production, replace this with a cloud storage URL (Cloudinary, S3, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', scanRoutes);

// ─── Production Frontend Serving ───────────────────────────────────────────
const clientDist = path.join(__dirname, '../client/dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist));

  // Any non-API route serves the frontend index.html for React Router SPA
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🌿 ─────────────────────────────────────────────');
  console.log(`🌿  PlantCare AI Server is running`);
  console.log(`🌿  Port    : ${PORT}`);
  console.log(`🌿  Mode    : ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌿  API     : http://localhost:${PORT}/api`);
  console.log(`🌿  Health  : http://localhost:${PORT}/api/health`);
  console.log('🌿 ─────────────────────────────────────────────');
  console.log('');
});
