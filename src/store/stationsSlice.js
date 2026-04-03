import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/Api';

export const fetchStations = createAsyncThunk(
  'stations/fetchStations',
  async (query = '') => {
    const data = await api.getStations(query);
    return data.stations;
  }
);

const stationsSlice = createSlice({
  name: 'stations',
  initialState: {
    items: [],
    filtered: [],
    selectedStation: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedStation(state, action) {
      state.selectedStation = action.payload;
    },
    filterStations(state, action) {
      const query = action.payload.toLowerCase();
      if (!query) {
        state.filtered = state.items;
      } else {
        state.filtered = state.items.filter(s =>
          s.title.toLowerCase().includes(query)
        );
      }
    },
    clearSelection(state) {
      state.selectedStation = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filtered = action.payload;
      })
      .addCase(fetchStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedStation, filterStations, clearSelection } = stationsSlice.actions;
export default stationsSlice.reducer;
