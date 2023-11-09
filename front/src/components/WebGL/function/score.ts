import data from '../interface/gameData';
import {RefObject} from 'react';

export function scoreInit() {
    data.textCanvas = document.createElement('canvas');
    const textContext = data.textCanvas.getContext('2d') as CanvasRenderingContext2D;

    if (!data.textCanvas || !data.gameCanvas) return;
    data.textCanvas.width = data.gameCanvas.width; // 캔버스의 너비
    data.textCanvas.height = data.gameCanvas.height; // 캔버스의 높이

    textContext.fillStyle = '#FFF'; // 텍스트 색상
    textContext.font = '30px Arial'; // 텍스트 폰트 설정
    textContext.fillText('Hello, WebGL!', 0, 40); // 텍스트 렌더링

    if (!data.gl) return;
    const textTexture = data.gl.createTexture();
    data.gl.bindTexture(data.gl.TEXTURE_2D, textTexture);
    // 옵션 의미 : https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
    data.gl.texImage2D(data.gl.TEXTURE_2D, 0, data.gl.RGBA, data.gl.RGBA, data.gl.UNSIGNED_BYTE, data.textCanvas);

    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
    data.gl.texParameteri(data.gl.TEXTURE_2D, data.gl.TEXTURE_WRAP_S, data.gl.CLAMP_TO_EDGE);
    data.gl.texParameteri(data.gl.TEXTURE_2D, data.gl.TEXTURE_WRAP_T, data.gl.CLAMP_TO_EDGE);
    data.gl.texParameteri(data.gl.TEXTURE_2D, data.gl.TEXTURE_MIN_FILTER, data.gl.LINEAR);
    data.gl.texParameteri(data.gl.TEXTURE_2D, data.gl.TEXTURE_MAG_FILTER, data.gl.LINEAR);
}
export function scoreRender() {
    if (!data.gl) return;
    data.gl.drawArrays(data.gl.TRIANGLES, 0, 6); // 2개의 삼각형(쿼드)를 그립니다.
}

export function scoreUpdate() {

}
