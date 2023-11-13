import data from '../interface/gameData';
import usePress from "../hook/usePress";

export function render() {
	if (!data.gl) return;
	
	data.gl.clear(data.gl.COLOR_BUFFER_BIT | data.gl.DEPTH_BUFFER_BIT);

	let { paddle } = data;
	const paddleVertices = new Float32Array([
	// 왼쪽 패들
		paddle[0].position[0], paddle[0].position[1] - data.paddle[0].height / 2.0, // 1
		paddle[0].position[0] + data.paddle[0].width / 2.0, paddle[0].position[1] - data.paddle[0].height / 2.0, // 2
		paddle[0].position[0], paddle[0].position[1] + data.paddle[0].height / 2.0, // 3

		paddle[0].position[0] + data.paddle[0].width / 2.0, paddle[0].position[1] - data.paddle[0].height / 2.0, // 2
		paddle[0].position[0], paddle[0].position[1] + data.paddle[0].height / 2.0, // 3
		paddle[0].position[0] + data.paddle[0].width / 2.0, paddle[0].position[1] + data.paddle[0].height / 2.0, // 4

	// 오른쪽 패들
		paddle[1].position[0], paddle[1].position[1] + data.paddle[1].height / 2.0, // 1
		paddle[1].position[0] - data.paddle[1].width / 2.0, paddle[1].position[1] + data.paddle[1].height / 2.0, // 2
		paddle[1].position[0], paddle[1].position[1] - data.paddle[1].height / 2.0, // 3

		paddle[1].position[0] - data.paddle[0].width / 2.0, paddle[1].position[1] + data.paddle[1].height / 2.0, // 2
		paddle[1].position[0], paddle[1].position[1] - data.paddle[1].height / 2.0, // 3
		paddle[1].position[0] - data.paddle[1].width / 2.0, paddle[1].position[1] - data.paddle[1].height / 2.0, // 4
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
	// 경계선
	const lineSize = 0.04;
	const lineVertices = new Float32Array([
		-lineSize, 1,
		lineSize, 1,
		-lineSize, -1,

		lineSize, 1,
		-lineSize, -1,
		lineSize, -1,
	]);

	if (data.isFirstRender) {
		data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.paddleBuffer);
		data.gl.bufferData(data.gl.ARRAY_BUFFER, paddleVertices, data.gl.DYNAMIC_DRAW);

		data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.ballBuffer);
		data.gl.bufferData(data.gl.ARRAY_BUFFER, ballVertices, data.gl.DYNAMIC_DRAW);

		data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.lineBuffer);
		data.gl.bufferData(data.gl.ARRAY_BUFFER, lineVertices, data.gl.STATIC_DRAW);

		data.isFirstRender = false;
		return ;
	}
	data.gl.useProgram(data.program[1]);
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.lineBuffer);
	data.gl.bufferSubData(data.gl.ARRAY_BUFFER, 0, lineVertices);
	data.gl.vertexAttribPointer(data.positionLoc, 2, data.gl.FLOAT, false, 0, 0);
	if (data.canvasRef)
		data.gl.uniform2f(data.viewPortLoc, data.canvasRef.clientWidth, data.canvasRef.clientHeight);
	data.gl.drawArrays(data.gl.TRIANGLES, 0, 6);

	data.gl.useProgram(data.program[0]);
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.paddleBuffer);
	data.gl.bufferSubData(data.gl.ARRAY_BUFFER, 0, paddleVertices);
	data.gl.vertexAttribPointer(data.positionLoc, 2, data.gl.FLOAT, false, 0, 0);
	data.gl.drawArrays(data.gl.TRIANGLES, 0, 12);

	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.ballBuffer);
	data.gl.bufferSubData(data.gl.ARRAY_BUFFER, 0, ballVertices);
	data.gl.vertexAttribPointer(data.positionLoc, 2, data.gl.FLOAT, false, 0, 0);
	data.gl.drawArrays(data.gl.TRIANGLES, 0, 6);
}
export default render;