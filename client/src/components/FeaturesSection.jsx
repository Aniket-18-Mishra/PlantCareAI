import { Microscope, Eye, Pill, Shield, History, Bot } from 'lucide-react';

const FEATURES = [
  {
    icon: Microscope,
    title: 'Disease Detection',
    description: 'Identify possible plant diseases from uploaded images using advanced AI visual analysis.',
    accent: '#34d399',
  },
  {
    icon: Eye,
    title: 'Symptom Analysis',
    description: 'Understand visual symptoms the AI noticed — spots, discoloration, lesions, and more.',
    accent: '#2dd4bf',
  },
  {
    icon: Pill,
    title: 'Treatment Guidance',
    description: 'Receive practical treatment suggestions appropriate to the identified condition.',
    accent: '#a78bfa',
  },
  {
    icon: Shield,
    title: 'Prevention Tips',
    description: 'Learn how to reduce the chance of the problem returning with targeted advice.',
    accent: '#34d399',
  },
  {
    icon: History,
    title: 'Scan History',
    description: 'Review all previous plant analyses in one place. Track your plants over time.',
    accent: '#f59e0b',
  },
  {
    icon: Bot,
    title: 'AI Explanations',
    description: 'Get easy-to-understand explanations instead of raw technical output.',
    accent: '#60a5fa',
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="plant-health"
      aria-labelledby="features-heading"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '5.5rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* BG glow */}
      <div style={{
        position: 'absolute', top: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(52,211,153,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="section-tag">What You Get</p>
          <h2 id="features-heading" className="section-title">Everything Your Plant Needs</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A complete plant-health analysis toolkit powered by multimodal AI.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {FEATURES.map(({ icon: Icon, title, description, accent }) => (
            <div
              key={title}
              className="feature-card"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {/* Accent top line */}
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                background: `linear-gradient(90deg, transparent, ${accent}50, transparent)`,
                opacity: 0,
                transition: 'opacity 0.3s',
              }} className="feature-accent-line" />

              <div className="feature-icon" style={{
                background: `${accent}14`,
                border: `1px solid ${accent}24`,
              }}>
                <Icon className="w-5 h-5" style={{ color: accent }} aria-hidden="true" />
              </div>

              <h3 style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                fontSize: '1rem',
              }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
