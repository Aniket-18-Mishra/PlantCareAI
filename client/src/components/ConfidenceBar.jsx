import { getConfidenceColor } from '../utils/formatters';

/**
 * Animated confidence bar with label and percentage.
 */
export default function ConfidenceBar({ confidence = 0, label = 'AI Confidence', size = 'md' }) {
  const color = getConfidenceColor(confidence);
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{confidence}%</span>
          <div
            className="relative group cursor-help"
            title="This score represents the AI model's estimated confidence, not a laboratory-confirmed diagnosis."
          >
            <span className="text-xs border rounded-full w-4 h-4 flex items-center justify-center font-medium" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
              ?
            </span>
          </div>
        </div>
      </div>
      <div className={`confidence-bar-track ${sizeClasses[size]}`}>
        <div
          className={`confidence-bar-fill ${color} ${sizeClasses[size]}`}
          style={{ width: `${confidence}%` }}
          role="progressbar"
          aria-valuenow={confidence}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${confidence}%`}
        />
      </div>
    </div>
  );
}
