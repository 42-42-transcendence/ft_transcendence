import { Form } from 'react-router-dom';
import styles from '../../styles/GameSelect.module.css';
import GameModeSelectionList from './GameModeSelectionList';
import CardButton from '../../UI/CardButton';
import GameMatchingModal from '../Modal/GameMatchingModal';
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import useModalState from '../../store/Modal/useModalState';
import useOpenModal from '../../store/Modal/useOpenModal';
import { socket } from '../../socket/SocketContext';

const GameModeForm = () => {
  const showGameMatching = useModalState('showGameMatching');
  const openHandler = useOpenModal('showGameMatching'); // submit handler
  const [enteredMode, setEnteredMode] = useState<string>('normal');

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    console.log(enteredMode);
    openHandler();
    // 1초 지연 (해당 부분에서, API 요청)
    console.log('1초 지연');
    await new Promise((res) => setTimeout(res, 1000));
    // 받은 데이터 처리
    navigate(`/game/10`, { state: { gameMode: enteredMode, gameId: 10, player: ["김봉삼", "감미선"]} });
  };

  return (
    <>
      <Form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.container}>
          <h2>GAME MODE</h2>
          <GameModeSelectionList setEnteredMode={setEnteredMode} enteredMode={enteredMode}/>
          <CardButton className={styles.start} type="submit">
            START
          </CardButton>
        </div>
      </Form>

      {showGameMatching && <GameMatchingModal />}
    </>
  );
};

export default GameModeForm;
