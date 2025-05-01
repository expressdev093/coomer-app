import {configureStore, combineReducers} from '@reduxjs/toolkit';

import {useDispatch, useSelector} from 'react-redux';
import {
  CreatorsReducer,
  ExporedModelReducer,
  SettingReducer,
  CreatorsV2Reducer,
} from './slices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
const persistConfig = {
  key: 'coomer-su-redux',
  storage: AsyncStorage,
  whitelist: ['exporteddModelsNames', 'settings'],
};

const reducers = combineReducers({
  exporteddModelsNames: ExporedModelReducer,
  creators: CreatorsReducer,
  creatorsV2: CreatorsV2Reducer,
  settings: SettingReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);
// ...

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
