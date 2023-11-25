import styles from '../../styles/Dropdown.module.css';
import type { Notification } from '../../store/Notification/notification';
import NotificationItem from './NotificationItem';

type Props = {
  notifications: Notification[];
};

const NotificationDropdown = ({ notifications }: Props) => {
  const notificationItemList = notifications.map((notification) => (
    <NotificationItem
      key={notification.notiID}
      id={notification.notiID}
      type={notification.type}
      message={notification.message}
      channelID={notification.channelID}
    />
  ));

  return (
    <ul className={styles.dropdown}>
      {notificationItemList.length === 0 ? (
        <h2 className={styles['no-content']}>No Notification.</h2>
      ) : (
        notificationItemList
      )}
    </ul>
  );
};
export default NotificationDropdown;
