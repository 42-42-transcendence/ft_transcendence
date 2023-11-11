import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ModalState = {
  showGameMatching: boolean;
  showGameInvitation: boolean;
  showCreatingChatRoom: boolean;
  showAchievementDetail: boolean;
  showAddFriend: boolean;
  showFriendDetail: boolean;
  showFriendRequest: boolean;
  showChatRoomConfig: boolean;
  showChatInvitation: boolean;
  showChatExitConfirm: boolean;
  showChatMemberDetail: boolean;
};

const initialState: ModalState = {
  showGameMatching: false,
  showGameInvitation: false,
  showCreatingChatRoom: false,
  showAchievementDetail: false,
  showAddFriend: false,
  showFriendDetail: false,
  showFriendRequest: false,
  showChatRoomConfig: false,
  showChatInvitation: false,
  showChatExitConfirm: false,
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