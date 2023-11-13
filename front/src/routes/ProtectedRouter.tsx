import { Navigate, Outlet } from 'react-router-dom';
import useAuthState from '../store/Auth/useAuthState';

const ProtectedRouter = () => {
  const authState = useAuthState();

  if (!authState.token) {
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
};
export default ProtectedRouter;
