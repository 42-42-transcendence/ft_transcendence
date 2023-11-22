import styles from '../../styles/Navigation.module.css';

import IconList from './IconList';
import NavList from './NavList';

const Navigation = () => {
  return (
    <header className={styles.header}>
      <NavList />
      <IconList />
    </header>
  );
};
export default Navigation;
