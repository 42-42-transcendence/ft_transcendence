import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { SocketContextProvider } from '../socket/SocketContext';
import { useEffect, useState } from 'react';
import useRequest from '../http/useRequest';
import { SERVER_URL } from '../App';
import { useDispatch } from 'react-redux';
import { actions as userActions } from '../store/User/user';
import useUserState from '../store/User/useUserState';

const ProtectedRouter = () => {
  const dispatch = useDispatch();
  const { isLoading, request } = useRequest();
  const [tokenIsValidated, setTokenIsValidated] = useState<boolean | null>(
    null
  );
  const userState = useUserState();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const tokenResponse = await request<{ message: string }>(
        `${SERVER_URL}/api/auth`,
        {
          method: 'GET',
        }
      );

      if (tokenResponse !== null) {
        setTokenIsValidated(true);
      } else {
        setTokenIsValidated(false);
        return;
      }

      const nickcnameResponse = await request<{ nickname: string }>(
        `${SERVER_URL}/api/auth/nickname`,
        {
          method: 'GET',
        }
      );

      if (nickcnameResponse !== null) {
        dispatch(userActions.setUserID(nickcnameResponse.nickname));
      } else {
        return;
      }
    };

    fetchData();
  }, [request, dispatch]);

  if (tokenIsValidated === null || isLoading) {
    return <h1 style={{ textAlign: 'center' }}>...Loading...</h1>;
  }

  if (tokenIsValidated === true) {
    if (location.pathname === '/setting-profile') {
      return <Outlet />;
    }
    if (userState.id !== '') {
      return (
        <SocketContextProvider>
          <Outlet />
        </SocketContextProvider>
      );
    }
  }

  return <Navigate to="/login" />;
};
export default ProtectedRouter;
