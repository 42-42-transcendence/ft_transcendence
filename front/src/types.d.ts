declare module '*.glsl' {
	const content: string;
	export default content;
}

interface gameData {
	paddle: {
		position: vec2,
		velocity: vec2,
		width: number;
		height: number;
	};
	ball: {
		position: vec2,
		velocity: vec2,
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
