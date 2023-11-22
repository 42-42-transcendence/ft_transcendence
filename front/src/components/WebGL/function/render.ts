import data from '../interface/gameData';
import {Ball} from '../class/Ball';
import {Paddle} from '../class/Paddle';
import Line from '../class/Line';

function initializeBuffer(buffer: WebGLBuffer | null, vertices: Float32Array) {
	if (!data.gl) throw new Error('data.gl is null');
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, buffer);
	data.gl.bufferData(data.gl.ARRAY_BUFFER, vertices, data.gl.DYNAMIC_DRAW);
}

// 인스턴스 생성
const line = new Line();

function drawPaddle(paddle: Paddle) {
	paddle.calculateVertices();
	if (!data.gl) throw new Error('data.gl is null');
	data.gl.useProgram(data.program[0]);
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.paddleBuffer);
	data.gl.bufferSubData(data.gl.ARRAY_BUFFER, 0, paddle.paddleVertices);
	data.gl.vertexAttribPointer(data.positionLoc, 2, data.gl.FLOAT, false, 0, 0);
	data.gl.drawArrays(data.gl.TRIANGLES, 0, 6);
}

function drawBall(ball: Ball) {
	ball.calculateVertices();
	if (!data.gl) throw new Error('data.gl is null');
	data.gl.useProgram(data.program[0]);
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.ballBuffer);
	data.gl.bufferSubData(data.gl.ARRAY_BUFFER, 0, ball.ballVertices);
	data.gl.vertexAttribPointer(data.positionLoc, 2, data.gl.FLOAT, false, 0, 0);
	data.gl.drawArrays(data.gl.TRIANGLES, 0, 6);
}

function drawLine(line: Line) {
	if (!data.gl) throw new Error('data.gl is null');
	data.gl.useProgram(data.program[1]);
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, data.lineBuffer);
	data.gl.bufferSubData(data.gl.ARRAY_BUFFER, 0, line.lineVertices);
	data.gl.vertexAttribPointer(data.positionLoc, 2, data.gl.FLOAT, false, 0, 0);
	if (data.canvasRef) {
		data.gl.uniform2f(data.viewPortLoc, data.canvasRef.clientWidth, data.canvasRef.clientHeight);
	}
	data.gl.drawArrays(data.gl.TRIANGLES, 0, 6);
}

export function render() {
	if (!data.gl) return;

	data.gl.clear(data.gl.COLOR_BUFFER_BIT | data.gl.DEPTH_BUFFER_BIT);

	if (data.isFirstRender) {
		initializeBuffer(data.paddleBuffer, data.paddle[0].paddleVertices);
		initializeBuffer(data.ballBuffer, data.ball.ballVertices);
		initializeBuffer(data.lineBuffer, line.lineVertices);

		data.isFirstRender = false;
		return;
	}

	drawLine(line);
	drawBall(data.ball);
	drawPaddle(data.paddle[0]);
	drawPaddle(data.paddle[1]);
}
