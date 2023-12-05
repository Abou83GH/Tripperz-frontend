import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: { email: null },
};

export const userSlice = createSlice({
 name: 'user',
 initialState,
 reducers: {
   updateEmail: (state, action) => {
     state.value.email = action.payload;
   },
 },
});

export const { updateEmail } = userSlice.actions;
export default userSlice.reducer;