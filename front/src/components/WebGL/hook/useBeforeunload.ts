import { useEffect } from 'react';
import { GameManager } from "../class/GameManager";
import data from '../interface/gameData';

const useBeforeunload = () => {
    useEffect(() => {
        const handler = () => {
            if (data.mode === 'AI') {
                GameManager.resetGame();
            } else {
                window.dispatchEvent(new CustomEvent('gameEnd', {}));
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => {
            window.removeEventListener('beforeunload', handler);
        };
    }, [data.requestId]); // 의존성 배열에 메시지 추가
};

export default useBeforeunload;
