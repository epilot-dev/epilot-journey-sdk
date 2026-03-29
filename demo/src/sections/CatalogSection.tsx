import { useState } from 'react';
import {
  BLOCK_CATALOG,
  CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  type BlockCategory,
  type BlockEntry,
} from '../data/blocks';
import { BlockCard } from '../components/BlockCard';
import { BlockDetail } from '../components/BlockDetail';

export function CatalogSection() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<BlockCategory | 'all'>('all');
  const [selectedBlock, setSelectedBlock] = useState<BlockEntry | null>(null);

  const filtered = BLOCK_CATALOG.filter((b) => {
    const matchCat = activeCategory === 'all' || b.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.displayName.toLowerCase().includes(q) ||
      b.controlName.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      (b.factory !== null && b.factory.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Title */}
      <div className="mb-6">
        <h1 className="section-title">Block Catalog</h1>
        <p className="section-desc">
          All {BLOCK_CATALOG.length} block types available in the Journey SDK. Click any block to see its value type,
          options, code example, and v3 wire format.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks…"
            className="input-field pl-8"
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === 'all'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-500 border-gray-200 hover:border-primary-300 hover:text-primary-600'
            }`}
          >
            All ({BLOCK_CATALOG.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = BLOCK_CATALOG.filter((b) => b.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>

        <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
          {filtered.length} of {BLOCK_CATALOG.length} blocks
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-semibold text-gray-500">No blocks found</p>
          <p className="text-sm mt-1">Try a different search term or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((block) => (
            <BlockCard key={block.controlName} block={block} onClick={setSelectedBlock} />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedBlock && (
        <BlockDetail block={selectedBlock} onClose={() => setSelectedBlock(null)} />
      )}
    </div>
  );
}
