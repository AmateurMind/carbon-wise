/**
 * useStoreSlice — Generic hook factory for Zustand store slices.
 *
 * Eliminates boilerplate when wrapping multiple store selectors into a single hook.
 * Usage: const useMySlice = useStoreSlice(s => ({ foo: s.foo, bar: s.bar }));
 */

import { useMemo } from 'react';
import { useCarbonStore } from '../store/carbonStore';

type StoreState = ReturnType<typeof useCarbonStore.getState>;

export const useStoreSlice = <T extends Record<string, unknown>>(
  selector: (state: StoreState) => T
): (() => T) => {
  return () => {
    const slice = useCarbonStore(selector);
    return useMemo(() => slice, [slice]);
  };
};
