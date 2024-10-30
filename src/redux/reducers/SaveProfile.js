import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const saveProfileSlice = createSlice({
  name: 'SaveProfile',
  initialState,
  reducers: {
    SaveProfile: (state, action) => {
      state.data = action.payload;
    },

    clearProfile: state => {
      state.data = null;
    },
  },
});

export const {SaveProfile,clearProfile
} = saveProfileSlice.actions;

export default saveProfileSlice.reducer;
