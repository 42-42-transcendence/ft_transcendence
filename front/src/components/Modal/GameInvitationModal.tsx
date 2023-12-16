import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';

import styles from '../../styles/Modal.module.css';
import AvatarImage from '../../UI/AvatarImage';

type User = {
  id: string;
  image: string;
};

type Props = {
  user: User;
};

const GameInvitationModal = ({ user }: Props) => {
  const closeHandler = useCloseModal();
  return (
    <Modal onClose={closeHandler}>
      <div className={styles.header}>게임 초대</div>
      <div className={styles.wrapper}>
        <div className={styles['user-wrapper']}>
          <AvatarImage radius="30%" imageURI={user.image} />
          <h3>{user.id}</h3>
        </div>
      </div>
      <div className={styles.footer}>
        <button className={`${styles['footer-button']} ${styles.confirm}`}>
          ACCEPT
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
export default GameInvitationModal;
