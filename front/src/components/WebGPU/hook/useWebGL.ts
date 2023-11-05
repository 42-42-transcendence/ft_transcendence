import { useState, useEffect, RefObject } from 'react';
import { initWebGL } from '../initialize';

// HTMLCanvasElement의 속성들을 정의한 interface를 상속받은 interface
const useWebGPU = (canvasRef: RefObject<HTMLCanvasElement>) => {
	// 요소들 null로 초기화
	const [gl, setWebGL] = useState<WebGLRenderingContext>();
	// 해당 error는 Game.tsx에서 사용
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const init = async () => {
			try {
				if (!canvasRef.current) {
					throw new Error('Canvas not found');
				}
				setWebGL(await initWebGL(canvasRef.current));
			} catch (e: unknown) {
				setError('Failed to initialize WebGL: ' + (e as Error).message);
			}
		};
		init();
	}, [canvasRef.current]);

	return { gl, error };
}

export default useWebGPU;
