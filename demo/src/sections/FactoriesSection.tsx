import { useState } from 'react';
import { FACTORY_FUNCTIONS, type FactoryEntry } from '../data/client-api';
import { CodeBlock } from '../components/CodeBlock';

export function FactoriesSection() {
  const [selected, setSelected] = useState<FactoryEntry>(FACTORY_FUNCTIONS[0]);

  const groups: Record<string, FactoryEntry[]> = {
    'Block Factories': FACTORY_FUNCTIONS.filter((f) =>
      !['createStep', 'createJourney', 'createBlock'].includes(f.name),
    ),
    'Step & Journey': FACTORY_FUNCTIONS.filter((f) =>
      ['createBlock', 'createStep', 'createJourney'].includes(f.name),
    ),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">Factory Functions</h1>
        <p className="section-desc">
          Typed factory functions that produce valid v3 API wire format payloads. Always prefer these over raw object
          construction — they handle format quirks like base64 encoding, parallel arrays, and nested option paths.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left: function list */}
        <div className="w-56 flex-shrink-0">
          {Object.entries(groups).map(([groupName, fns]) => (
            <div key={groupName} className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">{groupName}</p>
              <div className="space-y-0.5">
                {fns.map((fn) => (
                  <button
                    key={fn.name}
                    onClick={() => setSelected(fn)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-2 ${
                      selected.name === fn.name
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    <span className="font-mono truncate">{fn.name}</span>
                    {fn.alpha && (
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
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="font-mono text-sm text-primary-700 font-bold">{selected.name}</span>
              <span className="text-gray-300">→</span>
              <span className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5">{selected.producesType}</span>
              {selected.alpha && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-1.5 py-0.5">
                  alpha
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selected.description}</p>
            {selected.note && (
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-xs text-blue-700 mb-4">
                <span>ℹ️</span>
                <span>{selected.note}</span>
              </div>
            )}
            <CodeBlock code={selected.signature} title="Signature" language="typescript" />
          </div>

          <CodeBlock code={selected.example} title="Example" language="typescript" />
        </div>
      </div>
    </div>
  );
}
