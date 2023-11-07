import data from '../interface/gameData';

export function render() {
	if (!data.gl) return;
	// const { data.gl, data.paddle, data.ball, positionLoc} = data;
	
	data.gl.clear(data.gl.COLOR_BUFFER_BIT);

	const jump = 0.1; // delete after
	let { paddle } = data;
	const paddleVertices = new Float32Array([
	// 왼쪽 패들
		paddle.position[0], paddle.position[1] - data.paddle.height / 2.0, // 1
		paddle.position[0] + data.paddle.width / 2.0, paddle.position[1] - data.paddle.height / 2.0, // 2
		paddle.position[0], paddle.position[1] + data.paddle.height / 2.0, // 3

		paddle.position[0] + data.paddle.width / 2.0, paddle.position[1] - data.paddle.height / 2.0, // 2
		paddle.position[0], paddle.position[1] + data.paddle.height / 2.0, // 3
		paddle.position[0] + data.paddle.width / 2.0, paddle.position[1] + data.paddle.height / 2.0, // 4

	// 오른쪽 패들
		1.0 - jump, 1.0 - data.paddle.height, // 1
		1.0 - jump - data.paddle.width, 1.0 - data.paddle.height, // 2
		1.0 - jump, -1.0 + data.paddle.height, // 3

		1.0 - jump - data.paddle.width, 1.0 - data.paddle.height, // 2
		1.0 - jump, -1.0 + data.paddle.height, // 3
		1.0 - jump - data.paddle.width, -1.0 + data.paddle.height, // 4
	]);

	let { ball } = data;
	// 공의 크기와 위치
	const ballVertices = new Float32Array([
		ball.position[0] - ball.radius, ball.position[1] + ball.radius,  // 1
		ball.position[0] + ball.radius, ball.position[1] + ball.radius,  // 2
		ball.position[0] - ball.radius, ball.position[1] - ball.radius,   // 3

		ball.position[0] + ball.radius, ball.position[1] + ball.radius,  // 2
		ball.position[0] - ball.radius, ball.position[1] - ball.radius,   // 3
		ball.position[0] + ball.radius, ball.position[1] - ball.radius,    // 4
	]);

	data.gl.bufferData(data.gl.ARRAY_BUFFER, paddleVertices, data.gl.STATIC_DRAW);

	data.gl.enableVertexAttribArray(data.positionLoc);
	data.gl.vertexAttribPointer(data.positionLoc, 2, data.gl.FLOAT, false, 0, 0);
	data.gl.drawArrays(data.gl.TRIANGLES, 0, 12);

	// bufferSubData 교체 고려
	data.gl.bufferData(data.gl.ARRAY_BUFFER, ballVertices, data.gl.STATIC_DRAW);
	data.gl.drawArrays(data.gl.TRIANGLES, 0, 6);

	data.gl.enableVertexAttribArray(data.positionLoc);
	data.gl.vertexAttribPointer(data.positionLoc, 2, data.gl.FLOAT, false, 0, 0);
	data.gl.drawArrays(data.gl.TRIANGLES, 0, 6);
}

export default render;