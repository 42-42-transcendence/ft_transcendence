declare module '*.glsl' {
	const content: string;
	export default content;
}

interface gameData {
	paddle: Paddle[];
	ball: Ball;
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
	forTestSocket: any;
	uColorLocation: WebGLUniformLocation | null;
	requestId: number;
	endGame: boolean;
}
