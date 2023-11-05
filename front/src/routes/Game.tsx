import React, { useRef, useState, useEffect } from 'react';
import useCanvasSize from '../components/WebGL/hook/useCanvasSize';
import render from '../components/WebGL/function/render';

const GamePage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useCanvasSize(canvasRef);
    
    useEffect(() => {
        let gl = null;
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
        gl = data.gl;
        if (!gl) {
            console.error('WebGL not supported');
            return ;
        }
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        const vsGLSL = `
            attribute vec4 aVertexPosition;

            void main(void) {
                gl_Position = aVertexPosition;
            }
        `;
        const fsGLSL = `
            precision highp float;

            void main(void) {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `;
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertexShader) {
            console.error('ERROR creating vertex shader!');
            return ;
        }
        gl.shaderSource(vertexShader, vsGLSL);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
            return ;
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragmentShader) {
            console.error('ERROR creating fragment shader!');
            return ;
        }
        gl.shaderSource(fragmentShader, fsGLSL);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
            return ;
        }

        const shaderProgram = gl.createProgram();
        if (!shaderProgram) {
            console.error('ERROR creating shader program!');
            return ;
        }
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
            return ;
        }

        gl.detachShader(shaderProgram, vertexShader);
        gl.deleteShader(vertexShader);
        gl.detachShader(shaderProgram, fragmentShader);
        gl.deleteShader(fragmentShader);

        const positionLoc = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        gl.useProgram(shaderProgram);

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
