import { useEffect, RefObject } from 'react';
import { debounce } from 'lodash'; // lodash의 debounce 함수 사용
import data from '../interface/gameData';

function useCanvasSize() {
  const ratio = 4.0 / 3.0;

// 창 크기가 변할 때 실행될 함수
const updateCanvasSize = debounce(() => {
    const canvasRef = data.canvasRef;
    const profileRef = data.profileRef;

	if (!canvasRef) return;
    canvasRef.width = window.innerWidth / 1.5;
    canvasRef.height = canvasRef.width / ratio;

    // 캔버스의 부모 요소에 대한 스타일 설정
    const canvasContainer = canvasRef.parentElement as HTMLDivElement;
    canvasContainer.style.display = 'flex';
    canvasContainer.style.justifyContent = 'center';
    canvasContainer.style.alignItems = 'center';
    canvasContainer.style.width = '100%';
    canvasContainer.style.height = '100vh'; // 또는 `100%`로 설정할 수 있습니다.
    canvasContainer.style.fontFamily = "Roboto";

// 캔버스에 대한 스타일 설정
    canvasRef.style.display = 'flex';
    canvasRef.style.margin = 'auto';
//
    /* player1 프로필 설정 */
    // 닉네임 설정
    if (!profileRef[0]) return;
    profileRef[0].style.top = (canvasRef.offsetTop + canvasRef.clientHeight * 0.025) + "px";
    profileRef[0].style.left = "35%";
    profileRef[0].style.transform = "translateX(-50%)";
    profileRef[0].style.fontSize = canvasRef.offsetWidth * 0.03 + "px";
    // 점수 설정
    if (!data.scoreRef[0]) return;
    data.scoreRef[0].style.top = (canvasRef.offsetTop + 10) + "px";
    data.scoreRef[0].style.left = "45%";
    data.scoreRef[0].style.transform = "translateX(-50%)";
    data.scoreRef[0].style.fontSize = canvasRef.offsetWidth * 0.07 + "px";

    /* player2 프로필 설정 */
    // 닉네임 설정
    if (!profileRef[1]) return;
    profileRef[1].style.top = (canvasRef.offsetTop + canvasRef.clientHeight * 0.025) + "px";
    profileRef[1].style.left = "65%";
    profileRef[1].style.transform = "translateX(-50%)";
    profileRef[1].style.fontSize = canvasRef.offsetWidth * 0.03 + "px";
    // 점수 설정
    if (!data.scoreRef[1]) return;
    data.scoreRef[1].style.top = (canvasRef.offsetTop + 10) + "px";
    data.scoreRef[1].style.left = "55%";
    data.scoreRef[1].style.transform = "translateX(-50%)";
    // data.scoreRef[1].style.left = (canvasRef.offsetLeft + canvasRef.clientWidth * 0.55) + "px";
    data.scoreRef[1].style.fontSize = canvasRef.offsetWidth * 0.07 + "px";

    if (!data.gl) return;
    data.gl.viewport(0, 0, canvasRef.width, canvasRef.height);
}, 10); // 디바운스

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize(); // 초기 크기 설정http://localhost:3000/game/1

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
