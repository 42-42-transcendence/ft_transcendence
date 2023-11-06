import { useNavigate, useSubmit } from 'react-router-dom';
import styles from '../../styles/Dropdown.module.css';

const UserDropdown = () => {
  const submit = useSubmit();
  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate('/profile');
  };

  const logoutHandler = () => {
    submit(null, { action: '/logout', method: 'POST' });
  };

  return (
    <ul className={styles.dropdown}>
      <li className={styles.list}>
        <button onClick={navigateHandler}>내 프로필</button>
      </li>
      <li className={styles.list}>
        <button>2차 인증 켜기</button>
      </li>
      <li className={styles.list}>
        <button onClick={logoutHandler}>로그아웃</button>
      </li>
    </ul>
  );
};
export default UserDropdown;
