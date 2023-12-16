import { useEffect, useState } from 'react';
import data from '../interface/gameData';
import {GameManager} from "../class/GameManager";
import { useSocket } from '../context/SocketContext';
import useUserState from "../../../store/User/useUserState";
const useGameEvent = () => {
    const [gameResult, setGameResult] = useState('');
    const { socket } = useSocket();
    const userState = useUserState();

    useEffect(() => {
        const handleGameEnd = () => {
            if (data.winner === userState.id)
                setGameResult('win');
            else
                setGameResult('lost');
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