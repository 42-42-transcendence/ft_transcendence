import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type NotificationType = 'friend' | 'invite' | 'dm' | 'ban';

type Notification = {
  notiID: string;
  notiType: NotificationType;
  message: string;
  channelID?: string;
};

type NotificationState = {
  notifications: Notification[];
};

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },

    appendNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },

    clearNotification: (state) => {
      state.notifications = [];
    },

    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.notiID !== action.payload
      );
    },
  },
});

export type { NotificationType, Notification, NotificationState };
export const actions = notificationSlice.actions;
export default notificationSlice;
