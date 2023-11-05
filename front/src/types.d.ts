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
		x: number;
		y: number;
		radius: number;
	};
	gl: WebGLRenderingContext;
}
