import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, ArrowRight, Leaf, Sparkles, Zap, Shield } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import AnalysisLoader from '../components/AnalysisLoader';
import ErrorState from '../components/ErrorState';
import { analyzePlant } from '../services/api';
import { extractErrorMessage } from '../utils/formatters';

const SCAN_TIPS = [
  { icon: '📸', tip: 'Use good lighting — natural daylight works best' },
  { icon: '🔍', tip: 'Focus on affected leaves or stems' },
  { icon: '📐', tip: 'Fill the frame — zoom in on the problem area' },
];

export default function ScanPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
    setErrorMessage('');
    setStatus('idle');
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a plant image first.');
      return;
    }
    setStatus('analyzing');
    setErrorMessage('');
    try {
      const response = await analyzePlant(selectedFile);
      if (response.success && response.data?._id) {
        navigate(`/result/${response.data._id}`);
      } else {
        throw new Error('Unexpected response from server. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(extractErrorMessage(err));
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage('');
    setSelectedFile(null);
  };

  if (status === 'analyzing') {
    return (
      <div style={{
        background: 'var(--bg-base)',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <AnalysisLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="scan-page-bg">
      <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.18)',
            borderRadius: '999px', padding: '0.375rem 0.875rem', marginBottom: '1.25rem',
          }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--emerald)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              AI Plant Scanner
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
            lineHeight: 1.1,
          }}>
            Scan Your Plant
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            maxWidth: '400px',
            margin: '0 auto',
            lineHeight: 1.7,
            fontSize: '1rem',
          }}>
            Upload a clear photo of your plant or leaf for instant AI-powered
            health analysis and diagnosis.
          </p>
        </div>

        {/* Stats strip */}
        <div className="animate-slide-up animate-delay-100" style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { icon: Zap,    label: '< 15s analysis' },
            { icon: Shield, label: 'Secure & private' },
            { icon: Leaf,   label: '500+ plant types' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(52,211,153,0.05)',
              border: '1px solid rgba(52,211,153,0.1)',
              borderRadius: '99px',
              padding: '0.3rem 0.75rem',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}>
              <Icon className="w-3 h-3" style={{ color: 'var(--emerald)' }} />
              {label}
            </div>
          ))}
        </div>

        {/* Error state */}
        {status === 'error' && (
          <div className="animate-fade-in" style={{
            background: 'rgba(248,113,113,0.06)',
            border: '1px solid rgba(248,113,113,0.18)',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }} role="alert" aria-live="assertive">
            <ErrorState title="Analysis Failed" message={errorMessage} onRetry={handleRetry} retryLabel="Try Again" />
          </div>
        )}

        {/* Upload card */}
        {status !== 'error' && (
          <div className="animate-slide-up animate-delay-200">
            <div className="scan-upload-card" style={{ marginBottom: '1.25rem' }}>
              <ImageUploader onFileSelect={handleFileSelect} disabled={status === 'analyzing'} />
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || status === 'analyzing'}
              className="btn-primary animate-pulse-glow"
              style={{ width: '100%', fontSize: '1.05rem', padding: '1.05rem', borderRadius: '14px' }}
              id="analyze-plant-btn"
              aria-label="Analyze plant image with AI"
            >
              <Scan className="w-5 h-5" />
              Analyze My Plant
              <ArrowRight className="w-4 h-4" />
            </button>

            {!selectedFile && (
              <p style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.75rem',
              }}>
                Select an image above to enable analysis
              </p>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="animate-slide-up animate-delay-400" style={{ marginTop: '2.5rem' }}>
          <p style={{
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            textAlign: 'center', marginBottom: '1rem',
          }}>
            Tips for best results
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {SCAN_TIPS.map(({ icon, tip }) => (
              <div key={tip} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '0.875rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          marginTop: '2rem',
          lineHeight: 1.65,
          maxWidth: '380px',
          margin: '2rem auto 0',
        }}>
          AI results are informational only and not a professional agricultural diagnosis.
          Always consult a qualified expert for critical decisions.
        </p>
      </div>
    </div>
  );
}
