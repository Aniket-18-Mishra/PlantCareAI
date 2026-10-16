export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem', textAlign: 'center' }}>
      {Icon && (
        <div style={{
          width: '5rem', height: '5rem',
          background: 'rgba(52,211,153,0.08)',
          border: '1px solid rgba(52,211,153,0.15)',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
        }}>
          <Icon className="w-8 h-8" style={{ color: 'var(--emerald)', opacity: 0.7 }} aria-hidden="true" />
        </div>
      )}
      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      {subtitle && (
        <p style={{ color: 'var(--text-secondary)', maxWidth: '340px', marginBottom: '2rem', fontSize: '0.875rem', lineHeight: 1.7 }}>
          {subtitle}
        </p>
      )}
      {action}
    </div>
  );
}
