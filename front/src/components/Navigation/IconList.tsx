import { useState } from 'react';

import styles from '../../styles/Navigation.module.css';

import notificationIcon from '../../assets/notification-icon.svg';
import userIcon from '../../assets/user-icon.svg';
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
        <small className={styles.new}>7</small>
        {showNotificationDropdown && <NotificationDropdown />}
      </li>
      <li onBlur={offUserDropDownHandler} className={styles.icon_item}>
        <button
          onClick={toggleShowUserDropdownHandler}
          className={styles.toggle}
        >
          <img src={userIcon} alt="user icon" />
        </button>
        {showUserDropdown && <UserDropdown />}
      </li>
    </ul>
  );
};

export default IconList;
