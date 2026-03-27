import type { SectionId } from '../data/navigation';
import { BLOCK_CATALOG, CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS } from '../data/blocks';
import { FACTORY_FUNCTIONS } from '../data/client-api';
import { CodeBlock } from '../components/CodeBlock';

interface OverviewSectionProps {
  onNavigate: (id: SectionId) => void;
}

const STATS = [
  { label: 'Block Types', value: String(BLOCK_CATALOG.length), color: 'bg-primary-50 text-primary-700 border border-primary-100' },
  { label: 'Categories', value: String(CATEGORIES.length), color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  { label: 'Factory Fns', value: String(FACTORY_FUNCTIONS.length), color: 'bg-amber-50 text-amber-700 border border-amber-100' },
  { label: 'Alpha', value: 'v1.0.7', color: 'bg-purple-50 text-purple-700 border border-purple-100' },
];

const INSTALL_CODE = `npm install @epilot/epilot-journey-sdk`;

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
    title: 'Browse all 35+ blocks',
    desc: 'Every block type with value shape, options, and v3 wire format',
    nav: 'catalog' as SectionId,
  },
  {
    icon: '🏭',
    title: 'Type-safe factory functions',
    desc: '19 typed factories that auto-produce valid API wire format',
    nav: 'factories' as SectionId,
  },
  {
    icon: '⚡',
    title: 'Headless JourneyClient',
    desc: 'Full CRUD + block-level patch/add/remove without a UI',
    nav: 'client-api' as SectionId,
  },
  {
    icon: '🤖',
    title: 'Agent rules & gotchas',
    desc: 'Failure modes, wire format traps, and proven patterns',
    nav: 'agent-guide' as SectionId,
  },
];

const JOURNEY_PATTERNS = [
  {
    icon: '⚡',
    title: 'Energy Signup',
    gradient: 'from-amber-500 to-orange-500',
    steps: 'AvailabilityCheck → ProductSelection + Cart → PersonalInfo + Address → Payment → Consents → Confirm',
  },
  {
    icon: '📝',
    title: 'Lead / Inquiry Form',
    gradient: 'from-primary-600 to-blue-400',
    steps: 'Paragraph → PersonalInformation → MultiChoice → TextInput → Consents + SubmitAndGoNext → Confirm',
  },
  {
    icon: '☀️',
    title: 'PV Solar Planner',
    gradient: 'from-yellow-500 to-amber-500',
    steps: 'Address → PVRoofPlanner → NumberInput → ProductSelection → PersonalInfo → Consents → Confirm',
  },
];

export function OverviewSection({ onNavigate }: OverviewSectionProps) {
  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-5">
          <div className="agent-dot w-1.5 h-1.5"></div>
          Epilot Journey SDK · Agentic Ready · Alpha
        </div>

        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
          Build Journeys.
          <br />
          <span className="gradient-text">Programmatically.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
          A type-safe SDK for AI agents and developers to create, inspect, and modify epilot journeys. Every block
          type documented. Every wire format quirk handled.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {STATS.map((stat) => (
          <div key={stat.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${stat.color}`}>
            <span className="font-extrabold">{stat.value}</span>
            <span className="opacity-70">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* What this SDK gives agents */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">What agents get</h2>
      <p className="text-sm text-gray-400 mb-6">Everything an AI agent needs to generate valid epilot journeys</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {AGENT_CAPABILITIES.map((cap) => (
          <button
            key={cap.title}
            onClick={() => onNavigate(cap.nav)}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left group overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-primary-500 to-blue-400" />
            <div className="p-5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xl mb-3">
                {cap.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">{cap.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{cap.desc}</p>
              <p className="text-xs text-primary-600 font-semibold mt-3 group-hover:text-primary-700">
                Explore →
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Block categories */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Block Categories</h2>
      <p className="text-sm text-gray-400 mb-6">Browse by category in the block catalog</p>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-14">
        {CATEGORIES.map((cat) => {
          const count = BLOCK_CATALOG.filter((b) => b.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => onNavigate('catalog')}
              className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="text-2xl mb-2">{CATEGORY_ICONS[cat]}</div>
              <p className="text-sm font-bold text-gray-900 leading-tight">{CATEGORY_LABELS[cat]}</p>
              <p className="text-xs text-gray-400 mt-0.5">{count} block{count !== 1 ? 's' : ''}</p>
            </button>
          );
        })}
      </div>

      {/* Common journey patterns */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Common patterns</h2>
      <p className="text-sm text-gray-400 mb-6">Typical block sequences for different journey types</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
        {JOURNEY_PATTERNS.map((p) => (
          <div key={p.title} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className={`bg-gradient-to-br ${p.gradient} px-5 py-4 text-white`}>
              <span className="text-2xl">{p.icon}</span>
              <h3 className="font-bold text-base mt-1">{p.title}</h3>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 leading-relaxed font-mono">{p.steps}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick start */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Quick Start</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodeBlock title="Install" language="bash" code={INSTALL_CODE} />
        <CodeBlock title="Create a journey in < 30 lines" language="typescript" code={QUICKSTART_CODE} />
      </div>
    </div>
  );
}
