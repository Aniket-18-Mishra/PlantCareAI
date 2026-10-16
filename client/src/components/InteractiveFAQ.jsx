import { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export default function InteractiveFAQ({ plantName = 'Plant', diagnosisName = 'Condition' }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: `Can the spotted or damaged leaves on this ${plantName} recover and turn green again?`,
      a: `Generally, necrotic (brown, black, or dried) leaf tissue has suffered cellular death and will not regenerate green chlorophyll. However, by executing the recommended treatment protocol, you halt active progression and ensure all upcoming leaf flushes and shoots emerge vibrant, resilient, and disease-free.`,
    },
    {
      q: `Is this condition contagious to my neighboring houseplants or garden beds?`,
      a: `Yes, if it is caused by fungal spores or bacterial pathogens (such as Anthracnose or leaf spots), microscopic spores easily disperse via overhead watering splashes, high humidity, or physical contact. We recommend isolating this specimen by at least 3–4 feet until treatment is established.`,
    },
    {
      q: `What is the optimal time of day to apply sprays, fungicides, or neem oil?`,
      a: `Always administer foliar treatments during early morning or late dusk. Applying liquid remedies under intense midday sunlight can trigger phototoxicity (leaf burn) as water droplets act as miniature lenses magnifying solar radiation.`,
    },
    {
      q: `Should I prune all infected leaves at once?`,
      a: `Prune severely blighted or heavily diseased foliage immediately to eliminate fungal spore reserves, but avoid stripping more than 25% to 30% of the total canopy in a single session. Removing too much photosynthetic area can shock the root system. Disinfect pruning shears with isopropyl alcohol between cuts!`,
    },
    {
      q: `How long until I see verifiable recovery?`,
      a: `With proper sanitation and targeted intervention, active lesion expansion usually halts within 48 to 72 hours. Distinct new vegetative growth demonstrating full health should be visible within 10 to 14 days.`,
    },
  ];

  return (
    <div
      className="card p-6"
      style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
      }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(52, 211, 153, 0.1)' }}
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg text-white">
            Pathological Q&A & Botanical Guidance
          </h2>
          <p className="text-xs text-stone-400">
            Interactive agronomic clarifications tailored for {plantName}.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-stone-900/90 border-emerald-500/30 shadow-lg'
                  : 'bg-stone-900/40 border-stone-800/80 hover:border-stone-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full text-left p-4 flex items-center justify-between gap-3 text-sm font-semibold transition-colors"
                style={{ color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-stone-300 leading-relaxed border-t border-stone-800/60 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
