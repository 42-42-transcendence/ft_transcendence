import { useEffect, RefObject } from 'react';
import { debounce } from 'lodash'; // lodash의 debounce 함수 사용
import data from '../interface/gameData';

function useCanvasSize(canvasRef : RefObject<HTMLCanvasElement>) {
  const ratio = 4.0 / 3.0;

// 창 크기가 변할 때 실행될 함수
const updateCanvasSize = debounce(() => {
	if (canvasRef.current) {
    canvasRef.current.width = window.innerWidth / 1.5;
    canvasRef.current.height = canvasRef.current.width / ratio;

    if (!data.gl) return;
    data.gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
	}
}, 10); // 디바운스

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize(); // 초기 크기 설정

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      updateCanvasSize.cancel(); // 디바운스된 함수를 취소
    };
  }, [updateCanvasSize]);

  if (!canvasRef.current) {
    return null;
  }
}

export default useCanvasSize;