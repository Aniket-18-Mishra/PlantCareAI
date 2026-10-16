/**
 * Format a date string to a human-readable relative or absolute format.
 * @param {string | Date} date
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Returns Tailwind color classes for a severity level.
 */
export const getSeverityStyles = (severity) => {
  const map = {
    None: {
      badge: 'bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded-full text-xs font-semibold',
      dot: 'bg-emerald-400',
      text: 'text-emerald-400',
    },
    Mild: {
      badge: 'bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded-full text-xs font-semibold',
      dot: 'bg-yellow-400',
      text: 'text-yellow-400',
    },
    Moderate: {
      badge: 'bg-orange-900/40 text-orange-400 px-2 py-1 rounded-full text-xs font-semibold',
      dot: 'bg-orange-400',
      text: 'text-orange-400',
    },
    Severe: {
      badge: 'bg-red-900/40 text-red-400 px-2 py-1 rounded-full text-xs font-semibold',
      dot: 'bg-red-400',
      text: 'text-red-400',
    },
    Unknown: {
      badge: 'bg-stone-800 text-stone-400 px-2 py-1 rounded-full text-xs font-semibold',
      dot: 'bg-stone-400',
      text: 'text-stone-400',
    },
  };
  return map[severity] || map['Unknown'];
};

/**
 * Returns Tailwind color classes for health status.
 */
export const getHealthStatusStyles = (status) => {
  if (!status) return { icon: '🌿', color: 'text-stone-400', bg: 'bg-stone-800' };

  const lower = status.toLowerCase();
  if (lower.includes('healthy')) return { icon: '✅', color: 'text-emerald-400', bg: 'bg-emerald-900/40' };
  if (lower.includes('diseased')) return { icon: '🔴', color: 'text-red-400', bg: 'bg-red-900/40' };
  if (lower.includes('insufficient')) return { icon: '📷', color: 'text-yellow-400', bg: 'bg-yellow-900/40' };
  return { icon: '❓', color: 'text-stone-400', bg: 'bg-stone-800' };
};

/**
 * Returns Tailwind color for confidence percentage.
 */
export const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return 'bg-emerald-500';
  if (confidence >= 60) return 'bg-amber-400';
  if (confidence >= 40) return 'bg-orange-400';
  return 'bg-red-400';
};

/**
 * Extracts a friendly error message from an Axios error.
 */
export const extractErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};
