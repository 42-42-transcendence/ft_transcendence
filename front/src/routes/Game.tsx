import React, { useRef, useState, useEffect } from 'react';
import useWebGPU from '../components/WebGPU/hook/useWebGPU';
import useCanvasSize from '../components/WebGPU/hook/useCanvasSize';
import webgpuStart from '../components/WebGPU/webGPU';

const GamePage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { webGPU, error } = useWebGPU(canvasRef);
    useCanvasSize(canvasRef);
    if (!error && webGPU && canvasRef.current) {
        const canvasSize = { width: canvasRef.current.width, height: canvasRef.current.height };
        webgpuStart(webGPU, canvasSize);
    }
    return (
        <main>
            {error && <p className="error-message">{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <canvas
                    ref={canvasRef}
                    width="600"
                    height={window.innerHeight}
                    style={{ backgroundColor: 'black', boxShadow: '0 4px 15px red' }}
                ></canvas>
            </div>
        </main>
    );
};

export default GamePage;
