import { createSlice } from '@reduxjs/toolkit';
import { fetchChannels } from './channels.js';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: null,
    token: null,
  },
  reducers: {
    setAuth: (state, { payload }) => Object.assign(state, payload),
    removeAuth: () => ({
      username: null,
      token: null,
    }),
  },
  extraReducers: (builder) => builder
    .addCase(fetchChannels.rejected, (state, payload) => {
      if (payload.error.code === 'ERR_BAD_REQUEST') {
        authSlice.actions.removeAuth();
        localStorage.removeItem('user');
      }
    }),
});

export const selectAuth = (state) => state.auth;
export const authActions = authSlice.actions;
export default authSlice.reducer;
