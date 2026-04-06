import type { SectionId } from '../data/navigation';
import { BLOCK_CATALOG, CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS } from '../data/blocks';
import { FACTORY_FUNCTIONS } from '../data/client-api';
import { FACTORY_COUNT } from '../data/constants';
import { CodeBlock } from '../components/CodeBlock';

interface OverviewSectionProps {
  onNavigate: (id: SectionId) => void;
}

const STATS = [
  { label: 'Block Types', value: String(BLOCK_CATALOG.length), color: 'text-blue-600' },
  { label: 'Categories', value: String(CATEGORIES.length), color: 'text-emerald-600' },
  { label: 'Factory Fns', value: String(FACTORY_FUNCTIONS.length), color: 'text-amber-600' },
  { label: 'Status', value: 'Alpha', color: 'text-violet-600' },
];

import { SDK_NPM } from '../data/constants';

const INSTALL_CODE = `npm install ${SDK_NPM}`;

const QUICKSTART_CODE = `import {
  JourneyClient,
  createJourney, createStep,
  createPersonalInformation, createAddress,
  createActionBar, createSuccessMessage,
} from '@epilot/epilot-journey-sdk'

const client = new JourneyClient({ auth: process.env.EPILOT_TOKEN })

const journey = createJourney({
  organizationId: 'org-123',
  name: 'Contact Form',
  settings: { runtimeEntities: ['ORDER'] },
  steps: [
    createStep({
      name: 'Your Details',
      blocks: [
        createPersonalInformation({ name: 'pi', required: true }),
        createAddress({ name: 'address', required: true }),
        createActionBar('Next', {
          label: 'Submit',
          actionType: 'SubmitAndGoNext',
        }),
      ],
    }),
    createStep({
      name: 'Confirmation',
      showStepper: false,
      hideNextButton: true,
      blocks: [createSuccessMessage('thanks', { title: 'Thank you!' })],
    }),
  ],
})

const created = await client.createJourney(journey)
console.log('Created:', created.journeyId)`;

const AGENT_CAPABILITIES = [
  {
    icon: '🧩',
    title: 'Block Catalog',
    desc: 'All 35+ block types with value shapes, options, and v3 wire format',
    nav: 'catalog' as SectionId,
    accent: 'from-violet-500 to-purple-600',
  },
  {
    icon: '🏭',
    title: 'Factory Functions',
    desc: `${FACTORY_COUNT} typed factories that auto-produce valid API wire format`,
    nav: 'factories' as SectionId,
    accent: 'from-blue-500 to-indigo-600',
  },
  {
    icon: '⚡',
    title: 'Headless Client',
    desc: 'Full CRUD + block-level patch/add/remove without a UI',
    nav: 'client-api' as SectionId,
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    icon: '🤖',
    title: 'Agent Guide',
    desc: 'Wire format traps, failure modes, and proven patterns',
    nav: 'agent-guide' as SectionId,
    accent: 'from-amber-500 to-orange-600',
  },
];

const JOURNEY_PATTERNS = [
  {
    icon: '⚡',
    title: 'Energy Signup',
    steps: 'AvailabilityCheck → ProductSelection + Cart → PersonalInfo + Address → Payment → Consents → Confirm',
  },
  {
    icon: '📝',
    title: 'Lead / Inquiry Form',
    steps: 'Paragraph → PersonalInformation → MultiChoice → TextInput → Consents + SubmitAndGoNext → Confirm',
  },
  {
    icon: '☀️',
    title: 'PV Solar Planner',
    steps: 'Address → PVRoofPlanner → NumberInput → ProductSelection → PersonalInfo → Consents → Confirm',
  },
];

