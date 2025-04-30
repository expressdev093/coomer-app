import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {Model} from '../../typings';

// Define a type for the slice state
interface ExportedModelState {
  models: string[];
  modelsObj: Model[];
}

// Define the initial state using that type
const initialState: ExportedModelState = {
  models: [],
  modelsObj: [],
};

export const exportedModelSlice = createSlice({
  name: 'exported-models',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addBulk: (state, action: PayloadAction<string[]>) => {
      const importedModels: string[] = [];
      action.payload.forEach(m => {
        const index = state.models.findIndex(name => m === name);
        if (index === -1) {
          importedModels.push(m);
        }
      });

      state.models = [...importedModels, ...state.models];
    },
    add: (state, action: PayloadAction<string>) => {
      const index = state.models.findIndex(m => m === action.payload);
      if (index === -1) {
        state.models = [action.payload, ...state.models];
      }
    },
    remove: (state, action: PayloadAction<string>) => {
      state.models = state.models.filter(m => m !== action.payload);
    },
    addBulkModels(state, action: PayloadAction<Model[]>) {
      state.modelsObj = action.payload || [];
    },

    addModels(state, action: PayloadAction<Model>) {
      state.modelsObj = state.modelsObj.map(model =>
        model.id === action.payload.id ? action.payload : model,
      );
    },
  },
});

export const ExportedModelActions = exportedModelSlice.actions;

export const ExporedModelReducer = exportedModelSlice.reducer;
