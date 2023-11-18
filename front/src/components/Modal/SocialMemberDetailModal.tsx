import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';
import styles from '../../styles/Modal.module.css';
import AvatarImage from '../../UI/AvatarImage';
import { useNavigate } from 'react-router-dom';
import type { Member } from '../Social';

type User = {
  id: string;
  image: string;
  status: 'offline' | 'online' | 'in-game';
  isBlocked: boolean;
};

type Props = {
  member: Member;
};

const SocialMemberDetailModal = ({ member }: Props) => {
  const closeModalHandler = useCloseModal();
  const navigate = useNavigate();

  const isEnableDirectMessage =
    member.status !== 'offline' && member.isBlocked === false;
  const isEnableGameInvitation =
    member.status === 'online' && member.isBlocked === false;

  const clickProfileHandler = () => {
    closeModalHandler();
    navigate(`/profile/${member.id}`);
  };

  let contents = (
    <>
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
    </>
  );
  if (member.isBlocked)
    contents = <button className={styles['list-button']}>차단 해제</button>;

  return (
    <Modal onClose={closeModalHandler}>
      <div className={styles.header}>
        <div className={styles['user-wrapper']}>
          <AvatarImage radius="64px" imageURI={member.image} />
          <h3>{member.id}</h3>
        </div>
      </div>
      <div className={styles.wrapper}>{contents}</div>
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
export default SocialMemberDetailModal;
