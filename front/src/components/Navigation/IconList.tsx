import { useState } from 'react';

import styles from '../../styles/Navigation.module.css';

import notificationIcon from '../../assets/notification-icon.svg';
import userIcon from '../../assets/user-icon.svg';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';
import useNotificationState from '../../store/Notification/useNotificationState';
import QRCodeModal from '../Modal/QRCodeModal';
import useModalState from '../../store/Modal/useModalState';
import useOpenModal from '../../store/Modal/useOpenModal';

const IconList = () => {
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  const { notifications } = useNotificationState();

  const showQRCode = useModalState('showQRCode');
  const openQRCodeModal = useOpenModal('showQRCode');
  const [qrCodeURL, setQRCodeURL] = useState<string>('');

  const filteredNotifications = notifications.filter(
    (notification) => notification.notiType !== 'game'
  );
  const notificationCount = filteredNotifications.length;

  const toggleShowNotificationHandler = () => {
    setShowNotificationDropdown((prev) => !prev);
  };

  const offNotificationDropDownHandler = () => {
    setTimeout(() => {
      setShowNotificationDropdown(false);
    }, 150);
  };

  const toggleShowUserDropdownHandler = () => {
    setShowUserDropdown((prev) => !prev);
  };

  const offUserDropDownHandler = () => {
    setTimeout(() => {
      setShowUserDropdown(false);
    }, 150);
  };

  const openQRCodeHandler = (qrCodeURL: string) => {
    setQRCodeURL(qrCodeURL);
    openQRCodeModal();
  };

  return (
    <ul className={styles.icon_list}>
      <li
        onBlur={offNotificationDropDownHandler}
        className={`${styles.icon_item}`}
      >
        <button
          onClick={toggleShowNotificationHandler}
          className={styles.toggle}
        >
          <img src={notificationIcon} alt="notification icon" />
        </button>
        {notificationCount !== 0 && (
          <small className={styles.new}>{notificationCount}</small>
        )}
        {showNotificationDropdown && (
          <NotificationDropdown notifications={filteredNotifications} />
        )}
      </li>
      <li onBlur={offUserDropDownHandler} className={styles.icon_item}>
        <button
          onClick={toggleShowUserDropdownHandler}
          className={styles.toggle}
        >
          <img src={userIcon} alt="user icon" />
        </button>
        {showUserDropdown && (
          <UserDropdown onOpenQRCodeModal={openQRCodeHandler} />
        )}
        {showQRCode && <QRCodeModal qrCodeURL={qrCodeURL} />}
      </li>
    </ul>
  );
};

export default IconList;
