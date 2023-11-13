import { useSelector } from 'react-redux';
import type { RootStoreType } from '../../store';
import type { ModalState } from '../../store/modal';

const useModalState = (modalID: string) => {
  const state = useSelector(
    (state: RootStoreType) => state.modal[modalID as keyof ModalState]
  );

  return state;
};
export default useModalState;
