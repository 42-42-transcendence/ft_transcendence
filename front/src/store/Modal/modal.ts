import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ModalState = {
  showGameMatching: boolean;
  showGameInvitation: boolean;
  showCreatingChatRoom: boolean;
  showAchievementDetail: boolean;
  showAddFriend: boolean;
  showFriendRequest: boolean;
  showChatRoomConfig: boolean;
  showChatInvitation: boolean;
  showChatPassword: boolean;
  showUserDetail: boolean;
  showConfirm: boolean;
  showMessage: boolean;
  showQRCode: boolean;
};

const initialState: ModalState = {
  showGameMatching: false,
  showGameInvitation: false,
  showCreatingChatRoom: false,
  showAchievementDetail: false,
  showAddFriend: false,
  showFriendRequest: false,
  showChatRoomConfig: false,
  showChatInvitation: false,
  showChatPassword: false,
  showUserDetail: false,
  showConfirm: false,
  showMessage: false,
  showQRCode: false,
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
