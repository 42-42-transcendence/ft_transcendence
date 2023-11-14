import data from '../interface/gameData';
import { RefObject } from 'react';

function initialize() {
	if (data.canvasRef === null) return;
	data.gl = data.canvasRef.getContext('webgl');
	if (!data.gl) {
		throw new Error('WebGL not supported');
	}

	data.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	data.paddleBuffer = data.gl.createBuffer() as WebGLBuffer;
	data.ballBuffer = data.gl.createBuffer() as WebGLBuffer;
	data.lineBuffer = data.gl.createBuffer() as WebGLBuffer;
}

export default initialize;