import data from '../interface/gameData';
import {Paddle} from '../class/Paddle';
import {vec2} from 'gl-matrix';
import {Ball} from '../class/Ball';

function initialize(state: any) {
	if (data.canvasRef === null) return;
	data.gl = data.canvasRef.getContext('webgl');
	if (!data.gl) {
		throw new Error('WebGL not supported');
	}

	data.gl.clearColor(0.0, 0.0, 0.0, 1.0);

	data.paddleBuffer = data.gl.createBuffer() as WebGLBuffer;
	data.ballBuffer = data.gl.createBuffer() as WebGLBuffer;
	data.lineBuffer = data.gl.createBuffer() as WebGLBuffer;

	data.scores = [0, 0];
	data.paddle = [new Paddle(-0.96, 0), new Paddle(0.96, 0)];
	if (data.profileRef[0] && data.profileRef[1] && state && state.player) {
		data.profileRef[0].innerHTML = state.player[0];
		data.profileRef[1].innerHTML = state.player[1];
		data.mode = state.gameMode;
	}

	data.lastTime = performance.now();

	data.ball = new Ball(vec2.fromValues(0, 0), vec2.fromValues(1.0, 0), 2.0, 0.02);
	if (state.gameMode === 'fast') {
		data.ball.velocity = 3.0;
		data.paddle[0].speed = 1.5;
		data.paddle[1].speed = 1.5;
	} else if (state.gameMode === 'object') {
		data.ball.velocity = 1.5;
		data.paddle[0].speed = 1.0;
		data.paddle[1].speed = 1.0;
	}
}

export default initialize;