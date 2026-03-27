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
    <div className="flex h-screen overflow-hidden bg-surface-50">
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
              <div className="sb-title">Journey SDK</div>
              <div className="sb-subtitle">
                Agentic Ready
                <span className="sb-cursor" />
              </div>
            </div>
          </div>

          <a
            href="https://docs.epilot.io/docs/journeys/journey-builder"
            className="flex items-center gap-1.5 text-[11px] hover:text-primary-400 transition-colors mt-3 group"
            style={{ color: 'rgba(255,255,255,0.35)' }}
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
      <main className="flex-1 overflow-y-auto bg-grid-pattern bg-grid">
        <div className="topbar">
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
          <div className="ml-auto hidden md:flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span className="agent-dot" />
              <span>AI-ready SDK</span>
            </div>
            <a
              href="https://github.com/epilot-dev/epilot-journey-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="p-8 max-w-7xl mx-auto">
          <ActiveComponent onNavigate={navigate} />
        </div>
      </main>
    </div>
  );
}
