import { useRef, useState, useEffect } from 'react';
import data from '../components/WebGL/interface/gameData';
import useCanvasSize from '../components/WebGL/hook/useCanvasSize';
import gameLoop from '../components/WebGL/function/gameLoop';
import shader from '../components/WebGL/function/shader';
import initialize from '../components/WebGL/function/initialize';
import usePress from '../components/WebGL/hook/usePress';
import { useParams, useLocation } from 'react-router-dom';
import usePopstate from '../components/WebGL/hook/usePopstate';
import useBeforeunload from '../components/WebGL/hook/useBeforeunload';
import GameResultModal from '../components/Modal/GameResultModal';
import useGameEvent from '../components/WebGL/hook/useGameEvent';

const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const profileRef1 = useRef<HTMLDivElement>(null);
  const scoreRef1 = useRef<HTMLDivElement>(null);
  const profileRef2 = useRef<HTMLDivElement>(null);
  const scoreRef2 = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(null);
  const { gameId } = useParams();
  const { state } = useLocation();
  const gameResult = useGameEvent();
  useBeforeunload();
  usePopstate();
  useCanvasSize();
  usePress();

  let socket: any = null;
  useEffect(() => {
    try {
      data.canvasRef = canvasRef.current;
      data.profileRef[0] = profileRef1.current;
      data.scoreRef[0] = scoreRef1.current;
      data.profileRef[1] = profileRef2.current;
      data.scoreRef[1] = scoreRef2.current;

      /* webGL 초기화 */
      initialize(state);
      /* shader 세팅 */
      shader();
      /* 렌더링 */
      data.requestId = requestAnimationFrame(gameLoop);
    } catch (e: any) {
      setError(e.message);
    }
    return () => {
      if (socket && socket.connected) {
        socket.disconnect();
      }
    };
  }, []);
  if (error) {
    return (
      <div
        style={{
          color: '#be0000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <h1 className="error-message">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <div ref={profileRef1} style={{ position: 'absolute' }}>
          {' '}
          player1{' '}
        </div>
        <div ref={scoreRef1} style={{ position: 'absolute' }}>
          {' '}
          0{' '}
        </div>
        <canvas
          ref={canvasRef}
          width="600"
          height={window.innerHeight}
          style={{ backgroundColor: 'black', boxShadow: '0 4px 15px red' }}
        ></canvas>
        <div ref={scoreRef2} style={{ position: 'absolute' }}>
          {' '}
          0{' '}
        </div>
        <div ref={profileRef2} style={{ position: 'absolute' }}>
          {' '}
          player2{' '}
        </div>
        {gameResult && (
          <GameResultModal result={gameResult as 'win' | 'lost'} />
        )}
      </div>
    </main>
  );
};

export default GamePage;
