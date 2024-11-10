import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const courseFlowSlice = createSlice({
  name: 'Course',
  initialState,
  reducers: {
    setCourse: (state, action) => {
      state.data = action.payload;
    },

    clearCourse: state => {
      state.data = null;
    },
  },
});

export const {setCourse, clearCourse} = courseFlowSlice.actions;

export default courseFlowSlice.reducer;
