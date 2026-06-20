import { useEffect } from 'react';
import { CarbonForm } from './components/Calculator/CarbonForm';
import { ResultsDisplay } from './components/Calculator/ResultsDisplay';
import { HistoryChart } from './components/History/HistoryChart';
import { HistoryTable } from './components/History/HistoryTable';
import { InsightsList } from './components/Insights/InsightsList';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { SkipLink } from './components/shared/SkipLink';
import { useCarbonStore } from './store/carbonStore';

const NavLink = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className={`
      px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      ${
        active
          ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
          : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
      }
    `}
  >
    {label}
  </button>
);

function AppContent() {
  const step = useCarbonStore(s => s.step);
  const setStep = useCarbonStore(s => s.setStep);
  const result = useCarbonStore(s => s.result);
  const insights = useCarbonStore(s => s.insights);
  const history = useCarbonStore(s => s.history);
  const isLoadingHistory = useCarbonStore(s => s.isLoadingHistory);
  const fetchHistory = useCarbonStore(s => s.fetchHistory);
  const reset = useCarbonStore(s => s.reset);

  const handleHistoryClick = () => {
    setStep('history');
    fetchHistory();
  };

  useEffect(() => {
    const main = document.getElementById('main-content');
    if (main) main.focus();
  }, [step]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.18),_transparent_34%),linear-gradient(135deg,#f5fffb_0%,#eefbf4_45%,#f8fafc_100%)]">
      <SkipLink />

      <header
        role="banner"
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={reset}
            aria-label="Carbon wise - return to calculator"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-lime-500 text-white text-xs font-black uppercase tracking-[0.2em]"
            >
              CC
            </span>
            <div className="text-left">
              <span className="block text-sm font-bold text-gray-900 leading-tight">
                Carbon wise
              </span>
              <span className="block text-xs text-primary-700 leading-tight">
                Measure. Prioritise. Cut.
              </span>
            </div>
          </button>

          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-2 list-none m-0 p-0">
              <li>
                <NavLink
                  label="Calculate"
                  active={step === 'form' || step === 'results'}
                  onClick={() => setStep(result ? 'results' : 'form')}
                />
              </li>
              <li>
                <NavLink label="History" active={step === 'history'} onClick={handleHistoryClick} />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {step === 'form' && (
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0f766e_0%,#15803d_45%,#65a30d_100%)] text-white py-12 px-4">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,_transparent_22%),radial-gradient(circle_at_80%_10%,white,_transparent_18%)]" />
          <div className="relative max-w-5xl mx-auto text-center">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-50 mb-4">
              Personal Climate Challenge
            </p>
            <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">
              Build a lighter life, one measurable shift at a time.
            </h1>
            <p className="text-emerald-50/90 text-base sm:text-lg max-w-3xl mx-auto">
              Carbon wise turns everyday habits into a clear action roadmap: estimate your annual
              footprint, spot your highest-impact category, and follow a reduction plan that feels
              realistic instead of abstract.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 text-left max-w-3xl mx-auto">
              <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-100">Aware</p>
                <p className="mt-1 text-sm text-white">Translate daily habits into annual CO2e.</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-100">Focused</p>
                <p className="mt-1 text-sm text-white">
                  See the one category worth attacking first.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-100">Actionable</p>
                <p className="mt-1 text-sm text-white">
                  Get a practical plan and save your progress.
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-6 text-sm text-emerald-100 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true">Data</span> Science-backed factors
              </span>
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true">Coach</span> Smart reduction insights
              </span>
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true">Private</span> Anonymous by design
              </span>
            </div>
          </div>
        </div>
      )}

      <main
        id="main-content"
        tabIndex={-1}
        aria-label="Main content"
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8 focus:outline-none"
      >
        {step === 'form' && <CarbonForm />}

        {step === 'results' && result && (
          <div className="space-y-8">
            <button
              onClick={() => setStep('form')}
              aria-label="Back to calculator form"
              className="
                flex items-center gap-2 text-sm text-gray-500 hover:text-primary-700
                focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-2 py-1
                transition-colors duration-150
              "
            >
              <span aria-hidden="true">Back</span> Back to Calculator
            </button>
            <ResultsDisplay result={result} />
            {insights && <InsightsList insightsResponse={insights} />}
          </div>
        )}

        {step === 'history' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Reduction Timeline</h1>
              <p className="text-gray-500 text-sm">
                Review saved snapshots to see whether your latest decisions are moving the curve.
              </p>
            </div>
            {isLoadingHistory ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner label="Loading your history..." size="lg" />
              </div>
            ) : (
              <>
                <HistoryChart history={history} />
                <HistoryTable history={history} />
              </>
            )}
          </div>
        )}
      </main>

      <footer role="contentinfo" className="border-t border-gray-100 bg-white mt-16 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Data Sources</h2>
              <ul className="text-xs text-gray-500 space-y-1 list-none">
                <li>UK DEFRA 2023 - Transport and home energy factors</li>
                <li>US EPA 2023 - Electricity grid emissions</li>
                <li>ICAO Carbon Calculator - Aviation emissions</li>
                <li>Our World in Data 2023 - Diet emissions and global average</li>
                <li>IPCC AR6 / SR1.5 - Consumption and Paris target framing</li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Why Carbon wise</h2>
              <p className="text-xs text-gray-500">
                Carbon wise is designed as a lightweight climate coach for people who want clarity,
                momentum, and realistic next steps without spreadsheet-heavy dashboards.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
            <span>© 2026 Carbon wise</span>
            <span className="flex items-center gap-1">
              Built with{' '}
              <span aria-label="Google Gemini AI" className="font-medium text-gray-500">
                Google Gemini
              </span>{' '}
              ·{' '}
              <span aria-label="Google Cloud" className="font-medium text-gray-500">
                Google Cloud
              </span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
