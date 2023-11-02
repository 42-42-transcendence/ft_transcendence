import React, { useEffect, useRef, useState } from 'react';
import { initWebGPU } from '../components/WebGPU/initalize';

const GamePage = () => {
    /* useRef를 사용하여 canvas DOM을 가져옴 */
    const canvasRef = useRef(null);
    /* useState를 사용하여 창의 높이를 가져옴 */
    const [height, setHeight] = useState(window.innerHeight);

    /* useEffect를 사용하여 창의 크기 변화를 감지 */
    useEffect(() => {
        /* 창의 크기가 변화할 때마다 높이를 가져옴 */
        const handleResize = () => {
            setHeight(window.innerHeight);
        };
        /* 창의 크기가 변화할 때마다 handleResize 함수를 실행 */
        window.addEventListener('resize', handleResize);
        handleResize(); // 초기 설정

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const init = async () => {
            try {
                /* initWebGPU 함수를 실행하여 WebGPU를 초기화 */
                const result = await initWebGPU(canvas);
                if (result) {
                    const { gpuDevice, gpuAdapter } = result;
                } else {
                    console.error("Failed to initialize WebGPU");
                }
            } catch (e) {
                console.error("Failed to initialize WebGPU:", e);
            }
        };

        init();
    }, []);

    return (
        <main>
            <canvas
                ref={canvasRef}
                width="600"
                height={height}
                style={{ backgroundColor: 'black', boxShadow: '0 4px 15px red' }}
            ></canvas>
        </main>
    );
};

export default GamePage;
