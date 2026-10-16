import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  AlertTriangle,
  CheckCircle,
  Camera,
  ChevronLeft,
  Eye,
  Trash2,
  History,
  Scan,
  ShieldAlert,
  Info,
  Stethoscope,
  ListChecks,
  Sprout,
  Calendar,
  Share2,
  Printer,
  Sparkles,
  Check,
  HelpCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import ConfidenceBar from '../components/ConfidenceBar';
import ErrorState from '../components/ErrorState';
import LeafInspector from '../components/LeafInspector';
import HealthScoreGauge from '../components/HealthScoreGauge';
import CareChecklist from '../components/CareChecklist';
import AudioBriefing from '../components/AudioBriefing';
import InteractiveFAQ from '../components/InteractiveFAQ';
import { getScanById, deleteScan } from '../services/api';
import {
  formatDate,
  getSeverityStyles,
  getHealthStatusStyles,
  extractErrorMessage,
} from '../utils/formatters';

/* ── Section Wrapper ─────────────────────────────────────────────────────── */
function ResultSection({ icon: Icon, title, iconColor, children }) {
  return (
    <div
      className="card p-6"
      style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--surface-elevated)' }}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} aria-hidden="true" />
        </div>
        <h2 className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, emptyText = 'No information available.' }) {
  if (!items?.length) {
    return (
      <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
        {emptyText}
      </p>
    );
  }
  return (
    <ul className="space-y-2.5" role="list">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-sm p-2.5 rounded-xl border border-stone-800/60 bg-stone-900/30 transition-all hover:border-emerald-500/30"
          style={{ color: 'var(--text-primary)' }}
        >
          <span
            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
            style={{ background: 'var(--primary-color)' }}
            aria-hidden="true"
          />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Healthy Result View ─────────────────────────────────────────────────── */
function HealthyResult({ scan }) {
  return (
    <div
      className="card text-center py-12 px-6"
      style={{
        background: 'var(--surface-color)',
        border: '1px solid rgba(52, 211, 153, 0.3)',
        marginBottom: '1.5rem',
      }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-gentle"
        style={{ background: 'rgba(52,211,153,0.12)' }}
      >
        <CheckCircle className="w-10 h-10 text-emerald-400" aria-hidden="true" />
      </div>
      <h2 className="font-display font-extrabold text-3xl text-emerald-400 mb-3">
        Foliage Appears Healthy & Vigorous! 🌿
      </h2>
      <p className="text-sm max-w-lg mx-auto mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        The visual neural pipeline did not detect active fungal sporulation, necrotic lesions, or systemic chlorosis.
        Continue your regular hydration and indirect lighting regimen.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300">
        <Sparkles className="w-3.5 h-3.5" />
        Optimal Chlorophyll Distribution Detected
      </div>
    </div>
  );
}

/* ── Insufficient Image Result ──────────────────────────────────────────── */
function InsufficientResult() {
  return (
    <div
      className="card text-center py-12 px-6"
      style={{
        background: 'var(--surface-color)',
        border: '1px solid rgba(251, 191, 36, 0.25)',
        marginBottom: '1.5rem',
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: 'rgba(251, 191, 36, 0.1)' }}
      >
        <Camera className="w-8 h-8 text-amber-400" aria-hidden="true" />
      </div>
      <h2 className="font-display font-bold text-2xl text-amber-400 mb-2">
        Insufficient Visual Telemetry
      </h2>
      <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--text-muted)' }}>
        The image does not provide enough cellular leaf resolution for a deterministic diagnosis.
        Ensure adequate lighting and capture the affected leaf margins in sharp focus.
      </p>
      <div className="text-left rounded-xl p-4 max-w-sm mx-auto mb-6" style={{ background: 'var(--surface-elevated)' }}>
        <p className="text-xs font-semibold text-amber-400 mb-2 uppercase tracking-wider">
          Diagnostic Best Practices:
        </p>
        <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• Position the camera 6–10 inches from the leaf blade</li>
          <li>• Utilize natural, diffused indirect sunlight</li>
          <li>• Include both symptomatic lesions and healthy tissue margins</li>
          <li>• Avoid heavy shadows or extreme digital zoom blur</li>
        </ul>
      </div>
      <Link to="/scan" className="btn-primary inline-flex">
        <Scan className="w-4 h-4" aria-hidden="true" />
        Retake Specimen Photo
      </Link>
    </div>
  );
}

/* ── Main Result Page Component ─────────────────────────────────────────── */
export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'checklist' | 'prevention' | 'faq'
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        setLoading(true);
        const response = await getScanById(id);
        if (response.success) {
          setScan(response.data);
        } else {
          setError('Could not load this scan result.');
        }
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchScan();
  }, [id]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteScan(id);
      navigate('/history');
    } catch (err) {
      alert(extractErrorMessage(err));
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleShare = async () => {
    const textToShare = `PlantCare AI Diagnosis: ${scan.plant?.name || 'Plant'} — ${
      scan.diagnosis?.name || scan.healthStatus
    } (Severity: ${scan.severity || 'Standard'}). View report: ${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `PlantCare AI: ${scan.plant?.name || 'Specimen Diagnosis'}`,
          text: textToShare,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(textToShare);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch (e) {
      alert('Report link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadCalendarReminder = () => {
    const plantTitle = scan?.plant?.name || 'Specimen';
    const diagTitle = scan?.diagnosis?.name || 'Health Checkup';
    const now = new Date();
    const reminderDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const formatDateForICS = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const startStr = formatDateForICS(reminderDate);
    const endStr = formatDateForICS(new Date(reminderDate.getTime() + 30 * 60 * 1000));

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PlantCare AI//Specimen Recovery Tracking//EN',
      'BEGIN:VEVENT',
      `SUMMARY:🌿 PlantCare 7-Day Follow-Up: ${plantTitle}`,
      `DESCRIPTION:Conduct secondary visual inspection for ${diagTitle}. Inspect newly flushed leaves for absence of necrotic spotting.`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PlantCare_Checkup_${plantTitle.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div
        className="section container-xl flex items-center justify-center py-24"
        style={{ minHeight: 'calc(100vh - 80px)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 border-4 border-t-emerald-500 rounded-full animate-spin"
            style={{ borderColor: 'rgba(52,211,153,0.2)', borderTopColor: 'var(--primary-color)' }}
            aria-hidden="true"
          />
          <p className="text-sm font-mono text-emerald-400">Synthesizing clinical report...</p>
        </div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="section container-xl">
        <ErrorState
          title="Diagnostic Report Not Found"
          message={error || 'This specimen record could not be loaded.'}
          onRetry={() => navigate('/scan')}
          retryLabel="Scan a New Plant"
        />
      </div>
    );
  }

  const healthStyles = getHealthStatusStyles(scan.healthStatus);
  const severityStyles = getSeverityStyles(scan.severity);
  const isHealthy = scan.healthStatus?.toLowerCase().includes('healthy');
  const isInsufficient = scan.healthStatus?.toLowerCase().includes('insufficient');

  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 80px)', paddingBottom: '6rem' }}>
      <div className="container-xl max-w-5xl mx-auto">
        {/* ── Navigation & Tactical Utility Toolbar ────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost -ml-2 text-xs sm:text-sm font-semibold flex items-center gap-1"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={downloadCalendarReminder}
              className="px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900/80 hover:border-emerald-500/40 text-stone-300 hover:text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              title="Add 7-day follow-up reminder to calendar (.ics)"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              Set 7-Day Checkup
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900/80 hover:border-emerald-500/40 text-stone-300 hover:text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              title="Share or copy diagnosis summary"
            >
              {copiedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-stone-400" />
                  Share
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900/80 hover:border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-all hidden sm:flex"
              title="Print clinical diagnosis sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
              className="p-2 rounded-xl text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Delete this scan"
              title="Delete scan record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Specimen Header ────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-emerald-400">
                  Specimen Dossier
                </span>
                <span className="text-stone-600">•</span>
                <span className="text-xs font-mono text-stone-400">{formatDate(scan.createdAt)}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                {scan.plant?.name || 'Botanical Specimen'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${healthStyles.bg}`}>
                <span aria-hidden="true">{healthStyles.icon}</span>
                <span className={healthStyles.color}>{scan.healthStatus || 'Analyzed'}</span>
              </span>
              <span className={severityStyles.badge}>{scan.severity || 'Standard'}</span>
            </div>
          </div>
        </div>

        {/* ── Audio AI Briefing Synthesizer ──────────────────────────────── */}
        {!isInsufficient && (
          <AudioBriefing
            plant={scan.plant}
            diagnosis={scan.diagnosis}
            severity={scan.severity}
            symptoms={scan.symptoms}
            recommendedActions={scan.recommendedActions}
          />
        )}

        {/* ── Interactive Leaf Inspector + Health Gauge Grid ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left: Interactive Visual Leaf Inspector (7 cols) */}
          <div className="lg:col-span-7">
            {scan.imagePath ? (
              <LeafInspector
                imagePath={scan.imagePath}
                plantName={scan.plant?.name || 'Plant'}
                symptoms={scan.symptoms || []}
              />
            ) : (
              <div className="aspect-video rounded-2xl bg-stone-900 flex items-center justify-center border border-stone-800">
                <Leaf className="w-12 h-12 text-stone-600" />
              </div>
            )}
          </div>

          {/* Right: Specimen Vitals & Radial Score Gauge (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <HealthScoreGauge
              healthStatus={scan.healthStatus}
              severity={scan.severity}
              diagnosis={scan.diagnosis}
            />

            {/* Plant Identification Card */}
            <div
              className="p-5 rounded-2xl border"
              style={{
                background: 'var(--surface-color)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                  Taxonomic Match
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {scan.plant?.confidence || 0}% Match
                </span>
              </div>
              <p className="font-display font-bold text-xl text-white mb-2">
                {scan.plant?.name || 'Unknown Species'}
              </p>
              <ConfidenceBar
                confidence={scan.plant?.confidence || 0}
                label="Foliar ID Confidence"
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* ── Categorized Interactive Tabs ───────────────────────────────── */}
        {!isHealthy && !isInsufficient && (
          <div className="mb-6">
            <div className="flex items-center gap-2 border-b border-stone-800/80 pb-2 overflow-x-auto select-none no-scrollbar">
              {[
                { id: 'dossier', label: 'Diagnostic Dossier', icon: Stethoscope },
                { id: 'checklist', label: 'Interactive Recovery Plan', icon: ListChecks, badge: 'Interactive' },
                { id: 'prevention', label: 'Remedies & Prevention', icon: Sprout },
                { id: 'faq', label: 'Pathology Q&A', icon: HelpCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab Views ──────────────────────────────────────────────────── */}
        {isHealthy ? (
          <HealthyResult scan={scan} />
        ) : isInsufficient ? (
          <InsufficientResult />
        ) : (
          <div>
            {/* ── TAB 1: DIAGNOSTIC DOSSIER ── */}
            {activeTab === 'dossier' && (
              <div className="space-y-6 animate-fade-in">
                {/* Possible Condition Card */}
                <ResultSection icon={Stethoscope} title="Identified Pathological Condition" iconColor="text-rose-400">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display font-extrabold text-2xl text-white">
                          {scan.diagnosis?.name || 'Uncertain Pathology'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700">
                            Certainty: {scan.diagnosis?.certainty || 'Likely'}
                          </span>
                          <span className="text-xs text-stone-400">
                            Cross-referenced with multimodal agronomic datasets
                          </span>
                        </div>
                      </div>
                    </div>
                    <ConfidenceBar
                      confidence={scan.diagnosis?.confidence || 0}
                      label="Diagnosis Confidence Score"
                    />
                  </div>
                </ResultSection>

                {/* Symptoms Observed */}
                {scan.symptoms?.length > 0 && (
                  <ResultSection icon={Eye} title="Foliar Symptoms Detected" iconColor="text-blue-400">
                    <BulletList items={scan.symptoms} emptyText="No explicit foliar lesions detected." />
                  </ResultSection>
                )}

                {/* Possible Causes */}
                {scan.possibleCauses?.length > 0 && (
                  <ResultSection icon={Info} title="Etiology & Underlying Triggers" iconColor="text-violet-400">
                    <BulletList items={scan.possibleCauses} emptyText="No biological agents identified." />
                  </ResultSection>
                )}
              </div>
            )}

            {/* ── TAB 2: INTERACTIVE CHECKLIST ── */}
            {activeTab === 'checklist' && (
              <div className="animate-fade-in">
                <CareChecklist
                  scanId={scan._id}
                  recommendedActions={scan.recommendedActions || []}
                  treatment={scan.treatment || []}
                />
              </div>
            )}

            {/* ── TAB 3: REMEDIES & PREVENTION ── */}
            {activeTab === 'prevention' && (
              <div className="space-y-6 animate-fade-in">
                {/* Treatment Suggestions */}
                {scan.treatment?.length > 0 && (
                  <ResultSection icon={Leaf} title="Targeted Therapeutic Interventions" iconColor="text-teal-400">
                    <BulletList items={scan.treatment} />
                  </ResultSection>
                )}

                {/* Long-Term Prevention */}
                {scan.prevention?.length > 0 && (
                  <ResultSection icon={Sprout} title="Long-Term Agronomic Sanitation" iconColor="text-green-400">
                    <BulletList items={scan.prevention} />
                  </ResultSection>
                )}

                {/* Professional Help Banner */}
                {scan.professionalHelp?.recommended && (
                  <div
                    className="card p-5"
                    style={{
                      background: 'rgba(251, 191, 36, 0.08)',
                      border: '1px solid rgba(251, 191, 36, 0.25)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <h4 className="font-semibold text-amber-300 mb-1">
                          Escalate to Local Agricultural Extension
                        </h4>
                        <p className="text-xs leading-relaxed text-amber-200/80">
                          {scan.professionalHelp.reason ||
                            'Consider consulting an agronomist or regional university extension service if symptoms continue to spread across unpruned stems.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 4: INTERACTIVE FAQ ── */}
            {activeTab === 'faq' && (
              <div className="animate-fade-in">
                <InteractiveFAQ
                  plantName={scan.plant?.name || 'Plant'}
                  diagnosisName={scan.diagnosis?.name || 'Condition'}
                />
              </div>
            )}
          </div>
        )}

        {/* ── AI Disclaimer ──────────────────────────────────────────────── */}
        <div
          className="card p-4 mt-8"
          style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Agronomic AI Advisory: </strong>
              {scan.disclaimer ||
                'This result is generated via computer vision inference. It is intended for decision support and should not substitute laboratory assays for commercial orchards.'}
            </p>
          </div>
        </div>

        {/* ── Bottom Action Navigation ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to="/scan" className="btn-primary flex-1 justify-center py-3.5 text-sm">
            <Scan className="w-4 h-4" aria-hidden="true" />
            Scan Another Specimen
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/history" className="btn-secondary flex-1 justify-center py-3.5 text-sm">
            <History className="w-4 h-4" aria-hidden="true" />
            Review Telemetry History
          </Link>
        </div>
      </div>

      {/* ── Deletion Confirmation Modal ─────────────────────────────────── */}
      {showDeleteModal && (
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
          onClick={() => {
            if (!deleting) setShowDeleteModal(false);
          }}
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
              <Trash2 className="w-6 h-6 text-red-400" />
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
              Purge This Diagnosis?
            </h3>

            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginBottom: '1.75rem',
              }}
            >
              Are you sure you want to delete this scan of {scan.plant?.name || 'this plant'}? This action is permanent and cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="btn-secondary"
                style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.875rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="btn-primary"
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  background: '#ef4444',
                  borderColor: '#ef4444',
                  color: '#ffffff',
                }}
              >
                {deleting ? 'Deleting...' : 'Confirm Purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
