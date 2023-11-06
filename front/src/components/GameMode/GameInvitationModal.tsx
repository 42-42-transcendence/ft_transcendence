import Modal from '../../UI/Modal';

import modalStyles from '../../styles/Modal.module.css';
import styles from '../../styles/GameSelect.module.css';
import AvatarImage from '../../UI/AvatarImage';

type User = {
  id: string;
  image: string;
};

type Props = {
  user: User;
  onClose: () => void;
};

const GameInvitationModal = ({ user, onClose }: Props) => {
  return (
    <Modal onClose={onClose}>
      <div className={styles.modal}>
        <h1>게임 초대</h1>
        <div className={modalStyles['user-wrapper']}>
          <AvatarImage radius="30%" imageURI={user.image} />
          <h3>{user.id}</h3>
        </div>
        <div className={modalStyles.footer}>
          <button
            className={`${modalStyles['footer-button']} ${modalStyles.confirm}`}
            onClick={onClose}
          >
            ACCEPT
          </button>
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
export default GameInvitationModal;
