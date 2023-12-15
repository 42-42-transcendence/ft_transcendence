import styles from '../../styles/Navigation.module.css';
import GameInvitationList from './GameInvitationList';
import IconList from './IconList';
import NavList from './NavList';

const Navigation = () => {
  return (
    <header className={styles.header}>
      <NavList />
      <IconList />
      <GameInvitationList />
    </header>
  );
};
export default Navigation;
