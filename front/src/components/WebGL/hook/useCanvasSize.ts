import { useEffect} from 'react';
import { debounce } from 'lodash'; // lodash의 debounce 함수 사용
import data from '../interface/gameData';
import { useCallback } from 'react';

function useCanvasSize() {
  const ratio = 4.0 / 3.0;

// 창 크기가 변할 때 실행될 함수
    const updateCanvasSize = useCallback(debounce(() => {
    const canvasRef = data.canvasRef;

	if (!canvasRef) return;
    canvasRef.width = window.innerWidth / 1.5;
    canvasRef.height = canvasRef.width / ratio;

    // 캔버스의 부모 요소에 대한 스타일 설정
    const canvasContainer = canvasRef.parentElement;
    if (!canvasContainer) return;
    canvasContainer.style.display = 'flex';
    canvasContainer.style.justifyContent = 'center';
    canvasContainer.style.alignItems = 'center';
    canvasContainer.style.width = '100%';
    canvasContainer.style.height = '100vh'; // 또는 `100%`로 설정할 수 있습니다.
    canvasContainer.style.fontFamily = "Roboto";

    // 캔버스에 대한 스타일 설정
    canvasRef.style.display = 'flex';
    canvasRef.style.margin = 'auto';

    for (let i = 0; i < 2; i++) {
        // 닉네임 설정
        const profileRef = data.profileRef[i] as HTMLDivElement;
        profileRef.style.top = (canvasRef.offsetTop + canvasRef.clientHeight * 0.025) + "px";
        profileRef.style.left = (i === 0 ? "35%" : "65%");
        profileRef.style.transform = "translateX(-50%)";
        profileRef.style.fontSize = canvasRef.offsetWidth * 0.03 + "px";
        profileRef.style.fontFamily = "Roboto";

        // 점수 설정
        const scoreRef = data.scoreRef[i] as HTMLDivElement;
        scoreRef.style.top = (canvasRef.offsetTop + 10) + "px";
        scoreRef.style.left = (i === 0 ? "45%" : "55%");
        scoreRef.style.transform = "translateX(-50%)";
        scoreRef.style.fontSize = canvasRef.offsetWidth * 0.07 + "px";
        scoreRef.style.fontFamily = "Roboto";
    }

    if (!data.gl) return;
    data.gl.viewport(0, 0, canvasRef.width, canvasRef.height);
    }, 10), [data.canvasRef]);

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize(); // 초기 크기 설정

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      updateCanvasSize.cancel(); // 디바운스된 함수를 취소
    };
  }, [updateCanvasSize]);

  if (!data.canvasRef) {
    return null;
  }
}

export default useCanvasSize;
