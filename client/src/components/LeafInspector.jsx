import { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Crosshair,
  Layers,
  Sparkles,
  Info,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

export default function LeafInspector({ imagePath, plantName, symptoms = [] }) {
  const [mode, setMode] = useState('hud'); // 'clean' | 'hud' | 'contrast'
  const [activePin, setActivePin] = useState(null);
  const [isZoomModal, setIsZoomModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Generate tactical pins mapped to symptoms or default coordinates
  const pinPositions = [
    { top: '35%', left: '42%' },
    { top: '55%', left: '60%' },
    { top: '28%', left: '68%' },
    { top: '65%', left: '32%' },
  ];

  const hotspots = symptoms.slice(0, 4).map((symptom, idx) => ({
    id: idx + 1,
    title: `Observation #${idx + 1}`,
    description: symptom,
    pos: pinPositions[idx % pinPositions.length],
  }));

  const getImageStyle = () => {
    if (mode === 'contrast') {
      return {
        filter: 'contrast(1.4) saturate(1.3) brightness(1.05) hue-rotate(-5deg)',
        transition: 'filter 0.3s ease',
      };
    }
    return { transition: 'filter 0.3s ease' };
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-emerald-500/20 bg-stone-950/80 shadow-2xl">
      {/* ── Inspector Toolbar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-900/90 border-b border-emerald-500/15 backdrop-blur-md z-20 relative">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-emerald-400">
            Vision HUD Inspector
          </span>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center gap-1.5 bg-stone-950/80 p-0.5 rounded-lg border border-stone-800">
          <button
            type="button"
            onClick={() => setMode('clean')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              mode === 'clean'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Standard photo view"
          >
            Original
          </button>
          <button
            type="button"
            onClick={() => setMode('hud')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
              mode === 'hud'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Overlay targeting reticle and symptom markers"
          >
            <Crosshair className="w-3 h-3 text-emerald-400" />
            AI Scan HUD
          </button>
          <button
            type="button"
            onClick={() => setMode('contrast')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
              mode === 'contrast'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="High-contrast chlorophyll & pathogen highlight"
          >
            <Sliders className="w-3 h-3 text-emerald-400" />
            Contrast
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsZoomModal(true)}
          className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          title="Open interactive zoom view"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Main Viewport ────────────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden bg-black flex items-center justify-center select-none group">
        <img
          src={imagePath}
          alt={`Analyzed specimen: ${plantName}`}
          className="w-full h-full object-cover select-none"
          style={getImageStyle()}
        />

        {/* HUD Elements when in 'hud' mode */}
        {mode === 'hud' && (
          <>
            {/* Grid Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(52,211,153,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(52,211,153,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Animated Laser Scanline */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none animate-scanline shadow-[0_0_15px_#34d399]" />

            {/* Corner Target Brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400/80 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400/80 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400/80 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400/80 pointer-events-none" />

            {/* Interactive Hotspot Pins */}
            {hotspots.map((spot) => (
              <div
                key={spot.id}
                style={{ top: spot.pos.top, left: spot.pos.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
              >
                <button
                  type="button"
                  onClick={() => setActivePin(activePin === spot.id ? null : spot.id)}
                  className="relative group/pin flex items-center justify-center cursor-pointer p-2"
                  aria-label={`Inspect ${spot.title}`}
                >
                  {/* Pulsing ring */}
                  <span className="absolute w-7 h-7 rounded-full border border-emerald-400 animate-reticle" />
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] flex items-center justify-center text-[9px] font-bold text-black">
                    {spot.id}
                  </span>
                </button>

                {/* Popover Card */}
                {activePin === spot.id && (
                  <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 w-56 p-3 rounded-xl bg-stone-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md z-40 animate-pop">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                        {spot.title}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePin(null);
                        }}
                        className="text-stone-400 hover:text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-stone-200 leading-snug">
                      {spot.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Contrast Badge */}
        {mode === 'contrast' && (
          <div className="absolute bottom-3 left-3 bg-stone-900/90 border border-emerald-500/30 px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-300 backdrop-blur-sm pointer-events-none">
            FILTER: ENHANCED PATHOGEN HIGHLIGHT
          </div>
        )}

        {/* Tip at bottom */}
        {mode === 'hud' && (
          <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] font-mono text-stone-300 pointer-events-none">
            Click pins to inspect symptoms
          </div>
        )}
      </div>

      {/* ── Interactive Zoom Modal ─────────────────────────────────────── */}
      {isZoomModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-4"
          onClick={() => setIsZoomModal(false)}
        >
          {/* Controls Bar */}
          <div
            className="flex items-center gap-3 bg-stone-900/95 border border-stone-800 px-4 py-2 rounded-2xl mb-4 shadow-xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-mono text-stone-300">Zoom: {zoomLevel.toFixed(1)}x</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 3))}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 1))}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-stone-700" />
            <button
              type="button"
              onClick={() => setIsZoomModal(false)}
              className="btn-primary text-xs px-3 py-1 rounded-lg"
            >
              Done
            </button>
          </div>

          <div
            className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl border border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imagePath}
              alt="Zoomed specimen"
              className="w-full h-full object-contain transition-transform duration-300"
              style={{
                transform: `scale(${zoomLevel})`,
                ...getImageStyle(),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
