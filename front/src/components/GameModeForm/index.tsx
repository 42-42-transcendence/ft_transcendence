import {Form, useNavigate} from 'react-router-dom';
import styles from '../../styles/GameSelect.module.css';
import GameModeSelectionList from './GameModeSelectionList';
import CardButton from '../../UI/CardButton';
import GameMatchingModal from '../Modal/GameMatchingModal';
import { useState } from 'react';
import useModalState from '../../store/Modal/useModalState';
import useOpenModal from '../../store/Modal/useOpenModal';
import useUserState from '../../store/User/useUserState';
import { useSocket } from '../../socket/SocketContext';
import { SERVER_URL } from '../../App';

const sendInGameRequest = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/인게임/요청`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error during the API call:', error);
  }
};

const GameModeForm = () => {
  const userState = useUserState();
  const navigate = useNavigate();
  const openHandler = useOpenModal('showGameMatching');
  const { socket } = useSocket();
  const showGameMatching = useModalState('showGameMatching');
  const [enteredMode, setEnteredMode] = useState<string>('normal');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enteredMode === 'AI') {
      // if (!socket) return console.error('socket is null');
      await sendInGameRequest();
      navigate(`/game/AI-mode`, { state: { gameMode: enteredMode, player: [userState.id, "AI"]} });
    } else {
      openHandler();
    }
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