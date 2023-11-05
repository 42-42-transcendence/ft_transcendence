import React, { useRef, useState, useEffect } from 'react';
import useCanvasSize from '../components/WebGL/hook/useCanvasSize';
import render from '../components/WebGL/function/render';
import shader from '../components/WebGL/function/shader';
import initialize from '../components/WebGL/function/initialize';

const GamePage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState(null);
    useCanvasSize(canvasRef);
    
    useEffect(() => {
        try {
            /* webGL 초기화 */
            let data = initialize(canvasRef) as gameData;
            /* shader 세팅 */
            const positionLoc = shader(data.gl) as number;
            /* 렌더링 */
            render(data, positionLoc);
        } catch (e : any) {
            setError(e.message);
        }
    }, []);
    if (error) {
        return (
            <div style={{color:'#be0000', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column'}}>
                <h1 className="error-message" >Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <main>
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
