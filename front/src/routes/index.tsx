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
import OAuth, { loader as oAuthLoader } from './OAuth';
// import ProtectedRouter from './ProtectedRouter';

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    // element: <ProtectedRouter />,
    children: [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            path: '/',
            element: <MainPage />,
            // action: async () => {
            //   await new Promise((res) => setTimeout(res, 1000));
            //   return redirect('/game/1');
            // },
          },
          {
            path: '/dashboard/:userID',
            element: <DashboardPage />,
          },
          {
            path: '/channels',
            element: <ChannelsPage />,
          },
          {
            path: '/chatting/:mode/:chatID',
            element: <ChattingPage />,
          },
          {
            path: '/friends',
            element: <FriendsPage />,
          },
          {
            path: '/profile/:userID',
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: '/game/:gameID',
        element: <GamePage />,
        // action: async ({ request }) => {
        //   const data = await request.formData();
        //   console.log(data.get('mode'));
        //   return null;
        // },
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
    path: '/oauth',
    element: <OAuth />,
    loader: oAuthLoader,
  },
]);

export default router;
