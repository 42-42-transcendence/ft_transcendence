export function render({ paddle, ball, gl } : gameData, positionLoc : number) {
	gl.clear(gl.COLOR_BUFFER_BIT);

	/* 버퍼 사용 비효율 개선 필요 */

	// 패들의 크기와 위치
	const paddleWidth = 0.1;
	const paddleHeight = 0.8;
	const jump = 0.1;
	const paddleVertices = new Float32Array([
	// 왼쪽 패들
		-1.0 + jump, 1.0 - paddleHeight, // 1
		-1.0 + jump + paddleWidth, 1.0 - paddleHeight, // 2
		-1.0 + jump, -1.0 + paddleHeight, // 3

		-1.0 + jump + paddleWidth, 1.0 - paddleHeight, // 2
		-1.0 + jump, -1.0 + paddleHeight, // 3
		-1.0 + jump + paddleWidth, -1.0 + paddleHeight, // 4

	// 오른쪽 패들
		1.0 - jump, 1.0 - paddleHeight, // 1
		1.0 - jump - paddleWidth, 1.0 - paddleHeight, // 2
		1.0 - jump, -1.0 + paddleHeight, // 3

		1.0 - jump - paddleWidth, 1.0 - paddleHeight, // 2
		1.0 - jump, -1.0 + paddleHeight, // 3
		1.0 - jump - paddleWidth, -1.0 + paddleHeight, // 4
	]);

	// 공의 크기와 위치
	const ballSize = 0.03;
	const ballVertices = new Float32Array([
		-ballSize, ballSize,  // 1
		ballSize, ballSize,  // 2
		-ballSize, -ballSize,   // 3

		ballSize, ballSize,  // 2
		-ballSize, -ballSize,   // 3
		ballSize, -ballSize,    // 4
	]);

	// 패들 버퍼 생성
	const paddleBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, paddleBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, paddleVertices, gl.STATIC_DRAW);

	gl.enableVertexAttribArray(positionLoc);
	gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 12);

	// 공 버퍼 생성
	const ballBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, ballBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, ballVertices, gl.STATIC_DRAW);
	gl.drawArrays(gl.TRIANGLES, 0, 6);

	gl.enableVertexAttribArray(positionLoc);
	gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export default render;