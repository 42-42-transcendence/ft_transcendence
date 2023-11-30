import {Paddle} from '../class/Paddle';
import {vec2} from 'gl-matrix';

let data: gameData = {
	paddle: [new Paddle(-0.96, 0), new Paddle(0.96, 0)],
	ball : null,
	scores: [0, 0],
	gl: null,
	paddleBuffer: null,
	ballBuffer: null,
	lineBuffer: null,
	positionLoc: 0,
	viewPortLoc: null,
	lastTime: 0,
	isFirstRender: true,
	profileRef: [null, null],
	scoreRef: [null, null],
	canvasRef: null,
	program: [null, null],
	mode: 'normal',
	uColorLocation: null,
	requestId: 0,
	AIMode: false,
};

export default data;