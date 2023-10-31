import GameModeForm from '../components/GameMode/GameModeForm';

import styles from '../styles/Main.module.css';

const MainPage = () => {
  return (
    <>
      <h1 className={styles.heading}>42 Pong</h1>
      <GameModeForm />
    </>
  );
};
export default MainPage;
