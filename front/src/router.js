import { createBrowserRouter } from 'react-router-dom';

import HeaderRayout from './pages/HeaderRayout';
import ErrorPage from './pages/ErrorPage';
import MainPage from './pages/MainPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ChattingPage from './pages/ChattingPage';
import FriendsPage from './pages/FriendsPage';
import LoginRedirectPage from './pages/LoginRedirectPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HeaderRayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'chatting', element: <ChattingPage /> },
      { path: 'friends', element: <FriendsPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginRedirectPage />,
  },
]);

export default router;
