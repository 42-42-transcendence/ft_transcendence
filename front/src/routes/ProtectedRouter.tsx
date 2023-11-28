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
      return (
        <Navigate
          to="/setting-profile"
          state={{
            message: '토큰 정보가 유효하지 않습니다.',
          }}
        />
      );
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
