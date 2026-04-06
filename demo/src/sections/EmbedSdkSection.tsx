export function EmbedSdkSection() {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          color: '#6366f1',
        }}>
          v1 – Stable
        </div>
        <h1 className="section-title">Embed SDK</h1>
        <p className="section-desc">
          Embed epilot journeys into any webpage with the embed script. Supports inline and full-screen modes,
          data injection, field disabling, context data, custom blocks, and event listeners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <a
          href="https://docs.epilot.io/docs/journeys/sdk"
          target="_blank"
          rel="noopener noreferrer"
          className="card-interactive p-6 group"
        >
          <div className="text-2xl mb-3">📦</div>
          <h3 className="font-bold text-gray-900 text-base mb-2">Journey Embed SDK</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            Full documentation for embedding journeys, data injection, context data, events, and the <code className="bg-gray-100 px-1 rounded text-xs">__epilot</code> global API.
          </p>
          <p className="text-sm text-primary-600 font-semibold group-hover:text-primary-500 transition-colors">
            docs.epilot.io/docs/journeys/sdk →
          </p>
        </a>

        <a
          href="https://docs.epilot.io/docs/journeys/custom-blocks"
          target="_blank"
          rel="noopener noreferrer"
          className="card-interactive p-6 group"
        >
          <div className="text-2xl mb-3">🧩</div>
          <h3 className="font-bold text-gray-900 text-base mb-2">Custom Blocks</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            Build custom web components that integrate into journeys as blocks with two-way data communication.
          </p>
          <p className="text-sm text-primary-600 font-semibold group-hover:text-primary-500 transition-colors">
            docs.epilot.io/docs/journeys/custom-blocks →
          </p>
        </a>
      </div>

      <div className="card">
        <h3 className="font-bold text-gray-900 text-sm mb-3">Quick Reference</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex gap-3">
            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-primary-700 whitespace-nowrap h-fit">__epilot.init()</code>
            <span>Load and display a journey (inline or full-screen)</span>
          </div>
          <div className="flex gap-3">
            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-primary-700 whitespace-nowrap h-fit">__epilot.on()</code>
            <span>Listen to events: init, formChange, closeJourney, enter/exitFullScreen</span>
          </div>
          <div className="flex gap-3">
            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-primary-700 whitespace-nowrap h-fit">dataInjectionOptions</code>
            <span>Prefill data, start from a specific step, disable fields</span>
          </div>
          <div className="flex gap-3">
            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-primary-700 whitespace-nowrap h-fit">contextData</code>
            <span>Pass UTM params, campaign IDs, or custom data to the submission</span>
          </div>
        </div>
      </div>
    </div>
  );
}
