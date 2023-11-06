import { useState } from 'react';

import styles from '../../styles/Navigation.module.css';

import NotificationIcon from '../../assets/notification-icon';
import UserIcon from '../../assets/user-icon';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';

const IconList = () => {
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  const toggleShowNotificationHandler = () => {
    setShowNotificationDropdown((prev) => !prev);
  };
  const offNotificationDropDownHandler = () => {
    setShowNotificationDropdown(false);
  };

  const toggleShowUserDropdown = () => {
    setShowUserDropdown((prev) => !prev);
  };
  const offNotificationHandler = () => {
    setTimeout(() => {
      setShowUserDropdown(false);
    }, 100);
  };

  return (
    <ul className={styles.icon_list}>
      <li onBlur={offNotificationDropDownHandler} className={styles.icon_item}>
        <button
          onClick={toggleShowNotificationHandler}
          className={styles.toggle}
        >
          <NotificationIcon />
        </button>
        {showNotificationDropdown && <NotificationDropdown />}
      </li>
      <li onBlur={offNotificationHandler} className={styles.icon_item}>
        <button onClick={toggleShowUserDropdown} className={styles.toggle}>
          <UserIcon />
        </button>
        {showUserDropdown && <UserDropdown />}
      </li>
    </ul>
  );
};

export default IconList;
