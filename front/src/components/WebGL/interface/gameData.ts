import { vec2 } from 'gl-matrix';

export let gameDataFromServer = {
	paddlePos: [vec2.fromValues(0, 0), vec2.fromValues(0, 0)],
	height: [0, 0],
	ballPos: vec2.fromValues(0, 0),
}

let data: gameData = {
	paddle: [null, null],
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
	forTestSocket: null,
	endGame: false,
};

export default data;