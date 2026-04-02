import { configureStore } from '@reduxjs/toolkit';
import stationsReducer from './stationsSlice';
import scheduleReducer from './scheduleSlice';
import searchReducer from './searchSlice';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
  reducer: {
    stations: stationsReducer,
    schedule: scheduleReducer,
    search: searchReducer,
    favorites: favoritesReducer,
  },
});
