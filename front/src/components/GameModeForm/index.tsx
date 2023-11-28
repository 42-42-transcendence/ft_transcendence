import { Form } from 'react-router-dom';
import styles from '../../styles/GameSelect.module.css';
import GameModeSelectionList from './GameModeSelectionList';
import CardButton from '../../UI/CardButton';
import GameMatchingModal from '../Modal/GameMatchingModal';
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import useModalState from '../../store/Modal/useModalState';
import useOpenModal from '../../store/Modal/useOpenModal';
import { useSocket } from '../../socket/SocketContext';
import { io } from 'socket.io-client';

const GameModeForm = () => {
  const showGameMatching = useModalState('showGameMatching');
  const openHandler = useOpenModal('showGameMatching'); // submit handler
  const [enteredMode, setEnteredMode] = useState<string>('normal');
  const { socket } = useSocket();

  const navigate = useNavigate();
  const handlePlayerButton = async (playerType: 'player1' | 'player2') => {

  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const socket = io('http://localhost:3001/');
    if (socket) {
      socket.emit('create', { gameMode: enteredMode });
      console.log("socket emit");
      socket.on('created', () => {
        console.log("hello world!!!!");
        // navigate(`/game/${data.gameId}`, { state: { gameMode: enteredMode, gameId: data.gameId, player: data.player } });
        });
      }

    openHandler();
    // 1초 지연 (해당 부분에서, API 요청)
    // socket.emit('create', { gameMode: enteredMode });
    console.log('1초 지연');
    await new Promise((res) => setTimeout(res, 1000));
    // 받은 데이터 처리
    navigate(`/game/10`, { state: { gameMode: enteredMode, gameId: 10, player: ["김봉삼", "감미선"]} });
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px'}}>
        <div>
          <CardButton clickHandler={() => handlePlayerButton('player1')}>
            Player 1
          </CardButton>
        </div>
        <div>
          <CardButton clickHandler={() => handlePlayerButton('player2')}>
            Player 2
          </CardButton>
        </div>
      </div>
      
      <Form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.container}>
          <h2>GAME MODE</h2>
          <GameModeSelectionList setEnteredMode={setEnteredMode} enteredMode={enteredMode}/>
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
