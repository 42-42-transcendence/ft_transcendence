import { useRef, useState, useEffect } from 'react';
import useCanvasSize from '../components/WebGL/hook/useCanvasSize';
import gameLoop from '../components/WebGL/function/gameLoop';
import shader from '../components/WebGL/function/shader';
import initialize from '../components/WebGL/function/initialize';
import usePress from '../components/WebGL/hook/usePress';
import useCloseModal from '../components/Modal/useCloseModal';

const GamePage = () => {
  const closeModal = useCloseModal();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(null);
  useCanvasSize(canvasRef);
  usePress();

  useEffect(() => {
    closeModal();
    try {
      /* webGL 초기화 */
      initialize(canvasRef);
      /* shader 세팅 */
      shader();

      /* 렌더링 */
      requestAnimationFrame(gameLoop);
      // render();
    } catch (e: any) {
      setError(e.message);
    }
  }, [closeModal]);
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
          height: '100vh',
        }}
      >
        <canvas
          ref={canvasRef}
          width="600"
          height={window.innerHeight}
          style={{ backgroundColor: 'black', boxShadow: '0 4px 15px red' }}
        ></canvas>
      </div>
    </main>
  );
};

export default GamePage;
