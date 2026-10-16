const PLANTS = [
  { emoji: '🍅', name: 'Tomato' },
  { emoji: '🥔', name: 'Potato' },
  { emoji: '🌹', name: 'Rose' },
  { emoji: '🍎', name: 'Apple' },
  { emoji: '🍇', name: 'Grape' },
  { emoji: '🌽', name: 'Corn' },
  { emoji: '🫑', name: 'Pepper' },
  { emoji: '🥒', name: 'Cucumber' },
  { emoji: '🫐', name: 'Blueberry' },
  { emoji: '🍓', name: 'Strawberry' },
  { emoji: '🌻', name: 'Sunflower' },
  { emoji: '🌿', name: 'Basil' },
];

export default function SupportedPlants() {
  return (
    <section aria-labelledby="plants-heading" style={{
      background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', padding: '5rem 1.5rem',
    }}>
      <div className="container-xl">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p className="section-tag">Explore</p>
          <h2 id="plants-heading" className="section-title">Plants You Can Try</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Common examples — PlantCare AI works with any plant image you upload.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.75rem' }}>
          {PLANTS.map((plant) => (
            <div
              key={plant.name}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 0.5rem', borderRadius: '12px', cursor: 'default',
                background: 'rgba(52,211,153,0.04)', border: '1px solid var(--border)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(52,211,153,0.09)';
                e.currentTarget.style.borderColor = 'rgba(52,211,153,0.25)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(52,211,153,0.04)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span className="text-2xl" role="img" aria-label={plant.name}>{plant.emoji}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{plant.name}</span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2rem', maxWidth: '480px', margin: '1.5rem auto 0', lineHeight: 1.7 }}>
          PlantCare AI can analyze any plant image. The above are common examples. Accuracy depends on image quality and how clearly the affected area is visible.
        </p>
      </div>
    </section>
  );
}