export function OverviewSection({ onNavigate }: OverviewSectionProps) {
  return (
    <div>
      {/* Hero */}
      <div className="relative mb-8 sm:mb-12 -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-6" style={{ background: 'linear-gradient(to bottom, #fafbff 80%, transparent 100%)' }}>
        {/* Background glow */}
        <div className="hero-glow bg-primary-500 hidden sm:block" style={{ top: -100, right: -100 }} />
        <div className="hero-glow bg-violet-500 hidden sm:block" style={{ top: 0, left: -150 }} />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              color: '#6366f1',
            }}>
              <span className="agent-dot" />
              epilot Journey SDK
            </div>
            <a
              href="https://github.com/epilot-dev/epilot-journey-sdk/tree/v2-alpha"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
              style={{
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                color: '#d97706',
              }}
            >
              v2-alpha
            </a>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-5 tracking-tight leading-[1.1]">
            Build Journeys.
            <br />
            <span className="gradient-text">Programmatically.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed mb-4">
            A type-safe SDK for AI agents and developers to create, inspect, and modify epilot journeys. Every block
            type documented. Every wire format quirk handled.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8 text-sm text-gray-500">
            <span>
              <strong className="text-gray-700">Agentic SDK</strong> is under{' '}
              <a href="https://github.com/epilot-dev/epilot-journey-sdk/tree/v2-alpha" target="_blank" rel="noopener noreferrer" className="text-amber-600 font-semibold hover:underline">v2-alpha</a>
            </span>
            <span style={{ opacity: 0.3 }}>&middot;</span>
            <span>
              <a href="https://github.com/epilot-dev/epilot-journey-sdk" target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold hover:underline">v1 (main)</a> holds the{' '}
              <strong className="text-gray-700">Journey Embed SDK</strong>
            </span>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mb-2">
            {STATS.map((stat) => (
              <div key={stat.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-gray-200/60 text-sm">
                <span className={`font-extrabold ${stat.color}`}>{stat.value}</span>
                <span className="text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-14">
        {AGENT_CAPABILITIES.map((cap) => (
          <button
            key={cap.title}
            onClick={() => onNavigate(cap.nav)}
            className="card-interactive text-left group overflow-hidden"
          >
            <div className={`h-1 w-full bg-gradient-to-r ${cap.accent} rounded-t-2xl -mt-6 -mx-6 mb-5`} style={{ width: 'calc(100% + 3rem)' }} />
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xl mb-3">
              {cap.icon}
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">{cap.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{cap.desc}</p>
            <p className="text-xs text-primary-600 font-semibold mt-3 group-hover:text-primary-500 transition-colors">
              Explore →
            </p>
          </button>
        ))}
      </div>

      {/* Block categories */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Block Categories</h2>
      <p className="text-sm text-gray-400 mb-4 sm:mb-6">Browse by category in the block catalog</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 mb-8 sm:mb-14">
        {CATEGORIES.map((cat) => {
          const count = BLOCK_CATALOG.filter((b) => b.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => onNavigate('catalog')}
              className="card-interactive p-4 text-left"
            >
              <div className="text-2xl mb-2">{CATEGORY_ICONS[cat]}</div>
              <p className="text-sm font-bold text-gray-900 leading-tight">{CATEGORY_LABELS[cat]}</p>
              <p className="text-xs text-gray-400 mt-0.5">{count} block{count !== 1 ? 's' : ''}</p>
            </button>
          );
        })}
      </div>

      {/* Common patterns */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Common patterns</h2>
      <p className="text-sm text-gray-400 mb-4 sm:mb-6">Typical block sequences for different journey types</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-14">
        {JOURNEY_PATTERNS.map((p) => (
          <div key={p.title} className="card overflow-hidden">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xl">{p.icon}</span>
              <h3 className="font-bold text-gray-900 text-sm">{p.title}</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-mono">{p.steps}</p>
          </div>
        ))}
      </div>

      {/* Quick start */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight">Quick Start</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CodeBlock title="Install" language="bash" code={INSTALL_CODE} />
        <CodeBlock title="Create a journey in < 30 lines" language="typescript" code={QUICKSTART_CODE} />
      </div>
    </div>
  );
}
