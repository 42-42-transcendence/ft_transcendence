import React, { useRef, useState, useEffect } from 'react';
import useCanvasSize from '../components/WebGPU/hook/useCanvasSize';

const GamePage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useCanvasSize(canvasRef);
    
    useEffect(() => {
        let gl = null;
        if (canvasRef.current === null) return;
            gl = canvasRef.current.getContext("webgl") as WebGLRenderingContext;
        if (!gl) {
            console.error('WebGL not supported');
            return ;
        }
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
	    gl.clear(gl.COLOR_BUFFER_BIT);

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

        // 패들의 크기와 위치
        const paddleWidth = 0.1;
        const paddleHight = 0.8;
        const jump = 0.1;
        const paddleVertices = new Float32Array([
        // 왼쪽 패들
        -1.0 + jump, 1.0 - paddleHight, // 1
        -1.0 + jump + paddleWidth, 1.0 - paddleHight, // 2
        -1.0 + jump, -1.0 + paddleHight, // 3

        -1.0 + jump + paddleWidth, 1.0 - paddleHight, // 2
        -1.0 + jump, -1.0 + paddleHight, // 3
        -1.0 + jump + paddleWidth, -1.0 + paddleHight, // 4

        // 오른쪽 패들
        1.0 - jump, 1.0 - paddleHight, // 1
        1.0 - jump - paddleWidth, 1.0 - paddleHight, // 2
        1.0 - jump, -1.0 + paddleHight, // 3

        1.0 - jump - paddleWidth, 1.0 - paddleHight, // 2
        1.0 - jump, -1.0 + paddleHight, // 3
        1.0 - jump - paddleWidth, -1.0 + paddleHight, // 4
        ]);

        // 공의 크기와 위치
        const ballSize = 0.03;
        const ballVertices = new Float32Array([
        -ballSize, ballSize,  // 1
        ballSize, ballSize,  // 2
        -ballSize, -ballSize,   // 3

        ballSize, ballSize,  // 2
        -ballSize, -ballSize,   // 3
        ballSize, -ballSize,    // 4
        ]);

        // 패들 버퍼 생성
        const paddleBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, paddleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, paddleVertices, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 12);

        // 공 버퍼 생성
        const ballBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ballBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, ballVertices, gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
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
