import { actions as modalActions } from '../../store/modal';
import { useDispatch } from 'react-redux';

const useOpenModal = (modalID: string) => {
  const dispatch = useDispatch();

  const openHandler = () => {
    dispatch(modalActions.openModal(modalID)); // 예외처리 필요?
  };

  return openHandler;
};
export default useOpenModal;
