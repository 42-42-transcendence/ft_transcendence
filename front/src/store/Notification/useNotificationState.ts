import { useSelector } from 'react-redux';
import { RootStoreType } from '..';

const useNotificationState = () => {
  const state = useSelector((state: RootStoreType) => state.notification);

  return state;
};
export default useNotificationState;
