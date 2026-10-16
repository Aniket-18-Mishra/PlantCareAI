// ─── File Validation Utilities ─────────────────────────────────────────────

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/**
 * Validates an image file before uploading.
 * @param {File} file
 * @returns {{ valid: boolean, error: string | null }}
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected. Please choose a plant image.' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type (${file.type}). Please upload a JPG, JPEG, PNG, or WebP image.`,
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMB} MB). Maximum allowed size is ${MAX_SIZE_MB} MB.`,
    };
  }

  if (file.size < 1024) {
    return {
      valid: false,
      error: 'File seems too small. Please upload a valid plant image.',
    };
  }

  return { valid: true, error: null };
};

/**
 * Creates a browser-side object URL for image preview.
 * Remember to call URL.revokeObjectURL() when done.
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};
