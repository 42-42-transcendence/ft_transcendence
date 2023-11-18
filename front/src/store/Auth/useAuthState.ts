import { useSelector } from 'react-redux';
import { RootStoreType } from '..';

const useAuthState = () => {
  const state = useSelector((state: RootStoreType) => state.auth);

  return state;
};
export default useAuthState;
