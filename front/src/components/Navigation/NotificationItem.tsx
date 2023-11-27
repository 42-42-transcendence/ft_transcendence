import { useNavigate } from 'react-router-dom';
import { NotificationType } from '../../store/Notification/notification';
import styles from '../../styles/Dropdown.module.css';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';
import { useDispatch } from 'react-redux';
import { actions as notificationActions } from '../../store/Notification/notification';

type Props = {
  id: string;
  notiType: NotificationType;
  message: string;
  channelID?: string;
};

const NotificationItem = ({ id, notiType, message, channelID }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { request } = useRequest();

  let title = '';
  if (notiType === 'friend') title = '친구 요청';
  else if (notiType === 'ban') title = '추방 알림';
  else if (notiType === 'dm') title = '메시지 도착';
  else if (notiType === 'invite') title = '채팅 초대';

  const clickHandler = async () => {
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/notification/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (ret !== null) {
      dispatch(notificationActions.deleteNotification(id));
      if (notiType === 'dm' || notiType === 'invite')
        navigate(`/chatting/${channelID}`, {
          state: { redirect: true },
        });
    }
  };

  return (
    <li className={styles.list}>
      <small>! {title}</small>
      <button onClick={clickHandler}>
        <div>{message}</div>
      </button>
    </li>
  );
};
export default NotificationItem;
