import data from '../interface/gameData';
import {ItemManager} from "../class/ItemManager";
import {Paddle} from '../class/Paddle';
import {vec2} from 'gl-matrix';
import {Ball} from '../class/Ball';
import {Item} from "../class/Item";

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
	if (data.profileRef[0] && data.profileRef[1] && state.data && state.data.playerID) {
		data.profileRef[0].innerHTML = state.data.playerID[0];
		data.profileRef[1].innerHTML = state.data.playerID[1];
		data.mode = state.data.mode;
	}

	data.lastTime = performance.now();
	data.endGame = false;

	data.ball = new Ball(vec2.fromValues(0, 0), vec2.fromValues(1.0, 0), 2.0, 0.02);
	if (state.data.mode !== 'object') {
		data.ball.velocity = 3.0;
		data.paddle[0].speed = 1.5;
		data.paddle[1].speed = 1.5;
	} else {
		data.ball.velocity = 1.5;
		data.paddle[0].speed = 1.0;
		data.paddle[1].speed = 1.0;
	}

	if (data.mode !== 'AI') {
		for (let i = 0; i < 5; i++) {
			const position = vec2.fromValues(0.0, 0.0);
			const direction = vec2.fromValues(1.0, 0.0);
			const velocity = 1.0;
			const radius = 0.01;

			const newItem = new Item(position, direction, velocity, radius);
			ItemManager.getInstance().items.push(newItem);
		}
	}
}

export default initialize;