import { NavLink } from 'react-router-dom';

import styles from '../../styles/Navigation.module.css';

const checkNavActivation = ({ isActive }: { isActive: boolean }): string => {
  return isActive ? styles.active : '';
};

const NavList = () => {
  return (
    <ul className={styles.nav_list}>
      <li>
        <NavLink to="/" className={checkNavActivation}>
          홈
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard" className={checkNavActivation}>
          대시보드
        </NavLink>
      </li>
      <li>
        <NavLink to="/profile" className={checkNavActivation}>
          프로필
        </NavLink>
      </li>
      <li>
        <NavLink to="/channels" className={checkNavActivation}>
          채팅
        </NavLink>
      </li>
      <li>
        <NavLink to="/friends" className={checkNavActivation}>
          친구
        </NavLink>
      </li>
    </ul>
  );
};

export default NavList;
