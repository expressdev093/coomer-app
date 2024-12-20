import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// Define a type for the slice state
export interface SettingsState {
  domains: string[];
  maximumRequest: number;
  waitingTime: number;
  categories: string[];
}

// Define the initial state using that type
const initialState: SettingsState = {
  domains: ['n1', 'n2', 'n3', 'n4', 'n5'],
  maximumRequest: 5000,
  waitingTime: 30,
  categories: [
    'Chubby',
    'BBW',
    'Pegging',
    'Chastity',
    'Hairy',
    'Pissing',
    'Hotwife',
    'Rimming',
    'Foot',
    'Mistress',
    'Curvy',
  ],
};

export const settingSlice = createSlice({
  name: 'settings',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      state.domains = action.payload.domains || state.domains;
      state.maximumRequest =
        action.payload.maximumRequest || state.maximumRequest;
      state.waitingTime = action.payload.waitingTime || state.waitingTime;
      state.categories = action.payload.categories || state.categories;
    },
  },
});

export const SettingActions = settingSlice.actions;

export const SettingReducer = settingSlice.reducer;
