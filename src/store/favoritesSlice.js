import { createSlice } from '@reduxjs/toolkit';

const loadFavoritesFromStorage = () => {
  try {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch {}
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: loadFavoritesFromStorage(),
  },
  reducers: {
    addFavorite(state, action) {
      const station = action.payload;
      if (!state.items.find(f => f.code === station.code)) {
        state.items.push(station);
        saveFavoritesToStorage(state.items);
      }
    },
    removeFavorite(state, action) {
      state.items = state.items.filter(f => f.code !== action.payload);
      saveFavoritesToStorage(state.items);
    },
    loadFavorites(state) {
      state.items = loadFavoritesFromStorage();
    }
  },
});

export const { addFavorite, removeFavorite, loadFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
