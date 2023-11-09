declare module '*.glsl' {
	const content: string;
	export default content;
}

type Paddle = {
	position: vec2;
	paddleSpeed: number;
	width: number;
	height: number;
};

type Ball = {
	position: vec2;
	direction: vec2;
	velocity: number;
	radius: number;
};

type KeyPress = {
	up: boolean;
	down: boolean;
};

interface gameData {
	paddle: Paddle[];
	ball: Ball;
	keyPress: KeyPress;
	scores: number[];
	gl: WebGLRenderingContext | null;
	paddleBuffer: WebGLBuffer | null;
	ballBuffer: WebGLBuffer | null;
	positionLoc: number;
	lastTime: number;
	isFirstRender: boolean;
	textCanvas: HTMLCanvasElement | null;
	gameCanvas: HTMLCanvasElement | null;
}
