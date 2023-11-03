import { useState, useEffect, RefObject } from 'react';
import { initWebGPU } from '../initialize';

// HTMLCanvasElement의 속성들을 정의한 interface를 상속받은 interface
const useWebGPU = (canvasRef: RefObject<HTMLCanvasElement>) => {
	// 요소들 null로 초기화
	const [webGPU, setWebGPU] = useState<webGPU>();
	// 해당 error는 Game.tsx에서 사용
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const init = async () => {
			try {
				if (!canvasRef.current) {
					throw new Error('Canvas not found');
				}
				const result = await initWebGPU(canvasRef.current);
				if (result?.gpuDevice && result?.gpuAdapter) {
					setWebGPU({ gpuDevice: result.gpuDevice, gpuAdapter: result.gpuAdapter });
				} else {
					throw new Error();
				}
			} catch (e: unknown) {
				setError('Failed to initialize WebGPU: ' + (e as Error).message);
			}
		};

		init();
	}, [canvasRef]);

	return { webGPU, error };
}

export default useWebGPU;
