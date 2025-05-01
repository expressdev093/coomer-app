import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {CreatorDto, ICreatorFilter} from '../../typings/typings.v2';

// Define a type for the slice state
interface CreatorsV2State {
  mainDataSource: CreatorDto[];
  dataSource: CreatorDto[];
  creators: CreatorDto[];
  isLoaded: boolean;
  isLoading: boolean;
  filter?: ICreatorFilter;
}

// Define the initial state using that type
const initialState: CreatorsV2State = {
  mainDataSource: [],
  dataSource: [],
  creators: [],
  isLoaded: false,
  isLoading: false,
};

export const creatorV2Slice = createSlice({
  name: 'creators',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCreators: (state, action: PayloadAction<CreatorDto[]>) => {
      state.creators = action.payload;
    },
    setDataSource: (state, action: PayloadAction<CreatorDto[]>) => {
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
      if (action.payload.provider !== 'All') {
        filteredData = filteredData.filter(
          item => item.service === action.payload.provider,
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

export const CreatorsV2Actions = creatorV2Slice.actions;

export const CreatorsV2Reducer = creatorV2Slice.reducer;
