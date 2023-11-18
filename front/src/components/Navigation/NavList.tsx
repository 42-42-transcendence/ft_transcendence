import { NavLink } from 'react-router-dom';

import styles from '../../styles/Navigation.module.css';
import logo from '../../assets/42logo.svg';
import { RootStoreType } from '../../store';
import { useSelector } from 'react-redux';

const checkNavActivation = ({ isActive }: { isActive: boolean }): string => {
  return isActive ? styles.active : '';
};

const NavList = () => {
  const auth = useSelector((state: RootStoreType) => state.auth);

  return (
    <ul className={styles.nav_list}>
      <div className={styles.logo}>
        <NavLink to="/" className={checkNavActivation}>
          <img src={logo} alt="42 logo" />
        </NavLink>
      </div>
      <li>
        <NavLink
          to={`/dashboard/${auth.userID}`}
          className={checkNavActivation}
        >
          전적
        </NavLink>
      </li>
      <li>
        <NavLink to="/channels" className={checkNavActivation}>
          채팅방
        </NavLink>
      </li>
      <li>
        <NavLink to="/social" className={checkNavActivation}>
          소셜
        </NavLink>
      </li>
    </ul>
  );
};

export default NavList;
