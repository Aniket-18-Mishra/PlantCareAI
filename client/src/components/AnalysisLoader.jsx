import { useEffect, useState } from 'react';

const STAGES = [
  { message: 'Looking at your plant...', icon: '🔍' },
  { message: 'Examining the leaf structure...', icon: '🌿' },
  { message: 'Identifying visual symptoms...', icon: '🧬' },
  { message: 'Analyzing color patterns...', icon: '🎨' },
  { message: 'Preparing your plant-care guidance...', icon: '📋' },
];

export default function AnalysisLoader() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const stage = STAGES[stageIndex];

  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      role="status"
      aria-live="polite"
      aria-label="Analyzing your plant image"
    >
      {/* Animated leaf spinner */}
      <div className="relative w-24 h-24 mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        {/* Inner pulse */}
        <div className="absolute inset-3 rounded-full bg-emerald-50 flex items-center justify-center animate-pulse-slow">
          <span className="text-2xl" aria-hidden="true">
            {stage.icon}
          </span>
        </div>
      </div>

      {/* Stage message */}
      <div className="min-h-[2rem] transition-all duration-500">
        <p className="text-lg font-semibold text-stone-700 animate-fade-in" key={stageIndex}>
          {stage.message}
        </p>
      </div>

      <p className="text-sm text-stone-400 mt-3 max-w-xs">
        Gemini AI is analyzing visual characteristics. This usually takes 5–15 seconds.
      </p>

      {/* Animated dots */}
      <div className="flex gap-2 mt-6" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
