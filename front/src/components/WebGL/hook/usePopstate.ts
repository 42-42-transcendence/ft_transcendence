import { useEffect } from 'react';
import data from '../interface/gameData';
import {GameManager} from "../class/GameManager";
import { useSocket } from '../context/SocketContext';

const usePopstate = () => {
    const { socket } = useSocket();

    const handler = () => {
        cancelAnimationFrame(data.requestId);
        GameManager.cleanupWebGL();
        data.isFirstRender = true;
        socket?.disconnect();
    };

    useEffect(() => {
        window.addEventListener('popstate', handler);
        return () => {
            setTimeout(() => {
                window.removeEventListener('popstate', handler);
            }, 500);
        };
    }, []);
};

export default usePopstate;
