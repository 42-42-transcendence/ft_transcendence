import { useNavigate } from 'react-router-dom';
import { NotificationType } from '../../store/Notification/notification';
import styles from '../../styles/Dropdown.module.css';
import useRequest from '../../http/useRequest';
import { SERVER_URL } from '../../App';
import { useDispatch } from 'react-redux';
import { actions as notificationActions } from '../../store/Notification/notification';

type Props = {
  id: string;
  type: NotificationType;
  message: string;
  channelID?: string;
};

const NotificationItem = ({ id, type, message, channelID }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { request } = useRequest();

  let title = '';
  if (type === 'friend') title = '친구 요청';
  else if (type === 'ban') title = '추방 알림';
  else if (type === 'dm') title = '메시지 도착';
  else if (type === 'invite') title = '채팅 초대';

  const clickHandler = async () => {
    const ret = await request<{ message: string }>(
      `${SERVER_URL}/api/notification/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (ret !== null) {
      dispatch(notificationActions.deleteNotification(id));
      if (type === 'dm' || type === 'invite')
        navigate(`/chatting/${channelID}`);
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
