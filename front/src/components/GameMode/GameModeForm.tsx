import { Form } from 'react-router-dom';

import styles from '../../styles/GameSelectForm.module.css';
import GameModeSelectionList from './GameModeSelectionList';
import CardButton from '../../UI/CardButton';

const GameModeForm = () => {
  return (
    <Form method="post" action="/game/1" className={styles.form}>
      <div className={styles.container}>
        <h2>GAME MODE</h2>
        <GameModeSelectionList />
        <CardButton className={styles.start}>START</CardButton>
      </div>
    </Form>
  );
};

export default GameModeForm;
