import Modal from '../../UI/Modal';
import useCloseModal from '../../store/Modal/useCloseModal';
import styles from '../../styles/Modal.module.css';
import AvatarImage from '../../UI/AvatarImage';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { User } from '../Social';
import type { Role } from '../Chatting';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';
import useUserState from '../../store/User/useUserState';

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
  const { isLoading, error, request } = useRequest();
  const params = useParams();
  const userState = useUserState();

  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const ret = await request<User>(
        `${SERVER_URL}/api/user/${targetUserID}`,
        {
          method: 'GET',
        }
      );
      setUserInfo(ret);
    };

    fetchUserInfo();
  }, [request, targetUserID]);

  const profileHandler = () => {
    closeModalHandler();
    navigate(`/profile/${targetUserID}`);
  };

  const dashboardHandler = () => {
    closeModalHandler();
    navigate(`/dashboard/${targetUserID}`);
  };

  const directMessageHandler = async () => {
    const ret = await request<{ channelID: string }>(
      `${SERVER_URL}/api/channel/dm`,
      {
        method: 'POST',
        body: JSON.stringify({ targetUserID: targetUserID }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (ret !== null) {
      closeModalHandler();
      navigate(`/chatting/${ret.channelID}`);
    }
  };

  const inviteGameHandler = async () => {
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/game/invite`,
      {
        method: 'POST',
        body: JSON.stringify({ targetUserID: targetUserID }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (ret !== null) {
      closeModalHandler();
    }
  };

  const addFriendHandler = async () => {
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/relation/friend/${targetUserID}`,
      { method: 'GET' }
    );

    if (ret !== null) {
      closeModalHandler();
    }
  };

  const deleteFriendHandler = async () => {
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/relation/friend/${targetUserID}`,
      { method: 'DELETE' }
    );

    if (ret !== null) {
      closeModalHandler();
    }
  };

  const blockHandler = async () => {
    const channelID = params.channelID;
    let ret = null;
    if (channelID) {
      ret = await request<{ message: string }>(
        `${SERVER_URL}/api/channel/${params.channelID}/block`,
        {
          method: 'POST',
          body: JSON.stringify({ targetUserID: targetUserID }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      ret = await request<{ message: string }>(
        `${SERVER_URL}/api/relation/block/${targetUserID}`,
        {
          method: 'GET',
        }
      );
    }

    if (ret !== null) {
      closeModalHandler();
    }
  };

  const kickHandler = async () => {
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/channel/${params.channelID}/kick`,
      {
        method: 'POST',
        body: JSON.stringify({ targetUserID: targetUserID }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (ret !== null) {
      closeModalHandler();
    }
  };

  const banHandler = async () => {
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/channel/${params.channelID}/ban`,
      {
        method: 'POST',
        body: JSON.stringify({ targetUserID: targetUserID }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (ret !== null) {
      closeModalHandler();
    }
  };

  const muteHandler = async () => {
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/channel/${params.channelID}/mute`,
      {
        method: 'POST',
        body: JSON.stringify({ targetUserID: targetUserID }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (ret !== null) {
      closeModalHandler();
    }
  };

  const staffHandler = async () => {
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/channel/${params.channelID}/staff`,
      {
        method: 'POST',
        body: JSON.stringify({ targetUserID: targetUserID }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (ret !== null) {
      closeModalHandler();
    }
  };

  let contents: React.ReactNode = '';
  if (channelState && Object.values(channelState).includes(null)) {
    contents = <div className={styles.header}>Something Wrong</div>;
  } else if (userInfo === null) {
    contents = <div className={styles.header}>유저를 찾을 수 없습니다.</div>;
  } else if (userState.id === targetUserID) {
    contents = (
      <>
        <div className={styles.header}>
          <div className={styles['user-wrapper']}>
            <AvatarImage radius="64px" imageURI={userInfo.image} />
            <h3>{userInfo.nickname}</h3>
          </div>
        </div>
        <div className={styles.wrapper}>
          <button
            className={styles['list-button']}
            disabled={isLoading}
            onClick={profileHandler}
          >
            프로필 보기
          </button>
          <button
            className={styles['list-button']}
            disabled={isLoading}
            onClick={dashboardHandler}
          >
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
            <h3>{userInfo.nickname}</h3>
          </div>
        </div>
        <div className={styles.feedback}>{error}</div>
        <div className={styles.wrapper}>
          <button
            className={styles['list-button']}
            disabled={isLoading}
            onClick={profileHandler}
          >
            프로필 보기
          </button>
          <button
            className={styles['list-button']}
            disabled={isLoading}
            onClick={dashboardHandler}
          >
            전적 보기
          </button>
          <button
            className={styles['list-button']}
            disabled={userInfo.relation === 'block' || isLoading}
            onClick={directMessageHandler}
          >
            다이렉트 메시지
          </button>
          <button
            className={styles['list-button']}
            disabled={
              userInfo.relation === 'block' ||
              userInfo.status !== 'online' ||
              isLoading
            }
            onClick={inviteGameHandler}
          >
            게임 신청
          </button>
          <button
            className={styles['list-button']}
            disabled={userInfo.relation === 'block' || isLoading}
            onClick={
              userInfo.relation === 'friend'
                ? deleteFriendHandler
                : addFriendHandler
            }
          >
            친구 {userInfo.relation === 'friend' ? '삭제' : '추가'}
          </button>
          <button
            className={styles['list-button']}
            disabled={isLoading}
            onClick={blockHandler}
          >
            차단{userInfo.relation === 'block' ? ' 풀기' : ''}
          </button>
          {channelState && channelState.myRole !== 'guest' && (
            <>
              <button
                className={styles['list-button']}
                disabled={channelState.targetRole === 'owner' || isLoading}
                onClick={kickHandler}
              >
                강퇴
              </button>
              <button
                className={styles['list-button']}
                disabled={channelState.targetRole === 'owner' || isLoading}
                onClick={banHandler}
              >
                영구 추방
              </button>
              <button
                className={styles['list-button']}
                disabled={channelState.targetRole === 'owner' || isLoading}
                onClick={muteHandler}
              >
                채팅 금지{channelState.targetIsMuted ? ' 풀기' : ''}
              </button>
              {channelState.myRole === 'owner' && (
                <button
                  className={styles['list-button']}
                  disabled={isLoading}
                  onClick={staffHandler}
                >
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
          disabled={isLoading}
        >
          ClOSE
        </button>
      </div>
    </Modal>
  );
};
export default UserDetailModal;
