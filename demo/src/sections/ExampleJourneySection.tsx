import { useState } from 'react';
import { EXAMPLES, type ExampleEntry } from '../data/examples';
import { CodeBlock } from '../components/CodeBlock';

function StepCard({ step }: { step: ExampleEntry['steps'][number]; }) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
      <div className={`px-4 py-3 flex items-center gap-2 border-b ${step.color} border-opacity-50`}>
        <span className="text-lg">{step.icon}</span>
        <p className="font-bold text-sm">{step.name}</p>
      </div>
      <div className="p-3 space-y-2">
        {step.blocks.map((b, i) => (
          <div key={i} className="text-xs">
            <p className="font-mono text-primary-600 font-semibold">{b.fn}</p>
            <p className="text-gray-400 mt-0.5">{b.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExampleDetail({ example }: { example: ExampleEntry }) {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{example.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{example.name}</h2>
            <p className="text-sm text-gray-400">{example.tagline}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{example.description}</p>
      </div>

      {/* Highlights */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Key Patterns</h3>
        <div className="flex flex-wrap gap-2">
          {example.highlights.map((h) => (
            <span key={h} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary-50 border border-primary-100 text-xs text-primary-700 font-medium">
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Step breakdown */}
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Step Breakdown</h3>
      <div className={`grid grid-cols-1 gap-4 mb-10 ${
        example.steps.length <= 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
        example.steps.length <= 6 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {example.steps.map((s) => (
          <StepCard key={s.name} step={s} />
        ))}
      </div>

      {/* Full source */}
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Full Source</h3>
      <CodeBlock code={example.source} title={`${example.id}.ts`} language="typescript" />
    </div>
  );
}

export function ExampleJourneySection() {
  const [activeId, setActiveId] = useState(EXAMPLES[0].id);
  const active = EXAMPLES.find((e) => e.id === activeId) ?? EXAMPLES[0];

  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
          {EXAMPLES.length} End-to-End Examples
        </div>
        <h1 className="section-title">Example Journeys</h1>
        <p className="section-desc">
          Complete journey scripts built with the SDK factory functions. Each example is a runnable script
          that creates a real journey via the API.
        </p>
      </div>

      {/* Example tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => setActiveId(ex.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeId === ex.id
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-200 hover:text-primary-700'
            }`}
          >
            <span>{ex.icon}</span>
            <span>{ex.name}</span>
          </button>
        ))}
      </div>

      <ExampleDetail example={active} />
    </div>
  );
}
