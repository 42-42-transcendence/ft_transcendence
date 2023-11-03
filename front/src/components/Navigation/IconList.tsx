import NotificationIcon from '../../assets/notification-icon';
import UserIcon from '../../assets/user-icon';
import styles from '../../styles/Navigation.module.css';

const IconList = () => {
  return (
    <ul className={styles.icon_list}>
      <li>
        <button>
          <NotificationIcon />
        </button>
      </li>
      <li>
        <button>
          <UserIcon />
        </button>
      </li>
    </ul>
  );
};

export default IconList;
