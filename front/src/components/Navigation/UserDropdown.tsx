import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Dropdown.module.css';
import { RootStoreType } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { actions as authActions } from '../../store/Auth/auth';

const UserDropdown = () => {
  const auth = useSelector((state: RootStoreType) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate(`/profile/${auth.myID}`);
  };

  const logoutHandler = () => {
    dispatch(authActions.clearAuth());
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
