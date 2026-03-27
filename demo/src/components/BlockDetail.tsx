import { useState } from 'react';
import { CATEGORY_COLORS, type BlockEntry } from '../data/blocks';
import { CategoryBadge } from './CategoryBadge';
import { CodeBlock } from './CodeBlock';

interface BlockDetailProps {
  block: BlockEntry;
  onClose: () => void;
}

type Tab = 'overview' | 'value' | 'options' | 'code' | 'wire';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'value', label: 'Value Type' },
  { id: 'options', label: 'Options' },
  { id: 'code', label: 'Code' },
  { id: 'wire', label: 'Wire Format' },
];

export function BlockDetail({ block, onClose }: BlockDetailProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const colors = CATEGORY_COLORS[block.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" style={{
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }}>

        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-gray-100">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${colors.bg}`}>
            {block.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-lg leading-tight">{block.displayName}</h2>
            <p className="text-primary-600 font-mono text-xs mt-0.5">{block.controlName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-surface-50 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-primary-600 text-primary-700 bg-white font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Control Name" value={block.controlName} mono />
                <InfoRow label="Category" value={<CategoryBadge category={block.category} size="md" />} />
                <InfoRow
                  label="Has Value"
                  value={block.hasValue ? 'Yes – submits data' : 'Display / navigation only'}
                />
                <InfoRow
                  label="Commonly Used"
                  value={block.commonlyUsed ? 'Yes' : 'No'}
                />
                {block.deprecated && (
                  <InfoRow label="Status" value={<span className="text-red-600 font-semibold">Deprecated</span>} />
                )}
              </div>

              {block.factory && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Factory Function(s)</p>
                  <div className="space-y-2">
                    {block.factory.split(' / ').map((fn) => (
                      <div key={fn} className="rounded-xl px-4 py-3" style={{
                        background: 'rgba(99, 102, 241, 0.04)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                      }}>
                        <p className="font-mono text-sm text-primary-700 font-semibold">{fn}(opts)</p>
                        <p className="text-xs text-gray-500 mt-1">
                          import {'{ '}{fn}{' }'} from &apos;@epilot/epilot-journey-sdk&apos;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</p>
                <p className="text-sm text-gray-600 leading-relaxed bg-surface-50 rounded-xl px-4 py-3">{block.description}</p>
              </div>
            </div>
          )}

          {tab === 'value' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                Shape of the value submitted when the user fills this block. Accessible via{' '}
                <code className="bg-gray-100 px-1 rounded text-primary-700 text-[11px]">BlockValueMap[controlName]</code>.
              </p>
              <CodeBlock code={block.valueType} title="TypeScript" language="typescript" />
            </div>
          )}

          {tab === 'options' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                Configuration options passed to <code className="bg-gray-100 px-1 rounded text-primary-700 text-[11px]">opts.options</code> in the factory function, or in the <code className="bg-gray-100 px-1 rounded text-primary-700 text-[11px]">uischema.options</code> wire field.
              </p>
              <CodeBlock code={block.optionsType} title="TypeScript" language="typescript" />
            </div>
          )}

          {tab === 'code' && (
            <div className="space-y-3">
              {block.factory ? (
                <div className="flex items-start gap-2 rounded-xl px-4 py-2.5 text-xs" style={{
                  background: 'rgba(99, 102, 241, 0.05)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                  color: '#4f46e5',
                }}>
                  <span>→</span>
                  <span>Use the factory function – it produces valid v3 wire format automatically.</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-xs text-amber-700">
                  <span>→</span>
                  <span>No dedicated factory. Use <code className="font-mono">createBlock('{block.controlName}', opts)</code> directly.</span>
                </div>
              )}
              <CodeBlock code={block.codeExample} title="Usage Example" language="typescript" />
            </div>
          )}

          {tab === 'wire' && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-xs text-amber-700">
                <span>→</span>
                <span>
                  This is the v3 JSON stored in the Journey API&apos;s{' '}
                  <code className="font-mono">uischema.elements[]</code>.
                  {block.controlName === 'Label' && ' Note: text is at top level, not inside options.'}
                  {(block.controlName === 'Control' || block.controlName === 'MultichoiceControl') &&
                    ' Note: choices use parallel arrays, not a choices[] object.'}
                </span>
              </div>
              <CodeBlock code={block.wireExample} title="Wire Format (v3 API)" language="json" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      {typeof value === 'string' ? (
        <p className={`text-sm font-medium text-gray-700 ${mono ? 'font-mono text-primary-700' : ''}`}>{value}</p>
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
}
