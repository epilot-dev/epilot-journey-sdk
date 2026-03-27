import { CATEGORY_COLORS, type BlockEntry } from '../data/blocks';
import { CategoryBadge } from './CategoryBadge';

interface BlockCardProps {
  block: BlockEntry;
  onClick: (block: BlockEntry) => void;
}

export function BlockCard({ block, onClick }: BlockCardProps) {
  const colors = CATEGORY_COLORS[block.category];

  return (
    <button
      onClick={() => onClick(block)}
      className="text-left group w-full"
    >
      <div
        className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-4 flex flex-col gap-3 h-full relative ${
          block.commonlyUsed ? 'border-gray-100' : 'border-gray-100'
        }`}
      >
        {block.commonlyUsed && (
          <div className="absolute top-3 right-3 text-amber-400 text-xs" title="Commonly used">★</div>
        )}

        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${colors.bg}`}>
            {block.icon}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-tight">{block.displayName}</p>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">{block.controlName}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{block.description}</p>

        <div className="flex flex-wrap gap-1.5 items-center">
          <CategoryBadge category={block.category} />
          {block.hasValue ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              has value
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-50 text-gray-400 border border-gray-100">
              display only
            </span>
          )}
          {block.factory && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
              factory fn
            </span>
          )}
          {block.deprecated && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100">
              deprecated
            </span>
          )}
        </div>

        <p className={`text-[11px] font-semibold mt-auto ${colors.text} group-hover:underline`}>
          View details →
        </p>
      </div>
    </button>
  );
}
