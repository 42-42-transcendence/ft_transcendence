import { useSelector } from 'react-redux';
import { RootStoreType } from '..';

const useUserState = () => {
  const state = useSelector((state: RootStoreType) => state.user);

  return state;
};
export default useUserState;
