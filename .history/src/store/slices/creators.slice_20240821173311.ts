import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {Creator, Model} from '../../typings';
import {RootState} from '..';

// Define a type for the slice state
interface CreatorsState {
  mainDataSource: Model[];
  dataSource: Model[];
  creators: Creator[];
  isLoaded: boolean;
  isLoading: boolean;
}

export interface ICreatorFilter {
  provider: string;
}

// Define the initial state using that type
const initialState: CreatorsState = {
  mainDataSource: [],
  dataSource: [],
  creators: [],
  isLoaded: false,
  isLoading: false,
};

export const creatorSlice = createSlice({
  name: 'creators',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCreators: (state, action: PayloadAction<Creator[]>) => {
      state.creators = action.payload;
    },
    setDataSource: (state, action: PayloadAction<Model[]>) => {
      state.mainDataSource = action.payload;
      state.dataSource = action.payload;
      state.isLoaded = true;
      state.isLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    filterDataSourceByProvider: (state, action: PayloadAction<string>) => {
      if (action.payload === 'All') {
        // If the text is 'All', reset the dataSource to the entire list of creators
        state.dataSource = state.mainDataSource;
      } else {
        // Otherwise, filter by the specified provider
        state.dataSource = state.mainDataSource.filter(
          item => item.provider === action.payload,
        );
      }
    },
  },
});

export const CreatorsActions = creatorSlice.actions;

export const CreatorsReducer = creatorSlice.reducer;
