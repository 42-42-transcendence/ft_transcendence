import { createBrowserRouter, redirect } from 'react-router-dom';

import RootLayout from './RootLayout';
import ErrorPage from './Error';

import MainPage from './Main';
import DashboardPage from './Dashboard';
import ProfilePage from './Profile';
import FriendsPage from './Friends';
import ChannelsPage from './Channels';
import LoginPage from './Login';
import SettingProfilePage, {
  action as settingProfileAction,
} from './SettingProfile';
import GamePage from './Game';
import TwoFactorAuthPage from './TwoFactorAuth';
import ChattingPage from './Chatting';

const routerLoader = async ({ request }: { request: Request }) => {
  console.log('루트 loader');
  return 1;
};
const routerAction = async ({ request }: { request: Request }) => {
  console.log('루트 action');
  return 1;
};

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    loader: routerLoader,
    action: routerAction,
    children: [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <MainPage />,
            // 임시 액션 딜레이
            action: async () => {
              await new Promise((res) => setTimeout(res, 1000));

              return redirect('/game/1');
            },
          },
          {
            path: '/dashboard',
            children: [
              { index: true, element: <DashboardPage /> },
              { path: ':userID', element: <DashboardPage /> },
            ],
          },
          {
            path: '/channels',
            element: <ChannelsPage />,
            action: async ({ request }) => {
              const data = await request.formData();
              console.log(data.get('room-type'));
              console.log(data.get('room-name'));
              console.log(data.get('room-password'));
              return null;
            },
          },
          { path: '/chatting/:mode/:chatID', element: <ChattingPage /> },
          { path: '/friends', element: <FriendsPage /> },
          {
            path: '/profile',
            children: [
              { index: true, element: <ProfilePage /> },
              { path: ':userID', element: <ProfilePage /> },
            ],
          },
        ],
      },
      {
        path: '/game/:gameID',
        element: <GamePage />,
        action: async ({ request }) => {
          const data = await request.formData();
          console.log(data.get('mode'));
          return null;
        },
      },
      {
        path: '/two-factor-auth',
        element: <TwoFactorAuthPage />,
      },
      {
        path: '/setting-profile',
        element: <SettingProfilePage />,
        action: settingProfileAction,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/logout',
    action: () => {
      console.log('logout!');
      return redirect('/login');
    },
  },
]);

export default router;
