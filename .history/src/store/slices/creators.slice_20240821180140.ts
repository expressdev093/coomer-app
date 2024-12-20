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
      state.mainDataSource = action.payload;
      state.dataSource = action.payload;
      state.isLoaded = true;
      state.isLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    filterDataSource: (state, action: PayloadAction<ICreatorFilter>) => {
      let filteredData = state.mainDataSource;

      // Filter by provider
      if (action.payload.provider !== 'All') {
        filteredData = filteredData.filter(
          item => item.provider === action.payload.provider,
        );
      }

      // Filter by search term
      if (action.payload.search) {
        const searchLower = action.payload.search.toLowerCase();
        filteredData = filteredData.filter(
          item => item.name.toLowerCase().includes(searchLower), // Adjust the field being searched
        );
      }

      // Sort by specified field and direction
      if (action.payload.sortedBy) {
        console.log(
          'sorting',
          action.payload.sortedBy,
          action.payload.sortByDirection,
        );
        filteredData.sort((a, b) => {
          const fieldA = parseInt((a.creator as any)[action.payload.sortedBy!]);
          const fieldB = parseInt(
            (b.category as any)[action.payload.sortedBy!],
          );

          if (fieldA < fieldB) {
            return action.payload.sortByDirection === 'asc' ? -1 : 1;
          }
          if (fieldA > fieldB) {
            return action.payload.sortByDirection === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      state.dataSource = filteredData;
    },
  },
});

export const CreatorsActions = creatorSlice.actions;

export const CreatorsReducer = creatorSlice.reducer;
