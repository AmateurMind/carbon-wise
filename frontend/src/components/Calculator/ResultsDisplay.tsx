/**
 * ResultsDisplay - Carbon calculation results with comparisons and action prompts.
 */

import { useCarbonStore } from '../../store/carbonStore';
import type { CarbonResult } from '../../types';
import {
  formatCategory,
  formatKg,
  getCategoryIcon,
  getFootprintLabel,
  toMonthlyKg,
} from '../../utils/formatters';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { CategoryChart } from './CategoryChart';

interface ResultsDisplayProps {
  result: CarbonResult;
}

const GLOBAL_AVERAGE_KG = 4000;
const PARIS_TARGET_KG = 2000;

const ComparisonBar = ({
  id,
  label,
  pct,
  benchmark,
  benchmarkKg,
}: {
  id: string;
  label: string;
  pct: number;
  benchmark: string;
  benchmarkKg: number;
}) => {
  const clampedPct = Math.min(pct, 200);
  const barWidth = Math.min(clampedPct / 2, 100);
  const color = pct <= 100 ? 'bg-primary-500' : pct <= 150 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm gap-4">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-bold text-gray-900">
          {pct.toFixed(0)}% <span className="font-normal text-gray-500">of {formatKg(benchmarkKg)}</span>
        </span>
      </div>
      <div
        className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={200}
        aria-label={`${label}: your footprint is ${pct.toFixed(0)}% of the ${benchmark} (${formatKg(benchmarkKg)}/year)`}
        id={id}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${barWidth}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-gray-400 opacity-60"
          style={{ left: '50%' }}
          aria-hidden="true"
        />
      </div>
      <p className="text-xs text-gray-400">
        {pct <= 100
          ? `You are below the ${benchmark}`
          : `You are ${(pct - 100).toFixed(0)}% above the ${benchmark}`}
      </p>
    </div>
  );
};

const SnapshotCard = ({
  title,
  value,
  description,
  tone = 'neutral',
}: {
  title: string;
  value: string;
  description: string;
  tone?: 'neutral' | 'success' | 'warning';
}) => {
  const toneClasses =
    tone === 'success'
      ? 'border-green-100 bg-green-50'
      : tone === 'warning'
        ? 'border-amber-100 bg-amber-50'
        : 'border-gray-100 bg-white';

  return (
    <div className={`rounded-2xl border p-5 ${toneClasses}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-black text-gray-900">{value}</p>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
};

export const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  const fetchInsights = useCarbonStore(s => s.fetchInsights);
  const isLoadingInsights = useCarbonStore(s => s.isLoadingInsights);
  const insights = useCarbonStore(s => s.insights);

  const { label, colorClass, bgClass } = getFootprintLabel(result.vs_global_average_pct);
  const topCategory = result.ranked_categories[0];
  const reductionToGlobal = Math.max(result.total_kg - GLOBAL_AVERAGE_KG, 0);
  const reductionToParis = Math.max(result.total_kg - PARIS_TARGET_KG, 0);
  const monthlyParisGap = toMonthlyKg(reductionToParis);

  return (
    <section
      aria-labelledby="results-heading"
      aria-live="polite"
      aria-atomic="true"
      className="space-y-6 animate-slide-up"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <h2 id="results-heading" className="text-xl font-semibold text-gray-600 mb-2">
          Your Annual Carbon Footprint
        </h2>
        <div className="flex items-end justify-center gap-2 mb-3">
          <span className="text-6xl font-black text-gray-900 tabular-nums">
            {formatKg(result.total_kg)}
          </span>
          <span className="text-2xl text-gray-400 mb-2">CO2e</span>
        </div>
        <span
          className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${colorClass} ${bgClass}`}
        >
          {label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SnapshotCard
          title="Biggest Source"
          value={
            topCategory
              ? `${getCategoryIcon(topCategory.category)} ${formatCategory(topCategory.category)}`
              : 'Balanced profile'
          }
          description={
            topCategory
              ? `${topCategory.percentage.toFixed(0)}% of your footprint comes from this category.`
              : 'No single category dominates your impact.'
          }
          tone="warning"
        />
        <SnapshotCard
          title="Cut To Global Average"
          value={reductionToGlobal > 0 ? formatKg(reductionToGlobal) : 'Already below'}
          description={
            reductionToGlobal > 0
              ? 'This is the annual reduction needed to reach the average global footprint.'
              : 'You are already under the average global footprint benchmark.'
          }
          tone={reductionToGlobal > 0 ? 'neutral' : 'success'}
        />
        <SnapshotCard
          title="Paris-Aligned Pace"
          value={reductionToParis > 0 ? `${formatKg(monthlyParisGap)}/month` : 'On track'}
          description={
            reductionToParis > 0
              ? 'A monthly reduction target to move toward the 1.5C lifestyle threshold.'
              : 'Your current footprint is already within the Paris-aligned annual range.'
          }
          tone={reductionToParis > 0 ? 'warning' : 'success'}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <span aria-hidden="true">Stats</span> How You Compare
        </h3>
        <ComparisonBar
          id="global-average-bar"
          label="vs Global Average"
          pct={result.vs_global_average_pct}
          benchmark="global average"
          benchmarkKg={GLOBAL_AVERAGE_KG}
        />
        <ComparisonBar
          id="paris-target-bar"
          label="vs Paris 1.5C Target"
          pct={result.vs_paris_target_pct}
          benchmark="Paris climate target"
          benchmarkKg={PARIS_TARGET_KG}
        />
        <p className="text-xs text-gray-400 pt-2 border-t border-gray-50">
          Sources: Our World in Data 2023 and IPCC SR1.5 benchmark framing.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span aria-hidden="true">Focus</span> Breakdown by Category
        </h3>
        <CategoryChart breakdown={result.breakdown} ranked_categories={result.ranked_categories} />
      </div>

      {!insights && (
        <div className="flex justify-center">
          <button
            onClick={fetchInsights}
            disabled={isLoadingInsights}
            aria-busy={isLoadingInsights}
            aria-label={
              isLoadingInsights
                ? 'Loading your personalised reduction plan...'
                : 'Get personalised carbon reduction insights powered by Google Gemini AI'
            }
            className="
              flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-500
              text-white px-8 py-4 rounded-2xl text-base font-semibold
              hover:from-primary-700 hover:to-primary-600 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
              transition-all duration-200 shadow-lg shadow-primary-600/25 min-w-[260px] justify-center
            "
          >
            {isLoadingInsights ? (
              <LoadingSpinner label="Generating insights..." size="sm" />
            ) : (
              <>
                <span aria-hidden="true">Plan</span>
                Get Personalised Insights
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Gemini AI</span>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
