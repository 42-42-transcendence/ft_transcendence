import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../components/WebGL/interface/gameData';
import useCanvasSize from '../components/WebGL/hook/useCanvasSize';
import gameLoop from '../components/WebGL/function/gameLoop';
import shader from '../components/WebGL/function/shader';
import initialize from '../components/WebGL/function/initialize';
import usePress from "../components/WebGL/hook/usePress";
import { io } from "socket.io-client";

const GamePage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const profileRef1 = useRef<HTMLDivElement>(null);
    const scoreRef1 = useRef<HTMLDivElement>(null);
    const profileRef2 = useRef<HTMLDivElement>(null);
    const scoreRef2 = useRef<HTMLDivElement>(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useCanvasSize();
    usePress();

    useEffect(() => {
        try {
            data.canvasRef = canvasRef.current;
            data.profileRef[0] = profileRef1.current;
            data.scoreRef[0] = scoreRef1.current;
            data.profileRef[1] = profileRef2.current;
            data.scoreRef[1] = scoreRef2.current;

            // 소켓 연결 (테스트 코드)
            const socket = io('localhost:3000');
            socket.on('gameData', (data) => {
                if (data.id) {
                    navigate('/game/${data.id}');
                }
                // 클라이언트 움직임 수신 처리
                // 예: socket.on('playerMove', handlePlayerMove);
            });

            /* webGL 초기화 */
            initialize();
            /* shader 세팅 */
            shader();
            /* 렌더링 */
            requestAnimationFrame(gameLoop);
        } catch (e : any) {
            setError(e.message);
        }
    }, [navigate]);
    if (error) {
        return (
            <div style={{color:'#be0000', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'}}>
                <h1 className="error-message" >Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    const handlePlayerButton = (playerId: number) => {
        if (socket && socket.connected) {
            socket.emit('playerJoin', { playerId });
        }
    }

    return (
        <main>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                <div ref={profileRef1} style={{position: "absolute"}}> player1 </div>
                <div ref={scoreRef1} style={{position: "absolute"}}> 0 </div>
                    {/*<button onClick={() => handlePlayerButton(1)} style={{ position: 'absolute', top: '20px', left: '20px' }}>*/}
                    {/*    Join as Player 1*/}
                    {/*</button>*/}
                <canvas
                    ref={canvasRef}
                    width="600"
                    height={window.innerHeight}
                    style={{ backgroundColor: 'black', boxShadow: '0 4px 15px red' }}
                ></canvas>
                    {/*<button onClick={() => handlePlayerButton(2)} style={{ position: 'absolute', top: '20px', right: '20px' }}>*/}
                    {/*    Join as Player 2*/}
                    {/*</button>*/}
                <div ref={scoreRef2} style={{position: "absolute"}}> 0 </div>
                <div ref={profileRef2} style={{position: "absolute"}}> player2 </div>
            </div>
        </main>
    );
};

export default GamePage;
