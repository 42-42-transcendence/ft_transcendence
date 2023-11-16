import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';
import styles from '../../styles/Modal.module.css';
import AvatarImage from '../../UI/AvatarImage';
import { useNavigate } from 'react-router-dom';

type Member = {
  id: string;
  image: string;
};

type Props = {
  member: Member;
};

const ChatMemberDetailModal = ({ member }: Props) => {
  const closeModalHandler = useCloseModal();
  const navigate = useNavigate();

  const clickProfileHandler = () => {
    closeModalHandler();
    navigate(`/profile/${member.id}`);
  };

  return (
    <Modal onClose={closeModalHandler}>
      <div className={styles.header}>
        <div className={styles['user-wrapper']}>
          <AvatarImage radius="64px" imageURI={member.image} />
          <h3>{member.id}</h3>
        </div>
      </div>
      <div className={styles.wrapper}>
        <button className={styles['list-button']} onClick={clickProfileHandler}>
          프로필 보기
        </button>
        <button className={styles['list-button']}>다이렉트 메시지</button>
        <button className={styles['list-button']}>게임 신청</button>
        <button className={styles['list-button']}>친구 추가</button>
        <button className={styles['list-button']}>차단</button>
        <button className={styles['list-button']}>추방</button>
        <button className={styles['list-button']}>채팅 금지</button>
        <button className={styles['list-button']}>관리자 설정</button>
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
export default ChatMemberDetailModal;
