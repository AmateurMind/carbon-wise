/**
 * Zustand store for Carbon Compass.
 *
 * State shape:
 *   inputs            - Partial CarbonInput being edited in the form
 *   result            - Latest CarbonResult from the API
 *   insights          - Latest InsightsResponse from the API
 *   history           - Array of HistoryEntry objects for the current device
 *   isCalculating     - True while /api/calculate is in-flight
 *   isLoadingInsights - True while /api/insights is in-flight
 *   isLoadingHistory  - True while /api/entries GET is in-flight
 *   error             - User-facing error message or null
 *   step              - Current view: 'form' | 'results' | 'history'
 */

import { create } from 'zustand';
import { apiClient } from '../api/client';
import type {
  AppStep,
  CarbonInput,
  CarbonResult,
  HistoryEntry,
  InsightsResponse,
  SaveStatus,
} from '../types';
import { getDeviceId } from '../utils/formatters';
import { withLoadingState } from '../utils/storeHelpers';

interface CarbonState {
  inputs: Partial<CarbonInput>;
  result: CarbonResult | null;
  insights: InsightsResponse | null;
  history: HistoryEntry[];
  isCalculating: boolean;
  isLoadingInsights: boolean;
  isLoadingHistory: boolean;
  error: string | null;
  step: AppStep;
  saveStatus: SaveStatus;
  saveMessage: string | null;
  setInputs: (inputs: Partial<CarbonInput>) => void;
  calculate: (inputs: CarbonInput) => Promise<void>;
  fetchInsights: () => Promise<void>;
  saveEntry: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  setStep: (step: AppStep) => void;
  clearError: () => void;
  reset: () => void;
}

export const useCarbonStore = create<CarbonState>((set, get) => ({
  inputs: {},
  result: null,
  insights: null,
  history: [],
  isCalculating: false,
  isLoadingInsights: false,
  isLoadingHistory: false,
  error: null,
  step: 'form',
  saveStatus: 'idle',
  saveMessage: null,

  setInputs: inputs => set(state => ({ inputs: { ...state.inputs, ...inputs } })),

  calculate: async (inputs: CarbonInput) => {
    set({
      isCalculating: true,
      error: null,
      result: null,
      insights: null,
      saveStatus: 'idle',
      saveMessage: null,
    });
    const result = await withLoadingState(
      set,
      () => apiClient.calculateFootprint(inputs),
      'isCalculating',
      'Failed to calculate footprint'
    );
    if (result) set({ result, inputs, step: 'results' });
  },

  fetchInsights: async () => {
    const { result } = get();
    if (!result) return;

    const deviceId = getDeviceId();
    const insights = await withLoadingState(
      set,
      () => apiClient.getInsights(result, deviceId),
      'isLoadingInsights',
      'Failed to fetch insights'
    );
    if (insights) {
      set({ insights });
      await get().saveEntry();
    }
  },

  saveEntry: async () => {
    const { result, insights } = get();
    if (!result || !insights) return;

    set({ saveStatus: 'saving', saveMessage: 'Saving this snapshot to your history...' });
    try {
      await apiClient.saveEntry(result, insights.insights);
      set({
        saveStatus: 'saved',
        saveMessage: 'Saved to your history. You can review progress anytime in History.',
      });
    } catch {
      set({
        saveStatus: 'error',
        saveMessage: 'Could not save this snapshot right now. You can try again.',
      });
    }
  },

  fetchHistory: async () => {
    const deviceId = getDeviceId();
    const history = await withLoadingState(
      set,
      () => apiClient.getHistory(deviceId),
      'isLoadingHistory',
      'Failed to load history'
    );
    if (history) set({ history });
  },

  setStep: step => set({ step }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      inputs: {},
      result: null,
      insights: null,
      error: null,
      step: 'form',
      saveStatus: 'idle',
      saveMessage: null,
    }),
}));
