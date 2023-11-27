import data from '../interface/gameData';
import {Ball} from '../class/Ball';
import {Paddle} from '../class/Paddle';
import Line from '../class/Line';
import {Item} from '../class/Item';

function initializeBuffer(buffer: WebGLBuffer | null, vertices: Float32Array) {
	if (!data.gl) throw new Error('data.gl is null');
	data.gl.bindBuffer(data.gl.ARRAY_BUFFER, buffer);
	data.gl.bufferData(data.gl.ARRAY_BUFFER, vertices, data.gl.DYNAMIC_DRAW);
}

// 인스턴스 생성
const line = new Line();

function drawObject(program: WebGLProgram, buffer: WebGLBuffer, vertices: Float32Array, color: [number, number, number, number] | undefined, viewportSize?: { width: number, height: number }) {
	const gl = data.gl as WebGLRenderingContext;
	gl.useProgram(program);
	if (color !== undefined)
		gl.uniform4f(data.uColorLocation, ...color);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
	gl.vertexAttribPointer(data.positionLoc, 2, gl.FLOAT, false, 0, 0);

	if (viewportSize) {
		gl.uniform2f(data.viewPortLoc, viewportSize.width, viewportSize.height);
	}

	gl.drawArrays(gl.TRIANGLES, 0, 6);
}


function drawPaddle(paddle: Paddle) {
	paddle.calculateVertices();
	drawObject(data.program[0]!, data.paddleBuffer!, paddle.paddleVertices, [1.0, 0.0, 0.0, 1.0]);
}

function drawItem(item: Item) {
	item.calculateVertices();
	drawObject(data.program[0]!, data.ballBuffer!, item.vertices, [1.0, 0.0, 1.0, 1.0]);
}

function drawBall(ball: Ball) {
	ball.calculateVertices();
	drawObject(data.program[0]!, data.ballBuffer!, ball.vertices, [1.0, 0.0, 0.0, 1.0]);
}

function drawLine(line: Line) {
	const viewportSize = data.canvasRef ? { width: data.canvasRef.clientWidth, height: data.canvasRef.clientHeight } : undefined;
	drawObject(data.program[1]!, data.lineBuffer!, line.lineVertices, undefined, viewportSize);
}

export function render() {
	data.gl!.clear(data.gl!.COLOR_BUFFER_BIT | data.gl!.DEPTH_BUFFER_BIT);

	if (data.isFirstRender) {
		initializeBuffer(data.paddleBuffer, data.paddle[0].paddleVertices);
		initializeBuffer(data.ballBuffer, data.ball.vertices);
		initializeBuffer(data.lineBuffer, line.lineVertices);
		data.isFirstRender = false;
		return;
	}

	if (!data.program[0] || !data.ballBuffer)
		throw new Error('data.program[0] or data.ballBuffer is null');

	drawLine(line);
	drawBall(data.ball);
	drawPaddle(data.paddle[0]);
	drawPaddle(data.paddle[1]);
	for (let i = 0; i < data.items.length; i++) {
		drawItem(data.items[i]);
	}
}