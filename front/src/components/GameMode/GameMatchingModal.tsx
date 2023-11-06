import Modal from '../../UI/Modal';

import modalStyles from '../../styles/Modal.module.css';
import styles from '../../styles/GameSelect.module.css';
import loadingImage from '../../assets/loading.gif';

type Props = {
  onClose: () => void;
};

const GameMatchingModal = ({ onClose }: Props) => {
  return (
    <Modal onClose={onClose}>
      <div className={styles.modal}>
        <h1>상대방 찾는 중..</h1>
        <img src={loadingImage} alt="wait for game matching" />
        <div className={modalStyles.footer}>
          <button
            className={`${modalStyles['footer-button']} ${modalStyles.cancel}`}
            onClick={onClose}
          >
            CANCEL
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default GameMatchingModal;
