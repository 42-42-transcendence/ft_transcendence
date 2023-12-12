import { useEffect } from 'react';
import { useSocket } from "../context/SocketContext";
import data from '../interface/gameData';

const useBeforeunload = () => {
    const { socket } = useSocket();
    useEffect(() => {
        const handler = () => {
            cancelAnimationFrame(data.requestId);
            socket?.disconnect();
        };
        window.addEventListener('beforeunload', handler);
        return () => {
            window.removeEventListener('beforeunload', handler);
        };
    }, []); // 의존성 배열에 메시지 추가
};

export default useBeforeunload;
