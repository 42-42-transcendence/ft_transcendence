import styles from '../../styles/Navigation.module.css';
import { useDispatch } from 'react-redux';
import { SERVER_URL } from '../../App';
import { actions as notificationActions } from '../../store/Notification/notification';
import useRequest from '../../http/useRequest';

type Props = {
  id: string;
  message: string;
  inviterNickname: string;
};

const GameInvitationItem = ({ id, message, inviterNickname }: Props) => {
  const { isLoading, error, request } = useRequest();
  const dispatch = useDispatch();

  const acceptHandler = async () => {
    await request<{ message: string }>(`${SERVER_URL}/api/game/accept`, {
      method: 'POST',
      body: JSON.stringify({ targetUserID: inviterNickname }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setTimeout(() => {
      dispatch(notificationActions.clearGameNotification());
    }, 2000);
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

  let contents = (
    <>
      <div>{message}</div>
      <div className={styles['game-invitation-buttons']}>
        <button onClick={acceptHandler} disabled={isLoading}>
          수락
        </button>
        <button onClick={cancelHandler} disabled={isLoading}>
          거절
        </button>
      </div>
    </>
  );
  if (error) contents = <div className={styles.feedback}>{error}</div>;

  return <li className={styles['game-invitation-item']}>{contents}</li>;
};

export default GameInvitationItem;
