import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS, type BlockCategory } from '../data/blocks';

interface CategoryBadgeProps {
  category: BlockCategory;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[category];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${padding} ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      <span className="text-[10px]">{CATEGORY_ICONS[category]}</span>
      {CATEGORY_LABELS[category]}
    </span>
  );
}
