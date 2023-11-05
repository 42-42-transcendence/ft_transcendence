function initialize(canvasRef: React.RefObject<HTMLCanvasElement>) {
	if (canvasRef.current === null) return;
	const data: gameData = {
		paddle: {
			x: 0, // 시작 위치 X
			y: 0, // 시작 위치 Y
			width: 0.1, // 패들의 폭
			height: 0.7, // 패들의 높이
		},
		ball: {
			x: 0, // 시작 위치 X
			y: 0, // 시작 위치 Y
			radius: 0.03, // 공의 반지름
		},
		gl: canvasRef.current.getContext("webgl") as WebGLRenderingContext,
		paddleBuffer: null,
		ballBuffer: null,
	};
	if (!data.gl) {
		console.error('WebGL not supported');
		return ;
	}
	data.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	data.paddleBuffer = data.gl.createBuffer() as WebGLBuffer;
	data.ballBuffer = data.gl.createBuffer() as WebGLBuffer;
	
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.paddleBuffer);
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.ballBuffer);

	return data;
}

export default initialize;