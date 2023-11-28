declare module '*.glsl' {
	const content: string;
	export default content;
}

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
	lineBuffer: WebGLBuffer | null;
	positionLoc: number;
	viewPortLoc: WebGLUniformLocation | null;
	lastTime: number;
	isFirstRender: boolean;
	canvasRef: HTMLCanvasElement | null;
	profileRef: (HTMLDivElement | null)[];
	scoreRef: (HTMLDivElement | null)[];
	program: (WebGLProgram | null)[];
	mode: string;
	uColorLocation: WebGLUniformLocation | null;
	requestId: number;
}
