import { useCallback } from 'react';
import { actions as modalActions } from './modal';
import { useDispatch } from 'react-redux';

const useOpenModal = (modalID: string) => {
  const dispatch = useDispatch();

<<<<<<< HEAD:front/src/components/Modal/useOpenModal.ts
  let openHandler: () => void;
  openHandler = () => {
=======
  const openHandler = useCallback(() => {
>>>>>>> e8385e14cdfe002877d8eb7bdacb6742353e4670:front/src/store/Modal/useOpenModal.ts
    dispatch(modalActions.openModal(modalID)); // 예외처리 필요?
  }, [dispatch, modalID]);

  return openHandler;
};
export default useOpenModal;