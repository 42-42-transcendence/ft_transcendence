import { useCallback } from 'react';
import { actions as modalActions } from '../../store/modal';
import { useDispatch } from 'react-redux';

const useCloseModal = () => {
  const dispatch = useDispatch();

  const closeHandler = useCallback(() => {
    dispatch(modalActions.closeModal());
  }, [dispatch]);

  return closeHandler;
};
export default useCloseModal;
