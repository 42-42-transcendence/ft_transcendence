import { Form } from 'react-router-dom';

import styles from '../../styles/GameSelect.module.css';
import GameModeSelectionList from './GameModeSelectionList';
import CardButton from '../../UI/CardButton';
import GameMatchingModal from '../Modal/GameMatchingModal';

import useModalState from '../Modal/useModalState';
import useOpenModal from '../Modal/useOpenModal';

const GameModeForm = () => {
  const showGameMatching = useModalState('showGameMatching');
  const openHandler = useOpenModal('showGameMatching');

  return (
    <>
      <Form method="post" className={styles.form}>
        <div className={styles.container}>
          <h2>GAME MODE</h2>
          <GameModeSelectionList />
          <CardButton className={styles.start} clickHandler={openHandler}>
            START
          </CardButton>
        </div>
      </Form>

      {showGameMatching && <GameMatchingModal />}
    </>
  );
};

export default GameModeForm;
