import { useState } from 'react';
import { ShieldCheck, AlertCircle, TrendingUp, Clock, Bug, HelpCircle } from 'lucide-react';

export default function HealthScoreGauge({ healthStatus = '', severity = '', diagnosis = {} }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Compute a 0-100 plant health index score
  const getHealthScore = () => {
    const statusLower = healthStatus?.toLowerCase() || '';
    const sevLower = severity?.toLowerCase() || '';

    if (statusLower.includes('healthy')) return 94;
    if (statusLower.includes('insufficient')) return null;

    if (sevLower.includes('severe')) return 26;
    if (sevLower.includes('moderate')) return 54;
    if (sevLower.includes('mild')) return 76;
    return 60;
  };

  const score = getHealthScore();

  // Color & tier details
  const getTierDetails = (val) => {
    if (val === null) {
      return {
        label: 'Inconclusive Specimen',
        color: '#a8a29e',
        badge: 'bg-stone-800 text-stone-300',
        stroke: '#78716c',
      };
    }
    if (val >= 85) {
      return {
        label: 'Optimal Botanical Vigor',
        color: '#34d399',
        badge: 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30',
        stroke: '#10b981',
      };
    }
    if (val >= 68) {
      return {
        label: 'Mild Physiological Stress',
        color: '#facc15',
        badge: 'bg-yellow-950/60 text-yellow-400 border border-yellow-500/30',
        stroke: '#eab308',
      };
    }
    if (val >= 45) {
      return {
        label: 'Active Pathological Distress',
        color: '#fb923c',
        badge: 'bg-orange-950/60 text-orange-400 border border-orange-500/30',
        stroke: '#f97316',
      };
    }
    return {
      label: 'Critical Pathogen Load',
      color: '#f87171',
      badge: 'bg-red-950/60 text-red-400 border border-red-500/30',
      stroke: '#ef4444',
    };
  };

  const tier = getTierDetails(score);

  // Gauge calculation (radius = 44, circumference = 2 * PI * 44 ≈ 276.46)
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const validScore = score !== null ? score : 0;
  const strokeDashoffset = circumference - (validScore / 100) * circumference;

  // Derive Triage Signals
  const isFungalOrBacterial =
    diagnosis?.name?.toLowerCase().includes('fung') ||
    diagnosis?.name?.toLowerCase().includes('anthracnose') ||
    diagnosis?.name?.toLowerCase().includes('spot') ||
    diagnosis?.name?.toLowerCase().includes('blight') ||
    diagnosis?.name?.toLowerCase().includes('mildew');

  const triageSignals = [
    {
      id: 'contagion',
      label: 'Contagion Hazard',
      value: isFungalOrBacterial ? 'High (Spore-Borne)' : 'Low (Abiotic / Soil)',
      color: isFungalOrBacterial ? 'text-amber-400' : 'text-emerald-400',
      tooltip: isFungalOrBacterial
        ? 'Pathogen spores can travel via water droplets or wind to adjacent foliage.'
        : 'Symptom is localized to this specimen; low risk of cross-infection.',
      icon: Bug,
    },
    {
      id: 'urgency',
      label: 'Action Window',
      value: severity?.toLowerCase().includes('severe') ? 'Immediate (24h)' : '2–4 Days',
      color: severity?.toLowerCase().includes('severe') ? 'text-red-400' : 'text-stone-300',
      tooltip: 'Recommended timeframe to administer cultural or therapeutic treatment.',
      icon: Clock,
    },
    {
      id: 'recovery',
      label: 'Recovery Potential',
      value: score !== null && score >= 50 ? 'Strong (85%+)' : 'Requires Active Care',
      color: score !== null && score >= 50 ? 'text-emerald-400' : 'text-amber-400',
      tooltip: 'Estimated likelihood of complete foliage rejuvenation with consistent treatment.',
      icon: TrendingUp,
    },
  ];

  return (
    <div
      className="card p-5 mb-4"
      style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* ── Top: Circular Health Dial & Status ──────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Circular Dial */}
        <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 110 110">
            {/* Background Track */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              className="stroke-stone-800"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke={tier.stroke}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease',
                filter: `drop-shadow(0 0 8px ${tier.stroke}50)`,
              }}
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            {score !== null ? (
              <>
                <span className="font-display font-black text-2xl leading-none" style={{ color: tier.color }}>
                  {score}
                </span>
                <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider mt-0.5">
                  /100
                </span>
              </>
            ) : (
              <span className="text-xs font-mono text-stone-400">N/A</span>
            )}
          </div>
        </div>

        {/* Status Text & Severity Badge */}
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mb-1">
            Specimen Health Index
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2 leading-tight truncate">
            {tier.label}
          </h3>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${tier.badge}`}>
            Severity: {severity || 'Standard'}
          </span>
        </div>
      </div>

      {/* ── Bottom: Full-Width Triage Signal Rows ───────────────────────── */}
      <div className="space-y-2 mt-4 pt-4 border-t border-stone-800/60">
        {triageSignals.map((signal) => {
          const Icon = signal.icon;
          return (
            <div
              key={signal.id}
              className="relative p-2.5 px-3 rounded-xl border border-stone-800/80 bg-stone-900/60 flex items-center justify-between cursor-help group transition-all hover:border-emerald-500/30"
              onMouseEnter={() => setActiveTooltip(signal.id)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                <span className="text-xs text-stone-300 font-medium truncate">{signal.label}</span>
                <HelpCircle className="w-3 h-3 text-stone-500 opacity-60 flex-shrink-0" />
              </div>

              <span className={`text-xs font-semibold ${signal.color} flex-shrink-0 ml-2`}>
                {signal.value}
              </span>

              {/* Tooltip */}
              {activeTooltip === signal.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 rounded-lg bg-stone-950 border border-stone-700 text-[11px] text-stone-300 shadow-xl z-50 pointer-events-none animate-pop">
                  {signal.tooltip}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
