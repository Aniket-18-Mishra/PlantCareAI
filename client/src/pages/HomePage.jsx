import { Link } from 'react-router-dom';
import { ArrowRight, Scan, Sparkles, Leaf, Zap, Shield, Brain, Camera } from 'lucide-react';
import HowItWorks from '../components/HowItWorks';
import FeaturesSection from '../components/FeaturesSection';
import SupportedPlants from '../components/SupportedPlants';

/* ── Hero ───────────────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-bg">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }} />
      </div>

      <div className="hero-inner">
        {/* Left */}
        <div className="animate-slide-up">
          <div className="hero-badge">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemini AI
          </div>

          <h1 id="hero-heading" className="hero-title">
            Your Plant Has a Story.{' '}
            <span className="gradient-text">Let AI Read It.</span>
          </h1>

          <p className="hero-subtitle">
            Upload a photo of your plant and get instant AI-powered diagnosis — diseases,
            symptoms, treatments, and prevention tips in under 15 seconds.
          </p>

          <div className="hero-cta">
            <Link to="/scan" className="btn-primary text-base px-8 py-4 animate-pulse-glow" id="hero-scan-btn">
              <Scan className="w-5 h-5" />
              Scan Your Plant
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base px-7 py-4">
              How It Works
            </a>
          </div>

          <div className="hero-stats">
            {[
              { value: 'Free', label: 'No signup required' },
              { value: 'Gemini', label: 'Google AI powered' },
              { value: '< 15s', label: 'Avg. analysis time' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="hero-stat-value">{value}</div>
                <div className="hero-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — visual card */}
        <div className="animate-slide-up animate-delay-200 hidden lg:block">
          <div style={{ position: 'relative' }}>
            <div className="hero-card">
              {/* Plant image area */}
              <div className="hero-card-img">
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>🌿</div>
                  <p style={{ color: 'rgba(167,243,208,0.8)', fontSize: '0.8rem', fontWeight: 500 }}>
                    Tomato leaf uploaded
                  </p>
                </div>
              </div>

              {/* Mock result */}
              <div className="hero-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Plant Identified</p>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-primary)' }}>🍅 Tomato</p>
                  </div>
                  <span className="badge badge-green">Analyzed</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>Condition Detected</p>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Early Blight</p>
                  <div className="confidence-bar-track">
                    <div className="confidence-bar-fill" style={{ width: '78%', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }} />
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>78% confidence</p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-amber">Moderate</span>
                  <span className="badge badge-stone">Fungal</span>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="hero-floating-badge animate-bounce-gentle"
              style={{ top: '-1rem', left: '-1rem' }}>
              <Leaf className="w-4 h-4" style={{ color: 'var(--emerald)' }} />
              <span>Disease Detected</span>
            </div>
            <div className="hero-floating-badge"
              style={{
                bottom: '-1rem', right: '-1rem',
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                color: '#071009', borderColor: 'transparent',
              }}>
              <Zap className="w-4 h-4" />
              <span style={{ fontWeight: 700 }}>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Features (mini) ────────────────────────────────────────────────────────── */
function QuickFeatures() {
  const features = [
    { icon: Brain, title: 'AI Diagnosis', desc: 'Powered by Google Gemini for accurate plant disease identification.' },
    { icon: Shield, title: 'Treatment Plans', desc: 'Get specific treatment and prevention recommendations.' },
    { icon: Camera, title: 'Easy Upload', desc: 'Just snap a photo and upload — no technical knowledge needed.' },
    { icon: Zap, title: 'Instant Results', desc: 'Get your plant health report in seconds, not minutes.' },
  ];

  return (
    <section className="page-section" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div className="container-xl">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="section-tag">Why PlantCare AI</p>
          <h2 className="section-title">Smart plant health at your fingertips</h2>
          <p className="section-subtitle">From upload to diagnosis in seconds.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">
                <Icon className="w-5 h-5" style={{ color: 'var(--emerald)' }} />
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ────────────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section aria-labelledby="cta-heading" style={{
      background: 'linear-gradient(135deg, rgba(52,211,153,0.08) 0%, rgba(16,185,129,0.04) 100%)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '5rem 1.5rem',
    }}>
      <div className="container-xl" style={{ textAlign: 'center' }}>
        <div className="hero-badge" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
          <Sparkles className="w-3.5 h-3.5" />
          Start for free today
        </div>
        <h2 id="cta-heading" className="section-title">
          Ready to diagnose your plant?
        </h2>
        <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
          Upload a photo and get AI-powered plant health insights in seconds. No account required to scan.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/scan" className="btn-primary text-base px-8 py-4" id="cta-scan-btn">
            <Scan className="w-5 h-5" />
            Start Free Scan
          </Link>
          <Link to="/register" className="btn-secondary text-base px-7 py-4">
            Create Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── HomePage ────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickFeatures />
      <HowItWorks />
      <FeaturesSection />
      <SupportedPlants />
      <CTASection />
    </>
  );
}
