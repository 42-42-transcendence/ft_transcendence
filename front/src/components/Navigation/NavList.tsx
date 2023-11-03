import { NavLink } from 'react-router-dom';

import styles from '../../styles/Navigation.module.css';
import logo from '../../assets/42logo.svg';

const checkNavActivation = ({ isActive }: { isActive: boolean }): string => {
  return isActive ? styles.active : '';
};

const NavList = () => {
  return (
    <ul className={styles.nav_list}>
      <div className={styles.logo}>
        <NavLink to="/" className={checkNavActivation}>
          <img src={logo} alt="42 logo" />
        </NavLink>
      </div>
      <li>
        <NavLink to="/dashboard" className={checkNavActivation}>
          전적
        </NavLink>
      </li>
      <li>
        <NavLink to="/channels" className={checkNavActivation}>
          채팅방
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
