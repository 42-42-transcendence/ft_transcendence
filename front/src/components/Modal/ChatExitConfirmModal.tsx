import Modal from '../../UI/Modal';
import useCloseModal from './useCloseModal';

import styles from '../../styles/Modal.module.css';
import { useNavigate } from 'react-router-dom';

const ChatExitConfirmModal = () => {
  const closeHandler = useCloseModal();
  const navigate = useNavigate();

  const exitHandler = () => {
    navigate('/channels');
    closeHandler();
  };

  return (
    <Modal onClose={closeHandler}>
      <div className={styles.header}>채널 나가기</div>
      <div className={styles.wrapper}>정말로 나가시겠습니까?</div>
      <div className={styles.footer}>
        <button
          className={`${styles['footer-button']} ${styles.confirm}`}
          onClick={exitHandler}
        >
          OK
        </button>
        <button
          className={`${styles['footer-button']} ${styles.cancel}`}
          onClick={closeHandler}
        >
          CANCEL
        </button>
      </div>
    </Modal>
  );
};
export default ChatExitConfirmModal;
