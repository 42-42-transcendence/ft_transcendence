import { vec2 } from 'gl-matrix';

let data: gameData = {
	paddle: [
		{
			position: vec2.fromValues(-0.96, 0),
			paddleSpeed: 2.0,
			width: 0.1, // 패들의 폭
			height: 0.5, // 패들의 높이
		},
		{
			position: vec2.fromValues(0.96, 0),
			paddleSpeed: 2.0,
			width: 0.1, // 패들의 폭
			height: 1.5, // 패들의 높이
		},
	],
	ball: {
		position: vec2.fromValues(0, 0),
		direction: vec2.fromValues(1.0, 0),
		velocity: 2.0,
		radius: 0.02, // 공의 반지름
	},
	keyPress: {
		up: false,
		down: false,
	},
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
	socket: null,
	program: [null, null],
};

export default data;