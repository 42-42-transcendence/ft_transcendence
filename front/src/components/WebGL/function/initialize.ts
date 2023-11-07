import data from '../interface/gameData';

function initialize(canvasRef: React.RefObject<HTMLCanvasElement>) {
	if (canvasRef.current === null) return;
	data.gl = canvasRef.current.getContext('webgl');
	if (!data.gl) {
		throw new Error('WebGL not supported');
	}
	data.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	data.paddleBuffer = data.gl.createBuffer() as WebGLBuffer;
	data.ballBuffer = data.gl.createBuffer() as WebGLBuffer;
	
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.paddleBuffer);
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.ballBuffer);
}

export default initialize;