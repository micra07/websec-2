import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTodayDate } from '../utils/format';
import api from '../api/Api';

export const fetchSchedule = createAsyncThunk(
  'schedule/fetchSchedule',
  async ({ stationCode, date, direction }) => {
    return await api.getSchedule(stationCode, date, direction);
  }
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    data: null,
    segments: [],
    stationTitle: '',
    date: getTodayDate(),
    direction: 'all',
    loading: false,
    error: null,
  },
  reducers: {
    setDate(state, action) {
      state.date = action.payload;
    },
    setDirection(state, action) {
      state.direction = action.payload;
    },
    clearSchedule(state) {
      state.data = null;
      state.segments = [];
      state.stationTitle = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.segments = action.payload.schedule || [];
        state.stationTitle = action.payload.station?.title || '';
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setDate, setDirection, clearSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
