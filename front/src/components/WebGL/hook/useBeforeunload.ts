import { useEffect } from 'react';
import data from '../interface/gameData';

const useBeforeunload = () => {
    useEffect(() => {
        const handler = (event: BeforeUnloadEvent) => {
            cancelAnimationFrame(data.requestId);
            console.log('게임 접속 종료');
        };
        window.addEventListener('beforeunload', handler);
        return () => {
            window.removeEventListener('beforeunload', handler);
        };
    }, []); // 의존성 배열에 메시지 추가
};

export default useBeforeunload;
