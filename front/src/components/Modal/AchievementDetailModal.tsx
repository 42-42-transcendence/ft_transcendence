import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';

import styles from '../../styles/Modal.module.css';

type Props = {
  title: string;
  description: string;
};

const AchievementDetailModal = ({ title, description }: Props) => {
  const closeHandler = useCloseModal();

  return (
    <Modal onClose={closeHandler}>
      <div className={styles.header}>{title}</div>
      <div className={styles.wrapper}>{description}</div>
      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles['footer-button']} ${styles.confirm}`}
          onClick={closeHandler}
        >
          OK
        </button>
      </div>
    </Modal>
  );
};
export default AchievementDetailModal;
