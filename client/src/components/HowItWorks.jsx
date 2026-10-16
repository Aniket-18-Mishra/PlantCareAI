import { Upload, Cpu, ClipboardList } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Photo',
    description: 'Take a clear photo of the affected leaf or plant and upload it directly from your device.',
    color: 'var(--emerald)',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI Analysis',
    description: 'PlantCare AI analyzes patterns, colors, spots, and visual characteristics using Google Gemini multimodal AI.',
    color: '#2dd4bf',
  },
  {
    number: '03',
    icon: ClipboardList,
    title: 'Get Guidance',
    description: 'Receive a clear explanation of the issue, its symptoms, and actionable next steps for treatment.',
    color: '#a78bfa',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      style={{
        background: 'var(--bg-base)',
        padding: '5.5rem 1.5rem',
        borderTop: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background orb */}
      <div style={{
        position: 'absolute', bottom: '-150px', right: '-150px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 65%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="section-tag">Simple Process</p>
          <h2 id="how-it-works-heading" className="section-title">How It Works</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            From photo to plant-health guidance in three simple steps.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          position: 'relative',
        }}>
          {/* Connector line (desktop) */}
          <div style={{
            position: 'absolute',
            top: '2rem',
            left: '16.5%',
            right: '16.5%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.2), rgba(52,211,153,0.2), transparent)',
            display: 'none',
          }} className="connector-line" />

          {STEPS.map(({ number, icon: Icon, title, description, color }) => (
            <div
              key={number}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'rgba(11,20,16,0.5)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${color}35`;
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.3), 0 0 30px ${color}08`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Step number */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1.25rem',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '2.5rem',
                fontWeight: 900,
                color: `${color}12`,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                userSelect: 'none',
              }}>{number}</div>

              {/* Icon */}
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '16px',
                background: `${color}12`,
                border: `1px solid ${color}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                position: 'relative',
              }}>
                <Icon className="w-6 h-6" style={{ color }} aria-hidden="true" />
                {/* Badge */}
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '22px',
                  height: '22px',
                  background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  color: '#071009',
                  fontSize: '0.65rem',
                  fontWeight: 900,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {number.replace('0', '')}
                </span>
              </div>

              <h3 style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
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
