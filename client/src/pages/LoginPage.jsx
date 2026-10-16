import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf, Mail, Lock, Eye, EyeOff, AlertCircle,
  ArrowRight, Sparkles, CheckCircle, Zap, Shield, Brain,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: Brain,       text: 'AI-powered plant disease detection' },
  { icon: Zap,         text: 'Results in under 15 seconds' },
  { icon: Shield,      text: 'Treatment & prevention guidance' },
  { icon: CheckCircle, text: 'Save and review your scan history' },
];

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    const result = await login(form);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left visual panel ── */}
      <div className="auth-panel-left">
        <div className="auth-panel-left-orb-1" />
        <div className="auth-panel-left-orb-2" />
        <div className="auth-panel-left-grid" />

        <div className="auth-panel-left-content animate-slide-in-left">
          {/* Brand */}
          <Link to="/" className="auth-panel-brand">
            <div className="auth-panel-brand-icon">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="auth-panel-brand-name">
              PlantCare <span>AI</span>
            </span>
          </Link>

          {/* Headline */}
          <h1 className="auth-panel-headline">
            Diagnose your plant<br />
            <span className="gradient-text">in seconds.</span>
          </h1>
          <p className="auth-panel-subtext">
            Upload a photo of your plant and get instant AI-powered health
            analysis — diseases, symptoms, and treatment advice.
          </p>

          {/* Features */}
          <div className="auth-feature-list">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="auth-feature-item">
                <div className="auth-feature-dot">
                  <Icon className="w-3.5 h-3.5" style={{ color: 'var(--emerald)' }} />
                </div>
                {text}
              </div>
            ))}
          </div>

          {/* Mockup mini-card */}
          <div className="auth-mockup-card animate-float">
            <div className="auth-mockup-img">
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>🌿</div>
                <p style={{ fontSize: '0.72rem', color: 'rgba(167,243,208,0.75)', fontWeight: 500 }}>
                  Tomato leaf — analyzed
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <div>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Condition</p>
                <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Early Blight</p>
              </div>
              <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Moderate</span>
            </div>
            <div className="confidence-bar-track" style={{ marginBottom: '0.375rem' }}>
              <div className="confidence-bar-fill" style={{ width: '78%', background: 'linear-gradient(90deg,#fbbf24,#f59e0b)' }} />
            </div>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>78% confidence · Fungal infection</p>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-panel-right">
        <div className="auth-panel-right-inner animate-slide-up">
          {/* Mobile-only logo */}
          <Link to="/" className="auth-mobile-logo">
            <div className="auth-mobile-logo-icon">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="auth-mobile-logo-text">PlantCare <span>AI</span></span>
          </Link>

          {/* Header */}
          <div className="auth-form-header">
            <div className="auth-pill">
              <Sparkles className="w-3 h-3" />
              Welcome back
            </div>
            <h1 className="auth-heading">Sign in to your account</h1>
            <p className="auth-subheading">Continue your plant health journey</p>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-alert-error" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="auth-group">
              <label htmlFor="login-email" className="auth-label-txt">Email address</label>
              <div className="auth-input-wrap">
                <Mail className="auth-input-icon" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="auth-input-field"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-group">
              <label htmlFor="login-password" className="auth-label-txt">Password</label>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className={`auth-input-field ${showPassword ? '' : 'auth-input-padded-right'}`}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="auth-footer-txt">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-footer-link">
              Create one for free
            </Link>
          </p>

          {/* Back to home */}
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--emerald)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
