import Modal from '../../UI/Modal';

import styles from '../../styles/Modal.module.css';
import loadingImage from '../../assets/loading.gif';

import useCloseModal from '../../store/Modal/useCloseModal';

const GameMatchingModal = () => {
  const closeHandler = useCloseModal();

  return (
    <Modal onClose={closeHandler}>
      <div className={styles.wrapper}>
        <div className={styles.header}>상대방 찾는 중..</div>
        <img src={loadingImage} alt="wait for game matching" />
        <div className={styles.footer}>
          <button
            className={`${styles['footer-button']} ${styles.cancel}`}
            onClick={closeHandler}
          >
            CANCEL
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default GameMatchingModal;
