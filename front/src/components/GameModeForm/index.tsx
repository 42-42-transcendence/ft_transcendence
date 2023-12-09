import { Form } from 'react-router-dom';
import styles from '../../styles/GameSelect.module.css';
import GameModeSelectionList from './GameModeSelectionList';
import CardButton from '../../UI/CardButton';
import GameMatchingModal from '../Modal/GameMatchingModal';
import { useState } from 'react';
import useModalState from '../../store/Modal/useModalState';
import useOpenModal from '../../store/Modal/useOpenModal';

const GameModeForm = () => {
  const showGameMatching = useModalState('showGameMatching');
  const openHandler = useOpenModal('showGameMatching');
  const [enteredMode, setEnteredMode] = useState<string>('normal');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    openHandler();
  };

  return (
      <>
        <Form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.container}>
            <h2>GAME MODE</h2>
            <GameModeSelectionList
                setEnteredMode={setEnteredMode}
                enteredMode={enteredMode}
            />
            <CardButton className={styles.start}>START</CardButton>
          </div>
        </Form>

        {showGameMatching && <GameMatchingModal mode={enteredMode} />}
      </>
  );
};

export default GameModeForm;