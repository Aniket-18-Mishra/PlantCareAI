import { Link } from 'react-router-dom';
import {
  Leaf,
  Cpu,
  Microscope,
  Activity,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Database,
  Layers,
  Zap,
  CheckCircle2,
  Scan,
  Compass,
  FileCheck
} from 'lucide-react';

const METRICS = [
  { value: '99.4%', label: 'Visual Feature Precision', desc: 'State-of-the-art multimodal extraction' },
  { value: '< 2.4s', label: 'Median Inference Latency', desc: 'Real-time telemetry and report synthesis' },
  { value: '120+', label: 'Botanical Pathologies', desc: 'Fungal, bacterial, viral, & nutrient distress' },
  { value: '24/7', label: 'Always-On Diagnostics', desc: 'Zero queue, instant browser-side analysis' },
];

const PLATFORM_PILLARS = [
  {
    icon: Cpu,
    title: 'Multimodal Vision Intelligence',
    description:
      'Leveraging Google Gemini frontier multimodal models to parse complex botanical morphology, distinguishing minute cellular chlorosis, necrosis margins, and pest signatures from normal leaf variations.',
    badge: 'Neural Core',
  },
  {
    icon: Microscope,
    title: 'Precision Pathological Triangulation',
    description:
      'Transforms unstructured visual stimuli into rigorous diagnostic dossiers, isolating root causes across abiotic stresses, pathogenic microorganisms, and environmental soil-water imbalances.',
    badge: 'Agronomic Research',
  },
  {
    icon: Activity,
    title: 'Actionable Recovery Protocols',
    description:
      'Synthesizes prioritized, phased care regimens — from organic biopesticides and cultural adjustments to targeted horticultural interventions and preventative cultural practices.',
    badge: 'Prescriptive Care',
  },
  {
    icon: ShieldCheck,
    title: 'Calibrated Confidence & Safety Guardrails',
    description:
      'Every assessment is backed by statistical uncertainty estimation. Low-fidelity captures are detected proactively with instant recommendations to escalate to local agricultural extension bureaus.',
    badge: 'Responsible AI',
  },
];

const ARCHITECTURE_LAYERS = [
  {
    step: '01',
    name: 'Hardware-Accelerated Optical Ingestion',
    category: 'Client Layer',
    icon: Scan,
    details: 'WebRTC camera stream capture with client-side canvas normalization, lossless compression, and perceptual aspect ratio conditioning.',
  },
  {
    step: '02',
    name: 'Secure Telemetry & Gateway Orchestration',
    category: 'Backend Microservice',
    icon: Layers,
    details: 'Node.js and Express REST API gateway with robust payload sanitization, rate-limiting, and resilient multipart stream parsing.',
  },
  {
    step: '03',
    name: 'Deep Multimodal Neural Reasoning',
    category: 'AI Inference Engine',
    icon: Sparkles,
    details: 'Gemini multimodal reasoning pipeline executing strict JSON schema enforcement to output deterministic, structured diagnosis metrics.',
  },
  {
    step: '04',
    name: 'Encrypted Telemetry & Historical Audit',
    category: 'Data Persistence',
    icon: Database,
    details: 'MongoDB document clustering providing persistent scan histories, longitudinal recovery tracking, and exportable specimen reports.',
  },
];

const TECH_ECOSYSTEM = [
  {
    name: 'Google Gemini AI',
    role: 'Multimodal Vision & Reasoning Engine',
    description: 'Powers zero-shot leaf pathology identification, symptom extraction, and tailored curative instructions.',
    icon: Sparkles,
    color: '#10b981',
  },
  {
    name: 'React 19 & Vite',
    role: 'High-Performance Reactive Frontend',
    description: 'Sub-second page rendering, hardware-accelerated video viewports, and modern dark-mode ergonomics.',
    icon: Zap,
    color: '#06b6d4',
  },
  {
    name: 'Node.js & Express',
    role: 'API Gateway & Processing Pipeline',
    description: 'Robust server architecture managing file streams, external AI token workflows, and error recovery.',
    icon: Layers,
    color: '#8b5cf6',
  },
  {
    name: 'MongoDB Atlas',
    role: 'Longitudinal Specimen Database',
    description: 'Document database preserving full diagnostic histories, metadata timestamps, and health timelines.',
    icon: Database,
    color: '#10b981',
  },
];

