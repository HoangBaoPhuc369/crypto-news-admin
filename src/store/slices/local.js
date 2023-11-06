// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  local: null,
};

// ==============================|| SLICE - MENU ||============================== //

const local = createSlice({
  name: 'local',
  initialState,
  reducers: {
    getLocal(state, action) {
      state.local = action.payload;
    },
    clearLocal(state) {
      state.local = null;
    },
  },
});

export default local.reducer;

export const { getLocal, clearLocal } = local.actions;
