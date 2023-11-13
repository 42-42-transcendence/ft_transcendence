import Modal from '../../UI/Modal';
import useCloseModal from './useCloseModal';
import styles from '../../styles/Modal.module.css';
import AvatarImage from '../../UI/AvatarImage';
import { useNavigate } from 'react-router-dom';

type Friend = {
  id: string;
  image: string;
  status: 'offline' | 'online' | 'in-game';
  isBlocked: boolean;
};

type Props = {
  friend: Friend;
};

const FriendDetailModal = ({ friend }: Props) => {
  const closeModalHandler = useCloseModal();
  const navigate = useNavigate();

  const isEnableDirectMessage =
    friend.status !== 'offline' && friend.isBlocked === false;
  const isEnableGameInvitation =
    friend.status === 'online' && friend.isBlocked === false;

  const clickProfileHandler = () => {
    closeModalHandler();
    navigate(`/profile/${friend.id}`);
  };

  return (
    <Modal onClose={closeModalHandler}>
      <div className={styles.header}>
        <div className={styles['user-wrapper']}>
          <AvatarImage radius="64px" imageURI={friend.image} />
          <h3>{friend.id}</h3>
        </div>
      </div>
      <div className={styles.wrapper}>
        <button className={styles['list-button']} onClick={clickProfileHandler}>
          프로필 보기
        </button>
        <button
          className={styles['list-button']}
          disabled={!isEnableDirectMessage}
        >
          다이렉트 메시지
        </button>

        <button
          className={styles['list-button']}
          disabled={!isEnableGameInvitation}
        >
          게임 신청
        </button>
        <button className={styles['list-button']}>친구 삭제</button>
        {friend.isBlocked && (
          <button className={styles['list-button']}>차단 해제</button>
        )}
        {!friend.isBlocked && (
          <button className={styles['list-button']}>친구 차단</button>
        )}
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles['footer-button']} ${styles.cancel}`}
          onClick={closeModalHandler}
        >
          ClOSE
        </button>
      </div>
    </Modal>
  );
};
export default FriendDetailModal;
