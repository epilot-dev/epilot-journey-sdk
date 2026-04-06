// ─── Navigation Configuration ─────────────────────────────────────
// All sidebar sections and groups are defined here.
// Add, reorder, or remove entries to update the navigation.

export type SectionId =
  | 'overview'
  | 'catalog'
  | 'embed-sdk'
  | 'client-api'
  | 'factories'
  | 'agent-guide'
  | 'mcp-server'
  | 'example-journey';

export interface SectionItem {
  id: SectionId;
  label: string;
  icon: string;
  alpha?: boolean;
}

export interface SectionGroup {
  group: string;
  items: SectionItem[];
}

export type NavEntry = SectionItem | SectionGroup;

export function isGroup(entry: NavEntry): entry is SectionGroup {
  return 'group' in entry;
}

export const NAV: NavEntry[] = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'catalog', label: 'Block Catalog', icon: '🧩' },
  {
    group: 'SDK Reference',
    items: [
      { id: 'embed-sdk', label: 'Embed SDK', icon: '📦' },
      { id: 'factories', label: 'Factory Functions', icon: '🏭', alpha: true },
      { id: 'client-api', label: 'JourneyClient API', icon: '⚡', alpha: true },
    ],
  },
  {
    group: 'For AI Agents',
    items: [
      { id: 'agent-guide', label: 'Agent Guide', icon: '🤖', alpha: true },
      { id: 'mcp-server', label: 'MCP Server', icon: '🔌', alpha: true },
      { id: 'example-journey', label: 'Examples', icon: '📝', alpha: true },
    ],
  },
];

export function flattenNav(nav: NavEntry[]): SectionItem[] {
  const result: SectionItem[] = [];
  for (const entry of nav) {
    if (isGroup(entry)) {
      result.push(...entry.items);
    } else {
      result.push(entry);
    }
  }
  return result;
}
