import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type AuthState = {
  token: string;
  myID: string;
};

const initialState: AuthState = {
  token: '',
  myID: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    setUserID: (state, action: PayloadAction<string>) => {
      state.myID = action.payload;
    },

    clearAuth: (state) => {
      state.token = '';
      state.myID = '';
    },
  },
});

export type { AuthState };
export const actions = authSlice.actions;
export default authSlice;
