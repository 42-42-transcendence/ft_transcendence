import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type AuthState = {
  token: string;
};

const initialState: AuthState = {
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    clearAuth: (state) => {
      state = initialState;
    },
  },
});

export type { AuthState };
export const actions = authSlice.actions;
export default authSlice;
