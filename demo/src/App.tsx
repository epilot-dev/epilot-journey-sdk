import { useState, useCallback, useEffect } from 'react';
import { NAV, flattenNav, isGroup, type SectionId } from './data/navigation';
import { BLOCK_CATALOG } from './data/blocks';
import { OverviewSection } from './sections/OverviewSection';
import { CatalogSection } from './sections/CatalogSection';
import { FactoriesSection } from './sections/FactoriesSection';
import { ClientApiSection } from './sections/ClientApiSection';
import { AgentGuideSection } from './sections/AgentGuideSection';
import { ExampleJourneySection } from './sections/ExampleJourneySection';

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType<any>> = {
  overview: OverviewSection,
  catalog: CatalogSection,
  factories: FactoriesSection,
  'client-api': ClientApiSection,
  'agent-guide': AgentGuideSection,
  'example-journey': ExampleJourneySection,
};

const allSections = flattenNav(NAV);
const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobile());

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const navigate = useCallback((id: SectionId) => {
    setActiveSection(id);
    if (isMobile()) setSidebarOpen(false);
  }, []);

  const activeItem = allSections.find((s) => s.id === activeSection);
  const ActiveComponent = SECTION_COMPONENTS[activeSection] ?? OverviewSection;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ── Sidebar ── */}
      <aside
        className={`ai-sidebar ${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'} flex-shrink-0 flex flex-col transition-all duration-300`}
      >
        {/* Brand */}
        <div className="sb-brand">
          <div className="flex items-center gap-3">
            <div className="sb-logo">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <div className="sb-title">epilot Journey SDK</div>
              <div className="sb-subtitle">
                Agentic Ready
                <span className="sb-cursor" />
              </div>
            </div>
          </div>

          <a
            href="https://docs.epilot.io/docs/journeys/journey-builder"
            className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-primary-600 transition-colors mt-3 group"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="group-hover:underline">Back to Dev Center</span>
          </a>

          <div className="flex items-center gap-2 mt-2">
            <span className="sb-chip"><strong>{BLOCK_CATALOG.length}</strong> Blocks</span>
            <span className="sb-chip"><strong>19</strong> Factories</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {NAV.map((entry) => {
            if (isGroup(entry)) {
              return (
                <div key={entry.group} className="mt-5 first:mt-0">
                  <div className="sb-group">{entry.group}</div>
                  <div className="space-y-0.5">
                    {entry.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.id)}
                        className={`sb-nav-item ${activeSection === item.id ? 'active' : ''}`}
                      >
                        <span className="sb-dot" />
                        <span className="sb-nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={entry.id}
                onClick={() => navigate(entry.id)}
                className={`sb-nav-item ${activeSection === entry.id ? 'active' : ''}`}
              >
                <span className="sb-dot" />
                <span className="sb-nav-icon">{entry.icon}</span>
                <span>{entry.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sb-footer">
          <div className="sb-status-line">
            <span className="agent-dot" />
            <span className="sb-version">v1.0.7</span>
            <span style={{ opacity: 0.5 }}>ready</span>
          </div>
          <div className="sb-credit">
            Built by{' '}
            <a href="https://github.com/jpinho" target="_blank" rel="noopener noreferrer">
              @jpinho
            </a>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">{activeItem?.icon}</span>
            <h2 className="text-sm font-bold text-gray-700">{activeItem?.label}</h2>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className="agent-dot" />
            <span>AI-ready SDK</span>
          </div>
        </div>
        <div className="p-8 max-w-7xl mx-auto">
          <ActiveComponent onNavigate={navigate} />
        </div>
      </main>
    </div>
  );
}
