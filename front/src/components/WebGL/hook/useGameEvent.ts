import { useEffect, useState } from 'react';
import data from '../interface/gameData';
import {GameManager} from "../class/GameManager";
import { useSocket } from '../context/SocketContext';
const useGameEvent = () => {
    const [gameResult, setGameResult] = useState('');
    const { socket } = useSocket();

    useEffect(() => {
        const handleGameEnd = () => {
            if (data.scores[0] === 5)
                setGameResult('win');
            else
                setGameResult('lose');
            data.endGame = true;
            GameManager.cleanupWebGL();
            socket?.disconnect();
            data.isFirstRender = true;
        };
        window.addEventListener('gameEnd', handleGameEnd);
        return () => {
            window.removeEventListener('gameEnd', handleGameEnd);
        };
    }, [socket]);
    return gameResult;
};

export default useGameEvent;