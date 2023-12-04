import { createBrowserRouter, redirect } from 'react-router-dom';

import RootLayout from './RootLayout';
import ErrorPage from './Error';
import MainPage from './Main';
import DashboardPage from './Dashboard';
import ProfilePage from './Profile';
import ChannelsPage from './Channels';
import LoginPage from './Login';
import SettingProfilePage from './SettingProfile';
import GamePage from './Game';
import ChattingPage from './Chatting';
import OAuth, { loader as oAuthLoader } from './OAuth';
import ProtectedRouter from './ProtectedRouter';
import SocialPage from './Social';

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    element: <ProtectedRouter />,
    children: [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            path: '/',
            element: <MainPage />,
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
            path: '/chatting/:channelID',
            element: <ChattingPage />,
          },
          {
            path: '/social',
            element: <SocialPage />,
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
      },
      {
        path: '/setting-profile',
        element: <SettingProfilePage />,
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
