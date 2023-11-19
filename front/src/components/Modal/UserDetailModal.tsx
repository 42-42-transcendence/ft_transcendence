import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';
import styles from '../../styles/Modal.module.css';
import AvatarImage from '../../UI/AvatarImage';
import { useNavigate } from 'react-router-dom';
import { User } from '../Social';
import { ChatUser } from '../Chatting';

type Props = {
  user: User | ChatUser;
  myPermission?: 'owner' | 'staff' | 'member';
};

const UserDetailModal = ({ user, myPermission }: Props) => {
  const navigate = useNavigate();
  const closeModalHandler = useCloseModal();

  const navigateProfile = () => {
    closeModalHandler();
    navigate(`/profile/${user.id}`);
  };

  const navigateDashboard = () => {
    closeModalHandler();
    navigate(`/dashboard/${user.id}`);
  };

  return (
    <Modal onClose={closeModalHandler}>
      <div className={styles.header}>
        <div className={styles['user-wrapper']}>
          <AvatarImage radius="64px" imageURI={user.image} />
          <h3>{user.id}</h3>
        </div>
      </div>
      <div className={styles.wrapper}>
        <button className={styles['list-button']} onClick={navigateProfile}>
          프로필 보기
        </button>
        <button className={styles['list-button']} onClick={navigateDashboard}>
          전적 보기
        </button>
        {user.relation !== 'block' && (
          <button className={styles['list-button']}>다이렉트 메시지</button>
        )}
        {user.relation !== 'block' && user.status === 'online' && (
          <button className={styles['list-button']}>게임 신청</button>
        )}
        {user.relation !== 'block' && (
          <button className={styles['list-button']}>
            친구 {user.relation === 'normal' ? '추가' : '삭제'}
          </button>
        )}
        <button className={styles['list-button']}>
          차단{user.relation === 'block' ? ' 풀기' : ''}
        </button>
        {'role' in user &&
          user.role !== 'owner' &&
          myPermission !== 'member' && (
            <>
              <button className={styles['list-button']}>강퇴</button>
              <button className={styles['list-button']}>영구 추방</button>
              {
                <button className={styles['list-button']}>
                  채팅 금지{user.isMuted ? ' 풀기' : ''}
                </button>
              }
              {myPermission === 'owner' && (
                <button className={styles['list-button']}>
                  스태프 {user.role === 'member' ? '설정' : '해제'}
                </button>
              )}
            </>
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
export default UserDetailModal;
