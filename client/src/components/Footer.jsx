import { Link } from 'react-router-dom';
import { Leaf, Heart } from 'lucide-react';

const LINKS = {
  product: [
    { label: 'Scan Plant',  to: '/scan' },
    { label: 'History',     to: '/history' },
    { label: 'About',       to: '/about' },
  ],
  account: [
    { label: 'Sign In',     to: '/login' },
    { label: 'Register',    to: '/register' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      {/* Inner */}
      <div className="container-xl">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
              textDecoration: 'none', marginBottom: '1rem',
            }}>
              <div style={{
                width: '2.125rem', height: '2.125rem',
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                borderRadius: '9px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 14px rgba(52,211,153,0.25)',
              }}>
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                PlantCare <span style={{ color: 'var(--emerald)' }}>AI</span>
              </span>
            </Link>

            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '280px', marginBottom: '1.25rem' }}>
              AI-powered plant health analysis. Upload a photo, get instant insights and treatment guidance. Powered by Google Gemini.
            </p>

            {/* Tech badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['React', 'Node.js', 'MongoDB', 'Gemini AI'].map((tech) => (
                <span key={tech} style={{
                  padding: '0.2rem 0.625rem',
                  background: 'rgba(52,211,153,0.06)',
                  border: '1px solid rgba(52,211,153,0.12)',
                  borderRadius: '6px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.02em',
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              color: 'var(--text-primary)', fontSize: '0.78rem',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: '1rem',
            }}>
              Product
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {LINKS.product.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{
                      fontSize: '0.875rem', color: 'var(--text-muted)',
                      textDecoration: 'none', transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--emerald)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              color: 'var(--text-primary)', fontSize: '0.78rem',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: '1rem',
            }}>
              Account
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {LINKS.account.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{
                      fontSize: '0.875rem', color: 'var(--text-muted)',
                      textDecoration: 'none', transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--emerald)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              color: 'var(--text-primary)', fontSize: '0.78rem',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: '1rem',
            }}>
              Disclaimer
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>
              PlantCare AI results are AI-generated indications only. Always consult a qualified agricultural expert for critical plant health decisions.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © {year} PlantCare AI. All rights reserved.
          </p>
          <p style={{
            fontSize: '0.75rem', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
          }}>
            Made with <Heart className="w-3 h-3" style={{ color: '#f87171' }} /> using React, Node.js &amp; Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
