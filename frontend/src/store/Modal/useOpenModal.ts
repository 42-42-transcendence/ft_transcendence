import { useCallback } from 'react';
import { actions as modalActions } from './modal';
import { useDispatch } from 'react-redux';

const useOpenModal = (modalID: string) => {
  const dispatch = useDispatch();

  const openHandler = useCallback(() => {
    dispatch(modalActions.openModal(modalID)); // 예외처리 필요?
  }, [dispatch, modalID]);

  return openHandler;
};
export default useOpenModal;
