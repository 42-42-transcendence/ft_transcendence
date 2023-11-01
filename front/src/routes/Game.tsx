import React, { useEffect, useRef } from 'react';
import { initWebGPU } from '../components/WebGPU/Canvas';

const GamePage = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const init = async () => {
            await initWebGPU(canvas);
        };

        init();
    }, []);

    return (
        <main>
            <canvas
                ref={canvasRef}
                width="600"
                height={window.innerHeight}
                style={{ backgroundColor: 'black', boxShadow: '0 4px 15px red' }}
            ></canvas>
        </main>
    );
};
export default GamePage;
