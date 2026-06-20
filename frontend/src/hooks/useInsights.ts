/**
 * useInsights — hook for fetching AI-generated reduction insights.
 */

import { useStoreSlice } from './useStoreSlice';

export const useInsights = useStoreSlice(s => ({
  fetchInsights: s.fetchInsights,
  insights: s.insights,
  isLoadingInsights: s.isLoadingInsights,
}));
