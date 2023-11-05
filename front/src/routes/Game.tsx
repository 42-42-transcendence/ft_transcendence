import React, { useRef, useState, useEffect } from 'react';
import useCanvasSize from '../components/WebGL/hook/useCanvasSize';
import render from '../components/WebGL/function/render';
import shader from '../components/WebGL/function/shader';

const GamePage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useCanvasSize(canvasRef);
    
    useEffect(() => {
        if (canvasRef.current === null) return;
        const data: gameData = {
            paddle: {
                x: 0, // 시작 위치 X
                y: 0, // 시작 위치 Y
                width: 100, // 패들의 폭
                height: 20, // 패들의 높이
            },
            ball: {
                x: 50, // 시작 위치 X
                y: 50, // 시작 위치 Y
                radius: 10, // 공의 반지름
            },
            gl: canvasRef.current.getContext("webgl") as WebGLRenderingContext,
        };
        let gl = data.gl;
        if (!gl) {
            console.error('WebGL not supported');
            return ;
        }
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        const positionLoc = shader(gl) as number;
        if (positionLoc === -1) {
            console.error('Shader error');
            return ;
        }
        render(data, positionLoc);
    }, []);

    return (
        <main>
            {/* {error && <p className="error-message">{error}</p>} */}
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
