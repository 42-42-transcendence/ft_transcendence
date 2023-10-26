import { NavLink } from 'react-router-dom';

import logo from '../assets/42logo.svg';
import classes from '../styles/HeaderNavigation.module.css';

const HeaderNavigation = () => {
  return (
    <header className={classes.header}>
      <ul className={classes.list}>
        <div>
          <NavLink to="/">
            <img src={logo} alt="42logo.svg" />
          </NavLink>
        </div>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            대시보드
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            프로필
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/chatting"
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            채팅
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/friends"
            className={({ isActive }) => (isActive ? classes.active : '')}
          >
            친구
          </NavLink>
        </li>
      </ul>
    </header>
  );
};
export default HeaderNavigation;
