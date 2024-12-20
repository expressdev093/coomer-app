import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {Model} from '../../typings';
import {RootState} from '..';

// Define a type for the slice state
interface CreatorsState {
  models: Model[];
}

// Define the initial state using that type
const initialState: CreatorsState = {
  models: [],
};

export const creatorSlice = createSlice({
  name: 'creators',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Model[]>) => {
      state.models = action.payload;
    },
  },
});

export const CreatorsActions = creatorSlice.actions;

export const CreatorsReducer = creatorSlice.reducer;
