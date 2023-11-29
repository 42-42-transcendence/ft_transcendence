import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Dropdown.module.css';
import { useDispatch } from 'react-redux';
import { actions as authActions } from '../../store/Auth/auth';
import { actions as userActions } from '../../store/User/user';
import useUserState from '../../store/User/useUserState';

const UserDropdown = () => {
  const userState = useUserState();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate(`/profile/${userState.id}`);
  };

  const logoutHandler = () => {
    dispatch(authActions.clearAuth());
    dispatch(userActions.clearUser());
    navigate('/login');
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
