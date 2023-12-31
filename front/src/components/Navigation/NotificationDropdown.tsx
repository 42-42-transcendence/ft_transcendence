import styles from '../../styles/Navigation.module.css';
import type { Notification } from '../../store/Notification/notification';
import NotificationItem from './NotificationItem';
import BackdropOverlay from '../../UI/BackdropOverlay';

type Props = {
  notifications: Notification[];
  onClose: () => void;
};

const NotificationDropdown = ({ notifications, onClose }: Props) => {
  const notificationItemList = notifications.map((notification) => (
    <NotificationItem
      key={notification.notiID}
      id={notification.notiID}
      notiType={notification.notiType}
      message={notification.message}
      channelID={notification.data}
      onClose={onClose}
    />
  ));

  return (
    <>
      <BackdropOverlay onClose={onClose} />
      <ul className={styles.dropdown}>
        {notificationItemList.length === 0 ? (
          <h2 className={styles['no-content']}>No Notification.</h2>
        ) : (
          notificationItemList
        )}
      </ul>
    </>
  );
};
export default NotificationDropdown;
