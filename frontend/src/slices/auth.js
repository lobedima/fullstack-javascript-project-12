import { createSlice } from '@reduxjs/toolkit';
import { fetchChannels } from './channels.js';

const getStoredUser = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

const storeUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const clearStoredUser = () => {
  localStorage.removeItem('user');
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: null,
    token: null,
  },
  reducers: {
    setAuth: (state, { payload }) => {
      storeUser(payload);
      return Object.assign(state, payload);
    },
    removeAuth: () => {
      clearStoredUser();
      return { username: null, token: null };
    },
    restoreAuth: (state) => {
      const user = getStoredUser();
      return user ? { ...state, ...user } : state;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(fetchChannels.rejected, (state, { error }) => {
      if (error.code === 'ERR_BAD_REQUEST') {
        clearStoredUser();
        return { username: null, token: null };
      }
      return state;
    }),
});

export const selectAuth = (state) => state.auth;
export const authActions = authSlice.actions;
export default authSlice.reducer;
