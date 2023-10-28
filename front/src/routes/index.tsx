import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './RootLayout';
import ErrorPage from './Error';

import MainPage from './Main';
import DashboardPage from './Dashboard';
import ProfilePage from './Profile';
import FriendsPage from './Friends';
import ChannelsPage from './Channels';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/channels', element: <ChannelsPage /> },
      { path: '/friends', element: <FriendsPage /> },
    ],
  },
]);

export default router;
