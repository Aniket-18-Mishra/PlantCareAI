import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, User, Mail, Lock, Eye, EyeOff, AlertCircle,
  ArrowRight, Sparkles, CheckCircle, Zap, Shield, Brain,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: Brain,       text: 'AI-powered plant disease detection' },
  { icon: Zap,         text: 'Results in under 15 seconds' },
  { icon: Shield,      text: 'Treatment & prevention guidance' },
  { icon: CheckCircle, text: 'Save and review your scan history' },
];

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    const result = await register({ name: form.name, email: form.email, password: form.password });
    if (result.success) {
      navigate('/', { replace: true });
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
            Start healing your<br />
            <span className="gradient-text">plants today.</span>
          </h1>
          <p className="auth-panel-subtext">
            Join PlantCare AI and get instant, AI-powered plant health
            diagnostics. Free to sign up — no credit card required.
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
          <div className="auth-mockup-card animate-float animate-delay-200">
            <div className="auth-mockup-img">
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>🌿</div>
                <p style={{ fontSize: '0.72rem', color: 'rgba(167,243,208,0.75)', fontWeight: 500 }}>
                  Plant analyzed — healthy!
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <div>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Status</p>
                <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>No disease detected</p>
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Healthy</span>
            </div>
            <div className="confidence-bar-track" style={{ marginBottom: '0.375rem' }}>
              <div className="confidence-bar-fill" style={{ width: '94%', background: 'linear-gradient(90deg,#34d399,#10b981)' }} />
            </div>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>94% confidence · Basil plant</p>
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
              Get started for free
            </div>
            <h1 className="auth-heading">Create your account</h1>
            <p className="auth-subheading">Start diagnosing your plants with AI</p>
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
            {/* Name */}
            <div className="auth-group">
              <label htmlFor="reg-name" className="auth-label-txt">Full name</label>
              <div className="auth-input-wrap">
                <User className="auth-input-icon" />
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  className="auth-input-field"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-group">
              <label htmlFor="reg-email" className="auth-label-txt">Email address</label>
              <div className="auth-input-wrap">
                <Mail className="auth-input-icon" />
                <input
                  id="reg-email"
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
              <label htmlFor="reg-password" className="auth-label-txt">Password</label>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" />
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="auth-input-field auth-input-padded-right"
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

            {/* Confirm Password */}
            <div className="auth-group">
              <label htmlFor="reg-confirm" className="auth-label-txt">Confirm password</label>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" />
                <input
                  id="reg-confirm"
                  name="confirm"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handleChange}
                  className="auth-input-field"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
              id="register-submit-btn"
            >
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="auth-footer-txt">
            Already have an account?{' '}
            <Link to="/login" className="auth-footer-link">
              Sign in
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
