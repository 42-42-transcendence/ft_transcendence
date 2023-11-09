import { vec2 } from 'gl-matrix';

let data: gameData = {
	paddle: [
		{
			position: vec2.fromValues(-0.95, 0),
			paddleSpeed: 2.0,
			width: 0.1, // 패들의 폭
			height: 1.5, // 패들의 높이
		},
		{
			position: vec2.fromValues(0.95, 0),
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
	positionLoc: 0,
	lastTime: 0,
	isFirstRender: true,
	textCanvas: null,
	gameCanvas: null,
};

export default data;