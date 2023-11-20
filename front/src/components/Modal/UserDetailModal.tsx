import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';
import styles from '../../styles/Modal.module.css';
import AvatarImage from '../../UI/AvatarImage';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { User } from '../Social';
import type { Role } from '../Chatting';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';
import useAuthState from '../../store/Auth/useAuthState';

type Props = {
  targetUserID: string;
  channelState?: {
    myRole: Role | null;
    targetRole: Role | null;
    targetIsMuted: boolean | null;
  };
};

const UserDetailModal = ({ targetUserID, channelState }: Props) => {
  const navigate = useNavigate();
  const closeModalHandler = useCloseModal();
  const { myID } = useAuthState();
  const { request } = useRequest();

  const [userInfo, setUserInfo] = useState<User | null>({
    id: 'heryu',
    image: 'https://avatars.githubusercontent.com/u/49449452?v=4',
    relation: 'friend',
    status: 'online',
  });

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     const ret = await request<User>(`${SERVER_URL}/api/user`, {
  //       method: 'GET',
  //     });
  //     setUserInfo(ret);
  //   };

  //   fetchUserInfo();
  // }, [request]);

  const navigateProfile = () => {
    closeModalHandler();
    navigate(`/profile/${targetUserID}`);
  };

  const navigateDashboard = () => {
    closeModalHandler();
    navigate(`/dashboard/${targetUserID}`);
  };

  let contents: React.ReactNode = '';
  if (channelState && Object.values(channelState).includes(null)) {
    contents = <div className={styles.header}>Something Wrong</div>;
  } else if (!userInfo) {
    contents = <div className={styles.header}>유저를 찾을 수 없습니다.</div>;
  } else if (myID === targetUserID) {
    contents = (
      <>
        <div className={styles.header}>
          <div className={styles['user-wrapper']}>
            <AvatarImage radius="64px" imageURI={userInfo.image} />
            <h3>{userInfo.id}</h3>
          </div>
        </div>
        <div className={styles.wrapper}>
          <button className={styles['list-button']} onClick={navigateProfile}>
            프로필 보기
          </button>
          <button className={styles['list-button']} onClick={navigateDashboard}>
            전적 보기
          </button>
        </div>
      </>
    );
  } else {
    contents = (
      <>
        <div className={styles.header}>
          <div className={styles['user-wrapper']}>
            <AvatarImage radius="64px" imageURI={userInfo.image} />
            <h3>{userInfo.id}</h3>
          </div>
        </div>
        <div className={styles.wrapper}>
          <button className={styles['list-button']} onClick={navigateProfile}>
            프로필 보기
          </button>
          <button className={styles['list-button']} onClick={navigateDashboard}>
            전적 보기
          </button>
          <button
            className={styles['list-button']}
            disabled={userInfo.relation === 'block'}
          >
            다이렉트 메시지
          </button>
          <button
            className={styles['list-button']}
            disabled={
              userInfo.relation === 'block' || userInfo.status !== 'online'
            }
          >
            게임 신청
          </button>
          <button className={styles['list-button']}>
            차단{userInfo.relation === 'block' ? ' 풀기' : ''}
          </button>
          <button
            className={styles['list-button']}
            disabled={userInfo.relation === 'block'}
          >
            친구 {userInfo.relation === 'friend' ? '삭제' : '추가'}
          </button>
          {channelState && channelState.myRole !== 'guest' && (
            <>
              <button
                className={styles['list-button']}
                disabled={channelState.targetRole === 'owner'}
              >
                강퇴
              </button>
              <button
                className={styles['list-button']}
                disabled={channelState.targetRole === 'owner'}
              >
                영구 추방
              </button>
              <button
                className={styles['list-button']}
                disabled={channelState.targetRole === 'owner'}
              >
                채팅 금지{channelState.targetIsMuted ? ' 풀기' : ''}
              </button>
              {channelState.myRole === 'owner' && (
                <button className={styles['list-button']}>
                  스태프 {channelState.targetRole === 'guest' ? '설정' : '해제'}
                </button>
              )}
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <Modal onClose={closeModalHandler}>
      {contents}
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
