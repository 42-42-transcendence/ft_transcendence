declare module '*.glsl' {
	const content: string;
	export default content;
}

interface canvasSize {
	width: number;
	height: number;
}

interface gameData {
	paddle: {
		x: flaoat32;
		y: flaoat32;
		width: number;
		height: number;
	};
	ball: {
		x: float32;
		y: float32;
		radius: number;
		direction : number;
	};
	keyPress: {
		up: boolean;
		down: boolean;
	};
	gl: WebGLRenderingContext | null;
	paddleBuffer: WebGLBuffer | null;
	ballBuffer: WebGLBuffer | null;
	positionLoc: number;
	lastTime: number;
}
