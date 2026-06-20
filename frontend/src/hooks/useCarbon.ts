/**
 * useCarbon — hook for triggering carbon calculation.
 */

import { useStoreSlice } from './useStoreSlice';

export const useCarbon = useStoreSlice(s => ({
  calculate: s.calculate,
  result: s.result,
  isCalculating: s.isCalculating,
  error: s.error,
}));
