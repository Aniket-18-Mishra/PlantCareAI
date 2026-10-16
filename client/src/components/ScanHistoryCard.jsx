import { useNavigate } from 'react-router-dom';
import { Calendar, Trash2, ChevronRight, Leaf } from 'lucide-react';
import { formatDate, getSeverityStyles, getHealthStatusStyles } from '../utils/formatters';

export default function ScanHistoryCard({ scan, onDelete }) {
  const navigate = useNavigate();
  const severityStyles = getSeverityStyles(scan.severity);
  const healthStyles = getHealthStatusStyles(scan.healthStatus);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(scan._id);
  };

  const handleOpen = () => navigate(`/result/${scan._id}`);

  return (
    <div
      onClick={handleOpen}
      className="history-card"
      style={{ display: 'flex', gap: '1rem', cursor: 'pointer' }}
      aria-label={`View scan: ${scan.plant?.name || 'Unknown plant'} — ${scan.diagnosis?.name || 'No diagnosis'}`}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleOpen(); }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '76px', height: '76px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0,
        background: 'rgba(52,211,153,0.06)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {scan.imagePath ? (
          <img src={scan.imagePath} alt={`Scan: ${scan.plant?.name || 'plant'}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        ) : (
          <Leaf className="w-7 h-7" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.375rem' }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {scan.plant?.name || 'Unknown Plant'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {scan.diagnosis?.name || 'No diagnosis'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleDelete}
              onPointerDown={(e) => e.stopPropagation()}
              title="Delete this scan"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                border: '1px solid transparent',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ef4444';
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              aria-label={`Delete scan of ${scan.plant?.name || 'plant'}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem' }}>
          <span className={`badge text-xs ${healthStyles.bg} ${healthStyles.color}`}>
            <span aria-hidden="true">{healthStyles.icon}</span>
            {scan.healthStatus || 'Unknown'}
          </span>
          <span className={`${severityStyles.badge} text-xs`}>{scan.severity || 'Unknown'}</span>
          {scan.diagnosis?.confidence > 0 && (
            <span className="badge badge-stone text-xs">{scan.diagnosis.confidence}% confidence</span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            <Calendar className="w-3 h-3" />
            {formatDate(scan.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
