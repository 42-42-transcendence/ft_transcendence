import styles from '../../styles/Dropdown.module.css';

const NotificationDropdown = () => {
  return (
    <ul className={styles.dropdown}>
      <li className={styles.list}>
        <small>! 친구 요청</small>
        <button>
          <div>asdasdasd님의 친구 요청</div>
        </button>
      </li>
      <li className={styles.list}>
        <small>! 메시지</small>
        <button>asdf님에게 온 DM</button>
      </li>
      <li className={styles.list}>
        <small>! 친구요청</small>
        <button>홍길동님의 친구 요청</button>
      </li>
    </ul>
  );
};
export default NotificationDropdown;
