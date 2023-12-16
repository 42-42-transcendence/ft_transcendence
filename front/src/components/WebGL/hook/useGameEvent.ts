import { useEffect, useState } from 'react';
import data from '../interface/gameData';
import {GameManager} from "../class/GameManager";
import { useSocket } from '../context/SocketContext';
const useGameEvent = () => {
    const [gameResult, setGameResult] = useState('');
    const { socket } = useSocket();

    useEffect(() => {
        const handleGameEnd = () => {
            setGameResult(data.matchResult);
            data.endGame = true;
        };
        window.addEventListener('gameEnd', handleGameEnd);
        return () => {
            window.removeEventListener('gameEnd', handleGameEnd);
        };
    }, [socket]);
    return gameResult;
};

export default useGameEvent;