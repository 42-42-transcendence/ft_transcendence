import { useCallback, useEffect } from 'react';
import data from '../interface/gameData';
import {GameManager} from "../class/GameManager";
import { useSocket } from '../context/SocketContext';
import useRequest from "../../../http/useRequest";
import {SERVER_URL} from "../../../App";

const usePopstate = () => {
    const { request } = useRequest();
    const { socket } = useSocket();
    const sendEndGameRequest = useCallback(async () => {
        await request(`${SERVER_URL}/api/game/exitGame`, {
            method: 'POST',
        });
    }, [socket, request]);

    const handler = () => {
        if (data.mode === 'AI')
            sendEndGameRequest();
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
    }, [socket, sendEndGameRequest]);
};

export default usePopstate;
