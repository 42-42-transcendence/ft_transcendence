declare module '*.glsl' {
	const content: string;
	export default content;
}

interface gameData {
	paddle: {
		position: vec2,
		velocity: vec2,
		paddleSpeed: number,
		width: number;
		height: number;
	};
	ball: {
		position: vec2,
		direction: vec2,
		velocity: number,
		radius: number;
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
