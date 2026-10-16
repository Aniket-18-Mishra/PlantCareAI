import { useCallback, useState, useRef, useEffect } from 'react';
import { Upload, X, ImageIcon, CheckCircle, Lightbulb, Camera, Aperture } from 'lucide-react';
import { validateImageFile, createImagePreview } from '../utils/fileValidation';

const TIPS = [
  'Use good, natural lighting',
  'Keep the leaf clearly in focus',
  'Show the affected area prominently',
  'Include both healthy and affected portions if possible',
  'Avoid heavily filtered or edited photos',
];

/**
 * Drag-and-drop image uploader with preview and validation.
 *
 * Props:
 *   onFileSelect(file) — called when a valid file is chosen
 *   disabled — disables interaction during analysis
 */
export default function ImageUploader({ onFileSelect, disabled = false }) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async (e) => {
    if (e) e.preventDefault();
    try {
      setError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => console.error("Play error:", err));
        }
      }, 50);
    } catch (err) {
      console.error('Camera error:', err);
      // Fallback to the standard file input with capture attribute
      document.getElementById('plant-camera-input')?.click();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (!blob) {
        setError('Failed to capture image');
        return;
      }
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      stopCamera();
      handleFile(file);
    }, 'image/jpeg', 0.9);
  };

  const handleFile = useCallback(
    (file) => {
      setError(null);
      const { valid, error: validationError } = validateImageFile(file);

      if (!valid) {
        setError(validationError);
        return;
      }

      // Revoke previous preview URL to avoid memory leaks
      if (preview) URL.revokeObjectURL(preview);

      const previewUrl = createImagePreview(file);
      setPreview(previewUrl);
      setSelectedFile(file);
      onFileSelect(file);
    },
    [preview, onFileSelect]
  );

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragging ? 'drop-zone-active' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        aria-label="Upload plant image"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            document.getElementById('plant-image-input')?.click();
          }
        }}
      >
        {preview ? (
          /* Image Preview */
          <div className="relative p-4">
            <div className="relative rounded-xl overflow-hidden bg-stone-50">
              <img
                src={preview}
                alt="Selected plant image preview"
                className="w-full max-h-72 object-contain mx-auto block"
              />
              {/* Remove button */}
              {!disabled && (
                <button
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-card flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label="Remove selected image"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3 justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              <span className="text-sm text-emerald-600 font-medium">
                {selectedFile?.name} — ready to analyze
              </span>
            </div>
          </div>
        ) : isCameraActive ? (
          /* Live Camera Feed */
          <div className="relative p-6 flex flex-col items-center justify-center w-full">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-black flex items-center justify-center" style={{ aspectRatio: '4/3', border: '1px solid rgba(52,211,153,0.2)' }}>
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                playsInline 
                autoPlay 
                muted
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); stopCamera(); }}
                className="btn-secondary"
                style={{ borderRadius: '99px', padding: '0.6rem 1.5rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); capturePhoto(); }}
                className="btn-primary"
                style={{ borderRadius: '99px', padding: '0.6rem 1.5rem' }}
              >
                <Aperture className="w-5 h-5 mr-1" />
                Capture
              </button>
            </div>
          </div>
        ) : (
          /* Upload Prompts */
          <div className={`flex flex-col items-center justify-center py-12 px-6 ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
            {isDragging ? (
              <div className="flex flex-col items-center pointer-events-none">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(52,211,153,0.1)' }}>
                  <ImageIcon className="w-8 h-8 text-emerald-500 animate-bounce-gentle" aria-hidden="true" />
                </div>
                <p className="font-display font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>
                  Drop your image here
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-row gap-4 mb-6" style={{ width: '100%', maxWidth: '320px' }}>
                  {/* Upload Button */}
                  <label
                    htmlFor="plant-image-input"
                    className="flex-1 flex flex-col items-center justify-center py-6 rounded-2xl cursor-pointer transition-all duration-200"
                    style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(52,211,153,0.05)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.15)'; }}
                  >
                    <Upload className="w-7 h-7 mb-3" style={{ color: 'var(--emerald)' }} aria-hidden="true" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Upload Photo</span>
                  </label>

                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); startCamera(e); }}
                    className="flex-1 flex flex-col items-center justify-center py-6 rounded-2xl cursor-pointer transition-all duration-200"
                    style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(52,211,153,0.05)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.15)'; }}
                  >
                    <Camera className="w-7 h-7 mb-3" style={{ color: 'var(--emerald)' }} aria-hidden="true" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Open Camera</span>
                  </button>
                </div>
                <p className="text-sm mb-2 text-center" style={{ color: 'var(--text-secondary)' }}>
                  Drag &amp; drop an image, upload from device, or take a picture.
                </p>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>JPG, JPEG, PNG, WebP · Max 10 MB</p>
              </>
            )}
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          id="plant-image-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
          aria-label="Choose plant image file"
        />
        <input
          id="plant-camera-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          capture="environment"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
          aria-label="Take plant image with camera"
        />
      </div>

      {/* Validation error */}
      {error && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3"
          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          role="alert"
          aria-live="assertive"
        >
          <span className="text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true">⚠</span>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Tips */}
      <div className="card" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-color)', padding: '1rem' }}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Tips for better results</span>
        </div>
        <ul className="space-y-1" role="list">
          {TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="mt-0.5 text-emerald-500 flex-shrink-0" aria-hidden="true">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
