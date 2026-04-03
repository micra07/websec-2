import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTodayDate } from '../utils/format';
import api from '../api/Api';

export const searchRoute = createAsyncThunk(
  'search/searchRoute',
  async ({ from, to, date }) => {
    return await api.searchRoute(from, to, date);
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    data: null,
    from: null,
    to: null,
    date: getTodayDate(),
    loading: false,
    error: null,
  },
  reducers: {
    setFrom(state, action) {
      state.from = action.payload;
    },
    setTo(state, action) {
      state.to = action.payload;
    },
    setSearchDate(state, action) {
      state.date = action.payload;
    },
    swapStations(state) {
      const temp = state.from;
      state.from = state.to;
      state.to = temp;
    },
    clearSearch(state) {
      state.results = [];
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.results = action.payload.segments || [];
      })
      .addCase(searchRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFrom, setTo, setSearchDate, swapStations, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
