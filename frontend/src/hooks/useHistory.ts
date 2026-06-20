/**
 * useHistory — hook for fetching and displaying carbon history.
 */

import { useStoreSlice } from './useStoreSlice';

export const useHistory = useStoreSlice(s => ({
  fetchHistory: s.fetchHistory,
  history: s.history,
  isLoadingHistory: s.isLoadingHistory,
}));
