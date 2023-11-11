import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type AuthState = {
  token: string;
  userID: string;
};

const initialState: AuthState = {
  token: '',
  userID: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    setUserID: (state, action: PayloadAction<string>) => {
      state.userID = action.payload;
    },

    logout: (state) => {
      state = initialState;
    },
  },
});

export type { AuthState };
export const actions = authSlice.actions;
export default authSlice;
