import { useEffect, useState } from 'react';
import data from '../interface/gameData';
import {GameManager} from "../class/GameManager";
const useGameEvent = () => {
    const [gameResult, setGameResult] = useState('');

    useEffect(() => {
        const handleGameEnd = () => {
            console.log('종료 이벤트 감지');
            if (data.scores[0] === 5)
                setGameResult('win');
            else
                setGameResult('lose');
            data.endGame = true;
            GameManager.cleanupWebGL();
            data.isFirstRender = true;
        };
        window.addEventListener('gameEnd', handleGameEnd);
        return () => {
            window.removeEventListener('gameEnd', handleGameEnd);
        };
    }, []);
    return gameResult;
};

export default useGameEvent;