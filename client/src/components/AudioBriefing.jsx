import { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  Sliders,
  ChevronDown,
  FileText,
  Check
} from 'lucide-react';

/**
 * Strips out Latin botanical and fungal taxonomy names from parentheticals
 * e.g., "Pepper (Capsicum spp.)" -> "Pepper"
 * e.g., "Anthracnose (Colletotrichum gloeosporioides)" -> "Anthracnose"
 */
function cleanSpokenName(name = '') {
  return name.replace(/\([^)]*\)/g, '').replace(/\s{2,}/g, ' ').trim();
}

// Low-quality / novelty / joke voices to exclude
const EXCLUDED_VOICES = new Set([
  'Albert', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos',
  'Deranged', 'Good News', 'Hysterical', 'Junior', 'Kathy', 'Pipe Organ',
  'Princess', 'Ralph', 'Trinoids', 'Whisper', 'Zarvox', 'Fred'
]);

export default function AudioBriefing({
  plant,
  diagnosis,
  severity,
  symptoms = [],
  recommendedActions = []
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isSupported, setIsSupported] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Keep a persistent global reference to prevent Chrome garbage-collecting the utterance mid-speech
  const utteranceRef = useRef(null);

  // ── Load and filter high-quality natural voices ────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices() || [];
      const qualityEnglishVoices = allVoices
        .filter((v) => v.lang.startsWith('en') && !EXCLUDED_VOICES.has(v.name))
        .sort((a, b) => {
          // Prioritize Enhanced, Premium, Natural, Google, Samantha, Ava
          const score = (v) => {
            const name = v.name.toLowerCase();
            if (name.includes('premium') || name.includes('enhanced') || name.includes('natural')) return 5;
            if (name.includes('google')) return 4;
            if (name.includes('ava') || name.includes('samantha') || name.includes('daniel')) return 3;
            if (name.includes('serena') || name.includes('karen') || name.includes('oliver')) return 2;
            return 1;
          };
          return score(b) - score(a);
        });

      setAvailableVoices(qualityEnglishVoices);

      // Auto-select best default voice
      if (qualityEnglishVoices.length > 0 && !selectedVoiceName) {
        setSelectedVoiceName(qualityEnglishVoices[0].name);
      }
    };

    loadVoices();

    // Chrome fires 'onvoiceschanged' asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── Craft a natural, professional agronomic script ─────────────────────────
  const buildBriefingText = () => {
    const cleanPlant = cleanSpokenName(plant?.name) || 'plant specimen';
    const cleanDiag = cleanSpokenName(diagnosis?.name) || 'foliar distress';
    const conf = diagnosis?.confidence ? `${diagnosis.confidence}%` : 'high';
    const sev = severity ? severity.toLowerCase() : 'moderate';

    // Pick top foliar observations
    let symptomSnippet = '';
    if (symptoms.length > 0) {
      const firstTwo = symptoms
        .slice(0, 2)
        .map((s) => cleanSpokenName(s))
        .join(', and ');
      symptomSnippet = `Visible symptoms include ${firstTwo}. `;
    }

    // Pick top urgent intervention
    const topAction = recommendedActions[0]
      ? cleanSpokenName(recommendedActions[0])
      : 'isolate the plant and inspect leaf undersides';

    return (
      `Here is your agronomic health briefing for your ${cleanPlant}. ` +
      `Our visual neural analysis indicates ${cleanDiag}, detected with ${conf} confidence at a ${sev} severity level. ` +
      `${symptomSnippet}` +
      `Your priority intervention is to ${topAction}. ` +
      `Please review the interactive recovery checklist below for your complete step-by-step care plan.`
    );
  };

  const spokenText = buildBriefingText();

  // ── Play / Stop handler with Chrome GC & freeze fixes ─────────────────────
  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) return;

    // If currently speaking, stop cleanly
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Force cancel any prior or frozen queues in Chrome
    window.speechSynthesis.cancel();

    // Small timeout ensures Chrome's internal audio buffer is cleared
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utteranceRef.current = utterance;
      // Attach to window to guarantee V8 garbage collector won't kill it mid-sentence
      window._plantCareActiveUtterance = utterance;

      utterance.rate = playbackRate;
      utterance.pitch = 1.0;

      // Assign the selected high-quality voice
      if (selectedVoiceName && availableVoices.length > 0) {
        const voiceObj = availableVoices.find((v) => v.name === selectedVoiceName);
        if (voiceObj) utterance.voice = voiceObj;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
      };

      utterance.onend = () => {
        window._plantCareActiveUtterance = null;
        setIsPlaying(false);
      };

      utterance.onerror = (e) => {
        // 'interrupted' or 'canceled' are expected when user stops playback
        window._plantCareActiveUtterance = null;
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    }, 60);
  };

  const handleRestart = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setTimeout(() => {
      handleTogglePlay();
    }, 120);
  };

  const toggleRate = () => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    if (isPlaying) {
      handleRestart();
    }
  };

  if (!isSupported) return null;

  return (
    <div
      className="p-4 sm:p-5 rounded-2xl transition-all shadow-lg mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 78, 59, 0.15) 100%)',
        border: '1px solid rgba(52, 211, 153, 0.28)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Playback Controls & Status */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 shadow-md cursor-pointer"
            style={{
              width: '52px',
              height: '52px',
              background: isPlaying
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'rgba(52, 211, 153, 0.15)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              color: isPlaying ? '#051b11' : '#34d399',
            }}
            aria-label={isPlaying ? 'Stop audio briefing' : 'Play audio briefing'}
            title={isPlaying ? 'Stop briefing' : 'Play natural voice briefing'}
          >
            {isPlaying ? (
              <Square className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-6 h-6 ml-0.5 fill-current" />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                AI Voice Briefing
              </span>
              {isPlaying && (
                <span className="flex items-center gap-1 h-3.5 px-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <span className="w-1 bg-emerald-400 audio-bar-1 rounded-full" />
                  <span className="w-1 bg-emerald-400 audio-bar-2 rounded-full" />
                  <span className="w-1 bg-emerald-400 audio-bar-3 rounded-full" />
                  <span className="w-1 bg-emerald-400 audio-bar-4 rounded-full" />
                </span>
              )}
            </div>

            <h4 className="font-display font-bold text-sm sm:text-base text-white leading-tight">
              {isPlaying ? 'Speaking Agronomic Assessment...' : 'Listen to 30-Second Diagnosis Briefing'}
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">
              {isPlaying
                ? 'Clear spoken guidance on condition, severity & priority actions.'
                : 'Click play for natural voice synthesis with tailored recovery steps.'}
            </p>
          </div>
        </div>

        {/* Right Settings: Speed, Voice Picker & Transcript Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Speed Toggle */}
          <button
            type="button"
            onClick={toggleRate}
            className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-emerald-400 text-xs font-mono transition-colors shadow-sm cursor-pointer"
            title="Adjust reading speed"
          >
            {playbackRate}x
          </button>

          {/* Voice Selector Dropdown */}
          {availableVoices.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowVoicePicker(!showVoicePicker)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-emerald-400 text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                title="Select preferred voice"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline max-w-[100px] truncate">
                  {selectedVoiceName.split(' ')[0] || 'Voice'}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showVoicePicker && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 p-1.5 rounded-xl bg-stone-950 border border-emerald-500/30 shadow-2xl z-50 animate-pop max-h-56 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-stone-400 border-b border-stone-800 mb-1">
                    Select Voice
                  </div>
                  {availableVoices.map((voice) => {
                    const isSelected = voice.name === selectedVoiceName;
                    return (
                      <button
                        key={voice.name}
                        type="button"
                        onClick={() => {
                          setSelectedVoiceName(voice.name);
                          setShowVoicePicker(false);
                          if (isPlaying) handleRestart();
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                            : 'text-stone-300 hover:bg-stone-900'
                        }`}
                      >
                        <span className="truncate">{voice.name.replace(/(Google|Microsoft|Apple)\s*/gi, '')}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Transcript View Button */}
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className={`p-1.5 px-2.5 rounded-xl border text-xs flex items-center gap-1 transition-all cursor-pointer ${
              showTranscript
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle spoken text transcript"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Text</span>
          </button>

          {/* Replay Button */}
          {isPlaying && (
            <button
              type="button"
              onClick={handleRestart}
              className="p-1.5 px-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Spoken Transcript Teleprompter ──────────────────────────────── */}
      {showTranscript && (
        <div className="mt-3.5 pt-3.5 border-t border-emerald-500/20 animate-fade-in">
          <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
            Spoken Briefing Transcript:
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
            "{spokenText}"
          </p>
        </div>
      )}
    </div>
  );
}
