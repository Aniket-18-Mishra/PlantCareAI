import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scan, History, User, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import ScanHistoryCard from '../components/ScanHistoryCard';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { getAllScans, deleteScan, deleteAllScans } from '../services/api';
import { extractErrorMessage } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    mode: 'single', // 'single' | 'all'
    scanId: null,
    scanTitle: '',
  });
  const { user } = useAuth();

  const fetchScans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllScans();
      if (response.success) setScans(response.data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchScans(); }, []);

  const openDeleteSingle = (scanId) => {
    const target = scans.find((s) => s._id === scanId);
    setDeleteModal({
      isOpen: true,
      mode: 'single',
      scanId,
      scanTitle: target?.plant?.name || 'this plant scan',
    });
  };

  const openDeleteAll = () => {
    setDeleteModal({
      isOpen: true,
      mode: 'all',
      scanId: null,
      scanTitle: `all ${scans.length} scans`,
    });
  };

  const closeModal = () => {
    if (actionLoading) return;
    setDeleteModal({ isOpen: false, mode: 'single', scanId: null, scanTitle: '' });
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      if (deleteModal.mode === 'single') {
        await deleteScan(deleteModal.scanId);
        setScans((prev) => prev.filter((s) => s._id !== deleteModal.scanId));
      } else {
        await deleteAllScans();
        setScans([]);
      }
      setDeleteModal({ isOpen: false, mode: 'single', scanId: null, scanTitle: '' });
    } catch (err) {
      alert(extractErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <History className="w-5 h-5" style={{ color: 'var(--emerald)' }} />
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                My Scan History
              </h1>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {scans.length > 0
                ? `${scans.length} scan${scans.length !== 1 ? 's' : ''} in your history`
                : 'Your past plant analyses'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '8px', padding: '0.4rem 0.875rem' }}>
                <User className="w-3.5 h-3.5" style={{ color: 'var(--emerald)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{user.name}</span>
              </div>
            )}
            {scans.length > 0 && (
              <button
                type="button"
                onClick={openDeleteAll}
                className="btn-secondary text-sm"
                style={{
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.25)',
                  background: 'rgba(239, 68, 68, 0.05)',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                }}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear History
              </button>
            )}
            <Link to="/scan" className="btn-primary text-sm" id="new-scan-btn">
              <Scan className="w-4 h-4" />
              New Scan
            </Link>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                borderRadius: '14px', padding: '1.25rem', display: 'flex', gap: '1rem',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ height: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', width: '40%' }} />
                  <div style={{ height: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', width: '60%' }} />
                  <div style={{ height: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', width: '30%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <ErrorState title="Could not load scans" message={error} onRetry={fetchScans} />
        )}

        {/* Empty */}
        {!loading && !error && scans.length === 0 && (
          <EmptyState
            icon={History}
            title="No scans yet"
            subtitle="Scan your first plant to start your history. Every scan is saved automatically to your account."
            action={
              <Link to="/scan" className="btn-primary">
                <Scan className="w-4 h-4" />
                Scan Your First Plant
              </Link>
            }
          />
        )}

        {/* Scan list */}
        {!loading && !error && scans.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} role="list" aria-label="Scan history">
            {scans.map((scan) => (
              <ScanHistoryCard key={scan._id} scan={scan} onDelete={openDeleteSingle} />
            ))}
          </div>
        )}

        {/* ── Custom In-App Deletion Confirmation Modal ── */}
        {deleteModal.isOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
            }}
            onClick={closeModal}
          >
            <div
              style={{
                background: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '2rem',
                maxWidth: '420px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>

              <h3
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                }}
              >
                {deleteModal.mode === 'all' ? 'Clear Entire History?' : 'Delete This Scan?'}
              </h3>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  marginBottom: '1.75rem',
                }}
              >
                {deleteModal.mode === 'all'
                  ? 'This will permanently remove all your scanned plant records and associated telemetry. This action cannot be reversed.'
                  : `Are you sure you want to delete ${deleteModal.scanTitle}? This record will be permanently deleted.`}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="btn-secondary"
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={actionLoading}
                  className="btn-primary"
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    background: '#ef4444',
                    borderColor: '#ef4444',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
