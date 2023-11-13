import { useSelector } from 'react-redux';
import type { RootStoreType } from '..';
import type { ModalState } from './modal';

const useModalState = (modalID: string) => {
  const state = useSelector(
    (state: RootStoreType) => state.modal[modalID as keyof ModalState]
  );

  return state;
};
export default useModalState;
