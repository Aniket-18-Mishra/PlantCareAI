import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, Scan, History, Info, Home, LogIn, UserPlus, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home',       to: '/',        icon: Home },
  { label: 'Scan Plant', to: '/scan',    icon: Scan, highlight: true },
  { label: 'History',    to: '/history', icon: History },
  { label: 'About',      to: '/about',   icon: Info },
];

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setUserOpen(false); }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setUserOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`} role="banner">
      <div className="navbar-inner">

        {/* ── Logo ── */}
        <Link to="/" className="nav-logo" aria-label="PlantCare AI — Home">
          <div className="nav-logo-icon">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="nav-logo-text hidden sm:block">
            PlantCare <span>AI</span>
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="nav-links" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, to, highlight }) =>
            highlight ? (
              <Link key={to} to={to} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem' }}>
                <Scan className="w-3.5 h-3.5" />
                {label}
              </Link>
            ) : (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to) ? 'nav-link-active' : ''}`}
                aria-current={isActive(to) ? 'page' : undefined}
              >
                {label}
              </Link>
            )
          )}
        </nav>

        {/* ── Auth / User ── */}
        <div className="nav-auth-btns">
          {user ? (
            /* User dropdown */
            <div style={{ position: 'relative' }} ref={dropRef}>
              <button
                onClick={() => setUserOpen((v) => !v)}
                className="nav-user-info"
                aria-expanded={userOpen}
                aria-haspopup="true"
                aria-label="User menu"
                style={{ background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.625rem 0.25rem 0.25rem', borderRadius: '99px', border: '1px solid var(--border)', transition: 'all 0.2s' }}
              >
                <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="nav-user-name hidden sm:block">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)', transform: userOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Dropdown */}
              {userOpen && (
                <div className="animate-fade-in" style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'rgba(10, 18, 13, 0.97)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '0.5rem',
                  minWidth: '200px',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(52,211,153,0.05)',
                  zIndex: 200,
                }}>
                  {/* User info row */}
                  <div style={{ padding: '0.625rem 0.75rem', marginBottom: '0.25rem', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{user.email}</p>
                  </div>

                  <Link to="/history" onClick={() => setUserOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.55rem 0.75rem', borderRadius: '9px',
                    fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.07)'; e.currentTarget.style.color = 'var(--emerald)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <History className="w-3.5 h-3.5" /> Scan History
                  </Link>

                  <button onClick={() => { logout(); setUserOpen(false); }} style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%',
                    padding: '0.55rem 0.75rem', borderRadius: '9px',
                    fontSize: '0.85rem', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer',
                    transition: 'all 0.15s', textAlign: 'left',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    id="logout-btn"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login"    className="nav-login-btn"    id="nav-login-btn">Sign In</Link>
              <Link to="/register" className="nav-register-btn" id="nav-register-btn">Get Started</Link>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div id="mobile-menu" className="mobile-menu animate-fade-in" role="navigation" aria-label="Mobile navigation">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_LINKS.map(({ label, to, icon: Icon, highlight }) => (
              <Link
                key={to}
                to={to}
                className={`mobile-nav-link ${highlight ? 'mobile-nav-highlight' : isActive(to) ? 'mobile-nav-link-active' : ''}`}
                aria-current={isActive(to) ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            <div style={{ paddingTop: '0.625rem', marginTop: '0.375rem', borderTop: '1px solid var(--border)' }}>
              {user ? (
                <>
                  <div style={{ padding: '0.625rem 1rem', marginBottom: '0.25rem' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="mobile-nav-link"
                    style={{ color: '#f87171', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login"    className="mobile-nav-link"><LogIn    className="w-4 h-4" /> Sign In</Link>
                  <Link to="/register" className="mobile-nav-link mobile-nav-highlight"><UserPlus className="w-4 h-4" /> Create Account</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
