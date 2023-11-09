import data from '../interface/gameData';
import { RefObject } from 'react';

function initialize() {
	if (data.gameCanvas === null) return;
	data.gl = data.gameCanvas.getContext('webgl');
	if (!data.gl) {
		throw new Error('WebGL not supported');
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor
	data.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/createBuffer
	// GPU에 데이터를 저장할 버퍼를 생성한다. 이때, 메모리를 따로 해제해줄 필요는 거의 없다. (자동으로 해제)
	data.paddleBuffer = data.gl.createBuffer() as WebGLBuffer;
	data.ballBuffer = data.gl.createBuffer() as WebGLBuffer;
	
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.paddleBuffer);
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.ballBuffer);
}

export default initialize;