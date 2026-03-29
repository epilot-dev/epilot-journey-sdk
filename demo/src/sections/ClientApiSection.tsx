import { useState } from 'react';
import { CLIENT_API_METHODS, type ApiMethod } from '../data/client-api';
import { CodeBlock } from '../components/CodeBlock';

const GROUP_LABELS: Record<ApiMethod['group'], string> = {
  journey: 'Journey CRUD',
  block: 'Block Operations',
  step: 'Step Operations',
  factory: 'Factory Helpers',
};

const GROUP_ICONS: Record<ApiMethod['group'], string> = {
  journey: '🗺️',
  block: '🧩',
  step: '📄',
  factory: '🏭',
};

export function ClientApiSection() {
  const [selected, setSelected] = useState<ApiMethod>(CLIENT_API_METHODS[0]);

  const groups = (['journey', 'block', 'step'] as ApiMethod['group'][]).map((g) => ({
    group: g,
    methods: CLIENT_API_METHODS.filter((m) => m.group === g),
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">JourneyClient API</h1>
        <p className="section-desc">
          The headless client wraps the epilot Journey API with block-level operations. Designed for AI assistants and
          scripts to configure journeys without a UI.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left: method list */}
        <div className="w-60 flex-shrink-0">
          {groups.map(({ group, methods }) => (
            <div key={group} className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">
                {GROUP_ICONS[group]} {GROUP_LABELS[group]}
              </p>
              <div className="space-y-0.5">
                {methods.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setSelected(m)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-2 ${
                      selected.name === m.name
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    <span className="font-mono truncate">{m.name}</span>
                    {m.alpha && (
                      <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 rounded px-1 py-px">
                        alpha
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: detail */}
        <div className="flex-1 min-w-0 space-y-5">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{GROUP_ICONS[selected.group]}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{GROUP_LABELS[selected.group]}</span>
              {selected.alpha && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-1.5 py-0.5">
                  alpha
                </span>
              )}
            </div>
            <h2 className="font-bold text-gray-900 text-lg mb-2 font-mono">{selected.name}</h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selected.description}</p>
            <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-emerald-700 mb-4">
              <span>↩</span>
              <span><strong>Returns:</strong> {selected.returns}</span>
            </div>
            <CodeBlock code={selected.signature} title="Signature" language="typescript" />
          </div>

          <CodeBlock code={selected.example} title="Example" language="typescript" />
        </div>
      </div>
    </div>
  );
}
