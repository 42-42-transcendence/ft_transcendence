import { useEffect } from 'react';
import data from '../interface/gameData';
import {GameManager} from "../class/GameManager";

const handler = () => {
    cancelAnimationFrame(data.requestId);
    GameManager.cleanupWebGL();
    data.isFirstRender = true;
};

const usePopstate = () => {
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