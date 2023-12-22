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
import { useEffect } from 'react';
import useRequest from '../../http/useRequest';

const GameModeForm = () => {
  const [startAIMatch, setStartAIMatch] = useState(false);
  const userState = useUserState();
  const navigate = useNavigate();
  const openHandler = useOpenModal('showGameMatching');
  const { socket } = useSocket();
  const showGameMatching = useModalState('showGameMatching');
  const { request } = useRequest();
  const [enteredMode, setEnteredMode] = useState<string>('normal');
  useEffect(() => {
    const AIMatch = async () => {
      if (!startAIMatch)
        return;
      
      await request(`${SERVER_URL}/api/game/startAI`, {
        method: 'POST',
      });

      navigate(`/game/AI-mode`, { state: { data: {mode: enteredMode, playerID: [userState.id, "AI"]}}});
      
    };
    setStartAIMatch(false);
    AIMatch();
  }, [startAIMatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enteredMode === 'AI') {
      setStartAIMatch(true);
      return;
    }
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