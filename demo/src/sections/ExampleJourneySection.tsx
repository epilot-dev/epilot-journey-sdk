import { SALES_INQUIRY_EXAMPLE } from '../data/agent-guide';
import { CodeBlock } from '../components/CodeBlock';

const STEP_BREAKDOWN = [
  {
    step: 1,
    name: 'Choose Your Plan',
    icon: '📋',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    blocks: [
      { type: 'Label', fn: 'createParagraph()', note: 'Intro text (auto-encoded)' },
      { type: 'Control', fn: 'createSingleChoice()', note: 'Plan selection with icon buttons' },
      { type: 'Control', fn: 'createSingleChoice()', note: 'Team size selection' },
      { type: 'ActionBarControl', fn: 'createActionBar()', note: 'GoNext → step 2' },
    ],
  },
  {
    step: 2,
    name: 'About Your Business',
    icon: '🏢',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
    blocks: [
      { type: 'Label', fn: 'createParagraph()', note: 'Context text' },
      { type: 'Control', fn: 'createTextInput()', note: 'Multiline business description' },
      { type: 'MultichoiceControl', fn: 'createMultipleChoice()', note: 'Module interest (checkbox)' },
      { type: 'ActionBarControl', fn: 'createActionBar()', note: 'GoNext → step 3' },
    ],
  },
  {
    step: 3,
    name: 'Contact Details',
    icon: '👤',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blocks: [
      { type: 'PersonalInformationControl', fn: 'createPersonalInformation()', note: 'Business mode, required fields' },
      { type: 'SummaryControl', fn: 'createSummary()', note: 'Review all collected data' },
      { type: 'ActionBarControl', fn: 'createActionBar()', note: 'SubmitAndGoNext with GDPR consent' },
    ],
  },
  {
    step: 4,
    name: 'Confirmation',
    icon: '🎉',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
    blocks: [
      { type: 'ConfirmationMessageControl', fn: 'createSuccessMessage()', note: 'Thank-you with close button' },
    ],
  },
];

export function ExampleJourneySection() {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
          End-to-End Example
        </div>
        <h1 className="section-title">Sales Inquiry Journey</h1>
        <p className="section-desc">
          A complete 4-step journey: plan selection → business info → contact capture + submit → confirmation.
          This is the source for <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-primary-700">examples/create-sales-inquiry.ts</code>.
        </p>
      </div>

      {/* Step breakdown */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Step Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {STEP_BREAKDOWN.map((s) => (
          <div key={s.step} className={`bg-white border rounded-2xl overflow-hidden shadow-sm`}>
            <div className={`px-4 py-3 flex items-center gap-2 border-b ${s.color} border-opacity-50`}>
              <span className="text-lg">{s.icon}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Step {s.step}</p>
                <p className="font-bold text-sm">{s.name}</p>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {s.blocks.map((b, i) => (
                <div key={i} className="text-xs">
                  <p className="font-mono text-primary-600 font-semibold">{b.fn}</p>
                  <p className="text-gray-400 mt-0.5">{b.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Key decisions */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Key Decisions Explained</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          {
            icon: '⚙️',
            title: 'runtimeEntities: OPPORTUNITY',
            desc: 'Creating an Opportunity entity on submission — maps this lead to a CRM record in epilot for sales follow-up.',
          },
          {
            icon: '✅',
            title: 'GDPR consent in ActionBar',
            desc: 'Inline consent on the action bar is the standard pattern. The first_consent is required, blocking submission until accepted.',
          },
          {
            icon: '🧾',
            title: 'Summary before submit',
            desc: 'A SummaryControl before the final ActionBar lets the user review their input — reduces errors and builds trust.',
          },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="font-bold text-sm text-gray-900 mb-1">{item.title}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Full source */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Full Source</h2>
      <p className="text-sm text-gray-400 mb-4">
        Run with:{' '}
        <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">
          npx tsx examples/create-sales-inquiry.ts &lt;API_TOKEN&gt; &lt;ORG_ID&gt;
        </code>
      </p>
      <CodeBlock code={SALES_INQUIRY_EXAMPLE} title="examples/create-sales-inquiry.ts" language="typescript" />
    </div>
  );
}
