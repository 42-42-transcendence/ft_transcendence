import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';

import styles from '../../styles/Modal.module.css';

type Props = {
  title: string;
  message: string;
  acceptHandler: () => void;
};

const ConfirmModal = ({ title, message, acceptHandler }: Props) => {
  const closeHandler = useCloseModal();

  return (
    <Modal onClose={closeHandler}>
      <div className={styles.header}>{title}</div>
      <div className={styles.wrapper}>{message}</div>
      <div className={styles.footer}>
        <button
          className={`${styles['footer-button']} ${styles.confirm}`}
          onClick={acceptHandler}
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
export default ConfirmModal;
