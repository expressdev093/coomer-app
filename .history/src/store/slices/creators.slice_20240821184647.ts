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
  filter?: ICreatorFilter;
}

export interface ICreatorFilter {
  provider: string;
  search: string | undefined;
  sortedBy: string | undefined;
  sortByDirection: 'asc' | 'desc' | undefined;
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
      state.isLoaded = true;
      state.isLoading = false;
      state.mainDataSource = action.payload;
      state.dataSource = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    filterDataSource: (state, action: PayloadAction<ICreatorFilter>) => {
      let filteredData = state.mainDataSource;

      // Filter by provider
      if (
        action.payload.provider !== 'All' &&
        state.filter?.provider !== action.payload.provider
      ) {
        filteredData = filteredData.filter(
          item => item.provider === action.payload.provider,
        );
      }

      // Filter by search term
      if (
        action.payload.search &&
        state.filter?.search !== action.payload.search
      ) {
        const searchLower = action.payload.search.toLowerCase();
        filteredData = filteredData.filter(
          item => item.name.toLowerCase().includes(searchLower), // Adjust the field being searched
        );
      }

      // Sort by specified field and direction
      if (
        action.payload.sortedBy &&
        state.filter?.sortByDirection !== action.payload.sortByDirection &&
        state.filter?.sortedBy !== action.payload.sortedBy
      ) {
        filteredData.sort((a: any, b: any) => {
          const aValue = a.creator[action.payload.sortedBy!];
          const bValue = b.creator[action.payload.sortedBy!];
          return action.payload.sortByDirection === 'desc'
            ? bValue - aValue
            : aValue - bValue;
          //   if (action.payload.sortByDirection === 'asc') {
          //     return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          //   } else if (action.payload.sortByDirection === 'desc') {
          //     return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          //   }

          //   return 0;
        });
      }

      state.dataSource = filteredData;
      state.filter = action.payload;
    },
  },
});

export const CreatorsActions = creatorSlice.actions;

export const CreatorsReducer = creatorSlice.reducer;
