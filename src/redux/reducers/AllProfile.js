import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const allProfileFlowSlice = createSlice({
  name: 'AllProfile',
  initialState,
  reducers: {
    setAllProfile: (state, action) => {
      state.data = action.payload;
    },

    clearAllProfile: state => {
      state.data = null;
    },
  },
});

export const {setAllProfile, clearAllProfile} = allProfileFlowSlice.actions;

export default allProfileFlowSlice.reducer;
