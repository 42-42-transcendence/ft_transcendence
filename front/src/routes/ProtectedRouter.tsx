import { Navigate, Outlet } from 'react-router-dom';
import useAuthState from '../store/Auth/useAuthState';
import { SocketContextProvider } from '../socket/SocketContext';
import { useEffect, useState } from 'react';
import useRequest from '../http/useRequest';
import { SERVER_URL } from '../App';

const ProtectedRouter = () => {
  const authState = useAuthState();
  const [tokenIsValidated, setTokenIsValidated] = useState<boolean | null>(
    null
  );
  const { request } = useRequest();

  // token이 있는데 만료된 경우 로그인 시키기
  useEffect(() => {
    const fetchTokenisValidated = async () => {
      const ret = await request<{ message: string }>(`${SERVER_URL}/api/auth`, {
        method: 'GET',
      });

      if (ret !== null) {
        setTokenIsValidated(true);
      } else {
        setTokenIsValidated(false);
      }
    };
    fetchTokenisValidated();
  }, [request]);

  if (tokenIsValidated === null) {
    return <>...Loading...</>;
  } else if (tokenIsValidated === true) {
    if (!authState.myID) {
      return <Navigate to="/setting-profile" />;
    } else {
      return (
        <SocketContextProvider>
          <Outlet />
        </SocketContextProvider>
      );
    }
  } else {
    return <Navigate to="/login" />;
  }
};
export default ProtectedRouter;
