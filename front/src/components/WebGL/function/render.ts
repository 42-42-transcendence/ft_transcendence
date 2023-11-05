export function render({ paddle, ball, gl, paddleBuffer, ballBuffer} : gameData, positionLoc : number) {
	gl.clear(gl.COLOR_BUFFER_BIT);

	const jump = 0.1;
	const paddleVertices = new Float32Array([
	// 왼쪽 패들
		-1.0 + jump, 1.0 - paddle.height, // 1
		-1.0 + jump + paddle.width, 1.0 - paddle.height, // 2
		-1.0 + jump, -1.0 + paddle.height, // 3

		-1.0 + jump + paddle.width, 1.0 - paddle.height, // 2
		-1.0 + jump, -1.0 + paddle.height, // 3
		-1.0 + jump + paddle.width, -1.0 + paddle.height, // 4

	// 오른쪽 패들
		1.0 - jump, 1.0 - paddle.height, // 1
		1.0 - jump - paddle.width, 1.0 - paddle.height, // 2
		1.0 - jump, -1.0 + paddle.height, // 3

		1.0 - jump - paddle.width, 1.0 - paddle.height, // 2
		1.0 - jump, -1.0 + paddle.height, // 3
		1.0 - jump - paddle.width, -1.0 + paddle.height, // 4
	]);

	// 공의 크기와 위치
	const ballVertices = new Float32Array([
		-ball.radius, ball.radius,  // 1
		ball.radius, ball.radius,  // 2
		-ball.radius, -ball.radius,   // 3

		ball.radius, ball.radius,  // 2
		-ball.radius, -ball.radius,   // 3
		ball.radius, -ball.radius,    // 4
	]);

	gl.bufferData(gl.ARRAY_BUFFER, paddleVertices, gl.STATIC_DRAW);

	gl.enableVertexAttribArray(positionLoc);
	gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 12);

	// bufferSubData 교체 고려
	gl.bufferData(gl.ARRAY_BUFFER, ballVertices, gl.STATIC_DRAW);
	gl.drawArrays(gl.TRIANGLES, 0, 6);

	gl.enableVertexAttribArray(positionLoc);
	gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export default render;