import { useEffect } from 'react';
import { GameManager } from "../class/GameManager";
import { useSocket } from "../context/SocketContext";
import data from '../interface/gameData';

const useBeforeunload = () => {
    const { socket } = useSocket();
    useEffect(() => {
        const handler = () => {
            if (data.mode === 'AI')
                GameManager.resetGame();
            cancelAnimationFrame(data.requestId);
            socket?.disconnect();
            window.dispatchEvent(new CustomEvent('gameEnd', {}));
        };
        window.addEventListener('beforeunload', handler);
        return () => {
            window.removeEventListener('beforeunload', handler);
        };
    }, [data.requestId, socket]); // 의존성 배열에 메시지 추가
};

export default useBeforeunload;
