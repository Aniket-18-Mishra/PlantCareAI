// Re-export the configured axios instance from AuthContext
// so all API calls automatically include JWT tokens
export { api as default } from '../context/AuthContext';
import { api } from '../context/AuthContext';

// ─── Scan API Methods ──────────────────────────────────────────────────────

/**
 * Upload a plant image for Gemini analysis.
 */
export const analyzePlant = async (imageFile, onUploadProgress) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await api.post('/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onUploadProgress
      ? (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percent);
        }
      : undefined,
  });

  return response.data;
};

/**
 * Fetch all previous scans.
 */
export const getAllScans = async () => {
  const response = await api.get('/scans');
  return response.data;
};

/**
 * Fetch a single scan by ID.
 */
export const getScanById = async (id) => {
  const response = await api.get(`/scans/${id}`);
  return response.data;
};

/**
 * Delete a scan by ID.
 */
export const deleteScan = async (id) => {
  const response = await api.delete(`/scans/${id}`);
  return response.data;
};

/**
 * Delete all scans (clear history).
 */
export const deleteAllScans = async () => {
  const response = await api.delete('/scans');
  return response.data;
};

