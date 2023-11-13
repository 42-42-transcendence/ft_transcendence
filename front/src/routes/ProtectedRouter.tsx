import { useSelector } from 'react-redux';
import { RootStoreType } from '../store';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouter = () => {
  const auth = useSelector((state: RootStoreType) => state.auth);

  if (!auth.token) {
    return <Navigate to="/login" />;
  } else {
    return <Outlet />;
  }
};
export default ProtectedRouter;
