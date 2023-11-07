import { vec2 } from 'gl-matrix';

let data: gameData = {
	paddle: {
		position: vec2.fromValues(-0.95, 0),
		velocity: vec2.fromValues(0, 0),
		paddleSpeed: 0.07,
		width: 0.1, // 패들의 폭
		height: 0.3, // 패들의 높이
	},
	ball: {
		position: vec2.fromValues(0, 0),
		direction: vec2.fromValues(1.0, 0),
		velocity: 0.05,
		radius: 0.02, // 공의 반지름
	},
	keyPress: {
		up: false,
		down: false,
	},
	gl: null,
	paddleBuffer: null,
	ballBuffer: null,
	positionLoc: 0,
	lastTime: 0,
};

export default data;