import styles from '../../styles/Navigation.module.css';
import { useDispatch } from 'react-redux';
import { SERVER_URL } from '../../App';
import { actions as notificationActions } from '../../store/Notification/notification';
import useRequest from '../../http/useRequest';
import { useEffect } from 'react';
import useOpenModal from '../../store/Modal/useOpenModal';

type Props = {
  id: string;
  message: string;
  inviterNickname: string;
  setMessage: (message: string) => void;
};

const GameInvitationItem = ({
  id,
  message,
  inviterNickname,
  setMessage,
}: Props) => {
  const { isLoading, error, request } = useRequest();
  const dispatch = useDispatch();
  const openModalHandler = useOpenModal('showMessage');

  const acceptHandler = async () => {
    await request<{ message: string }>(`${SERVER_URL}/api/game/accept`, {
      method: 'POST',
      body: JSON.stringify({ targetUserID: inviterNickname }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    dispatch(notificationActions.deleteNotification(id));
  };

  const cancelHandler = async () => {
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/notification/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (ret !== null) dispatch(notificationActions.deleteNotification(id));
  };

  useEffect(() => {
    if (error === '') return;

    setMessage(error);
    openModalHandler();
  }, [error, setMessage, openModalHandler]);

  return (
    <li className={styles['game-invitation-item']}>
      <div>{message}</div>
      <div className={styles['game-invitation-buttons']}>
        <button onClick={acceptHandler} disabled={isLoading}>
          수락
        </button>
        <button onClick={cancelHandler} disabled={isLoading}>
          거절
        </button>
      </div>
    </li>
  );
};

export default GameInvitationItem;
