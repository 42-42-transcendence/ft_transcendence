import { Navigate, Outlet } from 'react-router-dom';
import useAuthState from '../store/Auth/useAuthState';

const ProtectedRouter = () => {
  const authState = useAuthState();
  // token이 있는데 만료된 경우 로그인 시키기
  if (!authState.token) {
    return <Navigate to="/login" />;
  } else if (!authState.userID) {
    return <Navigate to="/setting-profile" />;
  } else {
    return <Outlet />;
  }
};
export default ProtectedRouter;
