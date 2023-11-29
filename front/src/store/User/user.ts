import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type UserState = {
  id: string;
};

const initialState: UserState = {
  id: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserID: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },

    clearUser: (state) => {
      state = initialState;
    },
  },
});

export type { UserState };
export const actions = userSlice.actions;
export default userSlice;
