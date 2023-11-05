function initialize(canvasRef: React.RefObject<HTMLCanvasElement>) {
	if (canvasRef.current === null) return;
	const data: gameData = {
		paddle: {
			x: 0, // 시작 위치 X
			y: 0, // 시작 위치 Y
			width: 100, // 패들의 폭
			height: 20, // 패들의 높이
		},
		ball: {
			x: 50, // 시작 위치 X
			y: 50, // 시작 위치 Y
			radius: 10, // 공의 반지름
		},
		gl: canvasRef.current.getContext("webgl") as WebGLRenderingContext,
	};
	if (!data.gl) {
		console.error('WebGL not supported');
		return ;
	}
	data.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	return data;
}

export default initialize;