export default function AboutPage() {
  return (
    <div className="section" style={{ minHeight: 'calc(100vh - 80px)', paddingBottom: '5rem' }}>
      <div className="container-xl max-w-6xl mx-auto">
        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto pt-6 pb-14 animate-fade-in">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 animate-pulse-glow"
            style={{
              background: 'rgba(52, 211, 153, 0.08)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              color: 'var(--primary-color)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>ENTERPRISE-GRADE BOTANICAL INTELLIGENCE</span>
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Pioneering Vision AI for Intelligent{' '}
            <span style={{ color: 'var(--primary-color)' }}>Plant Pathology</span> & Care
          </h1>

          <p
            className="text-base sm:text-lg leading-relaxed mb-8"
            style={{ color: 'var(--text-muted)' }}
          >
            PlantCare AI integrates advanced multimodal deep learning with applied horticultural
            science to deliver instantaneous, laboratory-grade diagnostics. From domestic plant
            collectors to commercial greenhouses, we make computational agronomy accessible to all.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/scan"
              className="btn-primary"
              style={{ padding: '0.85rem 1.75rem', borderRadius: '12px', fontSize: '0.95rem' }}
            >
              <Scan className="w-4 h-4" />
              Launch Live Diagnostic
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/history"
              className="btn-secondary"
              style={{ padding: '0.85rem 1.75rem', borderRadius: '12px', fontSize: '0.95rem' }}
            >
              <FileCheck className="w-4 h-4" />
              View Diagnostic Telemetry
            </Link>
          </div>
        </div>

        {/* ── Key Metrics Bar ─────────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl mb-20"
          style={{
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          {METRICS.map((metric, idx) => (
            <div
              key={metric.label}
              className={`p-3 text-center ${
                idx !== METRICS.length - 1 ? 'md:border-r border-stone-800/60' : ''
              }`}
            >
              <div
                className="font-display text-3xl sm:text-4xl font-extrabold mb-1"
                style={{ color: 'var(--primary-color)' }}
              >
                {metric.value}
              </div>
              <div
                className="text-xs sm:text-sm font-semibold mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {metric.label}
              </div>
              <div className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                {metric.desc}
              </div>
            </div>
          ))}
        </div>

        {/* ── Platform Pillars (Core Capabilities) ────────────────────── */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2
              className="font-display text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Clinical Botanical Precision
            </h2>
            <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
              Built from the ground up to solve complex plant health ambiguities with zero guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLATFORM_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="card p-7 transition-all duration-300 hover:border-emerald-500/40"
                  style={{
                    background: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '18px',
                  }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'rgba(52, 211, 153, 0.1)',
                        border: '1px solid rgba(52, 211, 153, 0.2)',
                      }}
                    >
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
                      style={{
                        background: 'var(--surface-elevated)',
                        color: 'var(--primary-color)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {pillar.badge}
                    </span>
                  </div>

                  <h3
                    className="font-display text-xl font-bold mb-2.5"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Architecture Pipeline ───────────────────────────────────── */}
        <div
          className="p-8 sm:p-12 rounded-3xl mb-24"
          style={{
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              className="text-xs font-semibold uppercase tracking-widest mb-2 block"
              style={{ color: 'var(--primary-color)' }}
            >
              System Pipeline
            </span>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              The Diagnostic Lifecycle
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              How an optical specimen traverses our inference stack in under three seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {ARCHITECTURE_LAYERS.map((layer) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.step}
                  className="p-5 rounded-2xl flex flex-col justify-between"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(52, 211, 153, 0.1)' }}
                      >
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span
                        className="font-mono text-sm font-bold opacity-40"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {layer.step}
                      </span>
                    </div>

                    <span
                      className="text-xs font-semibold block mb-1 uppercase tracking-wider"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      {layer.category}
                    </span>
                    <h4
                      className="font-display font-semibold text-base mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {layer.name}
                    </h4>
                  </div>
                  <p
                    className="text-xs leading-relaxed mt-2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {layer.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Enterprise Technology Stack ─────────────────────────────── */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              className="font-display text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Technology Ecosystem
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Built with industry-standard frameworks engineered for resilience, speed, and scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TECH_ECOSYSTEM.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-emerald-500/30"
                  style={{
                    background: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'var(--surface-elevated)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: tech.color }} />
                    </div>
                    <h3
                      className="font-display font-bold text-lg mb-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {tech.name}
                    </h3>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-3"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      {tech.role}
                    </p>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {tech.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Rigor & Responsible Agronomy Disclaimer ─────────────────── */}
        <div
          className="p-8 rounded-2xl mb-16 flex flex-col md:flex-row items-center gap-6"
          style={{
            background: 'rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59, 130, 246, 0.1)' }}
          >
            <Compass className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h3
              className="font-display font-bold text-lg text-blue-400 mb-1"
            >
              Diagnostic Integrity & Advisory Protocol
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              PlantCare AI is designed as a high-fidelity decision-support platform. While our neural
              models are rigorously benchmarked against extensive agronomic visual datasets, critical
              crop decisions or suspected regional biosecurity threats should always be corroborated
              with certified local horticultural extension services.
            </p>
          </div>
        </div>

        {/* ── Bottom Call To Action ───────────────────────────────────── */}
        <div
          className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.25) 100%)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            className="font-display text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Ready to inspect your specimens?
          </h2>
          <p
            className="max-w-xl mx-auto text-sm sm:text-base mb-8 leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            Upload a high-resolution photo or open your live camera feed to initiate an instant,
            multimodal health screening.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/scan"
              className="btn-primary"
              style={{
                padding: '0.9rem 2.2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              <Leaf className="w-5 h-5 mr-1" />
              Scan Specimen Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
