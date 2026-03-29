// ─── Navigation Configuration ─────────────────────────────────────
// All sidebar sections and groups are defined here.
// Add, reorder, or remove entries to update the navigation.

export type SectionId =
  | 'overview'
  | 'catalog'
  | 'client-api'
  | 'factories'
  | 'agent-guide'
  | 'mcp-server'
  | 'example-journey';

export interface SectionItem {
  id: SectionId;
  label: string;
  icon: string;
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
      { id: 'factories', label: 'Factory Functions', icon: '🏭' },
      { id: 'client-api', label: 'JourneyClient API', icon: '⚡' },
    ],
  },
  {
    group: 'For AI Agents',
    items: [
      { id: 'agent-guide', label: 'Agent Guide', icon: '🤖' },
      { id: 'mcp-server', label: 'MCP Server', icon: '🔌' },
      { id: 'example-journey', label: 'Examples', icon: '📝' },
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
