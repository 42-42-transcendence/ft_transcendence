import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ModalState = {
  showGameMatching: boolean;
  showGameInvitation: boolean;
  showCreatingChatRoom: boolean;
  showAchievementDetail: boolean;
  showFriendsDetail: boolean;
  showChatRoomConfig: boolean;
  showChatInvite: boolean;
  showChatExitMessage: boolean;
  showChatMemberDetail: boolean;
};

const initialState: ModalState = {
  showGameMatching: false,
  showGameInvitation: false,
  showCreatingChatRoom: false,
  showAchievementDetail: false,
  showFriendsDetail: false,
  showChatRoomConfig: false,
  showChatInvite: false,
  showChatExitMessage: false,
  showChatMemberDetail: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state[action.payload as keyof ModalState] = true;
    },
    closeModal: (state) => {
      Object.keys(state).forEach((key) => {
        state[key as keyof ModalState] = false;
      });
    },
  },
});

export type { ModalState };
export const actions = modalSlice.actions;
export default modalSlice;
