import {Ball} from '../class/Ball';
import {Paddle} from '../class/Paddle';

let data: gameData = {
	paddle: [new Paddle(-0.96, 0), new Paddle(0.96, 0)],
	ball: new Ball(),
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
	program: [null, null],
	mode: 'normal',
	items: [],
};

export default data;